# UI / UX Design

## Experience architecture

The web client is a responsive, accessible commerce interface built from one shared shell, feature route groups, and small reusable primitives. It implements the approved user-visible behavior only; it does not introduce payment, shipping, reviews, wishlists, or other excluded features.

| Route group | Pages |
| --- | --- |
| Public | Register, Login, Product List, Product Detail |
| Customer only | Cart, Checkout, Order Confirmation, Order History, Order Detail, Profile |
| Admin only | Category Management, Product Management, Inventory Management, Order Management/Detail |

Every page has a unique visible `h1` identifying its purpose. The shell provides brand/catalog navigation, role-appropriate account/cart/Admin navigation, a main landmark, and compact footer. Admin navigation appears only for an authenticated Admin; customer-private navigation appears only for an authenticated Customer. Visibility is convenience, never authorization.

## Reusable UI boundary

Shared primitives: `AppShell`, `PageHeader`, `Button`, `TextField`, `Select`, `FormField`, `InlineAlert`, `LoadingState`, `EmptyState`, `ErrorState`, `ProductCard`, `Price`, `AvailabilityBadge`, `QuantityControl`, `CartSummary`, `OrderStatus`, `Pagination`, `DataTable`, and `ConfirmDialog`.

CSS tokens own color, typography, spacing, radius, elevation, focus ring, and breakpoints. Reusable components use the same labels, disabled/pending treatment, and feedback pattern for the same purpose. Feature views compose primitives rather than duplicate form/error/access behavior.

## Page and state design

| Page | Primary content/action | Required observable states |
| --- | --- | --- |
| Register | Email/password and optional display name; **Create account** | pending, field validation, duplicate email, generic safe error, success navigation |
| Login | Email/password; **Log in** | pending, validation, generic invalid credentials, session-expired/unauthenticated outcome |
| Product List | Search, category filter, pageable product cards | pending skeleton, results, no categories/no products/no matches, retrieval failure |
| Product Detail | Name, description, category, USD price, availability, quantity, **Add to cart** | pending, not found, out-of-stock/unavailable, add conflict, success |
| Cart | Current-price lines, quantities, totals, **Checkout** | pending, populated, empty with **Browse products**, unavailable line, mutation failure/success |
| Checkout | Read-only current cart summary and no-payment confirmation; **Place order** | empty/cart-version conflict, lifecycle/stock failure, pending, safe error, confirmation transition |
| Order Confirmation | Order id, PLACED status, items, total; **View orders** | success, refresh pending, not-found/error safe fallback |
| Order History/Detail | Pageable own orders; immutable item snapshots, status/dates | pending, empty, not found, retrieval failure |
| Profile | Normalized email and display name; **Save display name** | pending, validation, save success/failure, access outcome |
| Admin Category/Product/Inventory | Lists/forms for approved create/edit/activation/stock actions | pending, empty, validation/conflict/error, explicit deactivation confirmation |
| Admin Orders | Pageable list/detail and permitted next-status action | pending, empty, not found, invalid-transition/error, updated status |

A protected route without a valid session presents an unauthenticated outcome/sign-in path with no protected data. A wrong role presents a forbidden outcome with no protected data. Resource not found or non-owned private resource uses the safe contract outcome; views never turn a failed mutation into success.

## Interaction rules

- Route queries render a loading state before data, a distinct empty/no-match state after successful empty data, and a retry-capable retrieval failure where retry is meaningful.
- Form fields visibly identify required input. Inline corrective text is programmatically associated with each invalid field or the form. Safe recoverable values remain after rejection.
- A pending mutation disables or otherwise guards its initiating control. Checkout creates and retains one idempotency key for a single confirmation attempt; retry follows the API replay contract rather than issuing a new intent accidentally.
- Product cards/detail always show name, USD price, availability, and a labeled detail/primary purchase action. Unavailable purchase action is absent or visibly disabled with availability text.
- Cart totals are rendered from API-authoritative `*Minor` amounts. A successful cart/order mutation invalidates relevant server queries; checkout/inventory/status changes use conservative non-optimistic updates.
- Confirmation dialogs require explicit acknowledgement for category/product deactivation. Color is not the sole carrier of availability, status, or error meaning.

## Responsive requirements

At 360, 768, and 1280 CSS-pixel viewport widths, navigation, browsing, forms, cart, checkout, and primary actions remain present and usable with no page-level horizontal scrolling or loss of required information.

- **360:** compact navigation, stacked forms and checkout, adaptive one/two-card product grid, full-width primary actions where useful.
- **768:** wrapped/condensed navigation, multi-column catalog where space permits, cart summary placed beside or below content without overlap.
- **1280:** full navigation, multi-column catalog, two-column cart/checkout where appropriate, readable line lengths.
- **Admin tables:** either become labeled responsive cards or are inside a clearly bounded horizontal-scroll region. The entire page never scrolls horizontally because of an Admin table.

## Accessibility baseline

- All interactive elements have visible text labels or accessible names, keyboard reachability, keyboard operation, and a visible focus indicator.
- Native semantic controls are preferred. Dialogs move focus on open, trap it while active, and restore focus when closed.
- Validation error text is associated with its field/form. Status messages use semantic text/roles where appropriate and are not color-only.
- Normal text meets at least 4.5:1 contrast; large text and visible control/state boundaries meet at least 3:1.
- Hover is never required to discover or use a critical action.

## Frontend state and data ownership

TanStack Query owns API server state, request cache, retry policy, and invalidation. Local component state owns inputs, dialog visibility, and transient presentation. The API client is the sole HTTP interface and sends same-origin credentials, maps common errors, and never stores session material. Route guards use the safe current-user query but the server remains the authority.

## UI verification matrix

| Requirement group | Evidence |
| --- | --- |
| REQ-UI-001 | page-heading and state tests for every approved route; access-state tests |
| REQ-UI-002 | form labels/feedback, action labels, price/availability/cart presentation tests |
| REQ-UI-003 | Playwright viewport checks at 360/768/1280, keyboard/focus/semantic checks, contrast review |
| REQ-ERROR-001 | backend-error-to-UI feedback and no-stale-success tests |
| Customer/Admin functional requirements | journey and mutation tests for documented page actions |

**UI/UX design status:** `APPROVED` by independent Planning Verification.
