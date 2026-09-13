# E-commerce MVP Specification

## 1. Purpose and scope

This Specification defines what the E-commerce MVP must do. It is the business source of truth for later design, implementation, testing, and acceptance. It does not prescribe frameworks, tables, exact data fields, endpoint shapes, status codes, persistence mechanisms, or deployment.

The MVP covers account access, profile, category/product discovery, inventory, cart, checkout, orders, administration, UI/UX, security, and quality. Confirmed facts come from [Project Documentation](../../project/INDEX.md).

## 2. Actors and conventions

| Actor | Responsibility |
| --- | --- |
| Customer | Access an account, discover products, manage an own cart, checkout, view own orders, and manage an own profile. |
| Admin | Manage products, categories, inventory, and orders. |

An **unauthenticated state** is an access state, not another actor. Priorities are `MUST`, `SHOULD`, and `MAY`. Status is `DEFINED` when Planning can proceed and `BLOCKED` when a business decision is still required.

## 3. Requirement summary

| Requirement ID | Area | Priority | Summary | Status |
| --- | --- | --- | --- | --- |
| REQ-AUTH-001 | Authentication | MUST | Register a Customer account | DEFINED |
| REQ-AUTH-002 | Authentication | MUST | Login, logout, and authentication state | DEFINED |
| REQ-USER-001 | User/Profile | MUST | View and update own profile | DEFINED |
| REQ-CATEGORY-001 | Category | MUST | Discover categories and filter products | DEFINED |
| REQ-CATEGORY-002 | Category | MUST | Admin category management | DEFINED |
| REQ-PRODUCT-001 | Product | MUST | Browse, search, and view products | DEFINED |
| REQ-PRODUCT-002 | Product | MUST | Admin product management | DEFINED |
| REQ-INVENTORY-001 | Inventory | MUST | Maintain valid stock | DEFINED |
| REQ-CART-001 | Cart | MUST | View cart and summary | DEFINED |
| REQ-CART-002 | Cart | MUST | Add, update, and remove cart items | DEFINED |
| REQ-ORDER-001 | Checkout/Order | MUST | Complete consistent checkout | DEFINED |
| REQ-ORDER-002 | Checkout/Order | MUST | View own order history and detail | DEFINED |
| REQ-ORDER-003 | Checkout/Order | MUST | Admin order management | DEFINED |
| REQ-ADMIN-001 | Admin | MUST | Protect administrative capabilities | DEFINED |
| REQ-UI-001 | UI/UX | MUST | Provide required pages and states | DEFINED |
| REQ-UI-002 | UI/UX | MUST | Provide consistent forms and feedback | DEFINED |
| REQ-UI-003 | UI/UX | MUST | Remain responsive and accessible | DEFINED |
| REQ-ERROR-001 | Error | MUST | Return predictable, safe failures | DEFINED |
| REQ-SEC-001 | Security | MUST | Protect credentials, input, output, and secrets | DEFINED |
| REQ-SEC-002 | Security | MUST | Enforce role and resource ownership | DEFINED |
| REQ-QUALITY-001 | Quality | MUST | Preserve business consistency and history | DEFINED |
| REQ-QUALITY-002 | Quality | MUST | Verify critical behavior before acceptance | DEFINED |
## 4. Authorization matrix

Customer and Admin are exclusive roles in the MVP. Admin may use public catalog browsing, but Admin has no Customer profile, cart, checkout, or own-order context and cannot impersonate a Customer. Public registration always creates a Customer account and cannot grant Admin access.

| Capability | Guest | Customer | Admin |
| --- | --- | --- | --- |
| Browse categories and products | Yes | Yes | Yes |
| Register a Customer account | Yes | No | No |
| Login | Yes | Not applicable while authenticated | Not applicable while authenticated |
| Logout | No | Yes | Yes |
| View or update own profile | No | Yes | No |
| View or change own cart | No | Yes | No |
| Checkout | No | Yes | No |
| View own orders | No | Yes | No |
| Manage products | No | No | Yes |
| Manage categories | No | No | Yes |
| Manage inventory | No | No | Yes |
| Manage all orders | No | No | Yes |
| Update order status | No | No | Yes |
## 5. Requirements

