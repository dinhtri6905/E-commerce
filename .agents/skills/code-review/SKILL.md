---
name: code-review
description: "Review implementation độc lập để tìm lỗi correctness, scope, architecture, security, regression và test. Dùng khi cần findings; không dùng để tự rewrite code nếu chưa được yêu cầu."
---

# Purpose

Thực hiện independent code review dựa trên requirement, diff, test và evidence, ưu tiên finding có tác động thực tế.

# When to Use

- Khi review implementation, pull request hoặc task handoff trước acceptance.

# When NOT to Use

- Không dùng làm implementation workflow, style-only cleanup hoặc thay Specification/Planning review.

# Preconditions

- Có scope/task và diff hoặc implementation cụ thể để review.

# Required Inputs

- Task, requirement, Acceptance Criteria, relevant rules, diff, test và verification result.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, relevant engineering rules và artifact của current task.

# Workflow

1. Xác định expected behavior và scope trước khi đọc conclusion của implementer.
2. Review theo thứ tự: Correctness → Requirement compliance → Security → Architecture → Regression → Tests → Maintainability → Style.
3. Trace finding tới location và behavior cụ thể; kiểm tra evidence hoặc reproduction khi có thể.
4. Phân loại severity `BLOCKER`, `HIGH`, `MEDIUM` hoặc `LOW` theo impact.
5. Đánh giá test sufficiency và risk chưa được bao phủ.
6. Kết luận gate độc lập.

# Required Outputs

- Mỗi finding gồm severity, location, issue, impact, evidence và recommended correction.
- Nếu không có finding, nêu review coverage và residual risk.

# Verification

- Không đưa finding mơ hồ hoặc style-only nếu không có impact.
- Xác nhận location và recommendation không vượt scope.

# Gate

- `PASS` khi không có finding ảnh hưởng requirement/correctness/security hoặc required verification.
- `FAIL` khi có finding xác nhận cần sửa; `BLOCKED` khi thiếu artifact hoặc evidence bắt buộc.

# Prohibited Actions

- Không modify code trong independent review khi chưa được yêu cầu, fabricate finding hoặc hạ severity để tạo PASS.

# Reporting Format

- Findings theo severity; coverage; test/regression assessment; verdict; residual risk.
