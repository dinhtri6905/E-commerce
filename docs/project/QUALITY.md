# Kỳ vọng chất lượng ứng dụng

## Mục tiêu — CONFIRMED

Nguồn U1 tại [INDEX.md](./INDEX.md) xác nhận các kỳ vọng sau; đây chưa phải kết quả kiểm chứng implementation:

| Thuộc tính | Kỳ vọng của ứng dụng |
| --- | --- |
| Correctness | Chức năng đáp ứng phạm vi MVP và business rule đã được phê duyệt |
| Maintainability | Trách nhiệm ứng dụng rõ ràng, thay đổi có thể được hiểu và bảo trì |
| Testability | Nghiệp vụ và interaction quan trọng có thể được kiểm chứng |
| Consistent API behavior | API nhất quán với contract đã được phê duyệt |
| Validation | Dữ liệu không hợp lệ được xử lý theo contract rõ ràng |
| Error handling | Lỗi có hành vi nhất quán, an toàn và không tiết lộ nội bộ |

## Quality gate áp dụng

| Gate kỳ vọng | Trạng thái hiện tại |
| --- | --- |
| `lint` | Chưa có công cụ/configuration/command xác nhận |
| `typecheck` | Chưa có ngôn ngữ source/type checker/command xác nhận |
| `tests` | Chưa có test framework, runner hoặc test ứng dụng |
| `build` | Chưa có build configuration hoặc command xác nhận |

Tên gate không phải lệnh shell đã tồn tại. Các gate được áp dụng theo công nghệ và tooling được phê duyệt; lựa chọn cụ thể hiện là `TBD`. Khi verification bắt buộc thất bại, công việc không được xem là hoàn thành thành công. R1 chưa có source hoặc tooling để ghi nhận kết quả PASS cho các gate ứng dụng.

## Các cấp độ kiểm thử kỳ vọng

| Cấp độ | Mục đích |
| --- | --- |
| Unit Test | Kiểm chứng business logic riêng lẻ |
| Integration Test | Kiểm chứng sự phối hợp giữa các phần của ứng dụng và persistence |
| API Test | Kiểm chứng API contract, validation và kiểm soát truy cập |
| Frontend Test | Kiểm chứng presentation và tương tác người dùng |
| End-to-End Test | Kiểm chứng hành trình nghiệp vụ quan trọng qua toàn ứng dụng khi được hỗ trợ |

Các luồng quan trọng trong [SCOPE.md](./SCOPE.md), gồm tài khoản/quyền truy cập, sản phẩm/giỏ hàng, checkout/tạo đơn/tồn kho và quản trị, cần có verification phù hợp. Danh sách trên là kỳ vọng chất lượng, không phải test plan hoặc test case chi tiết.

**Coverage Target: TBD.** Chưa có ngưỡng coverage hoặc framework được user xác nhận hay configuration chứng minh.

## Ranh giới tài liệu

[TECHNOLOGY.md](./TECHNOLOGY.md) ghi nhận trạng thái tooling. [TESTING_RULES.md](../ai/TESTING_RULES.md) sở hữu convention và cách AI thực hiện kiểm thử. Acceptance Criteria, test definition và execution evidence thuộc SDD khi có artifact; Project Documentation không sao chép các nội dung đó.
