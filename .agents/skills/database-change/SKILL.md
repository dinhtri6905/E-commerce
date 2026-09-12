---
name: database-change
description: "Lập kế hoạch hoặc implement persistence change an toàn với migration, constraint, transaction và test. Dùng cho database task đã phê duyệt; không dùng để sửa production data thủ công."
---

# Purpose

Thiết kế và thực hiện persistence change an toàn, bảo toàn data integrity, compatibility và khả năng verify.

# When to Use

- Khi planning hoặc approved implementation task có schema, migration, query, constraint, index hay transaction impact.

# When NOT to Use

- Không dùng cho application behavior không có persistence impact hoặc production data operation thủ công.

# Preconditions

- Planning mode cần Specification `APPROVED`.
- Implementation mode cần Planning `APPROVED`, current task đã qua Task Verification và approval riêng cho destructive change nếu có.

# Required Inputs

- Requirement, schema/migration hiện có, data volume/constraint đã biết, approved Plan/task và test definition tương ứng với phase.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, Database/Security/Testing rules và SDD artifact liên quan.

# Workflow

1. Trace change về Requirement và inspect schema/migration mechanism hiện có.
2. Phân tích impact tới data integrity, backward compatibility, query và deployment.
3. Thiết kế schema change cùng PK/FK/constraint/index cần thiết.
4. Xác định migration/backfill/rollback hoặc recovery strategy.
5. Đánh giá transaction, concurrency và application compatibility.
6. Trong implementation mode, tạo migration bằng mechanism của project và chỉ sửa đúng task.
7. Thêm test cho constraint, migration, query và behavior bị ảnh hưởng.
8. Chạy verification được repository định nghĩa và ghi evidence.

# Required Outputs

- Impact analysis; schema/migration design hoặc implementation; compatibility/rollback plan; test và verification evidence.

# Verification

- Kiểm tra migration trên environment an toàn, data integrity, query plan/performance khi áp dụng và backward compatibility.
- Destructive effect phải rõ ràng, được phê duyệt và có recovery strategy.

# Gate

- Planning work tuân theo `Planning = APPROVED`.
- Implementation work chỉ đạt `Implementation = PASS` sau check của implementer và vẫn cần independent `sdd-verify`.

# Prohibited Actions

- Không mutate production database thủ công, âm thầm chạy destructive migration, sửa applied migration khi chưa được phép hoặc tự tạo application requirement.

# Reporting Format

- Phase/scope; current schema; impact; design/change; migration/recovery; transaction/query impact; tests/results; gate; remaining risk.
