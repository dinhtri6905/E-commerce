# Công nghệ ứng dụng

## Nguồn và trạng thái

U1 và R1 được định nghĩa tại [INDEX.md](./INDEX.md). `CONFIRMED` xác nhận lựa chọn hoặc dữ kiện, không xác nhận dependency đã được cài. R1 chưa có source, `package.json`, lockfile hoặc cấu hình ứng dụng để giải quyết các mục `TBD`.

## Thông tin đã xác nhận

| Area | Technology | Status | Evidence |
| --- | --- | --- | --- |
| Application Type | E-commerce Web Application | CONFIRMED | U1; tên E-commerce tại README |
| Backend Runtime | Node.js | CONFIRMED | U1 |
| API Style | REST; base path `/api` | CONFIRMED | U1 |
| Database Model | Relational | CONFIRMED | U1 |
| Version Control | Git | CONFIRMED | R1: repository Git hiện có |

## Frontend

| Area | Technology | Status | Evidence |
| --- | --- | --- | --- |
| Framework | TBD | TBD | U1 chưa chọn; R1 chưa có source/manifest |
| Language | TBD | TBD | Chưa có source xác nhận |
| Build Tool | TBD | TBD | Chưa có build configuration |
| Styling | TBD | TBD | Chưa có frontend configuration |
| State Management | TBD | TBD | Chưa có frontend implementation |
| Testing Framework | TBD | TBD | Chưa có test configuration |

## Backend

| Area | Technology | Status | Evidence |
| --- | --- | --- | --- |
| Node.js Version | TBD | TBD | U1 không chốt phiên bản; R1 không có runtime constraint |
| Language | TBD | TBD | Node.js chưa xác nhận ngôn ngữ source |
| Framework | TBD | TBD | U1 chưa chọn; R1 chưa có source/manifest |
| Validation Library | TBD | TBD | Chưa có API configuration |
| Authentication Library / Mechanism | TBD | TBD | Chưa có lựa chọn session/token hoặc library |
| Testing Framework | TBD | TBD | Chưa có test configuration |

## Database

| Area | Technology | Status | Evidence |
| --- | --- | --- | --- |
| Engine / Version | TBD | TBD | U1 xác nhận relational; R1 chưa có database configuration |
| ORM / Database Library | TBD | TBD | Chưa có manifest hoặc persistence code |
| Migration Mechanism | TBD | TBD | Chưa có migration/configuration |

[DATABASE.md](./DATABASE.md) sở hữu entity nghiệp vụ; lựa chọn dịch vụ và provisioning hạ tầng nằm ngoài repository ứng dụng.

## Công cụ phát triển

| Area | Technology | Status | Evidence |
| --- | --- | --- | --- |
| Package Manager / Version | TBD | TBD | Chưa có manifest/lockfile |
| Linter | TBD | TBD | Chưa có lint configuration |
| Formatter | TBD | TBD | Chưa có formatter configuration |
| Type Checker | TBD | TBD | Chưa có type-check configuration |
| Test Runner | TBD | TBD | Chưa có test tooling |
| Build / Quality Commands | TBD | TBD | Chưa có scripts cho build, lint, typecheck hoặc tests |

Các gate chất lượng kỳ vọng được mô tả tại [QUALITY.md](./QUALITY.md); sự tồn tại của AI Rules, agent và Skill chưa xác nhận một công cụ ứng dụng đã được cài đặt.

## Cấu hình ứng dụng còn TBD

Tên biến môi trường, consumer frontend/backend/database/authentication, môi trường áp dụng, required/default/format/validation và thời điểm nạp cấu hình chưa được xác nhận. Runtime port, startup contract, output build và định dạng cấu hình kết nối database cũng `TBD`. Chưa có file môi trường mẫu hoặc biến cụ thể được phê duyệt.

Yêu cầu bảo vệ secret thuộc [SECURITY.md](./SECURITY.md). Cấu hình hạ tầng và cloud deployment pipeline là `OUT OF SCOPE`, không phải lựa chọn tooling còn phải chốt trong repository này.
