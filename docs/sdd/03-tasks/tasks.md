# Implementation Task Decomposition

## Gate and execution policy

Specification and Planning are `APPROVED`. This document decomposes the approved MVP into eight coherent implementation tasks. The numbered subsections inside a task are implementation checkpoints, not independent approval gates. A task is `PASS` only after its required tests and quality checks pass; after a PASS, the next dependency-ready task may proceed automatically without another manual approval.

Primary ownership is assigned once per requirement below. Supporting tasks may exercise the same behavior for integration without taking ownership of the requirement.

## Dependency order

```text
TASK-001 Workspace & Quality Foundation
  -> TASK-002 Database & Persistence Foundation
       -> TASK-003 Authentication, User & Authorization
            -> TASK-004 Catalog Domain
                 -> TASK-005 Cart, Checkout & Order
TASK-001 + TASK-003 + TASK-004 -> TASK-006 Frontend Foundation & Shopping Experience
TASK-005 + TASK-006 -> TASK-007 Transactional UI, Account & Admin
TASK-001..TASK-007 -> TASK-008 System Verification & Acceptance
```

`TASK-002` is a persistence prerequisite for domain tasks. `TASK-003` may start after the persistence foundation and provides the server identity/role context used by all protected domains. `TASK-004` depends on both. `TASK-006` may consume completed public catalog/auth contracts; `TASK-007` waits for the backend purchase/admin behavior and the frontend foundation.

## Task summary

| Task | Title | Primary requirement ownership | Dependencies |
| --- | --- | --- | --- |
| TASK-001 | Workspace & Quality Foundation | REQ-ERROR-001, REQ-QUALITY-001, REQ-QUALITY-002 | none |
| TASK-002 | Database & Persistence Foundation | persistence enabler for REQ-AUTH through REQ-ORDER; no exclusive business requirement | TASK-001 |
| TASK-003 | Authentication, User & Authorization | REQ-AUTH-001, REQ-AUTH-002, REQ-USER-001, REQ-SEC-001, REQ-SEC-002 | TASK-002 |
| TASK-004 | Catalog Domain | REQ-CATEGORY-001/002, REQ-PRODUCT-001/002, REQ-INVENTORY-001 | TASK-002, TASK-003 authorization helpers |
| TASK-005 | Cart, Checkout & Order | REQ-CART-001/002, REQ-ORDER-001/002/003, REQ-ADMIN-001 | TASK-002, TASK-003, TASK-004 |
| TASK-006 | Frontend Foundation & Shopping Experience | supporting UI coverage; primary UI shell/public journey ownership for REQ-UI-001/002/003 | TASK-001, TASK-003, TASK-004 |
| TASK-007 | Transactional UI, Account & Admin | supporting UI coverage for REQ-UI-001/002/003 and backend integration | TASK-005, TASK-006 |
| TASK-008 | System Verification & Acceptance | final evidence for all requirements; no new product scope | TASK-001 through TASK-007 |

---

## TASK-001 — Workspace & Quality Foundation

### Objective

Create the stable monorepo, shared contracts, runtime configuration, safe error boundary, and repeatable quality/test entry points required by every later task.

### Requirement and AC mapping

- Primary: `REQ-ERROR-001` (`AC-ERROR-001-01–04`), `REQ-QUALITY-001` (`AC-QUALITY-001-01–03`), `REQ-QUALITY-002` (`AC-QUALITY-002-01–05`).
- Enables all later persistence, API, and UI tasks; no domain behavior is re-owned here.

### Dependencies

None. Use the approved Node 22 strict TypeScript, npm workspace, Fastify/Zod, React/Vite, PostgreSQL/Prisma, and test-tool choices from Planning. Do not add unapproved product features or infrastructure.

### In scope

