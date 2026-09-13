# Relational Data Model

## Scope and conventions

**Planning status:** `APPROVED`
**Traceability:** REQ-AUTH-001/002, REQ-USER-001, REQ-CATEGORY-001/002, REQ-PRODUCT-001/002, REQ-INVENTORY-001, REQ-CART-001/002, REQ-ORDER-001/002/003, REQ-SEC-001/002, and REQ-QUALITY-001/002 in the [approved Specification](../01-spec/spec.md).

This is an initial PostgreSQL, ORM-neutral data model. No schema, migration mechanism, or production data exists. Tables use plural `snake_case`; identifiers are `uuid`; business times use UTC `timestamptz`. The foundation task selects the UUID facility and migration tooling. Infrastructure, production data operations, payment, and shipping are out of scope.

Money uses USD integer minor units: `bigint` columns named `*_minor` with `currency char(3) = 'USD'`. Price and required quantities are positive; stock is non-negative. Checkout arithmetic uses integers only.

```text
users 1--1 carts 1--* cart_items *--1 products 1--1 inventories
users 1--* orders 1--* order_items *--1 products
categories 1--* products
users 1--* auth_sessions
users 1--* checkout_idempotencies *--0..1 orders
```

`users` represents exclusive `CUSTOMER` or `ADMIN` roles; Admin is not an entity. Category/Product lifecycle is logical active/inactive, never physical deletion. Cart lines use current data; order lines keep immutable purchase snapshots.

## Tables and constraints

| Table | Columns | Constraints and foreign keys |
| --- | --- | --- |
| `users` | `id uuid PK`, `email varchar(254)`, `password_hash text`, `display_name varchar(100) NULL`, `role text`, timestamps | `email = lower(btrim(email))`; email non-blank; display name is NULL only when omitted at registration and, when supplied or updated, trimmed and non-blank (1-100 characters); role restricted to CUSTOMER/ADMIN; `UNIQUE(email)` makes normalized identity cross-role unique. No User deletion; all dependents use `ON DELETE RESTRICT`. Hash is never public. |
| `auth_sessions` | `id uuid PK`, `user_id uuid`, `token_hmac bytea`, `expires_at`, `revoked_at NULL`, `created_at`, `last_seen_at` | User FK RESTRICT; unique `token_hmac`; `last_seen_at` is NOT NULL and initialized to `created_at`; `expires_at` is the immutable 8-hour absolute deadline; idle expiry is `last_seen_at + 30 minutes`, and both limits are runtime-configured but bounded. Store only keyed HMAC/digest of opaque session value, never raw token. |
| `categories` | `id uuid PK`, `name varchar(120)`, `is_active boolean`, timestamps | trimmed/non-blank name; unique functional `lower(name)` index across active/inactive rows; active defaults true; Product FK RESTRICT. |
| `products` | `id uuid PK`, `category_id uuid`, `name varchar(120)`, `description varchar(4000)`, `price_minor bigint`, `currency char(3)`, `is_active boolean`, timestamps | Category FK RESTRICT; trimmed/non-blank name/description; `price_minor > 0`; USD; active defaults true. Product name deliberately is not unique. |
| `inventories` | `product_id uuid PK`, `quantity bigint`, `updated_at` | Product FK RESTRICT; `quantity >= 0`. Product FK as PK gives one Inventory per Product. |
| `carts` | `id uuid PK`, `user_id uuid`, `version bigint DEFAULT 0`, timestamps | User FK RESTRICT; `UNIQUE(user_id)`; `version >= 0`. Customer and empty Cart are created atomically. Every cart mutation, including checkout clear, increments version. |
| `cart_items` | `id uuid PK`, `cart_id uuid`, `product_id uuid`, `quantity bigint`, timestamps | Cart FK CASCADE; Product FK RESTRICT; `quantity > 0`; `UNIQUE(cart_id,product_id)`, so repeated add updates one line. No stored amount; preview derives current Product price. |
| `orders` | `id uuid PK`, `user_id uuid`, `status text`, `total_minor bigint`, `currency char(3)`, `placed_at`, `processing_at NULL`, `completed_at NULL`, timestamps | User FK RESTRICT; status only PLACED/PROCESSING/COMPLETED; total positive; USD. Status/date check permits only PLACED with no later dates, PROCESSING with processing date only, COMPLETED with both dates. |
| `order_items` | `id uuid PK`, `order_id uuid`, `product_id uuid`, `product_name varchar(120)`, `unit_price_minor bigint`, `quantity bigint`, `line_total_minor bigint`, `currency char(3)`, `created_at` | Order FK CASCADE; Product FK RESTRICT; non-blank snapshot name; price/quantity positive; `line_total_minor = unit_price_minor * quantity`; USD; `UNIQUE(order_id,product_id)`. Snapshot is historical authority. |
| `checkout_idempotencies` | `id uuid PK`, `user_id uuid`, `key_hmac bytea`, `cart_version bigint`, `state text`, `order_id uuid NULL`, `created_at`, `completed_at NULL` | User/order FKs RESTRICT; `UNIQUE(user_id,key_hmac)`; unique non-null order; state PROCESSING/COMPLETED. Check requires null order/date while processing and non-null values when complete. Raw Idempotency-Key is never stored/logged. |

