# Kiến trúc ứng dụng

## Thành phần đã xác nhận

`CONFIRMED` — nguồn U1 tại [INDEX.md](./INDEX.md). Kiến trúc dưới đây mô tả ứng dụng; chưa có source để xác nhận implementation cụ thể.

```text
Frontend
    ↓
REST API
    ↓
Backend Application
    ↓
Relational Database
```

REST API là boundary giao tiếp của backend Node.js, không hàm ý một dịch vụ triển khai riêng. Frontend gửi request qua `/api`; backend xử lý request, phối hợp truy cập dữ liệu quan hệ và trả response cho frontend.

| Thành phần | Trách nhiệm ứng dụng |
| --- | --- |
| Frontend | Presentation, tương tác người dùng, sử dụng API và quản lý state phía client khi cần |
| Backend Application | API, authentication/authorization, validation, business logic và phối hợp persistence |
| Relational Database | Lưu trữ dữ liệu quan hệ bền vững của ứng dụng |

## Ranh giới module

| Module | Trách nhiệm |
| --- | --- |
| Authentication | Đăng ký, đăng nhập/đăng xuất và cơ chế xác thực/phân quyền |
| User | Tài khoản, role và hồ sơ người dùng |
| Category | Danh mục và quản lý danh mục |
| Product | Danh sách, tìm kiếm, lọc theo danh mục, chi tiết và quản lý sản phẩm |
| Inventory | Theo dõi stock; kiểm tra trước tạo đơn và cập nhật sau tạo đơn thành công |
| Cart | Giỏ, sản phẩm trong giỏ và số lượng tương ứng |
| Order | Checkout, tạo đơn, lịch sử, chi tiết và trạng thái đơn |
| Admin | Các chức năng quản trị sản phẩm, danh mục, tồn kho và đơn hàng |

Đây là trách nhiệm nghiệp vụ, chưa chốt thư mục, package, public interface hoặc service độc lập. Phạm vi đầy đủ thuộc [SCOPE.md](./SCOPE.md).

## Dependency triển khai logic

```text
Authentication
      ↓
User
      ↓
Category
      ↓
Product
      ↓
Inventory
      ↓
Cart
      ↓
Order
      ↓
Admin
```

Chuỗi do user xác nhận biểu diễn dependency logic khi phát triển, không nhất thiết là thứ tự gọi runtime hoặc import giữa mọi module. Thiết kế orchestration checkout/Order/Inventory, public contract và dependency code cụ thể vẫn `TBD`.

## Layering backend theo convention có điều kiện

[ARCHITECTURE_RULES.md](../ai/ARCHITECTURE_RULES.md) có convention sau **khi backend sử dụng phân layer**:

```text
Route / Controller
        ↓
Service
        ↓
Repository / Data Access
        ↓
Database
```

Trạng thái áp dụng cho ứng dụng: `TBD`. Chưa có framework/source chứng minh pattern này đã được chọn. Quy tắc chi tiết về trách nhiệm layer và chiều phụ thuộc được sở hữu bởi AI Rules; thiết kế được phê duyệt sẽ thuộc `docs/sdd/02-plan/` khi có SDD.

## Ranh giới kiến trúc

Tài liệu này chỉ sở hữu kiến trúc ứng dụng. Kiến trúc deployment, networking và provisioning thuộc repository hạ tầng riêng và là `OUT OF SCOPE`; xem [SCOPE.md](./SCOPE.md).