1. Establish the approved workspace boundaries (`apps/api`, `apps/web`, `packages/contracts`) and strict TypeScript/ESM configuration.
2. Add formatter, linter, typecheck, unit/API/web/E2E/build script interfaces; make every script deterministic and fail closed. The commands are created here, not assumed to exist.
3. Add shared request/response/error DTO schemas and safe error mapping: validation, authentication, authorization, not-found, conflict, and safe unexpected errors with request IDs.
4. Add runtime environment parsing and startup validation without placing secrets in source, bundles, responses, or logs.
5. Add test fixtures/utilities boundaries, test database configuration hooks, and minimal health/startup composition needed for later tasks.

### Out of scope

Business entities, migrations, credentials/sessions, catalog/cart/order behavior, UI feature pages, deployment/cloud infrastructure, payment, shipping, promotions, reviews, wishlist, recommendation, email, cache, and search infrastructure.

### Implementation boundaries

- `packages/contracts` contains transport schemas/types only; it imports no database or framework implementation.
- API routes/controllers call services, never persistence directly. Frontend uses one API client and never accesses the database.
- Error DTOs are allowlisted; internal errors, stack traces, credentials, session material, raw idempotency keys, and secrets are never serialized or logged.

### Internal implementation sections (not gates)

1.1 Workspace and scripts
1.2 Strict TypeScript and runtime configuration
1.3 Shared Zod contracts and error mapper
1.4 Test harness and disposable-environment interfaces
1.5 Foundation unit/API smoke tests

### Required tests and verification

- Unit tests for common schema boundaries, unknown-field rejection, error mapping, request-ID safety, and configuration validation.
- API smoke tests for safe error status/shape and absence of sensitive output.
- Run `npm run format:check`, `npm run lint`, `npm run typecheck`, and the foundation unit/API suites.
- `npm run build` must produce the configured API/web build artifacts.

### Definition of Done

- Workspace and all required commands execute deterministically in the bootstrap environment.
- Shared contracts and errors are consumed through the documented boundaries.
- Required tests, lint, typecheck, and build pass; no secret or unrelated feature is introduced.
- Task evidence records commands, results, changed files, and requirement/AC links before marking `PASS`.

---

## TASK-002 — Database & Persistence Foundation

### Objective

Implement the approved PostgreSQL/Prisma persistence model, constraints, indexes, repository foundations, transaction utilities, and disposable database test support.

### Requirement and AC mapping

- Persistence enabler for `REQ-AUTH-001/002`, `REQ-USER-001`, `REQ-CATEGORY-001/002`, `REQ-PRODUCT-001/002`, `REQ-INVENTORY-001`, `REQ-CART-001/002`, and `REQ-ORDER-001/002/003`.
- No business requirement is considered complete until its owning domain task verifies behavior against this foundation.

### Dependencies

`TASK-001`.

### In scope

1. Define migrations and ORM models for `users`, `auth_sessions`, `categories`, `products`, `inventories`, `carts`, `cart_items`, `orders`, `order_items`, and `checkout_idempotencies`.
2. Enforce approved UUID, timestamp, normalized-email, role, lifecycle, USD-minor, positive-price/quantity, non-negative-stock, status, uniqueness, foreign-key, and retention constraints.
3. Add approved indexes and deterministic ordering support, including owner-scoped queries and product name/description search support without introducing an unapproved search engine.
4. Build parameterized repository/data-access primitives, transaction boundaries, consistent error translation, and test-database reset/factory utilities.
5. Establish safe session HMAC and idempotency-key persistence interfaces; raw values are never stored or logged.

### Out of scope

HTTP routes, service business workflows, password/session policy enforcement, UI, deployment infrastructure, manual production data changes, unrelated schema entities, and future integrations.

### Implementation boundaries

- Repositories own persistence access and expose domain-safe results; services own policy and transaction orchestration.
- User dependents use the approved restrictive deletion policy. Orders preserve immutable snapshots; product/category lifecycle does not physically delete history.
- Checkout locking and mutation orchestration is implemented in TASK-005; this task supplies transaction primitives and constraints only.

### Internal implementation sections (not gates)

2.1 Prisma/PostgreSQL configuration and first migration
2.2 Core entities and foreign keys
2.3 Constraints, normalized uniqueness, and indexes
2.4 Repository primitives and typed persistence errors
2.5 Transaction/test-database utilities

### Required tests and verification

