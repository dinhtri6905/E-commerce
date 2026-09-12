# Quy tắc API

## Phạm vi áp dụng và quyền sở hữu

Các rule này sở hữu HTTP API contract. Hiện chưa xác nhận API framework hoặc contract hiện hữu. API trong tương lai MUST sử dụng các giá trị mặc định này, trừ khi specification đã phê duyệt hoặc contract đã được xác lập quy định một style nhất quán khác.

## URL và resource

- Endpoint MUST hướng đến resource, sử dụng tên resource số nhiều viết thường và tránh action verb khi HTTP method đã thể hiện được operation.
- Path parameter MUST sử dụng identifier có ý nghĩa như `:productId`, `:orderId` hoặc `:userId`.
- Nested path SHOULD thể hiện ownership hoặc containment thực sự và SHOULD giữ độ sâu thấp.
- Sử dụng các dạng mặc định sau:

```text
/api/products
/api/products/:productId
/api/cart/items
/api/orders
```

- Action-style endpoint MAY chỉ được sử dụng cho domain operation không thể biểu diễn rõ bằng thay đổi trạng thái resource; cách đặt tên MUST nhất quán.

## HTTP method và status code

- `GET` MUST đọc dữ liệu mà không thay đổi business state.
- `POST` MUST tạo resource hoặc bắt đầu operation được mô hình hóa rõ.
- `PUT` MUST thay thế resource khi được hỗ trợ; `PATCH` MUST cập nhật một phần resource.
- `DELETE` MUST xóa hoặc deactivate resource được định danh theo contract đã phê duyệt.
- API MUST dùng status semantic nhất quán: `200` cho response thành công có content, `201` khi tạo mới và `204` khi thành công không có content.
- API MUST dùng `400` cho request malformed hoặc invalid, `401` khi authentication thiếu hoặc không hợp lệ, `403` khi không đủ permission, `404` khi resource không tồn tại và `409` cho state conflict hoặc business conflict khi phù hợp.
- Handler MUST NOT trả về success khi operation thất bại.

## Validation

- Path parameter, query parameter, header được ứng dụng sử dụng và request body MUST được validate trước khi business logic sử dụng.
- Validation MUST từ chối field không được nhận biết hoặc không được phép khi việc chấp nhận chúng có thể che giấu client error hoặc tạo mass-assignment risk.
- Validation error SHOULD chỉ ra thông tin field an toàn, có thể xử lý mà không expose nội bộ.
- Business-rule failure MUST được phân biệt với malformed request.

## Response contract

- Single-resource response thành công SHOULD trả về resource representation đã được mô tả mà không có persistence-only field.
- Collection response cần pagination MUST sử dụng cấu trúc mặc định bên dưới, trừ khi contract đã phê duyệt quy định khác.

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

- Mọi API error MUST sử dụng một cấu trúc ổn định:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Không tìm thấy sản phẩm"
  }
}
```

- `error.code` MUST ổn định và machine-readable. `error.message` MUST an toàn cho client.
- Internal stack trace, database error, implementation name và sensitive field MUST NOT xuất hiện trong response.

## Pagination, filtering và sorting

- Collection có khả năng lớn MUST được giới hạn và phân trang.
- Page size MUST có giá trị tối đa đã được validate.
- Filter MUST sử dụng query parameter đã được mô tả và nằm trong allowlist.
- Sorting MUST sử dụng field và direction đã được mô tả, nằm trong allowlist; client input MUST NOT được chèn trực tiếp vào query clause.
- Pagination metadata và ordering MUST đủ ổn định để tránh trùng hoặc thiếu item trong quá trình duyệt bình thường.

## Authentication và authorization

- Protected endpoint MUST validate authentication trước khi truy cập behavior được bảo vệ.
- Authorization MUST kiểm tra role, permission hoặc resource ownership theo yêu cầu; chỉ authentication là chưa đủ.
- Authorization decision MUST được thực thi phía server và tuân thủ [SECURITY_RULES.md](./SECURITY_RULES.md).
- Response MUST NOT tiết lộ sự tồn tại của protected resource khi security model đã phê duyệt yêu cầu che giấu.

## Versioning và compatibility

- Dạng mặc định ban đầu không có version là `/api/...`; Agent MUST NOT đưa path versioning vào khi chưa có compatibility requirement được phê duyệt.
- Nếu versioning được phê duyệt, nó MUST được áp dụng nhất quán, ví dụ `/api/v1/...`.
- Client hiện có MUST tiếp tục tương thích, trừ khi breaking change và migration path được phê duyệt rõ.
- Xóa hoặc đổi tên field, thay đổi ý nghĩa hoặc siết input được chấp nhận theo cách gây breaking change đều yêu cầu compatibility analysis và contract test được cập nhật.

## Testing và thực thi qua review

API contract MUST có test theo [TESTING_RULES.md](./TESTING_RULES.md). Các rule này được thực thi qua review cho đến khi API tooling tồn tại.
