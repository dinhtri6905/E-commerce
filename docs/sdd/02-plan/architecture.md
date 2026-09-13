# Architecture Design

## Scope and technical baseline

This is one modular MVP application: browser client -> REST API at `/api` -> relational database. It covers only the approved Specification; payments, shipping, notifications, external search/cache, infrastructure, and deployment are excluded.

| Concern | Decision | Rationale |
| --- | --- | --- |
| Workspace | npm workspaces: `apps/api`, `apps/web`, `packages/contracts` | One lockfile and explicit web/API/shared-transport boundaries. |
| Runtime | Node.js 22 LTS, strict TypeScript, ESM | Supported Node baseline and one type system. |
| API | Fastify with Zod | Small Node HTTP surface, schema-first validation, testable request injection. |
| Persistence | PostgreSQL 16 with Prisma and migrations | Relational constraints, transactions, and safe bindings. |
| Web | React, Vite, React Router, TanStack Query, CSS Modules and CSS tokens | Conventional routing/server state without a separate global-state framework. |
| Auth | Opaque CSPRNG session id in a host-only `HttpOnly; Secure; SameSite=Lax` cookie; only a hash/HMAC, user id, expiry, and revocation state persist | Server-side logout/revocation and no authentication material exposed to JavaScript. |
| Verification | Vitest, Fastify injection/API tests, React Testing Library, Playwright | Unit through end-to-end coverage for the approved journeys. |

Exact dependency versions are locked only in an approved implementation-bootstrap task; this Planning phase adds none.

## Boundaries and dependency direction

```text
React web application
        | same-origin HTTPS JSON `/api`
        v
Fastify route -> schema/auth middleware -> application service -> repository -> PostgreSQL
```

Routes never access Prisma directly. Repositories never import HTTP, routes, or services. A service may call another module only through its exported service interface, never its repository internals. `packages/contracts` contains transport DTOs/schemas only; it has no persistence or orchestration imports.

| Module | Owns | Collaborates with |
| --- | --- | --- |
| Auth | registration, credential verification, session lifecycle, caller context | User repository |
| User | safe own-profile read/update | authenticated caller |
| Category | active discovery and Admin lifecycle | none |
| Product | catalog/detail and Admin lifecycle | Category validation, Inventory read |
| Inventory | stock read/set and conditional transactional decrement | Product identity, Order transaction |
| Cart | Customer-owned cart and current-price summary | Product/Category availability, Inventory |
| Order | checkout, immutable snapshots, own history, status transition | Cart, Product/Category, Inventory |
| Admin | Admin route/policy composition | domain service public interfaces |

Admin is an authorization boundary, not duplicate domain state. The design covers all 22 approved requirements: Auth/User modules satisfy REQ-AUTH/USER; Category/Product/Inventory/Cart/Order/Admin satisfy their matching functional IDs; shared HTTP/UI/security/test boundaries satisfy REQ-UI, REQ-ERROR, REQ-SEC, and REQ-QUALITY.

## Request handling and authorization

1. The single web API client sends `credentials: 'include'` to same-origin `/api` and centrally maps safe errors.
2. Middleware validates the session hash, absolute/idle expiry, revocation, and current account, then attaches only `{ userId, role }`.
3. Zod validates/allowlists every path, query, header, and body value before a service runs.
4. Services enforce role and ownership. Owner scope always derives from session `userId`, never a client identifier.
5. Repositories use typed, parameterized persistence access. Services map internal models through explicit public DTO allowlists.
6. One error mapper emits stable public errors with a request id; logs contain safe identifiers only.

Identity, role, and ownership are separate checks. Customer routes require `CUSTOMER`; Admin routes require `ADMIN`; Admin cannot satisfy a Customer guard or impersonate a Customer. Public registration hardcodes `CUSTOMER` and has no role field. The initial Admin is created only by a controlled one-shot provisioning/seed procedure using runtime secret configuration—never default credentials, startup reseeding, or a public API.

