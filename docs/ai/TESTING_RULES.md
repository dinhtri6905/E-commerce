# Quy tắc Testing

## Yêu cầu cốt lõi

- Mỗi feature hoặc bug fix MUST có automated test tương xứng khi repository hỗ trợ.
- Nếu chưa có test framework, Agent MUST NOT tự chọn hoặc cài đặt framework ngoài scope đã phê duyệt; Agent MUST ghi nhận khoảng trống verification và sử dụng các check không phá hủy mạnh nhất hiện có.
- Test MUST verify behavior và contract, không chỉ thực thi các dòng code.
- Mỗi test MUST có tính xác định, độc lập với thứ tự chạy và có thể lặp lại trong environment được hỗ trợ.

## Các cấp độ test

- Unit test MUST kiểm tra non-trivial business logic tách biệt khỏi external system khi phù hợp.
- Integration test MUST kiểm tra sự phối hợp giữa các internal layer thật khi wiring, persistence mapping hoặc boundary behavior là quan trọng.
- API test MUST kiểm tra validation, status code, response shape, authentication và authorization cho endpoint bị ảnh hưởng.
- Frontend test SHOULD kiểm tra rendering và interaction người dùng quan sát được, cùng loading, error, empty và success state khi frontend tồn tại.
- End-to-end test SHOULD bao phủ critical user journey khi repository hỗ trợ chạy E2E.
- Mỗi bug fix MUST bổ sung regression test có khả năng fail với lỗi ban đầu khi phù hợp.

## Đặt tên và cấu trúc

- Tên test MUST mô tả behavior có thể quan sát và điều kiện tương ứng.
- Ưu tiên tên như:

```text
thêm sản phẩm khi tồn kho còn đủ
từ chối số lượng lớn hơn tồn kho hiện có
```

- Các tên như `test1`, `case2` và `works` bị cấm.
- Một test suite MUST sử dụng nhất quán cấu trúc Arrange/Act/Assert hoặc Given/When/Then.
- Mỗi test SHOULD chỉ có một lý do về behavior để fail, kể cả khi nhiều assertion cùng mô tả một outcome.

## Phạm vi behavior bắt buộc

Với mỗi behavior quan trọng, test MUST xem xét và bao phủ từng trường hợp áp dụng được:

- happy path;
- invalid input;
- boundary value;
- not found;
- unauthenticated access;
- unauthorized role hoặc ownership;
- business conflict;
- external failure hoặc persistence failure khi recovery behavior đã được định nghĩa.

Trường hợp áp dụng được nhưng bị bỏ qua MUST có lý do được ghi lại.

## Test data và mocking

- Test data MUST tối thiểu, rõ ràng và không chứa secret hoặc personal data thật.
- Test MUST kiểm soát time, randomness và external service khi các input đó ảnh hưởng đến tính xác định.
- Mock MUST nằm ở boundary thật và MUST NOT thay thế business behavior đang được kiểm thử.
- Test SHOULD ưu tiên fixture/builder đại diện thay vì fixture lớn, khó hiểu.
- Integration test và E2E test MUST chỉ dọn dữ liệu do chính chúng tạo ra.

## Ngăn kết quả PASS sai

- Agent MUST NOT thay đổi expected result chỉ để test PASS khi implementation đang sai.
- Agent MUST NOT xóa hoặc làm yếu valid failing test.
- Agent MUST NOT skip, focus, quarantine hoặc disable test chỉ để báo cáo `PASS`.
- Agent MUST NOT over-mock đến mức contract hoặc business behavior thật không còn được thực thi.
- Task MUST NOT được báo cáo `PASS` khi required test, typecheck, lint, build hoặc security check vẫn fail.
- Existing failure không liên quan MUST được báo cáo kèm evidence và phân biệt với regression do task; MUST NOT âm thầm bỏ qua.

## Thực thi và evidence

- Agent MUST kiểm tra configuration của repository trước khi chọn command và MUST NOT tự tạo script không tồn tại.
- Relevant check MUST được chạy sau implementation theo thứ tự và hình thức repository hỗ trợ.
- Báo cáo cuối MUST liệt kê từng command, kết quả và mọi check bị bỏ qua cùng lý do.
- Test output hoặc evidence tương đương MUST đủ để trace acceptance criteria đến behavior đã được verify.

## Thực thi qua review

Hiện chưa cấu hình test framework hoặc test command. Mọi testing rule được thực thi qua review cho đến khi tooling được đưa vào qua công việc đã phê duyệt.
