# Quy tắc Frontend

## Phạm vi áp dụng

Chỉ áp dụng các rule này khi scope đã được phê duyệt tạo hoặc thay đổi frontend. Hiện chưa xác nhận frontend framework, state-management library, styling system hoặc test framework. Agent MUST NOT đưa vào các lựa chọn này khi chưa được phê duyệt.

## Component và hook

- Component MUST sử dụng `PascalCase`, trừ khi convention của framework đã xác lập yêu cầu khác.
- Custom hook MUST sử dụng dạng `useXxx` khi framework đã chọn có khái niệm hook.
- Một component MUST có một trách nhiệm UI chính.
- Presentation, state orchestration và data access SHOULD được tách biệt khi việc kết hợp chúng làm behavior khó hiểu hoặc cản trở kiểm thử tập trung.
- Component MUST NOT truy cập persistence trực tiếp.
- Hook MUST tuân thủ lifecycle và call-order rule của framework đã được xác nhận.

## Quyền sở hữu state

- State MUST nằm ở phạm vi hẹp nhất có trách nhiệm sở hữu và điều phối nó.
- Derived value SHOULD được tính từ authoritative state thay vì lưu thành state trùng lặp.
- Server state, form state và transient UI state SHOULD được phân biệt rõ.
- Global state MUST NOT được đưa vào cho giá trị chỉ thuộc về một screen hoặc component tree.
- Agent MUST tái sử dụng state-management pattern đã được phê duyệt và MUST NOT tự chọn library mới.

## Tương tác API

- API call SHOULD đi qua API/data-access layer dùng chung của repository khi layer đó tồn tại.
- API base URL, credential và endpoint phụ thuộc environment MUST NOT được hard-code trong component.
- Request construction, response mapping và API error handling dùng lặp lại MUST NOT bị duplicate giữa các component.
- Component MUST coi API data là không đáng tin cho đến khi dữ liệu đi qua validation boundary hoặc typed data boundary đã được xác lập.

## Trạng thái hiển thị cho người dùng

- Mọi asynchronous view MUST định nghĩa loading state, error state, success state và empty state phù hợp khi kết quả rỗng là hợp lệ.
- Mutation thất bại MUST cung cấp feedback có thể xử lý và MUST NOT để UI hiển thị sai là đã thành công.
- UI state MUST giữ nhất quán khi request được retry, cancel hoặc bị request mới thay thế nếu framework hỗ trợ các flow đó.

## Form và validation

- Form MUST validate user input trước khi submit và MUST hiển thị field error hoặc form-level error có thể xử lý.
- Client validation MUST cải thiện trải nghiệm nhưng MUST NOT được xem là thay thế cho server validation.
- Submission control SHOULD ngăn submit trùng lặp ngoài ý muốn khi mutation đang pending.
- Accessibility semantic, keyboard behavior và focus handling MUST tuân theo pattern hiện có của project và platform standard áp dụng.

## Tái sử dụng và styling

- Agent MUST tái sử dụng component, token và interaction pattern hiện có trước khi thêm lựa chọn mới.
- Reusable component MUST thể hiện một UI concept ổn định được dùng lặp lại, không phục vụ khả năng tái sử dụng giả định.
- Styling MUST tuân theo system đã được xác nhận của project; Agent MUST NOT trộn thêm styling approach mới khi chưa được phê duyệt.
- Component MUST NOT lặp lại loading, error hoặc formatting behavior dùng chung khi abstraction đã được xác lập tồn tại.

## Testing

Frontend behavior MUST tuân thủ [TESTING_RULES.md](./TESTING_RULES.md). Test SHOULD kiểm tra behavior người dùng quan sát được thay vì implementation detail.

## Thực thi qua review

Các rule frontend được thực thi qua review vì repository hiện chưa có frontend hoặc mechanical tooling dành cho frontend.