### Authentication

#### REQ-AUTH-001

**Title:** Customer account registration  
**Priority:** MUST  
**Requirement:** A Customer in a Guest state can register with a valid email address and password; public registration creates only a Customer account.  
**Related Actor:** Customer (Guest state)  
**Dependencies:** None  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-AUTH-001-01:** A syntactically valid email and valid password create exactly one Customer account and present a success outcome.
- **AC-AUTH-001-02:** Email identity is trimmed, compared case-insensitively, and stored in lowercase; the normalized email is unique across Customer and Admin accounts, and a duplicate is rejected without creating another account.
- **AC-AUTH-001-03:** A password must contain 8 through 128 characters inclusive; no composition rule is required, password characters are not trimmed or transformed, and missing or out-of-range credentials are rejected without creating an account.
- **AC-AUTH-001-04:** Registration cannot select or assign Admin role, and submitted credentials never appear in user-visible output or logs.
#### REQ-AUTH-002

**Title:** Login, logout, and authentication state  
**Priority:** MUST  
**Requirement:** Customer and Admin users can establish and end authenticated access using their normalized email and exact password; protected capabilities reflect the authenticated identity and exclusive role.  
**Related Actor:** Customer, Admin  
**Dependencies:** REQ-AUTH-001 for newly registered Customers  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-AUTH-002-01:** A valid normalized email and matching exact password establish authenticated access for the matching identity and role, which remains usable across navigation while that authentication state is valid.
- **AC-AUTH-002-02:** An unknown email, wrong password, or invalid or expired authentication state grants no protected access and returns a generic failure that does not confirm whether an account exists.
- **AC-AUTH-002-03:** Logout ends the current authentication state; reuse of that ended state for a protected operation is rejected.
- **AC-AUTH-002-04:** Authentication grants only the capabilities in the authorization matrix: Customer access remains owner-scoped, Admin access remains administrative, and neither role receives the other role's private capabilities.
### User and profile

#### REQ-USER-001

**Title:** Own profile management  
**Priority:** MUST  
**Requirement:** An authenticated Customer can view their normalized account email and display name and can update only their own display name.  
**Related Actor:** Customer  
**Dependencies:** REQ-AUTH-002  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-USER-001-01:** A Customer sees only their own normalized email and display name; credential material is never included.
- **AC-USER-001-02:** A non-empty display name after trimming can be saved and is then shown; an empty value or an attempt to change email, role, ownership, or another unsupported field is rejected without changing the profile.
- **AC-USER-001-03:** Guest, Admin, and other-Customer attempts to access or update a Customer profile are rejected without protected information disclosure.
- **AC-USER-001-04:** A failed update preserves the previously stored display name and does not report success.
### Category

#### REQ-CATEGORY-001

**Title:** Category discovery and filtering  
**Priority:** MUST  
**Requirement:** Any actor can view active categories and filter publicly visible products by one active category.  
**Related Actor:** Customer (Guest or authenticated state), Admin  
**Dependencies:** None  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-CATEGORY-001-01:** Category discovery returns active categories only; an inactive category is not exposed in the public category list.
- **AC-CATEGORY-001-02:** A filter for a known active category returns only publicly visible products assigned to that category, including out-of-stock products with their unavailable state.
- **AC-CATEGORY-001-03:** No active categories or no matching products produces a valid empty result; an unknown or inactive category filter produces a distinguishable not-found outcome.
#### REQ-CATEGORY-002