- Migration/bootstrap test against disposable PostgreSQL.
- Constraint tests for normalized cross-role email uniqueness, lifecycle preservation, money/quantity/stock domains, cart-line uniqueness, order snapshots/status values, and idempotency uniqueness.
- Repository tests for owner predicates, deterministic ordering, parameter binding, restrictive references, and transaction rollback primitives.
- Run format, lint, typecheck, focused persistence tests, and build.

### Definition of Done

- A clean disposable database migrates successfully and all approved tables/constraints/indexes are inspectable.
- Repository and transaction utilities have passing boundary/rollback tests and no raw secret/key persistence.
- No route or domain feature is silently implemented in this foundation task.
- Evidence and trace links are recorded before `PASS`.

---

## TASK-003 — Authentication, User & Authorization

### Objective

Implement secure registration/login/logout/session lifecycle, Customer/Admin role context, profile behavior, and reusable authentication, role, and ownership guards.

### Requirement and AC mapping

- Primary: `REQ-AUTH-001` (`AC-AUTH-001-01–04`), `REQ-AUTH-002` (`AC-AUTH-002-01–04`), `REQ-USER-001` (`AC-USER-001-01–04`), `REQ-SEC-001` (`AC-SEC-001-01–05`), `REQ-SEC-002` (`AC-SEC-002-01–04`).
- Supports protected access checks in TASK-004, TASK-005, TASK-006, and TASK-007.

### Dependencies

`TASK-002` and shared contracts from `TASK-001`.

### In scope

1. Normalize email by trim/lowercase and enforce cross-role uniqueness; validate exact 8–128-character passwords without transformation; accept optional display name under the approved null/nonblank rules.
2. Hash passwords with Argon2id and create only `CUSTOMER` through public registration. Provision `ADMIN` only through the approved controlled one-shot mechanism; never expose public role selection/default credentials.
3. Create opaque CSPRNG session identifiers, persist only keyed HMAC/digest, set host-only HttpOnly/Secure/SameSite=Lax cookie, and implement revocation/rotation.
4. Enforce bounded runtime-configured 8-hour absolute and 30-minute idle lifetimes, `last_seen_at` initialization/renewal, cookie `Max-Age`, expiry, and logout behavior.
5. Implement login’s generic invalid-credential response and registration’s generic non-enumerating duplicate conflict (`REGISTRATION_UNAVAILABLE`).
6. Implement `GET/PATCH /users/me`, safe profile DTOs, session identity hydration, exact Origin checks on unsafe cookie-authenticated requests, role guards, owner predicates, and IDOR-safe private not-found behavior.

### Out of scope

Catalog, inventory, cart, checkout/order workflows, frontend pages, payment, deployment, rate-limiting infrastructure not in the approved scope, and changing the approved API/security contract.

### Implementation boundaries

- Authentication establishes `{ userId, role }`; authorization and ownership are separate service checks.
- Customer-only profile routes reject Admin-as-Customer and mass assignment. Owner identity always comes from the session, never a client-supplied user ID.
- Cookie auth uses credentials; no bearer token/session material is returned to JSON. Safe DTO mapping excludes hashes, cookies, revocation fields, and secrets.

### Internal implementation sections (not gates)

3.1 Registration and normalization
3.2 Password verification and generic auth errors
3.3 Session issue/rotation/expiry/revocation
3.4 Auth middleware, Origin, role, and ownership guards
3.5 Customer profile endpoints
3.6 Authentication/security tests

### Required tests and verification

- Unit tests for normalization, password boundaries, role policy, session TTL/renewal decisions, and ownership guards.
- API/integration tests for registration/login/logout/session expiry, rotation, revocation, cookie attributes/Max-Age, exact Origin, generic duplicate registration and login errors, safe DTOs, profile ownership, Admin/Guest denial, IDOR, and mass-assignment rejection.
- Run focused unit/API tests plus format, lint, typecheck, and build.

### Definition of Done

