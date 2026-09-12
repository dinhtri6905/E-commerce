# Quy tắc Coding

## Phạm vi

Các rule này áp dụng cho mọi thay đổi source code. Rule file dành riêng cho từng layer bổ sung constraint thuộc phạm vi của layer đó.

## Ngôn ngữ quy định

- `MUST` biểu thị yêu cầu bắt buộc.
- `MUST NOT` biểu thị hành vi bị cấm.
- `SHOULD` biểu thị khuyến nghị mạnh; nếu không tuân theo thì phải ghi rõ lý do.
- `MAY` biểu thị hành vi tùy chọn.

## Đặt tên

Agent MUST sử dụng convention đã được xác lập rõ trong repository. Khi chưa có convention, sử dụng mặc định sau:

| Thành phần | Mặc định |
| --- | --- |
| Biến | `camelCase` |
| Hàm | `camelCase` |
| Class | `PascalCase` |
| Type | `PascalCase` |
| Interface | `PascalCase` |
| Enum | `PascalCase` |
| Hằng số thực sự ở cấp module/global | `UPPER_SNAKE_CASE` |
| Định danh entity | `userId`, `productId`, `orderId` |

- Tên boolean SHOULD sử dụng prefix có ý nghĩa như `is`, `has`, `can`, `should` hoặc `needs`.
- Tên hàm SHOULD hướng đến hành động và mô tả mục đích có thể quan sát được.
- MUST NOT sử dụng các tên như `data1`, `temp`, `obj`, `abc`, `flag`, `doSomething` và `processData` khi có tên domain chính xác hơn.
- Từ viết tắt MAY chỉ được sử dụng khi đó là thuật ngữ chuẩn, rõ nghĩa trong repository hoặc domain.

## Hàm và luồng điều khiển

- Một hàm MUST có một trách nhiệm chính.
- Side effect MUST được thể hiện rõ qua tên, vị trí hoặc contract.
- Agent SHOULD sử dụng early return khi giúp giảm nesting và tăng tính rõ ràng.
- Agent MUST NOT lặp lại business logic; SHOULD tái sử dụng implementation đang sở hữu behavior đó.
- Agent MUST NOT thêm wrapper chỉ chuyển tiếp argument mà không bảo vệ boundary, chuyển đổi contract hoặc giảm duplication có ý nghĩa.
- Hàm SHOULD đủ nhỏ để có thể hiểu input, output, failure path và side effect mà không phải lần theo các module không liên quan.

## Type, giá trị và configuration

- Public boundary MUST sử dụng type chính xác cho input và output khi ngôn ngữ hỗ trợ.
- MUST NOT sử dụng `any` không an toàn hoặc cơ chế bỏ qua type tương đương khi có thể định nghĩa type chính xác một cách hợp lý.
- Type assertion MUST NOT được dùng để bỏ qua runtime validation bắt buộc đối với external input.
- Domain constant được sử dụng lặp lại SHOULD có một nơi sở hữu rõ ràng thay vì lặp lại magic value.
- Configuration thay đổi theo environment MUST NOT được hard-code trong source file.
- Secret MUST NOT được lưu trong source code; tuân thủ [SECURITY_RULES.md](./SECURITY_RULES.md).

## Kỷ luật thay đổi

- Agent MUST NOT tạo dead code hoặc commented-out code không cần thiết.
- Agent MUST NOT suppress lỗi lint, type hoặc compiler chỉ để làm check PASS.
- Agent MUST NOT refactor code không liên quan.
- Agent MUST NOT tạo abstraction cho khả năng tái sử dụng giả định; abstraction phải phục vụ boundary hiện tại hoặc duplication đã được chứng minh.
- Public behavior hiện có MUST được giữ nguyên trừ khi task đã phê duyệt yêu cầu thay đổi.
- Comment SHOULD giải thích ý định hoặc constraint khó nhận biết, không lặp lại nội dung code.
- File MUST tuân thủ convention hiện có về format và import. Agent MUST NOT format file không liên quan.

## Thực thi qua review

Hiện chưa xác nhận coding toolchain. Các rule này được thực thi qua review cho đến khi tooling của repository được thêm hoặc phát hiện. Tooling trong tương lai MUST bổ trợ và MUST NOT làm suy yếu các rule này.