**Title:** Admin category management  
**Priority:** MUST  
**Requirement:** An Admin can view, create, update, deactivate, and reactivate categories; permanent category deletion is not part of the MVP.  
**Related Actor:** Admin  
**Dependencies:** REQ-ADMIN-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-CATEGORY-002-01:** A non-empty category name after trimming creates one active category; category-name uniqueness is enforced case-insensitively across active and inactive categories.
- **AC-CATEGORY-002-02:** A valid name update changes only the intended category; an unknown category, empty name, or duplicate normalized name is rejected without partial change.
- **AC-CATEGORY-002-03:** Deactivating a category preserves product and historical-order references, removes the category and its products from public discovery, and makes affected cart items unavailable; reactivation restores public visibility only for products that are themselves active.
- **AC-CATEGORY-002-04:** Unsupported deletion and denied lifecycle operations make no category, product, cart, inventory, or order-history change.
### Product

#### REQ-PRODUCT-001

**Title:** Product discovery, search, and detail  
**Priority:** MUST  
**Requirement:** Any actor can browse active products in active categories, search and filter them, and view Customer-facing product detail; stock determines purchase availability but not public visibility.  
**Related Actor:** Customer (Guest or authenticated state), Admin  
**Dependencies:** REQ-CATEGORY-001, REQ-INVENTORY-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-PRODUCT-001-01:** Every listed product shows its stable identity, name, USD unit price with no more than two fractional digits, category, stock availability, and a path to detail; an active out-of-stock product remains visible and is identified as unavailable to purchase.
- **AC-PRODUCT-001-02:** Search trims the query and performs a case-insensitive substring match against product name or description; a blank query applies no search restriction, category and search filters combine with AND, and no match produces an empty result.
- **AC-PRODUCT-001-03:** Detail for a publicly visible product shows its name, description, USD unit price, category, and current in-stock or out-of-stock state.
- **AC-PRODUCT-001-04:** An unknown product, inactive product, product in an inactive category, or unknown/inactive category filter produces a clear not-found outcome without exposing internal information.
#### REQ-PRODUCT-002

**Title:** Admin product management  
**Priority:** MUST  
**Requirement:** An Admin can view, create, update, deactivate, and reactivate products; permanent product deletion is not part of the MVP.  
**Related Actor:** Admin  
**Dependencies:** REQ-CATEGORY-002, REQ-INVENTORY-001, REQ-ADMIN-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-PRODUCT-002-01:** Creation requires a non-empty trimmed name and description, a USD price greater than zero with no more than two fractional digits, a known active category, and a non-negative whole initial stock quantity; success creates one active product with a unique immutable system identity, while product names need not be unique.
- **AC-PRODUCT-002-02:** A valid update changes only the intended product; an unknown product/category, inactive target category, empty required value, invalid price, invalid stock, or attempt to change product identity is rejected without partial change.
- **AC-PRODUCT-002-03:** Deactivation removes the product from public discovery, prevents new cart additions and checkout, leaves an existing cart line visible and available for correction/removal but unavailable for purchase, and preserves historical orders; reactivation restores visibility only when its category is active.
- **AC-PRODUCT-002-04:** Unsupported deletion and denied lifecycle operations cause no product, category, inventory, cart, or order-history change.
### Inventory

#### REQ-INVENTORY-001

**Title:** Stock availability and integrity  
**Priority:** MUST  
**Requirement:** The system maintains a current non-negative whole stock quantity for each product; Admin can view/update it and Customer purchase operations respect it.  
**Related Actor:** Customer, Admin  
**Dependencies:** REQ-ADMIN-001 for updates  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-INVENTORY-001-01:** A publicly visible product with stock greater than zero is in stock; stock equal to zero is out of stock, while lifecycle-inactive products or categories remain unavailable regardless of stock.
- **AC-INVENTORY-001-02:** Admin can view stock and set a valid non-negative whole quantity for a known product.
- **AC-INVENTORY-001-03:** Invalid quantities, unknown products, and denied updates leave stock unchanged.
- **AC-INVENTORY-001-04:** Cart cannot accept a resulting quantity above current stock; checkout revalidates lifecycle availability and stock and fails consistently if either became invalid.
- **AC-INVENTORY-001-05:** Successful or concurrent operations never make stock negative or sell the same available unit twice.
### Cart

#### REQ-CART-001