- All auth/profile/authorization Acceptance Criteria have executable tests and pass.
- Session behavior exactly matches the approved absolute/idle policy, including no absolute-lifetime extension on renewal.
- No credential, session, key, or secret is returned/logged; protected data is owner/role scoped.
- Evidence, traceability, and security-review results are recorded before `PASS`.

---

## TASK-004 — Catalog Domain

### Objective

Implement Category, Product, and Inventory domain behavior for public discovery and Admin management, including lifecycle, search, filtering, pagination, pricing, and availability.

### Requirement and AC mapping

- Primary: `REQ-CATEGORY-001` (`AC-CATEGORY-001-01–03`), `REQ-CATEGORY-002` (`AC-CATEGORY-002-01–04`), `REQ-PRODUCT-001` (`AC-PRODUCT-001-01–04`), `REQ-PRODUCT-002` (`AC-PRODUCT-002-01–04`), `REQ-INVENTORY-001` (`AC-INVENTORY-001-01–05`).
- Uses TASK-003 role/ownership helpers; provides catalog data to TASK-005 and TASK-006.

### Dependencies

`TASK-002`; authorization middleware from `TASK-003`.

### In scope

1. Implement public active category listing and active product list/detail with deterministic bounded pagination.
2. Implement trimmed/case-insensitive category name uniqueness across lifecycle records; active/inactive category lifecycle and active-category filtering.
3. Implement product validation, USD integer-cent prices, category validation, active/inactive lifecycle, name-or-description case-insensitive substring search, AND category filter, and out-of-stock visibility as unavailable.
4. Implement Admin category/product create/update/activate/deactivate and inventory quantity management, with stable inventory `name ASC, id ASC` ordering.
5. Recompute availability from current category/product/inventory state for public and cart projections; preserve historical references and prohibit physical deletion.

### Out of scope

Cart mutation, checkout, order snapshots/statuses, frontend screens, payment/shipping/promotions/reviews, external search/indexing, and changing lifecycle or money contracts.

### Implementation boundaries

- Public queries include active products in active categories only; public DTOs expose availability, not internal stock quantity.
- Admin service may expose approved management fields and quantity but remains role-gated. Product names are not made globally unique.
- Services validate policy before repository calls; repository queries remain parameterized and deterministic.

### Internal implementation sections (not gates)

4.1 Category discovery and Admin lifecycle
4.2 Product catalog/detail/search/filter
4.3 Inventory quantity and stock status
4.4 Pagination/order and safe DTO mapping
4.5 Catalog/inventory tests

### Required tests and verification

- Unit tests for normalized names, price/quantity domains, availability, lifecycle, search matching, and pagination parameters.
- API/integration tests for public active-only behavior, unknown/inactive filters, out-of-stock display, Admin CRUD/lifecycle/stock, duplicate category conflict, invalid category/product data, deterministic product/inventory order, and role denial.
- Run focused API/unit tests plus format, lint, typecheck, and build.

### Definition of Done

- All five owned requirements and their Acceptance Criteria pass against disposable PostgreSQL.
- Lifecycle changes preserve records and produce the documented public/cart effects.
- Search/filter/pagination and inventory ordering match the API contract exactly.
- Evidence and traceability are updated before `PASS`.

---

## TASK-005 — Cart, Checkout & Order

### Objective

Implement the critical Customer cart and checkout/order workflow and Admin order operations with atomic inventory mutation, immutable snapshots, ownership, and idempotency.

### Requirement and AC mapping

- Primary: `REQ-CART-001` (`AC-CART-001-01–04`), `REQ-CART-002` (`AC-CART-002-01–05`), `REQ-ORDER-001` (`AC-ORDER-001-01–05`), `REQ-ORDER-002` (`AC-ORDER-002-01–04`), `REQ-ORDER-003` (`AC-ORDER-003-01–04`), `REQ-ADMIN-001` (`AC-ADMIN-001-01–04`).
- Most critical backend task; consumes catalog availability and auth/ownership helpers.

### Dependencies

`TASK-002`, `TASK-003`, and `TASK-004`.

### In scope

