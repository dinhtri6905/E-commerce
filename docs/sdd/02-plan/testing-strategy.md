# Testing Strategy

## Objective

Verification proves approved behavior and safety, not implementation line coverage. Tests use behavior-oriented names, minimal synthetic fixtures, controlled time/identifiers where asserted, and Arrange/Act/Assert or Given/When/Then. Mocks exist only at genuine external boundaries; they do not replace the policy or transaction being verified.

## Test levels

| Level | Primary scope | Boundary |
| --- | --- | --- |
| Unit | email/password policy, money arithmetic, lifecycle/availability, quantity rules, ownership/role policy, status transitions, idempotency decisions | pure functions/services with repository fakes only where isolation is necessary |
| API/integration | Fastify routes, Zod schemas, error DTOs, sessions/Origin, repositories, constraints, transactions | real Fastify application and disposable PostgreSQL database |
| Web component | route rendering, forms, query/mutation states, safe errors, access outcomes | React/router/query client; API boundary stubbed with contract-shaped responses |
| E2E | Customer login/profile update/logout and purchase, plus focused Admin management journeys | built web/API plus isolated disposable database |

## Requirement coverage

| Requirement group | Required test behavior |
| --- | --- |
| REQ-AUTH-001/002 | normalized unique email with generic duplicate-registration conflict, 8–128 exact password, no public Admin registration, generic invalid login, 8-hour absolute/30-minute idle session persistence-expiry/renewal/revocation, logout rejection |
| REQ-USER-001 | Customer reads/updates only own display name; rejects mass assignment, Admin/Guest/other-owner access, preserves value on failure |
| REQ-CATEGORY-001/002 | active-only discovery/filter, unknown/inactive outcomes, normalized uniqueness, deactivate/reactivate effects and no delete |
| REQ-PRODUCT-001/002 | active catalog/detail, name-or-description search, AND filter, out-of-stock visibility, price/stock/category validation, lifecycle effects/history preservation |
| REQ-INVENTORY-001 | non-negative integer stock, Admin-only set, resulting-cart quantity limit, checkout revalidation, concurrent final-unit race |
| REQ-CART-001/002 | owner-only view, current-price totals, empty state, add merge, update zero removal, unavailable/quantity/missing-line rejection with no mutation |
| REQ-ORDER-001/002/003 | empty/role checkout denial, atomic snapshots/stock/cart commit and rollback, idempotency replay, Customer-only history/detail, ordered lists, allowed forward transitions only |
| REQ-ADMIN-001 and REQ-SEC-002 | Guest/Customer-to-Admin denial, Admin-to-Customer denial, IDOR denial, server guard despite client visibility |
| REQ-UI-001/002/003 | headings; loading/empty/validation/error/access/pending states; action/form labels; 360/768/1280 responsive smoke; keyboard, focus, semantic error association, contrast review |
| REQ-ERROR-001 and REQ-SEC-001 | stable safe error categories, input/unknown-field rejection, credential/secret/log-output exclusion, Origin/CSRF denial, safe unexpected failure |
| REQ-QUALITY-001/002 | rejection atomicity, deterministic bounded lists, concurrency, repeatable full critical-journey verification |

## Mandatory negative and boundary matrix

Every applicable endpoint/flow has valid path, invalid shape/value, boundary quantity/money/password, unknown resource, unauthenticated, wrong role, wrong ownership, business conflict, and defined recovery test. Key cases include:

- missing, malformed, expired, revoked, and logged-out session; 30-minute idle expiry, 8-hour absolute expiry despite activity, renewal only in the latter half of the idle window, rotation, and cookie `Max-Age` alignment;
- missing/cross-origin unsafe cookie request; no wildcard credentialed CORS;
- Customer requesting Admin operation; Admin requesting profile/cart/checkout/own orders; Customer requesting another Customer resource;
- duplicate normalized email returns the same generic registration conflict without confirming account existence; duplicate category name, unsupported body field, invalid ID/query/page size, invalid lifecycle/stock/price/status;
- product/category deactivation between cart mutation and checkout;
- parallel checkout for the last stock unit, rollback injection at transactional repository boundary, and no partial order/stock/cart state;
- duplicate `Idempotency-Key` with the original cart version replaying the first confirmation even after the cart clears; same key with a different supplied cart version conflicting without mutation;
- history snapshot unchanged after later product/category/price/stock/lifecycle changes.

## Data, transaction, and environment approach

Factories create only synthetic Customers/Admins, categories, products, inventories, carts, and orders. Integration/E2E tests create and clean up only their own data. A disposable PostgreSQL database runs migrations before integration tests. Concurrency tests use separate connections/requests and assert final database facts, not only response codes. Failure injection sits at a transaction/repository boundary; no test mocks away checkout business rules.

## UI verification approach

Component tests check visible headings, primary actions, server-state transitions, field association, retained safe input, disabled pending controls, and access-safe rendering. Playwright verifies Customer login, profile update, logout, and purchase journeys plus Admin category/product/inventory/order-status journeys, with viewport operation at 360, 768, and 1280 CSS pixels. Keyboard tests tab to and activate all critical controls; automated accessibility checks and manual token review confirm required names/focus/error relationships and contrast thresholds.

## Authoritative commands after bootstrap

The approved bootstrap implementation task must establish these root commands; Planning does not execute or create them:

```text
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run test:api
npm run test:web
npm run build
npm run test:e2e
```

Each implementation task runs the focused suite plus applicable lint/typecheck. Release/acceptance runs all commands. A skipped/flaky release-blocking test, a required-check failure, or a known critical regression fails the gate; percentage coverage is informational unless separately approved.

**Testing strategy status:** `APPROVED` by independent Planning Verification.
