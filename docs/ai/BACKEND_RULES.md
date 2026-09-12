# Quy tắc Backend

## Phạm vi áp dụng

Chỉ áp dụng các rule này khi một task đã được phê duyệt tạo hoặc thay đổi backend code. Hiện chưa xác nhận backend framework hoặc runtime, vì vậy convention dành riêng cho framework MUST xuất phát từ artifact đã phê duyệt hoặc code hiện có.

## Tổ chức và dependency

- Backend module MUST tuân theo cấu trúc project đã được xác lập và các boundary trong [ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md).
- Trách nhiệm transport, business và persistence MUST được tách biệt khi các layer đó tồn tại.
- Backend code MUST sử dụng public interface của module và MUST NOT import internal implementation xuyên qua module boundary.
- MUST NOT thêm dependency mới khi platform hoặc repository hiện tại đã đáp ứng đầy đủ requirement.

## Controller và route

- Controller và route MUST gọn, tập trung vào transport concern.
- Chúng MUST NOT chứa business decision lớn hoặc use-case logic bị lặp lại.
- Chúng MUST chuyển persistence access cho repository/data-access boundary hiện có.
- Chúng MUST map domain outcome sang API contract được định nghĩa trong [API_RULES.md](./API_RULES.md).

## Service và domain logic

- Service MUST sở hữu use-case orchestration, business rule và transaction boundary bao gồm nhiều persistence operation.
- Domain logic MUST độc lập với HTTP request và response object.
- Business rule có thể tái sử dụng MUST có một implementation duy nhất làm nguồn chuẩn.
- Service MUST trả về hoặc phát sinh domain outcome rõ ràng; caller MUST NOT suy đoán failure từ giá trị null mơ hồ, trừ khi đó là contract đã được xác lập.

## Repository và data access

- Repository/data-access component MUST sở hữu query, persistence mapping và persistence-specific error.
- HTTP handler MUST NOT truy cập database trực tiếp khi data layer tồn tại.
- Persistence code MUST tuân thủ [DATABASE_RULES.md](./DATABASE_RULES.md) và [SECURITY_RULES.md](./SECURITY_RULES.md).
- Kết quả data access MUST NOT làm rò rỉ persistence-only field vào public response.

## Validation

- Mọi external input MUST được validate tại một boundary rõ ràng trước khi business logic sử dụng.
- Validation MUST phân biệt malformed input với input hợp lệ về cấu trúc nhưng vi phạm business rule.
- Validation failure MUST sử dụng API error contract ổn định và MUST NOT expose implementation detail nội bộ.

## Configuration

- Giá trị phụ thuộc environment MUST lấy từ configuration mechanism của project.
- Configuration bắt buộc MUST được validate khi khởi động hoặc trước lần sử dụng đầu tiên theo runtime pattern đã được xác lập.
- Giá trị mặc định MUST an toàn và MUST NOT âm thầm bật privileged behavior hoặc production behavior.

## Asynchronous error và logging

- Awaited operation MUST truyền tiếp hoặc xử lý failure có chủ đích; exception MUST NOT bị nuốt.
- Catch block MUST thực hiện recovery, chuyển đổi lỗi, bổ sung diagnostic context an toàn hoặc throw lại; catch block rỗng bị cấm.
- Log SHOULD chứa operational context ổn định như operation và identifier không nhạy cảm.
- Credential, secret, token, sensitive field và toàn bộ untrusted payload MUST NOT được ghi log.
- Stack trace và internal exception detail MUST NOT được trả về client.

## Response mapping

- Public response MUST được map có chủ đích từ domain result.
- Sensitive field và persistence-only field MUST được loại trừ bằng allowlist hoặc response type rõ ràng.
- Status code và error body MUST tuân thủ [API_RULES.md](./API_RULES.md).

## Thực thi qua review

Các rule backend được thực thi qua review cho đến khi backend framework cùng tooling lint, typecheck và test được xác nhận.