1. Implement one owner-scoped cart, repeated-add quantity increments, whole non-negative quantity validation, update-to-zero removal, current-price totals in USD cents, and safe unavailable-line correction/removal.
2. Expose API-safe cart `version`; require UUID `Idempotency-Key` and original `cartVersion` on checkout.
3. In one short transaction, claim the user/key HMAC intent, lock owner cart lines and related product/category/inventory rows in stable order, revalidate lifecycle/quantity/current prices/stock, conditionally decrement stock, create `PLACED` order and immutable item snapshots/totals, clear ordered lines, complete the intent, and commit.
4. Return `201` for first success, `200` for exact same-key/original-version replay even after cart clear, and `409` for same-key different-version reuse or stock/state conflicts. Roll back all mutation on failure.
5. Implement owner-scoped Customer order history/detail and Admin order list/detail/status update with only `PLACED → PROCESSING → COMPLETED`; reject skips, reversals, cancellation, and completed mutation.

### Out of scope

Payment, shipping, promotions, cancellation/refund, order editing, recommendation/email, frontend UI, physical deletion, and status values outside the approved lifecycle.

### Implementation boundaries

- Checkout trusts no client price, product, total, customer, or stock value; it uses authoritative repository state.
- Idempotency is scoped to customer and keyed HMAC; raw keys never persist/log. Exact replay returns the original order without stock/cart mutation.
- Customer order reads are owner-scoped; Admin order mutation is role-gated. Order item snapshots are immutable after creation.

### Internal implementation sections (not gates)

5.1 Cart creation/read and owner scope
5.2 Add/quantity/removal behavior
5.3 Checkout validation and intent claim
5.4 Lock ordering and conditional inventory mutation
5.5 Order persistence, snapshots, totals, and cart clearing
5.6 Replay/conflict/rollback behavior
5.7 Customer order reads and Admin transitions
5.8 Critical transaction/concurrency tests

### Required tests and verification

Do not mark this task `PASS` without all of the following passing:

- Cart owner isolation, repeated add merge, quantity boundaries, zero removal, current-price totals, unavailable/missing-line rejection, and no-mutation-on-failure tests.
- Normal checkout, empty/invalid cart, lifecycle/price/stock revalidation, insufficient stock, no partial state, atomic rollback injection, and concurrent last-unit checkout tests.
- Duplicate-key exact replay after cart clear with no duplicate order or inventory mutation; same key/different cart version conflict with no mutation; idempotency persistence tests.
- Immutable order item snapshot after later catalog/price/stock/lifecycle changes.
- Customer ownership/private-not-found and Admin status-transition/role/IDOR tests.
- Run focused API/integration/concurrency tests plus format, lint, typecheck, and build.

### Definition of Done

- Every listed critical behavior is verified against final database facts, not only response status.
- Inventory, cart, idempotency, order, and snapshot state are atomic and correct under failure/concurrency.
- All owned requirements/ACs pass; status transition is exactly the approved three-state path.
- Evidence and traceability are updated before `PASS`.

---

## TASK-006 — Frontend Foundation & Shopping Experience

### Objective

Build the React/Vite client foundation and the public/authenticated shopping experience with the approved responsive and accessible UI behavior.

### Requirement and AC mapping

- Primary UI implementation ownership: `REQ-UI-001` (`AC-UI-001-01–04`), `REQ-UI-002` (`AC-UI-002-01–04`), `REQ-UI-003` (`AC-UI-003-01–04`).
- Implements public Register/Login/Product List/Product Detail and shared shell; supports Customer route guards and safe error presentation.

### Dependencies

`TASK-001`, completed auth contract from `TASK-003`, and catalog contract from `TASK-004`.

### In scope

1. Establish React/Vite routing, one credentialed API client, TanStack Query server-state ownership, safe error mapping, and session-aware route guards.
2. Implement shared shell/design tokens/primitives: headings, navigation, forms, buttons, alerts, loading/empty/error states, product cards, price/availability, pagination, and focus treatment.
3. Implement Register/Login, Product List search/filter/pagination, and Product Detail/add-to-cart entry points using approved API contracts.
4. Meet 360/768/1280 responsive requirements, keyboard operation, labels/error association, focus visibility, semantic status messaging, and contrast thresholds.
5. Add visual-quality checks for loading, empty, no-match, unavailable, validation, unauthorized, forbidden, and safe server-error states.

