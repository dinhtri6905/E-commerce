---
name: sdd-plan
description: "Chuyển Specification APPROVED thành technical Planning sẵn sàng implementation. Dùng cho architecture và design decision; không dùng khi Specification chưa APPROVED hoặc để implement code."
---

# Purpose

Chuyển Specification đã phê duyệt thành technical plan đầy đủ, khả thi và có thể verify.

# When to Use

- Khi tạo hoặc review Planning/Design từ Specification `APPROVED`.
- Khi cần quyết định architecture, boundary, contract, data flow hoặc verification strategy.

# When NOT to Use

- Không dùng để tạo requirement mới, chia task khi Plan chưa hoàn tất hoặc implement source code.

# Preconditions

- `Specification = APPROVED`.
- Không còn requirement contradiction blocking.

# Required Inputs

- Approved Specification, Acceptance Criteria, constraint kỹ thuật, architecture hiện có và repository tooling.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, approved Specification và Architecture/API/Database/Testing/Security rules áp dụng được.

# Workflow

1. Trace từng design concern về Requirement/Acceptance Criteria.
2. Kiểm tra architecture và convention hiện có.
3. Xác định module boundary, dependency direction và data flow.
4. Thiết kế data model, API contract và validation khi áp dụng.
5. Xác định error handling, security control và compatibility impact.
6. Định nghĩa testing strategy và verification command dựa trên tooling thật.
7. Ghi technical decision, alternative, trade-off, risk và mitigation.
8. Thực hiện Planning Verification.

# Required Outputs

- Plan có architecture, boundary, contract, data/security/test strategy, decision, trade-off, risk và traceability.

# Verification

- Xác nhận mọi requirement được plan bao phủ, không có feature ngoài scope và không còn design contradiction blocking.

# Gate

- `Planning = APPROVED` trước khi tạo implementation task.

# Prohibited Actions

- Không implement source code, thêm feature ngoài Specification hoặc tiếp tục khi contradiction ảnh hưởng correctness chưa được giải quyết.

# Reporting Format

- Scope; requirement mapping; proposed design; boundary/contract; security/testing; decisions/trade-offs; risks; verification; gate status.
