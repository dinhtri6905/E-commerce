# AGENTS.md

## 1. Mục đích

File này là governance chung cho Codex và AI Agent khi làm việc trong repository.

Mục tiêu:

* Thực hiện đúng yêu cầu và đúng scope.
* Không tự ý mở rộng chức năng.
* Tuân thủ Spec-Driven Development (SDD).
* Đảm bảo thay đổi có thể kiểm chứng.
* Hạn chế regression và thay đổi không cần thiết.
* Luôn cung cấp evidence cho kết quả thực hiện.

---

## 2. Phạm vi áp dụng

* File này áp dụng cho toàn repository.
* `AGENTS.md` hoặc `AGENTS.override.md` ở thư mục con có thể bổ sung hoặc ghi đè rule trong phạm vi của thư mục đó.
* Không tự suy diễn yêu cầu khi đã có tài liệu được phê duyệt.
* Không thay đổi ngoài phạm vi task hiện tại nếu không cần thiết.

---

## 3. Thứ tự ưu tiên instruction

Khi có xung đột, ưu tiên theo thứ tự:

1. Yêu cầu trực tiếp hiện tại của user.
2. `AGENTS.override.md` gần file đang xử lý nhất.
3. `AGENTS.md` gần file đang xử lý nhất.
4. Root `AGENTS.md`.
5. Specification đã được phê duyệt.
6. Planning / Design đã được phê duyệt.
7. Task definition đã được phê duyệt.
8. Convention đang tồn tại trong codebase.
9. Đề xuất mới của Agent.

Không tự ý ghi đè quyết định đã được phê duyệt.

---

## 4. Quy trình SDD bắt buộc

Quy trình chuẩn:

```text
Specification
    ↓
Specification Verification
    ↓
Planning / Design
    ↓
Planning Verification
    ↓
Task Decomposition
    ↓
Task Verification
    ↓
Implementation
    ↓
Per-task Verification
    ↓
Integration Testing
    ↓
Acceptance Verification
```

Không được bỏ qua gate nếu project đã áp dụng SDD.

---

## 5. Trạng thái Gate

Sử dụng các trạng thái:

* `NOT STARTED`
* `IN PROGRESS`
* `PASS`
* `APPROVED`
* `FAIL`
* `BLOCKED`

Chỉ chuyển sang phase tiếp theo khi gate hiện tại đạt `PASS` hoặc `APPROVED`.

---

## 6. Trước khi thực hiện task

Codex phải:

1. Kiểm tra `git status`.
2. Đọc `AGENTS.md`.
3. Đọc instruction gần phạm vi file đang xử lý.
4. Đọc `docs/project/INDEX.md` và các tài liệu dự án liên quan theo thứ tự tại đó.
5. Đọc `docs/ai/RULES_INDEX.md`, sau đó chỉ đọc các engineering rule file liên quan được định tuyến tại đó.
6. Đọc `docs/sdd/index.md` và SDD status nếu các artifact này tồn tại.
7. Đọc Specification liên quan.
8. Đọc Planning/Design liên quan.
9. Đọc đầy đủ task hiện tại.
10. Đọc test definition / acceptance criteria liên quan.
11. Kiểm tra dependency của task.
12. Inspect implementation hiện tại trước khi sửa.

Không sửa file trước khi hiểu đầy đủ scope.

---

## 7. Scope Control

* Chỉ thực hiện task được yêu cầu.
* Không implement task tương lai.
* Không thêm feature ngoài Specification.
* Không refactor unrelated code.
* Không đổi architecture nếu không được yêu cầu.
* Không đổi framework, database hoặc package manager ngoài scope.
* Không sửa API contract đã approved nếu implementation vẫn khả thi.
* Không thay đổi behavior hiện có ngoài phạm vi task.

Nếu phát hiện vấn đề ngoài scope:

1. Ghi nhận vấn đề.
2. Nêu ảnh hưởng.
3. Không tự ý sửa trừ khi nó blocking task hiện tại.

---

## 8. Coding Rules

* Ưu tiên code rõ ràng, đơn giản và dễ bảo trì.
* Một function nên có một trách nhiệm chính.
* Tránh duplicate business logic.
* Không tạo abstraction không cần thiết.
* Không để dead code.
* Không để commented-out code không cần thiết.
* Không hard-code configuration có thể thay đổi.
* Tuân thủ coding convention hiện có.
* Không format toàn repository nếu task không yêu cầu.

Naming mặc định nếu project chưa quy định:

* Variable / function: `camelCase`
* Class / type: `PascalCase`
* Constant: `UPPER_SNAKE_CASE`

---

## 9. Dependency Rules

Trước khi thêm dependency:

1. Kiểm tra dependency hiện tại có đáp ứng được không.
2. Chỉ thêm package khi thật sự cần.
3. Ưu tiên package phổ biến và được maintain.
4. Không upgrade major version ngoài scope.
5. Không đổi package manager.