### Out of scope

Cart/checkout/order/profile/admin feature pages (TASK-007), backend changes, payment/shipping/future features, a new state-management framework, and storing session material in browser storage.

### Implementation boundaries

- The client never authorizes access; server responses remain authoritative. Route visibility is convenience only.
- TanStack Query owns server state; local state owns form/dialog/transient presentation. Mutations invalidate relevant queries and preserve safe input.
- No page-level horizontal scrolling; Admin-table adaptation is handled when Admin screens are built.

### Internal implementation sections (not gates)

6.1 Web workspace and API client
6.2 Shell, tokens, primitives, and route guards
6.3 Register/Login and session states
6.4 Catalog list/search/filter/detail
6.5 Responsive/accessibility/visual-state tests

### Required tests and verification

- Component tests for headings, labels, form association, safe errors, loading/empty/pending/no-match/unavailable states, and query invalidation.
- Playwright smoke for Register/Login and public catalog/detail journeys at 360, 768, and 1280 CSS pixels, including keyboard/focus checks.
- Run web tests plus format, lint, typecheck, and build.

### Definition of Done

- Public/auth UI journeys meet approved UI/UX design and use only approved API behavior.
- Responsive and accessibility checks pass; no protected data is rendered for the wrong access state.
- Focused frontend tests, quality gates, and build pass; evidence is recorded before `PASS`.

---

## TASK-007 — Transactional UI, Account & Admin

### Objective

Complete Customer transactional/account screens and Admin management screens, integrated with the verified backend contracts and states.

### Requirement and AC mapping

- Supporting implementation for `REQ-UI-001/002/003`; completes the UI surfaces used by `REQ-USER-001`, `REQ-CART-001/002`, `REQ-ORDER-001/002/003`, and `REQ-ADMIN-001`.
- UI requirements remain primarily owned by TASK-006; this task owns the remaining screen behavior and integration evidence.

### Dependencies

`TASK-005` backend behavior and `TASK-006` frontend foundation.

### In scope

1. Implement Customer Cart, Checkout, Order Confirmation, Order History, Order Detail, and Profile pages.
2. Implement Admin Category, Product, Inventory, and Order list/detail/status screens.
3. Handle loading, empty, validation, pending, conflict, stock/lifecycle, unauthorized, forbidden, safe not-found, and unexpected API-error states.
4. Retain one checkout idempotency key for a confirmation attempt; display API-authoritative USD totals, availability, order snapshots, and status.
5. Integrate responsive layouts, accessible dialogs/deactivation confirmation, keyboard/focus/error semantics, table/card adaptation, and conservative non-optimistic mutations.

### Out of scope

New backend behavior, payment/shipping/future features, client-side authorization bypass, browser session-token storage, and redesign beyond approved UI/UX tokens and states.

### Implementation boundaries

- Customer/Admin route groups are server-enforced; the UI only reflects safe access outcomes.
- Checkout retry follows API replay semantics and never accidentally creates a new intent.
- Admin management controls expose only approved lifecycle/stock/status actions and no delete/cancel behavior.

### Internal implementation sections (not gates)

7.1 Cart and quantity correction
7.2 Checkout/confirmation and idempotent retry UX
7.3 Order history/detail and profile
7.4 Admin category/product/inventory
7.5 Admin order status and integrated UI tests

### Required tests and verification

- Component tests for every page’s loading/empty/error/validation/access/pending state and safe mutation recovery.
- Playwright Customer flow: login/profile update/logout, browse/search/detail, add/update cart, checkout, confirmation, history/detail.
- Playwright Admin flow: login, manage product/category/inventory, view order, advance status; include responsive and keyboard/accessibility checks.
- Run web/API integration tests as applicable plus format, lint, typecheck, and build.

### Definition of Done

