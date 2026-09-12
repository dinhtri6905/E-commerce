# Chỉ mục Quy tắc Kỹ thuật AI

## Mục đích

Thư mục này là điểm vào bắt buộc cho các quy tắc kỹ thuật AI áp dụng trên toàn repository. Hệ thống quy tắc giúp mọi thay đổi source code nhất quán, dễ bảo trì, an toàn, có thể kiểm thử, phù hợp với kiến trúc đã được phê duyệt và không vượt khỏi phạm vi task.

Các quy tắc này chỉ điều chỉnh công việc liên quan đến source code. Chúng không thay thế specification, thiết kế, task definition, acceptance criteria hoặc governance của repository đã được phê duyệt.

## Thẩm quyền và thứ tự ưu tiên

Khi các instruction xung đột, AI Agent MUST áp dụng thứ tự ưu tiên được quy định trong `AGENTS.md` hoặc `AGENTS.override.md` gần nhất có hiệu lực. Trong hệ thống quy tắc này:

1. Rule file cụ thể hơn cho task chỉ ghi đè rule chung trong đúng phạm vi trách nhiệm mà file đó sở hữu.
2. Thông tin repository đã được phê duyệt và convention đã được xác lập có ưu tiên cao hơn convention mặc định trong các file này.
3. Rule có thẩm quyền thấp hơn MUST NOT làm suy yếu security, acceptance criteria hoặc scope do user chỉ định rõ.
4. Mâu thuẫn chưa được giải quyết nhưng ảnh hưởng đến correctness MUST được báo cáo là `BLOCKED`; Agent MUST NOT tự tạo cách giải quyết.

## Quy trình đọc bắt buộc

Trước khi thay đổi source code, AI Agent MUST:

1. Đọc chuỗi instruction `AGENTS.md` có hiệu lực.
2. Đọc đầy đủ file này.
3. Phân loại task theo ma trận bên dưới.
4. Chỉ đọc các rule file bắt buộc cho task đó cùng với các rule được instruction gần nhất yêu cầu.
5. Kiểm tra implementation hiện tại và các artifact đã được phê duyệt trước khi đề xuất hoặc thực hiện thay đổi.

Các rule này là yêu cầu bắt buộc, không phải khuyến nghị. Ý nghĩa của `MUST`, `MUST NOT`, `SHOULD` và `MAY` được định nghĩa trong [CODING_RULES.md](./CODING_RULES.md).

## Ánh xạ task đến rule

| Loại task | Rule bắt buộc |
| --- | --- |
| Tính năng backend | Coding, Architecture, Backend, API, Testing, Security |
| Tính năng frontend | Coding, Architecture, Frontend, Testing, Security |
| Thay đổi API | Coding, Backend, API, Testing, Security |
| Thay đổi database | Coding, Architecture, Database, Testing, Security |
| Sửa lỗi | Coding, Testing, Security và rule của mọi layer bị ảnh hưởng |
| Refactor | Coding, Architecture, Testing và rule của mọi layer bị ảnh hưởng |
| Sửa lỗi bảo mật | Coding, Security, Testing và rule của mọi layer bị ảnh hưởng |
| Chỉ thay đổi test | Coding, Testing và rule của behavior được kiểm thử |
| Tính năng xuyên nhiều layer | Coding, Architecture, Testing, Security và mọi rule Backend, Frontend, API hoặc Database bị ảnh hưởng |

Tên rule ánh xạ đến file như sau:

- Coding: [CODING_RULES.md](./CODING_RULES.md)
- Architecture: [ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md)
- Backend: [BACKEND_RULES.md](./BACKEND_RULES.md)
- Frontend: [FRONTEND_RULES.md](./FRONTEND_RULES.md)
- API: [API_RULES.md](./API_RULES.md)
- Database: [DATABASE_RULES.md](./DATABASE_RULES.md)
- Testing: [TESTING_RULES.md](./TESTING_RULES.md)
- Security: [SECURITY_RULES.md](./SECURITY_RULES.md)

## Ranh giới trách nhiệm

Mỗi rule thuộc về một file chính:

- Coding sở hữu chất lượng implementation chung và quy tắc đặt tên.
- Architecture sở hữu chiều phụ thuộc và ranh giới module.
- Backend và Frontend sở hữu behavior triển khai riêng của từng layer.
- API sở hữu contract ở transport boundary.
- Database sở hữu thiết kế persistence và migration.
- Testing sở hữu behavior verification.
- Security sở hữu security control và xử lý dữ liệu nhạy cảm.

Các file khác SHOULD tham chiếu đến file sở hữu thay vì lặp lại rule. Một tham chiếu cần thiết không làm thay đổi quyền sở hữu rule.

## Legacy code

- Agent MUST giữ nguyên behavior của legacy code không liên quan và MUST NOT refactor code ngoài scope chỉ để code đó tuân thủ các rule này.
- Code mới hoặc code được sửa MUST tuân thủ các rule này trong phạm vi task.
- Khi convention cục bộ của legacy code xung đột với các rule này, Agent MUST tuân thủ yêu cầu có thẩm quyền cao hơn đồng thời thu nhỏ phạm vi thay đổi.
- Nếu việc tuân thủ đòi hỏi migration rộng hơn, Agent MUST ghi nhận khoảng trống và yêu cầu một task riêng được phê duyệt.

## Trạng thái thực thi

Repository hiện chưa xác nhận cấu hình lint, typecheck, test, build, framework, ORM hoặc formatter. Trừ khi một công cụ trong repository thực thi rõ một rule, việc tuân thủ rule đó được kiểm soát qua review. Trước mỗi task implementation, Agent MUST kiểm tra tooling hiện tại và MUST sử dụng cơ chế thực thi sẵn có mà không làm suy yếu hoặc thay thế nó.
