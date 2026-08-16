# RNF-005 — Maintainability and Quality

<!--
  What? Non-functional requirement about internal code quality.
  Why? A new contributor should be able to understand and extend the project without breaking sync/merge/encryption logic.
  Impact? Without tests or separation of concerns, a bug in auto-merge can corrupt real users' vaults.
-->

---

## Identification

| Field        | Value                       |
| ------------ | --------------------------- |
| **ID**       | RNF-005                     |
| **Name**     | Maintainability and Quality |
| **Category** | Code quality                |
| **Priority** | High                        |
| **Status**   | Planned                     |
| **Date**     | August 2026                 |

---

## Requirements

### RNF-005.1 — Test coverage

Hashing logic, three-way merge, encryption/decryption, and conflict handling require mandatory unit tests with Vitest (RH-003). Minimum code coverage: **85%** (lines/branches), enforced in CI; the build fails below the threshold.

### RNF-005.2 — Strict typing

TypeScript in `strict` mode, no implicit `any` (RT-001).

### RNF-005.3 — Separation of concerns

Sync Engine, SyncProvider, Crypto Layer, and Conflict Resolver are independent modules, individually testable.

### RNF-005.4 — Documentation before code

Every relevant functional change has its RF/RNF documented and approved before implementation (RO-003).

### RNF-005.5 — Consistent lint/format

ESLint + Prettier run in CI, with no exceptions or unformatted code on `main`.