**Title:** Own cart view and summary  
**Priority:** MUST  
**Requirement:** An authenticated Customer can view only their own cart, including current product availability and monetary summary.  
**Related Actor:** Customer  
**Dependencies:** REQ-AUTH-002, REQ-PRODUCT-001, REQ-INVENTORY-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-CART-001-01:** A populated cart shows each product name, requested quantity, current availability, current USD unit price, line subtotal, and cart total, with monetary amounts shown to no more than two fractional digits.
- **AC-CART-001-02:** A cart without items shows an empty state with an identifiable action to browse products and does not offer or imply successful checkout.
- **AC-CART-001-03:** Each line subtotal equals shown quantity multiplied by authoritative current unit price, and the cart total equals the sum of line subtotals.
- **AC-CART-001-04:** Guest, Admin, and other-Customer access is rejected without cart-content disclosure.
#### REQ-CART-002

**Title:** Own cart item management  
**Priority:** MUST  
**Requirement:** An authenticated Customer can add, update, and remove items only in their own cart using deterministic quantity rules.  
**Related Actor:** Customer  
**Dependencies:** REQ-CART-001, REQ-INVENTORY-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-CART-002-01:** Adding a publicly visible in-stock product with a positive whole quantity creates one line; adding the same product again increments that line, and the entire add is rejected with no change when the resulting quantity exceeds current stock.
- **AC-CART-002-02:** Updating an existing line to a positive whole quantity not exceeding current stock replaces its quantity and recalculates amounts; updating it to zero removes the line and recalculates amounts.
- **AC-CART-002-03:** Adding an unknown or lifecycle-unavailable product, positively updating a lifecycle-unavailable line, an add quantity below one, an update quantity below zero, a non-whole quantity, a quantity above stock, or an unknown cart item is rejected with a distinguishable non-success outcome and no cart change.
- **AC-CART-002-04:** Explicit removal of an existing line removes it and recalculates amounts; removal of an unknown item returns a not-found outcome and leaves the cart unchanged.
- **AC-CART-002-05:** Guest, Admin, and other-Customer attempts to view or mutate a Customer cart or item are rejected without protected data disclosure or state change.
### Checkout and order

#### REQ-ORDER-001

**Title:** Consistent checkout and order creation  
**Priority:** MUST  
**Requirement:** An authenticated Customer can confirm their valid non-empty cart as one order without payment or shipping-provider integration; the confirmation succeeds consistently or fails without partial business state.  
**Related Actor:** Customer  
**Dependencies:** REQ-AUTH-002, REQ-CART-002, REQ-PRODUCT-001, REQ-INVENTORY-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-ORDER-001-01:** Guest/Admin checkout and empty-cart checkout are rejected and create no order or stock change; the Customer's cart remains available.
- **AC-ORDER-001-02:** Before success, checkout revalidates that every cart product and category is active, every quantity is a positive whole number within current stock, and every final USD unit price is the authoritative current price; any failure identifies correctable items without partial state change.
- **AC-ORDER-001-03:** Success creates exactly one order in PLACED status with purchase-time product identity, name, USD unit price, quantity, line subtotal, and total; it reduces corresponding stock, removes successfully ordered cart items, and returns the order confirmation.
- **AC-ORDER-001-04:** A failed confirmation creates no order, changes no stock, and removes no cart item; success never leaves an order without its stock reduction or a stock reduction without its order.
- **AC-ORDER-001-05:** Repeating the same checkout confirmation intent returns the original order confirmation and creates no additional order, stock reduction, or cart mutation; Planning may choose the technology-independent means of identifying the intent.
#### REQ-ORDER-002

