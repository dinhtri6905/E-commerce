# Sổ quyết định dự án

Nguồn U1/R1 và ý nghĩa trạng thái được định nghĩa tại [INDEX.md](./INDEX.md). Cập nhật theo yêu cầu application-only ngày 2026-09-13. `CONFIRMED` không khẳng định implementation đã hoàn thành.

## Dữ kiện đã xác nhận

| Decision | Status | Reason / Source |
| --- | --- | --- |
| E-commerce Web Application | CONFIRMED | U1; README xác nhận tên E-commerce |
| Customer actor | CONFIRMED | U1; vai trò tại OVERVIEW |
| Admin actor | CONFIRMED | U1; vai trò tại OVERVIEW |
| Repository chỉ sở hữu ứng dụng | CONFIRMED | U1 tách hạ tầng/deployment sang repository riêng |
| Node.js backend runtime | CONFIRMED | U1 |
| REST API và base path `/api` | CONFIRMED | U1 |
| Relational database model | CONFIRMED | U1 |
| Tám module và dependency triển khai logic | CONFIRMED | U1; ARCHITECTURE sở hữu sơ đồ, không phải runtime call order |
| Tám entity và quan hệ nghiệp vụ | CONFIRMED | U1; DATABASE sở hữu mô hình cấp cao |
| MVP Customer/Admin và Inventory | CONFIRMED | U1; SCOPE sở hữu chức năng, gồm kiểm tra/cập nhật stock quanh việc tạo đơn |
| Security requirements của ứng dụng | CONFIRMED | U1; SECURITY sở hữu yêu cầu |
| Quality gates và năm cấp độ test kỳ vọng | CONFIRMED | U1; QUALITY ghi rõ chưa có tooling/verification ứng dụng |
| Git và cấu trúc governance/documentation hiện có | CONFIRMED | R1; REPOSITORY_STRUCTURE |

## Quyết định chưa chốt

| Decision | Status | Reason / Source |
| --- | --- | --- |
| Frontend framework | TBD | U1 chưa chọn; R1 chưa có source/manifest |
| Frontend language, build tool, styling, state management, testing framework | TBD | Chưa có evidence từ source/configuration |
| Backend framework | TBD | U1 chưa chọn; R1 chưa có source/manifest |
| Node.js version; backend language, validation library, testing framework | TBD | Runtime đã xác nhận, chi tiết công nghệ chưa được chốt |
| Database engine/version | TBD | Chỉ xác nhận mô hình relational; chưa có cấu hình ứng dụng |
| ORM / database library | TBD | Chưa có persistence implementation |
| Migration mechanism và detailed schema | TBD | Chưa có migration; column/type/index/constraint/cascade/cardinality/mapping/naming thuộc SDD Planning |
| Transaction, isolation, concurrency, retry và lưu lịch sử dữ liệu | TBD | Yêu cầu kiểm tra/cập nhật stock đã rõ; cơ chế đảm bảo nhất quán chưa được thiết kế |
| Authentication mechanism/library | TBD | Chưa chọn token/session, transport, lifetime hoặc logout invalidation |
| Password protection mechanism; permission matrix; validation/output field | TBD | Yêu cầu bảo mật đã xác nhận, chi tiết implementation/contract chưa chốt |
| API success envelope, error shape/code, pagination, sorting, filtering format, versioning | TBD | Ví dụ endpoint và AI Rules chưa thay thế approved API Contract |
| Danh sách endpoint đầy đủ và request/response schema | TBD | Gồm logout, profile, Admin và tồn kho; thuộc SDD Planning |
| Source structure, backend layering và public contract module | TBD | Chưa có source hoặc approved Planning |
| Trạng thái đơn/chuyển trạng thái và chi tiết checkout không có gateway | TBD | Phạm vi chức năng đã xác nhận; business rule chi tiết chưa có |
| Package manager/version, linter, formatter, type checker, test runner | TBD | Chưa có manifest, lockfile hoặc tooling configuration |
| Build/quality commands, runtime port, startup contract, build output | TBD | Chưa có scripts hoặc cấu hình ứng dụng |
| Coverage target | TBD | Không có tỷ lệ được phê duyệt hoặc cấu hình xác nhận |
| Biến môi trường và hợp đồng configuration ứng dụng | TBD | Chưa chốt tên/consumer/environment/required/default/format/validation/thời điểm nạp hoặc connection format |
| Nguồn secret ứng dụng, quyền truy cập và rotation | TBD | Yêu cầu bảo vệ secret đã rõ; nhu cầu tích hợp chưa chốt, provisioning ngoài scope |
| Tên/URL repository hạ tầng | TBD | U1 xác nhận repository riêng nhưng chưa cung cấp địa chỉ tham chiếu |
| Roadmap/ưu tiên tính năng tương lai | TBD | Các mục ngoài MVP chưa được cam kết triển khai |

## Ngoài phạm vi hiện tại

| Decision | Status | Reason / Source |
| --- | --- | --- |
| Real Payment Gateway Integration | OUT OF SCOPE | U1 loại khỏi MVP; checkout/tạo đơn vẫn thuộc MVP |
| Coupon / Promotion Engine | OUT OF SCOPE | U1 |
| Product Reviews / Ratings | OUT OF SCOPE | U1 |
| Wishlist | OUT OF SCOPE | U1 |
| Recommendation Engine / Advanced Recommendation | OUT OF SCOPE | U1 |
| Email Notification | OUT OF SCOPE | U1 |
| Redis / OpenSearch | OUT OF SCOPE | U1; tìm kiếm sản phẩm cơ bản vẫn thuộc MVP |
| Shipping Provider Integration | OUT OF SCOPE | U1 |
| Advanced Recommendation/Search Infrastructure | OUT OF SCOPE | U1 |
| Infrastructure / Deployment / Cloud CI/CD | OUT OF SCOPE | U1 xác nhận repository riêng; danh sách ranh giới tại SCOPE |

## Thông tin đã được thay thế

| Decision | Status | Reason / Source |
| --- | --- | --- |
| Sở hữu kiến trúc AWS/deployment trong Project Documentation ngày 2026-09-12 | DEPRECATED | U1 ngày 2026-09-13 xác định lại phạm vi application-only; không phải quyết định hủy lựa chọn của repository hạ tầng |
| Bộ tài liệu cũ có DEPLOYMENT.md và ENVIRONMENT.md riêng | DEPRECATED | Chuẩn hóa theo bộ 11 file của U1; thông tin configuration ứng dụng còn hợp lệ được giữ tại TECHNOLOGY và SECURITY |

Các file sở hữu chi tiết được liên kết tại [INDEX.md](./INDEX.md). Không có mục `TBD` nào được nâng thành `CONFIRMED` dựa trên lựa chọn phổ biến hoặc suy đoán.
