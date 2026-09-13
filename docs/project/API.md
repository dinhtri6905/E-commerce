# API ứng dụng

## Thông tin ổn định — CONFIRMED

Backend Node.js cung cấp **REST API** với base path `/api`, theo U1 tại [INDEX.md](./INDEX.md). API là boundary để frontend sử dụng nghiệp vụ ứng dụng; chưa có endpoint implementation hoặc approved API Contract trong repository.

## Nhóm resource

| Nhóm | Trách nhiệm |
| --- | --- |
| `/api/auth/*` | Đăng ký và xác thực |
| `/api/users/*` | Tài khoản và hồ sơ |
| `/api/products/*` | Sản phẩm |
| `/api/categories/*` | Danh mục |
| `/api/cart/*` | Giỏ hàng |
| `/api/orders/*` | Đơn hàng |
| `/api/admin/*` | Chức năng quản trị |

`*` chỉ nhóm đường dẫn, không xác nhận wildcard route được implement. Admin APIs được kỳ vọng cho quản lý sản phẩm, danh mục, tồn kho và đơn hàng; route/method cụ thể vẫn `TBD`.

## Ví dụ endpoint cấp khái niệm

Các ví dụ sau do user cung cấp, không phải danh sách đầy đủ hoặc API Contract đã được phê duyệt:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/products
GET    /api/products/:productId

GET    /api/categories

GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:cartItemId
DELETE /api/cart/items/:cartItemId

POST   /api/orders
GET    /api/orders
GET    /api/orders/:orderId
```

Logout và xem/cập nhật hồ sơ thuộc MVP dù endpoint tương ứng chưa được chốt trong các ví dụ. Các ví dụ trên không chốt request/response schema, error code hoặc toàn bộ quyền truy cập.

## Trách nhiệm API và kiểm soát truy cập

API tiếp nhận/validate dữ liệu bên ngoài, xác thực và kiểm tra quyền cho operation được bảo vệ, chuyển xử lý đến nghiệp vụ, rồi trả response/lỗi phù hợp. Authentication và authorization là hai trách nhiệm riêng.

Thao tác Customer riêng tư yêu cầu authentication; thao tác Admin yêu cầu quyền Admin. Người dùng chỉ được truy cập tài nguyên của mình hoặc tài nguyên được cấp quyền truy cập. Yêu cầu bảo vệ output, credential và truy cập dữ liệu được sở hữu bởi [SECURITY.md](./SECURITY.md).

## Những quyết định contract còn TBD

| Hạng mục | Trạng thái và ranh giới |
| --- | --- |
| Standard success response envelope | `TBD` |
| Standard error shape và error code | `TBD` |
| Pagination | `TBD`: cơ chế, tham số và giới hạn |
| Sorting | `TBD`: field, direction và thứ tự mặc định |
| Filtering format | `TBD`: lọc theo danh mục đã xác nhận, query format chưa chốt |
| Authentication token/session mechanism | `TBD`: transport, lifetime và cơ chế đăng xuất |
| Versioning | `TBD`: base path hiện được xác nhận là `/api`, chưa chọn chiến lược versioning |
| Endpoint đầy đủ, field và validation | `TBD`: bao gồm logout, profile, Admin và tồn kho |
| Permission matrix | `TBD`: chi tiết theo operation/ownership, bên cạnh yêu cầu bảo vệ đã xác nhận |

[API_RULES.md](../ai/API_RULES.md) chứa convention và mẫu mặc định áp dụng theo governance. Các mẫu đó chưa phải lựa chọn contract đã phê duyệt cho ứng dụng và không được sao chép thành quyết định ở đây.

## Ranh giới SDD Planning

Endpoint contract chi tiết thuộc `docs/sdd/02-plan/api-contract.md` khi Planning tồn tại và được phê duyệt: request/response schema, validation, error code, status, pagination và quyền cụ thể. Hiện file này chưa tồn tại; Project Documentation chỉ giữ các dữ kiện API ổn định và ví dụ khái niệm.
