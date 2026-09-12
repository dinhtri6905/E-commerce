# Quy tắc Security

## Nguyên tắc secure-by-default

Security control là acceptance constraint bắt buộc. Agent MUST áp dụng least privilege, trust boundary rõ ràng và safe default; MUST NOT làm suy yếu control để đơn giản implementation hoặc làm test PASS.

## Secret

Agent MUST NEVER commit hoặc hard-code:

- password;
- token;
- API key;
- cloud credential;
- private key;
- database credential.

Secret MUST sử dụng secret/configuration mechanism đã được phê duyệt của repository. File ví dụ và test fixture MUST chứa placeholder rõ ràng không phải secret. Secret MUST NOT xuất hiện trong log, error, snapshot, generated artifact hoặc client bundle.

## Authentication

- Password MUST NOT được lưu dưới dạng plaintext; MUST sử dụng password-hashing mechanism đã được phê duyệt với parameter an toàn.
- Credential và authentication token MUST NOT được ghi log.
- Authentication state, token validity, expiry và session property bắt buộc MUST được validate phía server.
- Authentication và authorization MUST là hai khái niệm tách biệt: chỉ xác định identity MUST NOT tự động cấp quyền thực hiện operation.
- Authentication failure MUST trả về error an toàn, không expose credential hoặc account detail ngoài contract đã phê duyệt.

## Authorization

- Mọi protected operation MUST xác minh identity và permission, role, tenant boundary hoặc resource ownership bắt buộc.
- Authorization MUST được thực thi tại server-side boundary cho mọi entry path dẫn đến operation.
- Client-side visibility control MUST NOT được xem là authorization.
- Behavior mặc định MUST từ chối truy cập khi permission context bị thiếu, không hợp lệ hoặc mơ hồ.
- Thay đổi authorization logic MUST có test cho identity được phép và bị từ chối.

## Input và file

Mọi external input đều không đáng tin, bao gồm:

- request body;
- query parameter;
- path parameter;
- header liên quan;
- cookie và token;
- message và third-party response;
- file và upload.

- Input MUST được validate về type, shape, size, range, format và allowed value khi áp dụng trước khi business logic sử dụng.
- Field không được nhận biết hoặc nguy hiểm MUST bị từ chối hoặc bỏ qua theo contract rõ ràng.
- Khi hỗ trợ upload, file handling MUST validate size, type, name và storage destination, đồng thời MUST ngăn path traversal.
- Untrusted input MUST NOT được diễn giải thành executable code, shell command, template, path hoặc query nếu không có cơ chế an toàn đã được phê duyệt.

## Output và logging

Public output MUST NOT expose:

- password hoặc password hash;
- secret hoặc token;
- internal stack trace;
- database detail hoặc infrastructure detail nhạy cảm;
- field không được contract yêu cầu rõ.

- Response mapping SHOULD sử dụng allowlist hoặc public response type rõ ràng.
- Log MUST loại trừ credential và sensitive payload field; SHOULD sử dụng identifier ổn định, không nhạy cảm cho mục đích diagnostic.
- Error message MUST hữu ích cho client mà không tiết lộ internal control flow hoặc protected resource detail.

## Persistence

- Database access MUST sử dụng parameterized query hoặc ORM-safe binding.
- Untrusted input MUST NOT được nối vào SQL hoặc query-language fragment.
- Database identity và service identity SHOULD chỉ có permission cần thiết cho runtime role tương ứng.
- Sensitive data MUST được tối thiểu hóa, bảo vệ khi truyền và khi lưu bằng platform control đã được phê duyệt, đồng thời chỉ được giữ trong thời gian cần thiết.
- Multi-tenant query hoặc owner-scoped query MUST áp dụng authorization scope tại data boundary khi phù hợp.

## Dependency và external service

- Dependency hoặc external service mới cần scope rõ ràng và quy trình dependency review của repository.
- Agent MUST NOT tắt certificate validation, authentication, signature check hoặc origin protection để đơn giản integration.
- External response MUST được validate trước khi ảnh hưởng đến trusted state.
- Network timeout, retry safety và failure handling MUST được định nghĩa rõ cho security-sensitive operation.

## Verification và thực thi qua review

- Thay đổi liên quan security MUST có negative test và authorization test khi áp dụng.
- Security/static check hiện có MUST được chạy và MUST NOT bị làm yếu.
- Hiện chưa xác nhận security scanner hoặc static-analysis configuration; rule không được tooling tương lai bao phủ vẫn được thực thi qua review.