**Title:** Own order history and detail  
**Priority:** MUST  
**Requirement:** An authenticated Customer can view only their own order history and detail, including purchase-time information and the current PLACED, PROCESSING, or COMPLETED status.  
**Related Actor:** Customer  
**Dependencies:** REQ-ORDER-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-ORDER-002-01:** History is a bounded, deterministically ordered list of the Customer's own orders showing order identity, current status, USD total, and creation information.
- **AC-ORDER-002-02:** Detail shows purchase-time product identity/name, USD unit price, quantity, line subtotal, order total, current status, and relevant status dates.
- **AC-ORDER-002-03:** Later product name, price, category, stock, or lifecycle changes do not alter historical order item information or totals.
- **AC-ORDER-002-04:** Guest, Admin, unknown-order, and other-Customer access is rejected without protected order-detail disclosure.
#### REQ-ORDER-003

**Title:** Admin order management  
**Priority:** MUST  
**Requirement:** Admin can view all bounded order lists/details and advance an order through the minimal forward-only status model PLACED → PROCESSING → COMPLETED; cancellation is not part of the MVP.  
**Related Actor:** Admin  
**Dependencies:** REQ-ORDER-001, REQ-ADMIN-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-ORDER-003-01:** Admin listing/detail exposes the Customer/order identity, purchase-time items, USD total, current status, and relevant dates needed to manage an order.
- **AC-ORDER-003-02:** An order is created as PLACED; Admin may change PLACED to PROCESSING and PROCESSING to COMPLETED, and the accepted status is visible to Admin and the Customer owner.
- **AC-ORDER-003-03:** Unknown orders, unsupported statuses, skipped or reversed transitions, and any transition from COMPLETED are rejected without changing the order or inventory.
- **AC-ORDER-003-04:** Guest and Customer management attempts are rejected with no order change and no protected information beyond the requester's authorized view.
### Admin

#### REQ-ADMIN-001

**Title:** Administrative authorization  
**Priority:** MUST  
**Requirement:** Every product, category, inventory, and all-order management capability requires authenticated Admin authorization enforced by the application.  
**Related Actor:** Admin  
**Dependencies:** REQ-AUTH-002  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-ADMIN-001-01:** An authenticated Admin can use approved product, category, inventory, all-order, and order-status management capabilities.
- **AC-ADMIN-001-02:** Guest and Customer requests to every Admin capability are rejected without protected management data or state change.
- **AC-ADMIN-001-03:** Admin may browse the public catalog but has no Customer profile, cart, checkout, or own-order context and cannot impersonate or silently acquire ownership of a Customer resource.
- **AC-ADMIN-001-04:** Client-side visibility is not authorization; every Admin operation enforces role permission at the application boundary.
### UI/UX

#### REQ-UI-001

**Title:** Required pages and user-visible states  
**Priority:** MUST  
**Requirement:** Frontend provides the approved Customer/Admin pages and observable pending, result, empty, validation, application-error, unauthenticated, and unauthorized states wherever applicable.  
**Related Actor:** Customer, Admin  
**Dependencies:** Functional requirements represented by each page  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-UI-001-01:** Customer pages cover Register, Login, Product List/Detail, Cart, Checkout, Order Confirmation/History/Detail, and Profile; each page has a unique visible heading that identifies its purpose.
- **AC-UI-001-02:** Admin pages cover Product, Category, Inventory, and Order management; each view identifies its managed resource and available permitted action.
- **AC-UI-001-03:** Product browsing distinguishes pending data, results, no products/no matches, and retrieval failure; cart/order views distinguish applicable pending, populated, empty, failure, and success outcomes without displaying stale success.
- **AC-UI-001-04:** Protected pages show unauthenticated or unauthorized outcomes without protected data, and a pending mutation disables or otherwise guards its initiating control against unintended repeated submission.
#### REQ-UI-002

