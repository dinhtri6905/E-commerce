# MVP Test Plan

Test IDs represent behavior families, not executed results. Before implementation every row is **PLANNED**. Release-blocking rows marked **YES** must pass without skip or flakiness.

| ID / flow | Unit | API / Integration | Frontend | E2E | Release blocking |
| --- | --- | --- | --- | --- | --- |
| T-AUTH — Register/login/logout | normalization, password/token policy | cookie, duplicate, invalid/expired, safe output | forms, pending, errors, logout | Customer auth entry | YES |
| T-USER — Own profile | allowed-field policy | read/update, immutable/unauthenticated | load/edit/validation/error | Journey profile check | NO |
| T-AUTHZ — Role/ownership | policy decisions | `401/403/404`, no denied mutation | guards/access states | Customer denied Admin; cross-owner denied | YES |
| T-CATEGORY — Category lifecycle | normalization | public list; Admin create/update/deactivate/conflict | filters and Admin states | Admin category management | YES |
| T-PRODUCT — Browse/detail/admin | filter/sort validation | search/filter/page/inactive/not-found/CRUD | catalog/detail/all states | Browse and select product | YES |
| T-INVENTORY — Stock integrity | boundaries/conditional decrement | Admin set/access/concurrent final units | stock badges/Admin edit/errors | Admin stock update | YES |
| T-CART — Cart management | subtotal/merge rules | empty/add/merge/update/remove/conflicts/owner | all interactions/states | Add and update cart | YES |
| T-CHECKOUT — Atomic checkout | totals/orchestration/status initial | rollback injection, insufficient/unavailable, concurrency, repeat | pending/conflict/recovery/no duplicate | Place order and confirm | YES |
| T-ORDER — Customer orders | snapshot calculations | history/detail/owner/pagination | confirmation/history/detail states | Confirmation → history → detail | YES |
| T-ADMIN-ORDER — Status flow | transition matrix | list/filter/detail/valid-invalid-stale transition | Admin state/action/error | Advance one order | YES |
| T-CONTRACT — Validation/errors | schema boundaries | exact DTO/status/error/request id; safe `500` | centralized mapping/retry | Critical error smoke | YES |
| T-UI — Shared visual behavior | formatter/component logic | — | shell/components/navigation/dialog | Responsive smoke | NO |
| T-UI-STATES — Async states | — | representative failures | loading/empty/success/validation/API/access | Critical page states | YES |
| T-UI-A11Y — Accessibility basics | — | — | labels, focus, keyboard, semantic roles, contrast review | Keyboard critical path | YES |
| T-UI-PAGES — Route coverage | — | — | every approved page/guard | Customer and Admin route journeys | YES |
| T-SECURITY — Secrets/input/output | policy/schema cases | Argon2, Origin, injection-safe binding, no leakage | no token storage/safe errors | Auth/access negative smoke | YES |
| T-RELEASE — Full regression | all unit suites | all API/integration suites | all frontend suites | Customer + Admin journeys | YES |

## Critical scenarios

1. Register or log in → browse/search/filter → detail → add/merge/update cart → checkout → confirmation → history → owned detail.
2. Checkout with price change uses authoritative price; stock loss or injected write failure returns conflict/error and leaves order, items, stock, and cart consistent.
3. Two Customers compete for the final unit: exactly one checkout succeeds and inventory is zero, never negative.
4. Customer and unauthenticated identities cannot call Admin endpoints; Customer A cannot read or mutate Customer B resources.
5. Admin creates/deactivates catalog data, changes inventory, and advances an order exactly one valid status step.

## Execution and evidence

Use disposable PostgreSQL data and synthetic credentials. Run focused tests per task, then all root commands in `TASK-019`. Evidence records command, exit result, linked test IDs, and failures/skips. Unit/API/frontend/build PASS does not substitute for the two required E2E journeys. No PASS status is recorded in this document until implementation actually runs.
