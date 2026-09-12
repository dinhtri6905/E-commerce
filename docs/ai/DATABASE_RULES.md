# Quy tắc Database

## Phạm vi áp dụng

Chỉ áp dụng các rule này khi task đã được phê duyệt tạo hoặc thay đổi persistence. Hiện chưa xác nhận database, ORM hoặc migration tool. Agent MUST kiểm tra và sử dụng cơ chế đã được project lựa chọn thay vì ngầm đưa vào một cơ chế mới.

## Đặt tên và mapping

- Convention đặt tên schema hiện có MUST được giữ nguyên khi đã được xác lập rõ.
- Nếu chưa có convention, database table và column SHOULD sử dụng `snake_case`, còn identifier trong application SHOULD sử dụng `camelCase` với mapping rõ ràng tại data-access boundary.
- Tên table MUST tuân theo một convention số ít hoặc số nhiều nhất quán trên toàn schema; code mới MUST dùng lựa chọn đã được xác lập.
- Primary key SHOULD dùng `id`, trừ khi schema hiện có yêu cầu tên gắn với domain.
- Foreign key SHOULD dùng `<referenced_entity>_id` trong database và `<referencedEntity>Id` trong application code.
- Tên constraint và index SHOULD có tính xác định và mô tả rõ mục đích khi database hoặc migration tool cho phép đặt tên.

## Column và constraint

- Mỗi table MUST có primary key ổn định, trừ khi design đã phê duyệt ghi rõ lý do không cần.
- Relationship MUST sử dụng foreign-key constraint khi datastore hỗ trợ và phù hợp với data model đã phê duyệt.
- Tính duy nhất do business behavior yêu cầu MUST được bảo vệ bằng database unique constraint, không chỉ bằng application check.
- Field chỉ được nullable khi việc không có giá trị mang một ý nghĩa domain rõ ràng.
- Giá trị mặc định MUST an toàn và MUST NOT che giấu dữ liệu bắt buộc bị thiếu.
- Timestamp tạo/cập nhật SHOULD theo convention đã được xác lập; nếu chưa có, dùng timestamp hỗ trợ UTC với tên `created_at` và `updated_at` khi cần audit lifecycle.

## Index và thiết kế query

- Index MUST phục vụ nhu cầu query, relationship, uniqueness hoặc ordering đã được chứng minh; SHOULD NOT thêm speculative index.
- Agent MUST cân nhắc write cost và storage cost trước khi thêm index.
- List query MUST tránh đọc không giới hạn khi pagination là phù hợp.
- Query MUST chỉ select dữ liệu cần thiết khi nếu không sẽ lấy cả field lớn hoặc nhạy cảm.
- N+1 query MUST được tránh bằng join, batching hoặc eager loading phù hợp mà không over-fetch dữ liệu không liên quan.
- Query ordering MUST có tính xác định khi pagination hoặc presentation ổn định phụ thuộc vào nó.

## Migration

- Schema change MUST sử dụng migration mechanism đã được xác nhận của project.
- Production schema MUST NOT được thay đổi thủ công.
- Migration đã được áp dụng MUST NOT bị sửa, trừ khi project policy cho phép rõ và operational impact đã được phê duyệt.
- Mỗi migration MUST có forward outcome rõ ràng và rollback hoặc recovery strategy đã được verify tương xứng với rủi ro.
- Destructive change MUST được phê duyệt rõ và SHOULD sử dụng staged migration khi có rủi ro cho dữ liệu hoặc compatibility.
- Data backfill MUST có giới hạn, có thể tiếp tục sau gián đoạn khi phù hợp và an toàn với kích thước dataset dự kiến.

## Transaction và concurrency

- Business operation nhiều bước cần atomicity MUST sử dụng transaction khi datastore hỗ trợ.
- Transaction scope SHOULD nhỏ nhất trong giới hạn correctness cho phép.
- External network call SHOULD NOT diễn ra bên trong database transaction, trừ khi consistency design đã phê duyệt yêu cầu.
- Update nhạy cảm với concurrency MUST định nghĩa cách xử lý lost update, duplicate creation và retry.

## Security và dữ liệu nhạy cảm

- Query MUST sử dụng parameterized statement hoặc ORM-safe binding; untrusted value MUST NOT được nối vào SQL.
- Database credential và sensitive data MUST tuân thủ [SECURITY_RULES.md](./SECURITY_RULES.md).
- Quyền truy cập SHOULD sử dụng identity có least privilege phù hợp với từng environment.
- Sensitive field MUST NOT được select, ghi log hoặc trả về nếu use case không yêu cầu.

## Testing và thực thi qua review

Persistence behavior và migration MUST được verify theo [TESTING_RULES.md](./TESTING_RULES.md). Các rule này được thực thi qua review cho đến khi database tooling tồn tại.