**Title:** Consistent commerce presentation and forms  
**Priority:** MUST  
**Requirement:** Customer/Admin interfaces present a clean, modern, consistent, e-commerce-appropriate visual experience whose important behavior is verified through observable criteria rather than reviewer preference.  
**Related Actor:** Customer, Admin  
**Dependencies:** REQ-UI-001 and the functional requirement represented by each view  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-UI-002-01:** Navigation, buttons, inputs, forms, product presentations, status indicators, dialogs, and feedback use the same label, state, and interaction treatment whenever they serve the same purpose.
- **AC-UI-002-02:** Product list/detail visibly identify name, USD price, availability, and detail/primary purchase action; cart/checkout visibly identify items, quantities, line amounts, total, validation outcome, and the next permitted action.
- **AC-UI-002-03:** Every available primary action has a visible text label or accessible name describing the action, while unavailable actions are absent or visibly disabled with the current availability state.
- **AC-UI-002-04:** Forms visibly identify required fields, associate invalid fields with corrective feedback, show backend rejection at field or form level, preserve safe recoverable input after rejection, and expose a distinct pending submission state.
#### REQ-UI-003

**Title:** Responsive and accessible baseline  
**Priority:** MUST  
**Requirement:** Customer/Admin interfaces remain operable at representative mobile, tablet, and desktop viewport widths and provide objective keyboard, labeling, focus, error, color, and contrast basics.  
**Related Actor:** Customer, Admin  
**Dependencies:** REQ-UI-001, REQ-UI-002  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-UI-003-01:** At 360, 768, and 1280 CSS-pixel viewport widths, navigation, browsing, forms, cart, checkout, and primary actions remain present and operable without page-level horizontal scrolling or loss of required information.
- **AC-UI-003-02:** At those widths, Admin management remains operable using responsive layout or a clearly bounded horizontally scrollable data region that does not force the whole page to scroll horizontally.
- **AC-UI-003-03:** Every interactive control is keyboard reachable and operable, has a visible focus indication and accessible name, and each validation error is programmatically associated with its field or form.
- **AC-UI-003-04:** Information and errors do not rely on color alone; normal text has at least 4.5:1 contrast, while large text and visible control/state boundaries have at least 3:1 contrast.
### Error behavior

#### REQ-ERROR-001

**Title:** Predictable and safe failures  
**Priority:** MUST  
**Requirement:** The application distinguishes invalid input, missing authentication, insufficient permission, unknown/unavailable resources, business conflicts, and unexpected failures without reporting failure as success.  
**Related Actor:** Customer, Admin  
**Dependencies:** None  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-ERROR-001-01:** Each expected error category produces a stable, distinguishable non-success outcome that identifies the failed operation or affected field when safe.
- **AC-ERROR-001-02:** When the requester can correct a failure, feedback identifies the field, resource state, or next permitted action needed for correction without disclosing protected or internal information.
- **AC-ERROR-001-03:** Unexpected failures neither appear successful nor expose stack, persistence, infrastructure, secret, credential, or authentication material.
- **AC-ERROR-001-04:** A failed mutation preserves the previously valid business and visible UI state unless another recovery outcome is explicitly specified by its requirement.
### Security

#### REQ-SEC-001

**Title:** Credential, input, output, and secret protection  
**Priority:** MUST  
**Requirement:** The application protects passwords, authentication material, secrets, external input, and public output according to [Project Security](../../project/SECURITY.md).  
**Related Actor:** Customer, Admin  
**Dependencies:** None  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-SEC-001-01:** Passwords are not stored as plaintext; passwords/authentication material never appear in user output or logs.
- **AC-SEC-001-02:** Real secrets/credentials are absent from source, committed content, and frontend-delivered content.
- **AC-SEC-001-03:** External values are validated for applicable shape, type, range, format, size, and allowed value before affecting business state.
- **AC-SEC-001-04:** Unsupported fields cannot change protected information; public output/errors exclude sensitive and internal information.
- **AC-SEC-001-05:** Untrusted values cannot alter the intended meaning of a persistence operation.

#### REQ-SEC-002

