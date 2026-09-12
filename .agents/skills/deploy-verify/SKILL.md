---
name: deploy-verify
description: "Thực hiện pre-deployment, deployment và post-deployment verification có rollback evidence. Dùng khi build đã verify và deployment được cho phép; không dùng để deploy code chưa đạt gate."
---

# Purpose

Triển khai và xác minh vận hành theo artifact đã phê duyệt, với health evidence và rollback readiness rõ ràng.

# When to Use

- Khi cần verify deployment workflow hoặc thực hiện deployment đã được user cho phép rõ.

# When NOT to Use

- Không dùng khi implementation/verification gate chưa đạt, chưa có deployment artifact hoặc chưa được phép thực hiện external mutation.

# Preconditions

- Application implementation đã đạt required independent verification gate.
- Có approved deployment detail, target environment, artifact identity, health/smoke criteria và rollback plan.
- Có explicit user authorization ngay trước bước deployment thay đổi external state.

# Required Inputs

- Verified build evidence, deployment/runbook artifact, environment configuration source, monitoring access và rollback procedure.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, Security/Testing/Architecture rules và approved project deployment artifacts.

# Workflow

1. Xác nhận pre-deployment gate, artifact identity, configuration và secret handling.
2. Build hoặc lấy đúng artifact theo workflow đã phê duyệt và verify integrity.
3. Dừng để lấy approval nếu external deployment chưa được authorize.
4. Deploy bằng mechanism đã được phê duyệt.
5. Chạy health check và smoke test.
6. Kiểm tra log/metric trong observation window được artifact quy định.
7. Xác nhận rollback readiness; rollback khi trigger đã định nghĩa xảy ra và quyền cho phép.
8. Ghi deployment evidence và final status.

# Required Outputs

- Artifact/version, environment, approvals, command/action result, health/smoke evidence, log/metric observation, rollback readiness và status.

# Verification

- Không kết luận thành công chỉ từ deploy command; health, smoke và required observation phải đạt.
- Secret không được xuất hiện trong output hoặc evidence.

# Gate

- `PASS` khi deployment và toàn bộ post-deployment check bắt buộc đạt.
- `FAIL` khi deployment/health/smoke không đạt; `BLOCKED` khi thiếu approval, prerequisite, access hoặc artifact.

# Prohibited Actions

- Không hard-code infrastructure cụ thể vào Skill, deploy build chưa verify, expose secret, bypass security control hoặc thay đổi business behavior.

# Reporting Format

- Pre-check/gate; target/artifact; approval; deployment result; health/smoke; logs/metrics; rollback readiness/action; verdict; remaining issue.
