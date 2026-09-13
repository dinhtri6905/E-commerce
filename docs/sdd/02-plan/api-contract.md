# REST API Contract

## Common rules

Base path is `/api`; all payloads are JSON. There is no API version segment. IDs are UUID strings, dates are UTC ISO-8601 strings, and money uses USD integer cents (`*Minor`). A collection response is:

```json
{ "items": [], "page": 1, "pageSize": 20, "totalItems": 0, "totalPages": 0 }
```

`page` defaults to 1, `pageSize` defaults to 20 and is at most 100. Lists use documented deterministic ordering with `id` as a final tie-breaker. Unknown body fields and unknown filter/sort values are rejected. Errors use:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Request is invalid", "fields": { "email": "Invalid email" }, "requestId": "safe-id" } }
```

`fields` appears only for correctable safe validation. `400` is malformed/invalid input, `401` missing/invalid/expired/revoked authentication, `403` wrong role or Origin, `404` unknown resource (also non-owned private resource), `409` uniqueness/state/stock/idempotency conflict, and `500` safe unexpected failure. Public errors never expose account existence on login, credentials, sessions, stack traces, persistence details, or secrets.

Cookie authentication uses a host-only `session` cookie: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` outside local development. Its `Max-Age` is the lesser remaining 30-minute idle or 8-hour absolute session lifetime; only a valid request in the latter half of the idle window renews it with a rotated opaque value, never beyond the absolute deadline. Unsafe authenticated methods require an exact allowed `Origin`. Browser calls use credentials; no token is returned in JSON.

### Public representations

- `SessionIdentity`: `{ id, role }`, used only to hydrate safe authentication state.
- `Profile`: `{ email, displayName }`; `displayName` may be `null` until the Customer supplies one. Neither representation includes credential/session fields.
- `Category`: `{ id, name }`; Admin category additionally has `{ isActive, createdAt, updatedAt }`.
- `ProductSummary`: `{ id, name, description, priceMinor, currency: "USD", category: Category, stockStatus: "IN_STOCK"|"OUT_OF_STOCK" }`.
- `ProductDetail`: `ProductSummary` plus no internal inventory count. Admin product additionally has `{ isActive, stockQuantity, createdAt, updatedAt }`.
- `Cart`: `{ version, items, subtotalMinor, totalMinor, currency: "USD" }`; a line has `{ product, quantity, currentUnitPriceMinor, lineSubtotalMinor, availability }`.
- `OrderSummary`: `{ id, status: "PLACED"|"PROCESSING"|"COMPLETED", totalMinor, currency: "USD", createdAt }`.
- `OrderDetail`: `OrderSummary` plus `{ statusDates, items[] }`; each item has immutable `{ productId, productName, unitPriceMinor, quantity, lineSubtotalMinor, currency: "USD" }`.

## Authentication and profile

| Method/path | Access | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `POST /auth/register` | Guest | `{ email, password, displayName? }`; display name, if supplied, is non-empty after trim | `201 Profile`; session set | `400 VALIDATION_ERROR`, `409 REGISTRATION_UNAVAILABLE` (generic; does not identify a duplicate email) |
| `POST /auth/login` | Guest | `{ email, password }` | `200 SessionIdentity`; rotated session set | `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS` (generic) |
| `POST /auth/logout` | Authenticated | empty body | `204`; session revoked/cookie expired | `401 AUTHENTICATION_REQUIRED`, `403 ORIGIN_FORBIDDEN` |
| `GET /auth/session` | Authenticated | none | `200 SessionIdentity` | `401` |
| `GET /users/me` | Customer only | none | `200 Profile` | `401`, `403` |
| `PATCH /users/me` | Customer only | `{ displayName }`, non-empty after trim | `200 Profile` | `400`, `401`, `403` |

Email is trimmed, lowercased, and unique case-insensitively. Password is exact (not trimmed/transformed) and length 8–128. Public registration always creates `CUSTOMER`; role/email/ownership fields are rejected on profile update.

## Public catalog