All cookie-authenticated unsafe requests require an exact configured Origin match (scheme, host, port); absent/cross-origin browser requests fail. Credentialed CORS is either same-origin or a fixed allowlist, never wildcard. Passwords use Argon2id with current library-recommended parameters. Runtime validates all required configuration at startup; secrets never enter source, frontend bundles, errors, or logs.

Sessions use bounded runtime configuration: an 8-hour maximum absolute lifetime and 30-minute maximum idle lifetime. `expires_at` stores the absolute deadline; `last_seen_at` determines the idle deadline. On a valid request in the latter half of the idle window, Auth atomically rotates the opaque session value, updates `last_seen_at`, and sends a replacement cookie whose `Max-Age` is the lesser remaining absolute/idle duration. No renewal can extend the absolute deadline. Missing, expired, or revoked sessions produce the normal unauthenticated result; logout revokes the session and expires the cookie.

## Checkout consistency and idempotency

`POST /orders` requires a bounded UUID `Idempotency-Key` header. The data model owns exact columns and constraints; it must provide unique `(user_id, key_hmac)` and bind the key to the cart version supplied in the original request.

```text
existing matching completed intent with original cart version -> return original order
otherwise, in one short transaction:
  claim key; lock owner cart lines and product/category/inventory rows by product id
  validate lifecycle, quantities, authoritative USD-cent prices, and stock
  conditionally decrement every inventory row
  create PLACED order + immutable item snapshots
  clear ordered owner cart lines; bind intent to order; commit
failure -> rollback every business change
```

The same key with a different supplied cart version is a conflict; it is not compared to the cart after checkout has cleared/incremented it. The transaction retries only safe serialization/deadlock outcomes. It makes no external call. Locking/conditional decrements, cart-line uniqueness, and the intent constraint prevent negative stock, duplicate order creation, or partial cart/order/stock state.

## Persistence and public-data boundary

The database design in [Data Model](./data-model.md) is authoritative for tables/constraints. It uses active/inactive lifecycle rather than physical deletion, preserving order history. Money is integer USD cents (`*Minor`) and never floating point. Application validation gives usable feedback; database constraints remain the final guard for email/category uniqueness, quantity/money domains, cart-line uniqueness, status values, and idempotency.

Public DTO mappers exclude password hashes, session state, internal flags, and persistence metadata. Customer reads use owner-scoped queries and return the same safe not-found outcome for unknown/non-owned private resources. Inactive category/product state is recomputed for cart display and revalidated during checkout.

## Frontend architecture

- Public catalog/auth, Customer commerce/account, and Admin management form separate route groups.
- TanStack Query owns server cache/invalidation; forms, dialogs, and transient UI state stay local.
- Shared primitives/tokens own labels, focus, loading/empty/error/pending states, and visual consistency. Feature components own domain presentation.
- Route guards improve navigation only. A backend `401`, `403`, or `404` clears/protects sensitive display and renders the corresponding safe state.
- Mutation controls prevent duplicate local submission; checkout additionally uses the persisted idempotency key.

## Risks and verification

| Risk | Mitigation |
| --- | --- |
| Oversell or duplicate checkout | Transaction, stable locks, conditional decrement, unique intent/version binding, concurrency tests. |
| CSRF/session misuse | Host-only HttpOnly cookie, exact Origin checks, server-side expiry/revocation, negative tests. |
| IDOR/role confusion | Separate identity/role/ownership guards and owner-scoped data access. |
| Historical corruption | Immutable order item snapshots and lifecycle-only deactivation. |
| Scope creep | No microservices, event bus, cache, external integrations, or deployment design. |

Planning verification must demonstrate requirement traceability, no prohibited dependency direction, API/security negative paths, and checkout success/conflict/replay/concurrency behavior.

**Architecture status:** `APPROVED` by independent Planning Verification.