DB constraints enforce canonical forms and invariants; the request boundary validates email syntax, password length, safe integers, UUIDs, field allowlists, and shape.

## Indexes and data access

| Index | Need |
| --- | --- |
| unique `users(email)` | normalized registration/login |
| unique `auth_sessions(token_hmac)`; `(user_id,expires_at)` | session validation and cleanup |
| unique `categories(lower(name))`; `(name,id) WHERE is_active` | duplicate check and active category listing |
| `(category_id,created_at DESC,id DESC) WHERE is_active`; `(created_at DESC,id DESC) WHERE is_active` on Product | public category/global newest-id list |
| Inventory PK; unique `(cart_id,product_id)`; `(cart_id,id)` | stock lookup, line upsert, stable cart read |
| `(user_id,created_at DESC,id DESC)`, `(status,created_at DESC,id DESC)`, `(created_at DESC,id DESC)` on Order; `(order_id,id)` on OrderItem | Customer history, Admin lists, detail |
| unique `(user_id,key_hmac)` | idempotency claim/replay |

Public search is parameter-bound case-insensitive substring match on Product name **or** description, joined to active Product/Category and paged. Leading-wildcard search has no useful B-tree path; verify `EXPLAIN` at representative scale before an independently approved trigram index.

Repository queries bind authenticated Customer `user_id` for profile, cart, cart-item, checkout, and own-order access; client owner IDs never grant scope. Password hashes, raw session/key material, all internal versions other than the API-safe Cart version, and database errors never enter DTOs/logs. Cart version is exposed solely as the checkout precondition.

## Transactions, lifecycle, and concurrency

- Registration atomically inserts a CUSTOMER User and Cart; duplicate email rolls back both.
- Product creation atomically inserts Product plus Inventory. Category/Product deactivation keeps references/history and does not mutate cart rows; cart availability derives current lifecycle and stock.
- Every Cart mutation locks its owner Cart before lines, validates lifecycle/stock, writes its line, and increments Cart version in the same transaction. A Cart never reserves stock.
- Admin status update is a guarded write: only PLACED to PROCESSING and PROCESSING to COMPLETED; zero affected rows maps to not-found/invalid transition and never changes inventory.

### Checkout and idempotency

```text
checkout(customerId, cartVersion, idempotencyKey)
  -> original completed order for exact replay
  -> conflict for same key with a different cartVersion
```

Cart version binds the canonical intent. The initial request must match locked Cart version. An exact retry sends that original version after success has cleared/incremented Cart and returns the original Order; the same key for changed cart intent is rejected without mutation.

One short PostgreSQL transaction, with no network call:

1. HMAC the opaque Idempotency-Key with server-held material; never persist/log its raw value.
2. Insert PROCESSING `(user_id,key_hmac)` claim. On conflict, lock/read it: completed plus same version replays Order; another version conflicts.
3. Lock Cart/lines, then Product, Category, Inventory in ascending Product UUID order; validate version, non-empty cart, active lifecycle, USD price, quantities, and stock.
4. Conditionally decrement each row: `UPDATE inventories SET quantity = quantity - :q WHERE product_id = :id AND quantity >= :q`; every line must affect one row.
5. Insert one PLACED Order and snapshots; complete idempotency row; delete Cart lines; increment Cart version; commit.

Any failure rolls back claim, stock, Order, snapshots, and Cart together. At READ COMMITTED, locks plus conditional decrement prevent negative stock and duplicate sale. Only bounded serialization/deadlock failures retry using the same input; domain conflicts never become success.

### Session persistence

Login/re-authentication rotates an opaque session value and stores only its HMAC/digest, User, expiry, and revocation state. Validation hashes the presented value, requires non-revoked/unexpired row, then loads current role. Logout transactionally revokes matched session and clears cookie. Raw session/key values, key material, password hashes, and credentials are excluded from logs/errors/responses.

## Migration, recovery, and verification

The first approved persistence task creates an additive migration: users, sessions, categories, products, inventories, carts, cart items, orders, order items, idempotencies, then indexes/checks. Run against disposable PostgreSQL. No backfill exists. Before production data rollback may remove initial schema through chosen migration tool; once data exists use forward compensating migrations and never rewrite applied history.

Future integration tests cover unique/FK/check failures; Customer ownership/Admin denial; cart merge/zero removal/version; lifecycle; Product+Inventory atomicity; snapshots and status transitions; checkout rollback/concurrent final unit/non-negative stock/replay/changed-intent conflict; HMAC-only session rotation/expiry/revocation; and representative query plans.

No migration, database, application code, or production data changed in this planning work.