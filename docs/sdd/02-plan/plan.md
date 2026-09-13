# MVP Implementation Plan

## Planning scope

This plan turns the approved 22-requirement E-commerce MVP Specification into an implementation-ready application design. It authorizes design only: no source, dependencies, migrations, infrastructure, deployment, or task decomposition is created here. The former `02-plan` content is replaced because it predated the approved Specification.

## Delivery architecture

`apps/web` (React) consumes the JSON REST API in `apps/api` (Fastify). The API owns authentication, authorization, validation, business services, and persistence access. PostgreSQL is the source of truth. `packages/contracts` shares API-safe DTO types and schemas, not database types or service logic. See [Architecture](./architecture.md), [Data Model](./data-model.md), [API Contract](./api-contract.md), [UI/UX Design](./ui-ux-design.md), and [Testing Strategy](./testing-strategy.md).

## Decision record

| ID | Decision | Alternative/trade-off |
| --- | --- | --- |
| PLAN-001 | Node 22 + strict TypeScript, npm workspaces, Fastify/Zod, React/Vite, PostgreSQL/Prisma | A single modular application is lower-risk than service decomposition; dependencies are intentionally deferred to implementation bootstrap. |
| PLAN-002 | Opaque database-backed sessions in host-only HttpOnly Secure SameSite=Lax cookies, with an 8-hour absolute TTL and 30-minute idle TTL | A signed stateless token would simplify persistence but cannot reliably revoke a copied token on logout. Bounded, runtime-configured lifetimes limit exposure while allowing normal active use. |
| PLAN-003 | Money is integer USD cents in APIs/storage; display is formatted USD | More explicit DTO conversion, but avoids floating-point totals. |
| PLAN-004 | Product and category lifecycle is active/inactive only; no DELETE route | Historical integrity and cart correction are preserved; records are retained. |
| PLAN-005 | Checkout is one short transaction with lock/conditional stock decrement and persisted idempotency | More complex than a simple insert, but required to prevent oversell, partial state, and duplicate orders. |
| PLAN-006 | Customer and Admin routes are exclusive server-enforced role groups; owner scope derives from session identity | Slightly repeated guard wiring, but prevents Admin-as-Customer and IDOR errors. |
| PLAN-007 | Page-number pagination with `page`, `pageSize`, deterministic `createdAt,id` or `name,id` ordering | Pages can shift during concurrent writes; stable tie-breakers meet MVP requirements without cursor complexity. |

## Implementation sequence and dependency gates

```text
workspace/tooling + contracts
  -> schema/migrations/test database
  -> HTTP foundation, safe errors, sessions, Auth/User
  -> Category/Product/Inventory
  -> Cart
  -> transactional checkout + customer/admin orders
  -> web foundation and public/customer/admin views
  -> cross-layer and E2E acceptance checks
```

Each later increment depends only on completed predecessor behavior. Checkout depends on a tested Cart, catalog lifecycle, inventory conditional decrement, and order snapshot model. Web views are delivered with their applicable loading, empty, validation, error, access, pending, responsive, and accessibility states—not as a deferred polish phase.

## Requirement-to-design mapping

| Requirements | Design owner | Primary verification |
| --- | --- | --- |
| REQ-AUTH-001/002, REQ-USER-001 | Auth/User services, database-backed sessions, `/auth` and `/users/me` | API auth/session/role/ownership tests |
| REQ-CATEGORY-001/002, REQ-PRODUCT-001/002 | Category/Product services; active lifecycle; public/Admin endpoints | API discovery/lifecycle/validation tests |
| REQ-INVENTORY-001 | Inventory service and conditional database updates | integration stock/concurrency tests |
| REQ-CART-001/002 | owner-scoped Cart service; current-price/availability projection | API ownership, quantity, summary tests |
| REQ-ORDER-001/002/003 | transactional Order service, snapshots, idempotency, transition policy | integration rollback/replay/concurrency and API tests |
| REQ-ADMIN-001, REQ-SEC-002 | role middleware plus owner-scoped service/repository queries | negative authorization/IDOR tests |
| REQ-UI-001/002/003 | route groups, shared UI primitives/tokens, query/mutation states | component and viewport/keyboard E2E tests |
| REQ-ERROR-001, REQ-SEC-001 | Zod schemas, error mapper, DTO allowlists, Origin/session controls | invalid-input, CSRF, output/log review tests |
| REQ-QUALITY-001/002 | transactions, constraints, deterministic lists, required quality gates | full unit/API/web/E2E suite |

## Security and operational boundaries

- Argon2id hashes passwords. Cookies/session ids, passwords, hashes, raw idempotency keys, and secrets are neither returned nor logged.
- Session lifetime is runtime-configured but bounded: a session expires after 8 hours from login regardless of activity or after 30 minutes idle, whichever occurs first. A valid request renews only in the latter half of the idle window by rotating the opaque identifier; the cookie `Max-Age` is the lesser remaining idle/absolute lifetime. Logout revokes the server session and expires its cookie.
- Identity validation, role authorization, and Customer ownership checks are separate controls on every protected path.
- Every cookie-authenticated unsafe operation verifies an exact configured Origin. No wildcard credentialed CORS is permitted.
- Startup validates runtime configuration. The initial Admin is supplied by a controlled, one-shot provisioning process; no default or public Admin creation exists.
- Public DTO mappers and safe error mapping prevent persistence/infrastructure detail leakage. All external input is allowlisted and validated before state change.

## Checkout design contract

The checkout client sends a UUID `Idempotency-Key` and its current cart version. The database stores only a keyed hash of the raw key, binds it to customer and cart version, and uniquely constrains it. A replay with that key/version returns the original order; reuse of the key for a different cart version is a conflict. Within one transaction the service locks relevant owner-cart/product/category/inventory records in product-id order, revalidates, conditionally decrements inventory, creates immutable PLACED snapshots, clears ordered lines, records the completed intent, and commits. Any failure rolls back all business mutations.

## Planning risks and controls

| Risk | Control |
| --- | --- |
| Concurrent checkout oversells or duplicates orders | database constraints, stable locks, conditional decrements, persisted idempotency, concurrency tests |
| Session/CSRF compromise | opaque revocable session, host-only HttpOnly cookie, exact Origin validation, security negative tests |
| Lifecycle changes invalidate carts | compute current availability and repeat validation within checkout |
| Contract drift between web/API | shared transport contracts and API contract tests |
| Unbounded/nondeterministic lists | validated bounded pagination and stable ordering |
| Incomplete UI acceptance | every route gets explicit state/access/viewport/keyboard test coverage |

## Required verification interface

The implementation bootstrap establishes the authoritative root commands: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:api`, `npm run test:web`, `npm run build`, and `npm run test:e2e`. Tasks run their focused checks plus relevant quality gates; release verification runs all. No command is presumed to exist until the approved bootstrap task creates it.

## Handoff

Planning is ready for independent Planning Verification once all owned design documents and the data model agree. Task decomposition is allowed only after `Planning = APPROVED`.

**Plan status:** `APPROVED` by independent Planning Verification.