Không tự ý chuyển giữa `npm`, `yarn`, `pnpm` hoặc công cụ tương đương.

---

## 10. Testing Rules

Mọi feature hoặc bug fix phải có test phù hợp khi có thể.

Ưu tiên:

* Unit Test cho business logic.
* Integration Test cho interaction giữa các layer.
* API Test cho contract và validation.
* Authorization / Security Test khi có liên quan.
* Regression Test cho bug fix.
* End-to-End Test cho critical flow khi project hỗ trợ.

Không sửa expected result chỉ để làm test PASS khi implementation đang sai.

---

## 11. Requirement → Test Traceability

Mỗi requirement quan trọng phải có khả năng trace:

```text
Requirement
    ↓
Acceptance Criteria
    ↓
Design
    ↓
Task
    ↓
Test
    ↓
Implementation
```

Nếu requirement không có verification phù hợp, không được xem là hoàn thành.

---

## 12. Verification bắt buộc

Sau implementation, chạy các command phù hợp đã được định nghĩa trong repository:

* Test
* Typecheck
* Lint
* Build
* Security/static checks nếu có

Không tự đoán command.

Kiểm tra configuration hoặc `package.json` trước khi chạy.

Không báo `PASS` nếu verification bắt buộc còn fail.

---

## 13. Definition of Done

Task chỉ được xem là hoàn thành khi:

* [ ] Implementation đúng scope.
* [ ] Acceptance Criteria được đáp ứng.
* [ ] Required tests PASS.
* [ ] Typecheck PASS nếu áp dụng.
* [ ] Lint PASS nếu áp dụng.
* [ ] Build PASS nếu áp dụng.
* [ ] Không có regression đã biết.
* [ ] Không có secret bị commit.
* [ ] Documentation liên quan được cập nhật.
* [ ] Traceability được cập nhật nếu project sử dụng SDD.
* [ ] Có verification evidence.

---

## 14. Security

Không được:

* Commit password hoặc token.
* Commit API key.
* Commit private key.
* Commit cloud credential.
* Hard-code secret.
* Log password hoặc sensitive credential.
* Disable security control chỉ để test PASS.
* Bỏ validation để đơn giản implementation.

Luôn áp dụng:

* Least Privilege.
* Input Validation.
* Secure defaults.
* Private-by-default khi phù hợp.
* Không tin tưởng input từ client.

---

## 15. Git Safety

Không được tự ý:

* `git reset --hard`
* Force push.
* Rewrite history.
* Xóa branch.
* Xóa thay đổi của user.
* Revert unrelated changes.
* Commit secret.

Trước khi sửa phải kiểm tra working tree.

Giữ thay đổi nhỏ, rõ ràng và đúng scope.

---

## 16. Documentation

Documentation phải phản ánh implementation thực tế.

Khi behavior hoặc contract thay đổi, cập nhật tài liệu liên quan.

Không ghi một feature là hoàn thành nếu chưa được implement và verify.

Nếu project sử dụng SDD, ưu tiên duy trì:

* `index.md`
* `status.md`
* `traceability.md`
* Specification
* Planning
* Tasks
* Implementation Report
* Verification / Test Report

---

## 17. SDD Tracking

Sau mỗi task `PASS`, cập nhật các tracking artifact liên quan.

Tối thiểu phải phản ánh:

* Task hiện tại.
* Trạng thái.
* Requirement liên quan.
* Test/evidence liên quan.
* File đã thay đổi.
* Kết quả verification.

Không xóa evidence lịch sử chỉ để làm tài liệu ngắn hơn.

---

## 18. Báo cáo sau mỗi task

Báo cáo cuối task phải gồm:

### Summary

* Đã thực hiện gì.
* Các file chính đã thay đổi.

### Verification

* Command đã chạy.
* Test result.
* Typecheck / lint / build result.

### Status

* `PASS`, `FAIL` hoặc `BLOCKED`.

### Remaining Issues

* Vấn đề còn lại.
* Risk hoặc limitation nếu có.

Không báo `DONE` nếu vẫn còn lỗi blocking.

---

## 19. Khi gặp thông tin chưa rõ

Trước tiên kiểm tra:

1. Repository.
2. Approved Specification.
3. Approved Planning.
4. Task definition.
5. Existing conventions.

Không tự tạo requirement mới.

Nếu thiếu thông tin nhưng có thể suy ra an toàn từ artifact đã approved, sử dụng artifact đó làm source of truth.

Nếu có contradiction ảnh hưởng correctness, đánh dấu `BLOCKED` và báo rõ vấn đề.

---

## 20. Nguyên tắc cuối cùng

Codex phải ưu tiên theo thứ tự:

```text
Correctness
    ↓
Scope Compliance
    ↓
Verification
    ↓
Security
    ↓
Maintainability
    ↓
Optimization
```

Không tối ưu hoặc mở rộng hệ thống trước khi chứng minh implementation hiện tại đúng yêu cầu.
