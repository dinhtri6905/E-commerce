---
name: sdd-spec
description: "Soạn thảo hoặc review SDD Specification có requirement và Acceptance Criteria kiểm thử được. Dùng khi yêu cầu cần chuẩn hóa; không dùng cho Planning, task decomposition hoặc implementation."
---

# Purpose

Chuyển business requirement thành Specification chính xác, có thể kiểm thử và truy vết mà không đưa ra implementation sớm.

# When to Use

- Khi tạo hoặc review Specification.
- Khi cần làm rõ actor, use case, requirement, Acceptance Criteria, dependency hoặc contradiction.

# When NOT to Use

- Không dùng để thiết kế kỹ thuật, chia implementation task hoặc sửa source code.

# Preconditions

- Có yêu cầu nguồn và xác định được authority phê duyệt.
- Đã biết vị trí SDD/status hiện tại nếu project đã áp dụng SDD.

# Required Inputs

- Yêu cầu của user/business, constraint, artifact liên quan và câu trả lời cho open question đã có.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, rule liên quan và SDD artifact hiện có.

# Workflow

1. Thu thập và chuẩn hóa requirement mà không thay đổi ý nghĩa.
2. Gán Requirement ID duy nhất.
3. Xác định actor, trigger, precondition, outcome và boundary.
4. Viết Acceptance Criteria cụ thể, quan sát và kiểm thử được.
5. Ghi dependency, assumption được xác nhận và traceability.
6. Tách requirement khỏi implementation decision.
7. Liệt kê ambiguity, missing information và contradiction.
8. Thực hiện Specification Verification.

# Required Outputs

- Requirement có ID, Acceptance Criteria, dependency, open question, contradiction và traceability.

# Verification

- Kiểm tra mỗi requirement đều cần thiết, không mơ hồ, nhất quán và có Acceptance Criteria kiểm thử được.
- Không coi assumption chưa được phê duyệt là requirement.

# Gate

- `Specification = APPROVED` chỉ khi không còn contradiction blocking và authority phù hợp đã phê duyệt.

# Prohibited Actions

- Không implement code, tạo technical implementation sớm, tự tạo requirement hoặc chuyển sang Planning khi Specification là `BLOCKED`.

# Reporting Format

- Tóm tắt scope; bảng Requirement/Acceptance Criteria; dependency; open question; contradiction; traceability; verification evidence; gate status.
