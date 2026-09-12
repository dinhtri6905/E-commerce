---
name: security-review
description: "Thực hiện security review có cấu trúc cho auth, ownership, input, output, secret, injection và logging. Dùng cho security assessment; không dùng để remediate nếu chưa được yêu cầu rõ."
---

# Purpose

Phát hiện security finding có evidence và đánh giá regression/risk mà không làm suy yếu control hiện có.

# When to Use

- Khi task yêu cầu security review hoặc thay đổi chạm trust boundary, authentication, authorization hay sensitive data.

# When NOT to Use

- Không tự kích hoạt remediation, penetration action ngoài scope hoặc thay general code review.

# Preconditions

- Có scope được phép, implementation/diff và expected security behavior.

# Required Inputs

- Requirement/Acceptance Criteria, architecture/data flow, diff, test, configuration an toàn để inspect và threat context liên quan.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, `docs/ai/SECURITY_RULES.md` và rule của layer bị ảnh hưởng.

# Workflow

1. Xác định asset, actor, trust boundary và entry point trong scope.
2. Kiểm tra Authentication, Authorization, Ownership, Input Validation và Output exposure.
3. Kiểm tra Secret, Injection, Error leakage, Sensitive logging và Unsafe default.
4. Đánh giá dependency/security impact khi áp dụng.
5. Xác minh finding bằng code path, test hoặc reproduction an toàn.
6. Phân loại severity nhất quán và đề xuất correction tối thiểu.

# Required Outputs

- Finding có severity, location, evidence, exploit/impact condition, recommended correction và residual risk.

# Verification

- Mỗi finding phải có evidence; kết luận PASS yêu cầu mọi security check bắt buộc đạt.
- Negative/authorization test phải được đánh giá khi áp dụng.

# Gate

- `PASS`, `FAIL` hoặc `BLOCKED` với lý do và evidence rõ ràng.

# Prohibited Actions

- Không expose secret, thực hiện destructive/external exploit ngoài quyền, làm yếu security control hoặc sửa implementation khi chưa được yêu cầu remediation.

# Reporting Format

- Scope/threat boundary; findings theo severity; verification evidence; residual risk; verdict.
