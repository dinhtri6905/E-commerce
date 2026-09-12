# Quy tắc Kiến trúc

## Trạng thái hiện tại

Repository chưa có kiến trúc ứng dụng được xác nhận. Agent MUST kiểm tra design artifact đã phê duyệt và cấu trúc source hiện có trước khi áp dụng một pattern. Agent MUST NOT mô tả các boundary có điều kiện bên dưới như kiến trúc hiện hữu cho đến khi implementation xác nhận điều đó.

## Lựa chọn boundary

- Module mới MUST tuân theo kiến trúc đã được phê duyệt hoặc pattern chủ đạo đã được xác lập trong repository.
- Agent MUST NOT đưa vào framework, architectural style hoặc cross-cutting layer khi chưa có scope rõ ràng hoặc design được phê duyệt.
- Thay đổi kiến trúc MUST được chứng minh bằng requirement hiện tại và được verify trên mọi boundary bị ảnh hưởng.
- Public contract MUST rõ ràng; implementation detail SHOULD được giữ nội bộ trong module sở hữu.

## Trách nhiệm của các layer

Khi backend sử dụng kiến trúc phân layer, chiều phụ thuộc SHOULD là:

```text
Controller / Route
        ↓
Service
        ↓
Repository / Data Access
        ↓
Database
```

- Controller hoặc route MUST xử lý transport concern: lấy dữ liệu request, chuyển giao transport-level validation, chuyển authentication context, chọn status và map response.
- Service MUST sở hữu use-case orchestration và business rule.
- Repository hoặc data-access component MUST sở hữu persistence query và mapping giữa persistence representation với domain representation.
- Validation boundary chuyên biệt SHOULD sở hữu request hoặc command validation có thể tái sử dụng khi framework hỗ trợ.
- Business logic MUST NOT phụ thuộc trực tiếp vào HTTP request hoặc response object.
- UI code MUST NOT truy cập trực tiếp database hoặc persistence mechanism.

## Quy tắc dependency

- Dependency MUST hướng đến component sở hữu contract cần dùng; caller MUST NOT đi xuyên qua public boundary để truy cập internal implementation của module khác.
- Higher-level policy code SHOULD phụ thuộc vào interface ổn định khi việc đó duy trì boundary hiện có hoặc tạo khả năng kiểm thử có ý nghĩa.
- Circular dependency bị cấm. Agent MUST giải quyết bằng cách điều chỉnh ownership, tách contract hoặc sử dụng event/orchestration boundary đã được kiến trúc hỗ trợ.
- Shared module MUST chứa behavior thực sự dùng chung và MUST NOT trở thành nơi tập hợp helper không liên quan.
- Infrastructure concern MUST NOT chứa domain policy chỉ vì nó gọi external system.

## Tương tác giữa module

- Mỗi module MUST chỉ expose public interface tối thiểu mà consumer cần.
- Tương tác xuyên module MUST sử dụng public interface, documented event hoặc contract đã được phê duyệt.
- Một module MUST NOT thay đổi internal state hoặc persistence table của module khác qua shortcut không được quy định.
- Thay đổi public interface MUST xác định mọi consumer đã biết và duy trì backward compatibility, trừ khi breaking change được phê duyệt.

## Kiến trúc legacy

Agent MUST giới hạn thay đổi trong task hiện tại. Vi phạm boundary trong legacy code MAY được ghi nhận nhưng MUST NOT được refactor trừ khi nó chặn task hoặc nằm trong scope rõ ràng.

## Thực thi qua review

Các rule kiến trúc được thực thi qua review vì repository hiện chưa có source layout hoặc tooling phân tích kiến trúc.