| Method/path | Access | Query/request | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET /categories` | Public | `page,pageSize` | active categories, `name,id` order | `400` |
| `GET /products` | Public | `page,pageSize,q?,categoryId?` | active products in active categories, `createdAt DESC,id DESC` | `400`, `404 CATEGORY_NOT_FOUND` for unknown/inactive filter |
| `GET /products/:productId` | Public | UUID path | `200 ProductDetail` | `400`, `404 PRODUCT_NOT_FOUND` |

`q` is trimmed; blank means no search restriction. Nonblank `q` is a case-insensitive substring match against name **or** description. `q` and `categoryId` combine with AND. Active out-of-stock products remain public and report `OUT_OF_STOCK`; inactive products/categories are not exposed.

## Customer cart

Every route below requires `CUSTOMER`; Admin receives `403 ROLE_FORBIDDEN` and no cart data.

| Method/path | Request | Success | Errors |
| --- | --- | --- | --- |
| `GET /cart` | none | `200 Cart`, including empty cart/version | `401`, `403` |
| `POST /cart/items` | `{ productId, quantity }`; positive integer | `200 Cart`; same product increments its single line | `400`, `404 PRODUCT_NOT_FOUND`, `409 PRODUCT_UNAVAILABLE|INSUFFICIENT_STOCK` |
| `PATCH /cart/items/:productId` | `{ quantity }`; whole integer `>= 0` | `200 Cart`; zero removes line | `400`, `404 CART_ITEM_NOT_FOUND`, `409 PRODUCT_UNAVAILABLE|INSUFFICIENT_STOCK` |
| `DELETE /cart/items/:productId` | UUID path | `204` | `400`, `404 CART_ITEM_NOT_FOUND` |

Cart amounts use authoritative current product prices. Cart mutation increments `version`. A lifecycle-unavailable line can be removed but cannot be positively updated; no cart operation reserves stock.

## Customer checkout and orders

Every route requires `CUSTOMER`; Admin has no Customer order context.

| Method/path | Request | Success | Errors |
| --- | --- | --- | --- |
| `POST /orders` | Header `Idempotency-Key`: UUID, body `{ cartVersion }` positive integer | `201 OrderDetail` first success; `200 OrderDetail` matching replay | `400`, `401`, `403`, `409 EMPTY_CART|CART_VERSION_CONFLICT|PRODUCT_UNAVAILABLE|INSUFFICIENT_STOCK|IDEMPOTENCY_KEY_REUSED` |
| `GET /orders` | `page,pageSize` | own orders, `createdAt DESC,id DESC` | `400`, `401`, `403` |
| `GET /orders/:orderId` | UUID path | `200` own `OrderDetail` | `400`, `401`, `403`, `404 ORDER_NOT_FOUND` |

Checkout ignores/rejects client price, total, product, and customer fields. It revalidates cart version, lifecycle, quantity, stock, and current prices transactionally. First success creates exactly one `PLACED` order, decrements stock, clears ordered lines, and saves snapshots. A matching key/version replay returns that order without further mutation. Same key with a different cart version is a conflict. Failed checkout changes neither order, stock, nor cart.

## Admin category, product, and inventory

All routes below require `ADMIN`; Guest gets `401`, Customer gets `403`, and neither receives management data.

| Method/path | Request | Success | Errors |
| --- | --- | --- | --- |
| `GET /admin/categories` | `page,pageSize,isActive?` | Admin category list, `name,id` | `400` |
| `POST /admin/categories` | `{ name }` | `201` Admin Category | `400`, `409 CATEGORY_NAME_EXISTS` |
| `PATCH /admin/categories/:categoryId` | non-empty subset `{ name?, isActive? }` | `200` Admin Category | `400`, `404`, `409 CATEGORY_NAME_EXISTS` |
| `GET /admin/products` | `page,pageSize,q?,categoryId?,isActive?` | Admin product list, `createdAt DESC,id DESC` | `400`, `404 CATEGORY_NOT_FOUND` |
| `POST /admin/products` | `{ name, description, priceMinor, categoryId, initialStock }` | `201` Admin Product | `400`, `404 CATEGORY_NOT_FOUND`, `409 CATEGORY_INACTIVE` |
| `PATCH /admin/products/:productId` | non-empty allowed subset `{ name?, description?, priceMinor?, categoryId?, isActive? }` | `200` Admin Product | `400`, `404`, `409 CATEGORY_INACTIVE` |
| `GET /admin/inventory` | `page,pageSize,q?,stock?` where stock is `in` or `out`; stable order is product `name` ascending then `id` ascending | product/quantity list | `400` |
| `PATCH /admin/inventory/:productId` | `{ quantity }`, non-negative whole integer | `200 { productId, quantity, updatedAt }` | `400`, `404 PRODUCT_NOT_FOUND` |

Category names are trimmed/case-insensitively unique. Product name/description are non-empty trimmed strings; `priceMinor` is an integer greater than zero; `initialStock`/inventory quantity are non-negative integers; target category must be active. There is no DELETE endpoint. Deactivation preserves references, hides public discovery, prevents addition/checkout, and retains cart correction/removal/history behavior.

## Admin orders

| Method/path | Request | Success | Errors |
| --- | --- | --- | --- |
| `GET /admin/orders` | `page,pageSize,status?` | all orders, `createdAt DESC,id DESC`; safe customer identity | `400`, `401`, `403` |
| `GET /admin/orders/:orderId` | UUID path | `200` Admin `OrderDetail` + safe customer identity | `400`, `401`, `403`, `404 ORDER_NOT_FOUND` |
| `PATCH /admin/orders/:orderId` | `{ status }` | `200 OrderDetail` | `400 INVALID_STATUS`, `401`, `403`, `404`, `409 INVALID_ORDER_TRANSITION` |

Only `PLACED -> PROCESSING -> COMPLETED` is accepted. Skips, reversals, cancellation, and any transition from `COMPLETED` fail without inventory or order mutation.

## Contract verification

API tests assert request schemas, public DTO allowlists, error shape/status, pagination/order, email/password policy, session/Origin rules, Guest/Customer/Admin denial, owner-private `404`, lifecycle/search behavior, cart quantity outcomes, transaction rollback/idempotency/concurrency, and allowed order transitions. Any later breaking path, field, validation, or semantics change requires an approved Specification/Planning update and contract-test revision.