**Title:** Role and resource-ownership enforcement  
**Priority:** MUST  
**Requirement:** Protected capabilities separately enforce authentication, exclusive Customer/Admin role permission, and Customer resource ownership on every access path.  
**Related Actor:** Customer, Admin  
**Dependencies:** REQ-AUTH-002, REQ-ADMIN-001  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-SEC-002-01:** Customer profile, cart, checkout, and own-order capabilities require a valid authenticated Customer identity; an authenticated Admin does not satisfy this Customer-role requirement.
- **AC-SEC-002-02:** A Customer can view or mutate only their own profile and cart and can view only their own orders; an identifier supplied by a client never grants ownership.
- **AC-SEC-002-03:** Every product, category, inventory, and all-order management operation requires Admin role; Admin access does not grant Customer impersonation or ownership.
- **AC-SEC-002-04:** Missing, invalid, or ambiguous identity/permission/ownership context is rejected with no protected data disclosure or state change, and client-side visibility never replaces application authorization.
### Reliability and quality

#### REQ-QUALITY-001

**Title:** Consistent and recoverable business state  
**Priority:** MUST  
**Requirement:** Validation, authorization, conflict, duplicate-confirmation, and processing failures do not corrupt or silently contradict business state or historical facts.  
**Related Actor:** Customer, Admin  
**Dependencies:** All state-changing requirements  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-QUALITY-001-01:** A rejected operation does not partially apply intended business changes and does not present a success state.
- **AC-QUALITY-001-02:** Concurrent cart/inventory/checkout activity preserves non-negative stock, one valid order per checkout intent, correct cart removal, and consistent order/stock relationships.
- **AC-QUALITY-001-03:** Historical orders remain accurate after later product, category, price, stock, or lifecycle changes.
#### REQ-QUALITY-002

**Title:** Verification and release integrity  
**Priority:** MUST  
**Requirement:** Critical flows and primary failure paths have repeatable automated verification, and no known blocking regression remains at acceptance.  
**Related Actor:** Customer, Admin  
**Dependencies:** All MUST requirements  
**Status:** DEFINED

**Acceptance Criteria**

- **AC-QUALITY-002-01:** Automated verification covers account access, protected access, discovery, cart, checkout, inventory consistency, own-order access, and Admin authorization.
- **AC-QUALITY-002-02:** Tests cover applicable valid/invalid input, unknown resource, unauthenticated, unauthorized/ownership, conflict, and recovery behavior.
- **AC-QUALITY-002-03:** Customer and focused Admin journeys are verified across the application when the approved environment supports them.
- **AC-QUALITY-002-04:** Growable product/order lists use bounded retrieval with deterministic ordering; asynchronous interactions show applicable loading state.
- **AC-QUALITY-002-05:** Acceptance is withheld while required checks fail or a blocking regression affects a critical journey.

## 6. Critical user journeys

| Journey | Sequence | Requirement mapping |
| --- | --- | --- |
| Customer purchase | Register/Login → Browse/Search/Filter → Detail → Add/Update Cart → Checkout → Confirmation → Order History/Detail | REQ-AUTH-001/002, REQ-CATEGORY-001, REQ-PRODUCT-001, REQ-INVENTORY-001, REQ-CART-001/002, REQ-ORDER-001/002 |
| Customer profile | Login → View/Update own Profile → Logout | REQ-AUTH-002, REQ-USER-001 |
| Admin management | Admin Login → Manage Category/Product → Inventory → View Order → Update Status | REQ-AUTH-002, REQ-CATEGORY-002, REQ-PRODUCT-002, REQ-INVENTORY-001, REQ-ORDER-003, REQ-ADMIN-001 |

All journeys also depend on REQ-UI-001/002/003, REQ-ERROR-001, REQ-SEC-001/002, and REQ-QUALITY-001/002.

## 7. Out of scope

- Real payment gateway; coupon/promotion engine; reviews/ratings; wishlist; recommendations; email notification.
- Redis, OpenSearch, and advanced recommendation/search infrastructure; basic search remains in scope.
- Shipping-provider integration.
- Infrastructure, deployment, cloud provisioning, and infrastructure CI/CD.
- Any capability not listed as an MVP requirement here.

## 8. Specification decisions and open questions

The former blockers were resolved under the brief's resolution policy. These are product-level behavior decisions, not implementation choices.

