# Chỉ mục tài liệu dự án

## Mục đích và trạng thái

`docs/project/` là nguồn thông tin chính thức về các dữ kiện ổn định, đã xác nhận của E-commerce Web Application. Repository này chỉ sở hữu phát triển ứng dụng. Hạ tầng, kiến trúc deployment, provisioning và cloud deployment pipeline thuộc repository riêng.

`CONFIRMED` xác nhận yêu cầu hoặc quyết định, không có nghĩa đã implement hay verify. `TBD` là chưa quyết định; `OUT OF SCOPE` là ngoài phạm vi hiện tại; `DEPRECATED` là thông tin đã được thay thế bằng yêu cầu mới.

## Nguồn dữ kiện và thẩm quyền

- **U1:** Yêu cầu trực tiếp của user “You are creating the canonical Project Documentation for this repository”, ngày 2026-09-13, xác nhận phạm vi application-only và các dữ kiện nghiệp vụ/kỹ thuật trong bộ tài liệu này.
- **R1:** Kiểm tra repository ngày 2026-09-13: [README](../../README.md), [AGENTS.md](../../AGENTS.md), `.codex/`, `.agents/` và tài liệu hiện có. Chưa có source ứng dụng, manifest/lockfile, cấu hình build/test/database hoặc SDD artifact; xem [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md).

Thứ tự nguồn xác nhận dữ kiện: U1 → thông tin user đã phê duyệt trong tài liệu repository → implementation/configuration → SDD artifact đã phê duyệt → convention hiện có. Thứ tự ưu tiên instruction vẫn do [AGENTS.md](../../AGENTS.md) quy định. Ví dụ và convention mặc định không tự trở thành lựa chọn công nghệ hoặc contract đã được phê duyệt.

## Danh mục tài liệu

| File | Trách nhiệm |
| --- | --- |
| [INDEX.md](./INDEX.md) | Điểm vào, nguồn dữ kiện và ranh giới tài liệu |
| [OVERVIEW.md](./OVERVIEW.md) | Bối cảnh ứng dụng, actor và hành trình tổng quan |
| [SCOPE.md](./SCOPE.md) | Phạm vi MVP, tính năng tương lai và phần bị loại trừ |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Thành phần ứng dụng, module và chiều phụ thuộc logic |
| [TECHNOLOGY.md](./TECHNOLOGY.md) | Ma trận công nghệ CONFIRMED/TBD và evidence |
| [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) | Cấu trúc repository thực tế |
| [DATABASE.md](./DATABASE.md) | Entity, quan hệ và ranh giới thiết kế dữ liệu |
| [API.md](./API.md) | REST, resource, ví dụ endpoint và quyết định contract còn thiếu |
| [SECURITY.md](./SECURITY.md) | Yêu cầu bảo mật của ứng dụng |
| [QUALITY.md](./QUALITY.md) | Kỳ vọng chất lượng và các cấp độ kiểm chứng |
| [DECISIONS.md](./DECISIONS.md) | Sổ quyết định CONFIRMED/TBD/OUT OF SCOPE/DEPRECATED |

## Thứ tự đọc

```text
OVERVIEW → SCOPE → ARCHITECTURE → TECHNOLOGY
    → REPOSITORY_STRUCTURE → DATABASE + API
    → SECURITY → QUALITY → DECISIONS
```

## Ranh giới tài liệu

| Khu vực | Nội dung sở hữu |
| --- | --- |
| `docs/project/` | Dự án là gì: dữ kiện, yêu cầu ổn định và trạng thái hiện thực hóa được phân biệt rõ |
| [docs/ai/](../ai/RULES_INDEX.md) | AI thực hiện công việc kỹ thuật như thế nào |
| `docs/sdd/` | Công việc đang được đặc tả, thiết kế, phân rã task, implement và verify |

`docs/sdd/` chưa tồn tại. Khi có SDD, điểm vào là `docs/sdd/index.md`; Specification, Planning, Tasks và evidence sẽ thuộc các thư mục tương ứng tại đó. Schema chi tiết và endpoint contract không thuộc Project Documentation.

Hạ tầng/deployment thuộc repository khác, kể cả thiết kế mạng và provisioning. Tên hoặc URL repository đó chưa được cung cấp (`TBD`). Việc thay đổi phạm vi so với bộ tài liệu trước được ghi tại [DECISIONS.md](./DECISIONS.md).
