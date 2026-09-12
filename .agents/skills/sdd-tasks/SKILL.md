---
name: sdd-tasks
description: "Chuyển Planning APPROVED thành các implementation task nhỏ, có dependency và verification rõ. Dùng cho task decomposition; không dùng để implement code hoặc thay thế Planning."
---

# Purpose

Chuyển Planning đã phê duyệt thành chuỗi implementation task có thứ tự, nhỏ và independently verifiable.

# When to Use

- Khi tạo hoặc review task decomposition sau Planning.
- Khi cần kiểm tra requirement mapping hoặc dependency giữa task.

# When NOT to Use

- Không dùng khi Planning chưa `APPROVED`, để thiết kế lại Plan hoặc để implement code.

# Preconditions

- `Specification = APPROVED` và `Planning = APPROVED`.

# Required Inputs

- Approved Specification, Acceptance Criteria, Planning, test strategy và dependency đã biết.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, approved Specification/Planning, SDD status và rule của layer liên quan.

# Workflow

1. Trace plan component về Requirement và Acceptance Criteria.
2. Xác định dependency graph và thứ tự thực hiện.
3. Chia công việc thành task nhỏ với một objective chính.
4. Với mỗi task, ghi Task ID, title, objective, requirement mapping, dependency, scope và out-of-scope.
5. Ghi expected affected module khi biết, test definition, Acceptance Criteria, verification requirement và Definition of Done.
6. Kiểm tra mỗi task có thể verify độc lập và không chứa future work ẩn.
7. Thực hiện Task Verification.

# Required Outputs

- Danh sách task có thứ tự và đầy đủ các trường bắt buộc; dependency/traceability matrix.

# Verification

- Không có task mơ hồ hoặc quá lớn như `Build backend`.
- Toàn bộ Plan được bao phủ đúng một cách rõ ràng, không duplicate ownership hoặc bỏ sót dependency.

# Gate

- `Task Verification = PASS` trước khi implementation bắt đầu.

# Prohibited Actions

- Không implement code, thêm requirement, thay đổi approved Plan hoặc gộp nhiều objective không liên quan vào một task.

# Reporting Format

- Dependency order; từng task với đầy đủ field; traceability; verification finding; gate status.
