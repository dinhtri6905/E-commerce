# Cấu trúc repository

## Cấu trúc thực tế

`CONFIRMED` — kiểm tra R1 ngày 2026-09-13 và đối chiếu sau khi chuẩn hóa Project Documentation. Các vùng chính hiện có:

```text
.
├── README.md
├── AGENTS.md
├── .git/
├── .codex/
│   ├── config.toml
│   ├── agents/
│   └── rules/
├── .agents/
│   └── skills/
└── docs/
    ├── project/
    └── ai/
```

| Khu vực | Trách nhiệm hiện tại |
| --- | --- |
| [README.md](../../README.md) | Tên dự án E-commerce |
| [AGENTS.md](../../AGENTS.md) | Governance và thứ tự đọc bắt buộc |
| `.git/` | Metadata quản lý phiên bản |
| `.codex/` | Cấu hình Codex, các vai trò agent và command execution rules hiện có |
| `.agents/skills/` | Các Skill tái sử dụng hỗ trợ công việc kỹ thuật |
| [docs/project/](./INDEX.md) | Bộ 11 tài liệu về dữ kiện ứng dụng đã xác nhận |
| [docs/ai/](../ai/RULES_INDEX.md) | Quy tắc kỹ thuật AI theo từng phạm vi |

Đây là bản đồ trách nhiệm; không sao chép nội dung cấu hình runtime Codex hoặc workflow Skill vào Project Documentation.

## Những phần chưa tồn tại

| Thành phần | Kết quả kiểm tra |
| --- | --- |
| Frontend / backend / source ứng dụng | Chưa có thư mục source để mô tả |
| `package.json` và lockfile | Chưa có |
| TypeScript / build / lint / formatter / test configuration | Chưa có |
| Database / ORM configuration và migration | Chưa có |
| `docs/sdd/` | Chưa có Specification, Planning, Tasks hoặc verification artifact |

Khi tồn tại, `docs/sdd/index.md` sẽ là điểm vào công việc SDD theo governance. Việc tham chiếu đường dẫn dự kiến không xác nhận artifact đã được tạo.

Cấu trúc source, cách tổ chức frontend/backend và package boundary là `TBD`. Không có cấu trúc thư mục tương lai nào được ghi như hiện trạng. Repository hạ tầng/deployment là nơi sở hữu công việc hạ tầng và không được mô tả như một thư mục ứng dụng tại đây.
