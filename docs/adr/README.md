# Architecture Decision Records

Every feature and functional change starts here
([ADR-0001](ADR-0001-adr-driven-development-workflow.md)). Template:
[`../_templates/adr.md`](../_templates/adr.md).

**Next free number: 0010**

## Conventions

- File name: `ADR-NNNN-kebab-title.md`, numbered from the *next free number* above. Add the
  index row and bump the number **in the same change** that creates the file, so ADRs in flight
  cannot collide.
- Title: a short imperative statement of the decision ("Re-export the option types").
- Status: `Proposed` → `Approved` (by the owner, with name and date) → optionally
  `Superseded by ADR-NNNN`. A rejected proposal is marked `Rejected` and kept.
- An approved ADR's **Decision** is never edited. Supersede it with a new ADR and cross-link
  both.
- Every ADR states its **semver impact**, and one that changes the public API ships its
  `docs/api/` change with it ([ADR-0008](ADR-0008-public-api-changes-ship-their-reference.md)).
- The **Security considerations** section is mandatory
  ([ADR-0005](ADR-0005-security-as-a-standing-practice.md)).

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](ADR-0001-adr-driven-development-workflow.md) | Every change starts with an approved ADR | Proposed | 2026-10-30 |
| [0002](ADR-0002-living-design-documentation.md) | Documentation is a living snapshot; decisions are immutable | Proposed | 2026-10-30 |
| [0003](ADR-0003-code-comment-policy.md) | Comments explain why; every export has TSDoc; every branch takes a block | Proposed | 2026-10-30 |
| [0004](ADR-0004-ask-never-guess.md) | Resolve ambiguity by asking, never by guessing | Proposed | 2026-10-30 |
| [0005](ADR-0005-security-as-a-standing-practice.md) | Supply-chain security is a standing practice | Proposed | 2026-10-30 |
| [0006](ADR-0006-agent-skills-are-advisory.md) | Agent skills are advisory; this repository's documentation is binding | Proposed | 2026-10-30 |
| [0007](ADR-0007-tests-are-part-of-every-change.md) | Tests are part of every change, run with `bun test` | Proposed | 2026-10-30 |
| [0008](ADR-0008-public-api-changes-ship-their-reference.md) | A public API change ships its reference and a semver decision | Proposed | 2026-10-30 |
| [0009](ADR-0009-package-invariants.md) | Hold the package invariants: zero dependencies, environment-agnostic, pure, non-throwing | Proposed | 2026-10-30 |
