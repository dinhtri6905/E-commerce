# Miền dữ liệu ứng dụng

## Mô hình và công nghệ

`CONFIRMED` — ứng dụng sử dụng mô hình dữ liệu quan hệ, theo U1 tại [INDEX.md](./INDEX.md). Engine/phiên bản, ORM/database library và migration mechanism đều `TBD`; R1 chưa có persistence code, schema hoặc database configuration.

Lựa chọn và provisioning dịch vụ hạ tầng không thuộc tài liệu ứng dụng này. Ma trận công nghệ được sở hữu bởi [TECHNOLOGY.md](./TECHNOLOGY.md).

## Entity đã xác nhận

| Entity | Trách nhiệm nghiệp vụ |
| --- | --- |
| User | Thông tin tài khoản, role và hồ sơ người dùng |
| Category | Danh mục sản phẩm |
| Product | Sản phẩm có trong hệ thống E-commerce |
| Inventory | Tồn kho khả dụng của sản phẩm |
| Cart | Giỏ hàng của Customer |
| CartItem | Sản phẩm và số lượng trong giỏ |
| Order | Đơn hàng của Customer |
| OrderItem | Các sản phẩm thuộc một đơn hàng |

Đây là tên entity nghiệp vụ, chưa xác nhận tên table hoặc column. Việc User sở hữu thông tin role không chốt cách biểu diễn vật lý hoặc tạo thêm entity Admin.

## Quan hệ cấp cao

```text
User
 ├── Cart
 │    └── CartItem
 │          └── Product
 │
 └── Order
      └── OrderItem
            └── Product

Category
   └── Product
        └── Inventory
```

Sơ đồ ghi nhận quan hệ nghiệp vụ đã được user xác nhận; cardinality, tính tùy chọn, khóa ngoại và mapping vật lý còn `TBD`.

## Tồn kho và tạo đơn

Trong MVP, hệ thống theo dõi tồn kho sản phẩm, kiểm tra tồn kho trước khi tạo đơn và cập nhật tồn kho sau khi tạo đơn thành công. CartItem biểu diễn số lượng sản phẩm trong giỏ; OrderItem biểu diễn sản phẩm thuộc đơn.

Transaction boundary, atomicity, isolation, concurrency, retry và cách phối hợp Order/Inventory là `TBD`. Việc xác nhận yêu cầu nghiệp vụ chưa xác nhận cơ chế xử lý transaction đã được thiết kế hoặc thực thi.

## Ranh giới thiết kế chi tiết

Các nội dung sau thuộc `docs/sdd/02-plan/data-model.md` sau khi được phê duyệt:

- Column và kiểu dữ liệu/SQL type.
- Primary/foreign key, constraint và index.
- Cardinality và mapping giữa domain với persistence.
- Migration design, backfill và rollback/recovery.
- Cascade behavior và FK delete behavior.

Hiện artifact này chưa tồn tại. Convention naming của schema, quy tắc toàn vẹn dữ liệu chi tiết và cách lưu lịch sử/trạng thái cũng `TBD`. Quy tắc kỹ thuật nền được tham chiếu tại [DATABASE_RULES.md](../ai/DATABASE_RULES.md), không thay thế một schema được phê duyệt.