| ID | Previous state | Classification | Recorded decision | Current state |
| --- | --- | --- | --- | --- |
| OQ-001 | Blocking | B — safe MVP default | Email is the only account identifier. It is trimmed, compared case-insensitively, stored lowercase, and unique across Customer/Admin accounts. | RESOLVED |
| OQ-002 | Blocking | B — safe MVP default | Password length is 8–128 characters inclusive with no composition rule; characters are not trimmed or transformed. | RESOLVED |
| OQ-003 | Blocking | B — safe MVP default | Category names are trimmed and case-insensitively unique. Categories are active/inactive, can be reactivated, cannot be permanently deleted, and deactivation preserves references while hiding the category and its products publicly. | RESOLVED |
| OQ-004 | Blocking | B — safe MVP default | Products have immutable system identity and reversible active/inactive lifecycle; names need not be unique. Deactivation blocks discovery/add/checkout, keeps existing cart lines visible and correctable/removable but unavailable for purchase, and preserves order history. | RESOLVED |
| OQ-005 | Blocking | B — safe MVP default | Orders use the forward-only PLACED → PROCESSING → COMPLETED model. Cancellation, reversal, and skipped transitions are outside the MVP. | RESOLVED |
| OQ-006 | Blocking | A — confirmed actor boundaries and least privilege | Customer/Admin roles are exclusive. Admin may browse public catalog but has no Customer profile/cart/checkout/own-order context and cannot impersonate a Customer. | RESOLVED |
| OQ-007 | Non-blocking | B — safe MVP default | Customer profile exposes normalized email and display name; only the Customer's display name is editable. Email, role, and ownership are immutable through profile behavior. | RESOLVED |
| OQ-008 | Blocking | B — safe MVP default | Repeated add increments the existing line after validating resulting stock; update-to-zero removes the line; explicit removal of a missing line returns not found without change. | RESOLVED |

### Major finding remediation

| Finding | Resolution |
| --- | --- |
| SPEC-MAJ-001 | Search uses trimmed case-insensitive name/description substring matching; blank search means no restriction. MVP money uses USD, prices are greater than zero with at most two fractional digits, and cart/order calculations use authoritative prices consistently. |
| SPEC-MAJ-002 | Repeating one checkout confirmation intent returns its original order result and performs no additional order, stock, or cart mutation. |
| SPEC-MAJ-003 | UI/error ACs now define page headings, action labels, pending/empty/failure states, supported viewport checks, keyboard/focus/label behavior, field association, and measurable contrast thresholds. |

### Remaining open questions

None. Frameworks, authentication transport, persistence design, exact API shape/status mapping, and the technical mechanism used to identify a checkout intent remain Planning decisions and do not alter the approved business outcomes above.
## 9. Acceptance summary

| Area | Requirements | MUST | SHOULD | MAY | Blocked |
| --- | ---: | ---: | ---: | ---: | ---: |
| Authentication | 2 | 2 | 0 | 0 | 0 |
| User/Profile | 1 | 1 | 0 | 0 | 0 |
| Category | 2 | 2 | 0 | 0 | 0 |
| Product | 2 | 2 | 0 | 0 | 0 |
| Inventory | 1 | 1 | 0 | 0 | 0 |
| Cart | 2 | 2 | 0 | 0 | 0 |
| Checkout/Order | 3 | 3 | 0 | 0 | 0 |
| Admin | 1 | 1 | 0 | 0 | 0 |
| UI/UX | 3 | 3 | 0 | 0 | 0 |
| Error | 1 | 1 | 0 | 0 | 0 |
| Security | 2 | 2 | 0 | 0 | 0 |
| Quality | 2 | 2 | 0 | 0 | 0 |
| **Total** | **22** | **22** | **0** | **0** | **0** |

All 22 requirements have unique IDs, priorities, actor attribution, dependencies, and observable AC IDs. The seven former blockers and three MAJOR findings have explicit requirement-level resolutions. No product decision remains open for Planning.

**Specification gate:** APPROVED by independent Specification Verification. The next authorized phase is Planning; Planning remains NOT STARTED and no pre-existing downstream artifact is approved by this gate.