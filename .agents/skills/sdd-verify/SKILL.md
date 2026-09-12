---
name: sdd-verify
description: "Kiểm chứng độc lập implementation so với requirement, Acceptance Criteria, design, task và test. Dùng cho verification gate; không dùng để giả lập evidence hoặc thay implementation nhằm tự tạo PASS."
---

# Purpose

Xác minh độc lập actual implementation so với expected behavior và đưa ra verdict có evidence.

# When to Use

- Sau implementation handoff hoặc khi được yêu cầu audit trạng thái của một SDD task.

# When NOT to Use

- Không dùng để viết Specification/Planning, thực hiện implementation chính hoặc hợp thức hóa check đang fail.

# Preconditions

- Có current task, linked requirement/Acceptance Criteria, approved Plan và implementation/diff cần kiểm chứng.

# Required Inputs

- SDD artifacts liên quan, source/diff, test definition, repository commands và environment cần thiết.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, relevant engineering rules và toàn bộ trace của task.

# Workflow

1. Lập trace `Requirement → Acceptance Criteria → Design → Task → Test → Implementation`.
2. Kiểm tra actual behavior so với expected behavior, không dựa chỉ vào báo cáo của implementer.
3. Chạy unit, integration, API, frontend và E2E test áp dụng được.
4. Chạy typecheck, lint, build, security/static check và regression check được repository định nghĩa.
5. Kiểm tra scope, contract, user change và evidence.
6. Phân loại finding và đưa verdict `PASS`, `FAIL` hoặc `BLOCKED`.
7. Sau `PASS`, cập nhật SDD tracking/evidence phù hợp khi task cho phép thay đổi documentation.

# Required Outputs

- Traceability, command/result evidence, finding, uncovered risk, verdict và tracking update áp dụng được.

# Verification

- Evidence phải là kết quả thực tế và đủ để tái kiểm tra.
- Mọi required check phải PASS trước verdict `PASS`.

# Gate

- `PASS`: đáp ứng toàn bộ required verification.
- `FAIL`: implementation hoặc test không đáp ứng expected behavior.
- `BLOCKED`: thiếu prerequisite/evidence/environment bắt buộc và không thể suy ra an toàn.

# Prohibited Actions

- Không fabricate evidence, xóa hoặc skip valid test, đổi expected result để PASS, hay báo PASS khi check bắt buộc fail.

# Reporting Format

- Trace matrix; commands/results; findings; regression/security coverage; verdict; tracking update; remaining issue.
