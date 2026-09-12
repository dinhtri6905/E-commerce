---
name: test-design
description: "Thiết kế test case theo behavior trước hoặc cùng implementation. Dùng khi cần coverage và test definition; không dùng để thay đổi requirement hoặc chỉ tạo test tên chung chung."
---

# Purpose

Thiết kế test có ý nghĩa, trace được về requirement và bao phủ risk thực tế.

# When to Use

- Khi tạo test definition, bổ sung coverage cho feature hoặc thiết kế regression test cho bug fix.

# When NOT to Use

- Không dùng để thay đổi expected behavior, chọn framework chưa được phê duyệt hoặc thay independent verification.

# Preconditions

- Có behavior/requirement và Acceptance Criteria đủ rõ để xác định expected result.

# Required Inputs

- Requirement, Acceptance Criteria, design/task liên quan, implementation boundary và test tooling hiện có.

# Mandatory Reading

- `AGENTS.md`, `docs/ai/RULES_INDEX.md`, `docs/ai/TESTING_RULES.md` và rule của layer được kiểm thử.

# Workflow

1. Xác định behavior, risk và test level phù hợp.
2. Trace từng test về Requirement/Acceptance Criteria.
3. Bao phủ trường hợp áp dụng được: happy path, invalid input, boundary, not found, unauthorized, forbidden, business conflict và regression.
4. Chọn cấu trúc Arrange/Act/Assert hoặc Given/When/Then nhất quán.
5. Xác định data, boundary thật, mock tối thiểu và expected observable outcome.
6. Review khả năng false positive, false negative và over-mocking.

# Required Outputs

- Test matrix/case có tên theo behavior, precondition, input, action, expected result, level và requirement mapping.

# Verification

- Không có tên vô nghĩa như `test1`, `case2`, `works`.
- Test phải kiểm tra behavior thật, có tính xác định và không mock mất logic cần verify.

# Gate

- `Test Design = PASS` khi coverage đáp ứng Acceptance Criteria và risk áp dụng được, không còn expected-result ambiguity blocking.

# Prohibited Actions

- Không sửa requirement, tạo expected result để phù hợp code sai, over-mock hoặc cài test dependency ngoài scope.

# Reporting Format

- Coverage summary; test matrix; data/mock strategy; requirement traceability; gap/risk; gate status.
