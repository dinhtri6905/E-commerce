# Phạm vi ứng dụng

## Phạm vi hiện tại — CONFIRMED

Nguồn: U1 tại [INDEX.md](./INDEX.md). Đây là phạm vi MVP đã xác nhận, chưa phải danh sách chức năng đã implement.

### Customer Scope

- Đăng ký tài khoản, đăng nhập và đăng xuất.
- Xem danh sách sản phẩm, tìm kiếm và lọc sản phẩm theo danh mục.
- Xem danh sách danh mục và chi tiết sản phẩm.
- Xem giỏ hàng; thêm sản phẩm; cập nhật số lượng mục giỏ; xóa sản phẩm khỏi giỏ.
- Checkout và tạo đơn hàng.
- Xem lịch sử và chi tiết đơn hàng, gồm thông tin trạng thái đơn.
- Xem và cập nhật hồ sơ/thông tin tài khoản.

### Admin Scope

- Đăng nhập Admin.
- Quản lý sản phẩm.
- Quản lý danh mục.
- Quản lý tồn kho.
- Xem danh sách và chi tiết đơn; cập nhật trạng thái đơn hàng.

### Shared / Application Scope

| Miền | Phạm vi đã xác nhận |
| --- | --- |
| Authentication / User | Đăng ký, đăng nhập/đăng xuất, phân quyền, thông tin tài khoản và hồ sơ |
| Category / Product | Danh mục, danh sách, tìm kiếm, lọc theo danh mục và chi tiết sản phẩm |
| Inventory | Theo dõi tồn kho; kiểm tra tồn kho trước khi tạo đơn; cập nhật tồn kho sau khi tạo đơn thành công |
| Cart / Order | Giỏ và số lượng sản phẩm; checkout, tạo đơn, lịch sử, chi tiết và trạng thái đơn |
| Admin | Quản lý các miền sản phẩm, danh mục, tồn kho và đơn |

Frontend sử dụng REST API `/api`; backend Node.js xử lý nghiệp vụ và phối hợp persistence quan hệ. Yêu cầu bảo mật và chất lượng chung được sở hữu bởi [SECURITY.md](./SECURITY.md) và [QUALITY.md](./QUALITY.md).

## Ngoài MVP — OUT OF SCOPE

Các mục sau chỉ có thể được xem là ứng viên nâng cấp tương lai, chưa có cam kết roadmap hoặc phạm vi triển khai:

- Tích hợp cổng thanh toán thật (real payment gateway integration).
- Coupon và promotion engine.
- Product reviews và ratings.
- Wishlist.
- Recommendation engine.
- Email notification.
- Redis và OpenSearch.
- Tích hợp nhà cung cấp vận chuyển (shipping provider integration).
- Hạ tầng tìm kiếm/gợi ý nâng cao (advanced recommendation/search infrastructure).

Tìm kiếm sản phẩm cơ bản vẫn thuộc MVP; việc loại trừ OpenSearch hoặc hạ tầng tìm kiếm nâng cao không loại bỏ chức năng này. Checkout/tạo đơn vẫn thuộc MVP dù không tích hợp cổng thanh toán thật.

## Ranh giới hạ tầng — OUT OF SCOPE

**Infrastructure and deployment implementation are OUT OF SCOPE for this repository.** Thiết kế và triển khai hạ tầng thuộc một repository riêng, bao gồm:

- VPC, Subnets, Internet Gateway, NAT Gateway và AWS networking.
- Provisioning Application Load Balancer, EC2 và Auto Scaling.
- Provisioning CloudFront, S3 và RDS.
- Hạ tầng IAM và CloudWatch.
- Infrastructure as Code, hạ tầng CI/CD và cloud deployment pipelines.

Ứng dụng có thể được phát triển để chạy trên hạ tầng cloud về sau; tài liệu này không sở hữu thiết kế mạng, kiến trúc deployment hoặc hướng dẫn provisioning.

## Chi tiết ứng dụng chưa chốt

Tập trạng thái đơn, điều kiện chuyển trạng thái, xử lý checkout khi không có payment gateway, chi tiết điều phối đơn/tồn kho và ma trận quyền theo operation là `TBD`. Các nội dung này không mở rộng phạm vi MVP; business rule và Acceptance Criteria chi tiết sẽ thuộc Specification khi có SDD.
