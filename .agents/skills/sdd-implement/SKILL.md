---
name: sdd-implement
description: "Implement chính xác một SDD task đã được phê duyệt và chạy verification phù hợp. Dùng cho implementation; không dùng cho Specification, Planning, nhiều task cùng lúc hoặc independent acceptance."
---

# Purpose

Implement chính xác một approved SDD task, bảo toàn contract và thay đổi ngoài scope của user.

# When to Use

- Khi một current task đã qua Task Verification và được phép implement.

# When NOT to Use

- Không dùng để tạo Specification/Planning/task, thực hiện future task hoặc tự làm independent acceptance verification.

# Preconditions

- Specification và Planning đã `APPROVED`.
- Current task có `Task Verification = PASS`; dependency của task đã hoàn thành.

# Required Inputs

- Current task, linked Requirement/Acceptance Criteria, approved Plan, linked test definition và SDD status.

# Mandatory Reading

```text
AGENTS.md
    ↓
docs/ai/RULES_INDEX.md
    ↓
Relevant engineering rules
    ↓
SDD status và current TASK
    ↓
Linked REQ + AC
    ↓
Approved Plan
    ↓
Linked TEST definition
    ↓
Existing implementation
```

# Workflow

1. Kiểm tra dependency và working tree; bảo toàn unrelated user change.
2. Xác nhận scope/out-of-scope và contract của đúng một task.
3. Inspect implementation và test hiện có trước khi sửa.
4. Implement thay đổi tối thiểu đáp ứng Acceptance Criteria.
5. Thêm hoặc cập nhật required test.
6. Chạy lint, typecheck, test, build và security/static check áp dụng được theo command thật của repository.
7. Ghi file changed, evidence và issue còn lại; handoff cho independent verification.

# Required Outputs

- Implementation và test đúng scope; verification evidence; danh sách file; handoff rõ ràng.

# Verification

- Mọi implementer-run check bắt buộc phải PASS; failure không liên quan phải được phân biệt bằng evidence.
- Implementation completion không tự động làm overall task PASS.

# Gate

- `Implementation = PASS` chỉ khi code/test trong scope hoàn tất và check của implementer đạt; task vẫn `IN PROGRESS` cho đến independent verification.

# Prohibited Actions

- Không implement nhiều task, future task, refactor ngoài scope, thay approved contract thiếu blocking reason, xóa user change hoặc sửa expected test để tạo PASS giả.

# Reporting Format

- Task/requirement mapping; summary; files changed; commands/results; implementation gate; remaining issue; handoff cho `sdd-verify`.
