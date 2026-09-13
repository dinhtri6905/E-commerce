# Yêu cầu bảo mật ứng dụng

## Phạm vi và trạng thái

Các yêu cầu dưới đây là `CONFIRMED` theo U1 tại [INDEX.md](./INDEX.md). Chúng mô tả thuộc tính bảo mật ứng dụng cần đáp ứng; repository chưa có implementation hoặc verification evidence chứng minh các thuộc tính đã được thực thi.

| Nhóm | Yêu cầu ứng dụng |
| --- | --- |
| Authentication | Thao tác Customer riêng tư chỉ khả dụng khi danh tính đã được xác thực |
| Authorization | Thao tác Admin yêu cầu quyền Admin; xác thực danh tính không tự cấp quyền thao tác |
| Ownership / access control | Người dùng chỉ có thể truy cập tài nguyên thuộc quyền sở hữu của mình hoặc được cấp quyền truy cập |
| Password protection | Mật khẩu không được lưu dưới dạng plaintext |
| Secrets / credentials | Secret không được hard-code trong source; credential không được commit vào Git |
| Validation | Mọi external input là dữ liệu không đáng tin và cần được kiểm tra tại boundary ứng dụng |
| Sensitive output | API response không tiết lộ thông tin nhạy cảm |
| Safe database access | Truy cập database sử dụng cơ chế an toàn/parameterized hoặc bảo vệ ORM tương đương |
| Secure error handling | Lỗi trả về client không chứa internal stack trace hoặc thông tin nội bộ nhạy cảm |

Authentication và authorization là hai mối quan tâm riêng. Yêu cầu quyền/ownership được thực thi trong ứng dụng, không chỉ dựa vào việc ẩn nút hoặc màn hình phía client.

## Quyết định kỹ thuật chưa chốt

Authentication library/mechanism, session/token transport, lifetime và logout invalidation là `TBD`. Thuật toán/tham số bảo vệ mật khẩu, ma trận quyền chi tiết, validation schema và danh sách field an toàn trong response cũng `TBD`.

Chưa có tên biến hoặc cơ chế cung cấp secret ứng dụng được xác nhận. Secret source, quyền truy cập và rotation còn `TBD` ở mức nhu cầu ứng dụng; provisioning cơ chế hạ tầng thuộc repository riêng. Configuration contract hiện tại được ghi tại [TECHNOLOGY.md](./TECHNOLOGY.md).

Giá trị secret thật không được đưa vào tài liệu repository. Khi cần ví dụ, giá trị chỉ là placeholder như `<application-secret>`, không phải credential thực.

## Ranh giới với quy tắc AI

| Tài liệu | Nội dung sở hữu |
| --- | --- |
| `docs/project/SECURITY.md` | Các yêu cầu bảo mật mà ứng dụng cần đáp ứng |
| [docs/ai/SECURITY_RULES.md](../ai/SECURITY_RULES.md) | Cách AI thực hiện công việc lập trình an toàn |

Các lựa chọn implementation cụ thể và evidence kiểm chứng sẽ thuộc SDD khi có artifact. Tài liệu này không sao chép workflow, checklist lập trình hoặc hướng dẫn hạ tầng từ các nguồn đó.