- All approved Customer/Admin screens function against real contract-shaped API responses and do not rely on mocked success for integration acceptance.
- Critical flows preserve safe errors, ownership boundaries, authoritative totals/status, and idempotent checkout retry.
- Focused frontend/integration tests, quality gates, and build pass; evidence is recorded before `PASS`.

---

## TASK-008 — System Verification & Acceptance

### Objective

Independently verify the implemented MVP end to end against the approved Specification, Planning, task contracts, security controls, and UI quality requirements.

### Requirement and AC mapping

- Final acceptance evidence for all `REQ-AUTH-001` through `REQ-QUALITY-002` and all `AC-*` identifiers; no new behavior or requirement ownership.
- Primary final verification artifacts: implementation report, per-task verification, integration/acceptance evidence, and completed traceability.

### Dependencies

`TASK-001` through `TASK-007` each `PASS`.

### In scope

1. Run the full unit, API/integration, web/component, E2E, lint, typecheck, build, and applicable security/static suites established by TASK-001.
2. Execute the critical Customer flow: Register/Login → Browse/Search → Detail → Add to Cart → Update Cart → Checkout → Confirmation → History/Detail.
3. Execute the critical Admin flow: Admin Login → Manage Product → Manage Inventory → View Order → Advance Order Status.
4. Verify authorization/ownership/IDOR, Origin/session controls, safe outputs/logs, checkout concurrency/idempotency/rollback, immutable snapshots, lifecycle, pagination/search, responsive/accessibility behavior, and regression coverage.
5. Audit every approved requirement/AC against actual evidence, update implementation/test/acceptance tracking, and record failures honestly.

### Out of scope

Changing approved Specification/Planning to make a check pass, adding features, weakening security, deleting evidence, deployment, production data changes, and silently skipping a failing required check.

### Implementation boundaries

- This is an independent verification task, not a remediation bucket. Defects are returned to the owning task unless a small in-scope correction is explicitly made and reverified there.
- Acceptance status may be `PASS` only when required checks and critical journeys pass; otherwise record `FAIL` or `BLOCKED` with evidence.
- No requirement is considered implemented merely because a task or test name exists.

### Internal implementation sections (not gates)

8.1 Full quality suite and environment check
8.2 Customer E2E and API acceptance
8.3 Admin E2E and authorization/security review
8.4 Checkout concurrency/idempotency/rollback audit
8.5 UI responsive/accessibility audit
8.6 Requirement/AC traceability and final report

### Required tests and verification

- All commands from Planning: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:api`, `npm run test:web`, `npm run build`, and `npm run test:e2e`.
- Full requirement-to-evidence audit: 22/22 requirements and 91/91 Acceptance Criteria, with no orphan or fabricated result.
- Independent security, ownership, transaction, UI-quality, Customer E2E, and Admin E2E evidence.

### Definition of Done

- All required checks and critical flows pass, or a clear `FAIL/BLOCKED` report prevents acceptance.
- Implementation and verification tracking records changed files, commands, results, and requirement/AC evidence without deleting history.
- Final status is updated only from observed results; no implementation or test result is fabricated.

## Primary requirement ownership matrix

| Requirement group | Primary task |
| --- | --- |
| REQ-AUTH-001/002 | TASK-003 |
| REQ-USER-001 | TASK-003 |
| REQ-CATEGORY-001/002 | TASK-004 |
| REQ-PRODUCT-001/002 | TASK-004 |
| REQ-INVENTORY-001 | TASK-004 |
| REQ-CART-001/002 | TASK-005 |
| REQ-ORDER-001/002/003 | TASK-005 |
| REQ-ADMIN-001 | TASK-005 (backend), TASK-007 (UI integration) |
| REQ-UI-001/002/003 | TASK-006 (shared/public), TASK-007 (remaining screens) |
| REQ-ERROR-001 | TASK-001 |
| REQ-SEC-001/002 | TASK-003 |
| REQ-QUALITY-001/002 | TASK-001 (foundation), TASK-008 (final evidence) |

## Handoff

Task Decomposition is complete pending independent verification. Implementation must not begin until `docs/sdd/03-tasks/verification.md` records `PASS` and SDD tracking authorizes `TASK-001`.