# Tổng quan ứng dụng

## Tên, loại và mục đích

**E-commerce — E-commerce Web Application** (`CONFIRMED`, nguồn U1/R1 tại [INDEX.md](./INDEX.md)). Ứng dụng hỗ trợ khách hàng tìm sản phẩm, quản lý giỏ, tạo và theo dõi đơn hàng; quản trị viên quản lý dữ liệu bán hàng và tồn kho.

Phạm vi repository là ứng dụng gồm frontend, REST API, backend Node.js và dữ liệu quan hệ. Chưa có source hoặc bằng chứng chức năng hoàn thành; thông tin ở đây mô tả yêu cầu đã xác nhận.

## Actor và trách nhiệm

| Actor | Trách nhiệm nghiệp vụ |
| --- | --- |
| Customer | Đăng ký/đăng nhập/đăng xuất; tìm và xem sản phẩm; quản lý giỏ, checkout, đơn hàng và hồ sơ/tài khoản |
| Admin | Đăng nhập; quản lý sản phẩm, danh mục, tồn kho và đơn hàng, bao gồm cập nhật trạng thái đơn |

## Hành trình Customer tổng quan

```text
Register / Login
      ↓
Browse Products
      ↓
Search / Filter by Category
      ↓
Product Detail
      ↓
Shopping Cart
      ↓
Checkout
      ↓
Order
```

Customer có thể xem lịch sử, chi tiết đơn và xem/cập nhật hồ sơ sau các tương tác mua sắm. Sơ đồ là hành trình tổng quan, không chốt điều kiện đăng nhập cho mọi thao tác xem catalog; yêu cầu bảo vệ thao tác riêng tư nằm tại [SECURITY.md](./SECURITY.md).

## Module chính

`Authentication`, `User`, `Category`, `Product`, `Inventory`, `Cart`, `Order`, `Admin` là tám module đã xác nhận. Trách nhiệm và dependency logic được mô tả tại [ARCHITECTURE.md](./ARCHITECTURE.md).

Phạm vi chức năng đầy đủ và danh sách loại trừ được sở hữu bởi [SCOPE.md](./SCOPE.md). Checkout/tạo đơn thuộc MVP; tích hợp cổng thanh toán thật và nhà cung cấp vận chuyển nằm ngoài MVP.
