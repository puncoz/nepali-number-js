# ADR-NNNN — <short imperative title>

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Deciders:** Puncoz Nepal
- **Approved by:** —
- **Approved on:** —
- **Supersedes:** —
- **Superseded by:** —
- **Semver impact:** none / patch / minor / major (see `docs/release/versioning.md`)
- **Design documents:** `docs/api/<domain>.md` (when the public API changes, ADR-0008),
  `docs/architecture/system.md`, … (the living docs this decision creates or changes — ADR-0002)

## Context

What problem are we solving? What forces, constraints and facts about the current codebase
make this decision necessary *now*? State only what is true and verifiable — run the current
code and quote its actual output.

Link the issue or report this comes from, if there is one.

## Decision

The decision, stated plainly and in the present tense ("`toNepaliWords` accepts decimals",
"Option types are re-exported from the barrel"). Include the concrete shape of the change:
signatures, option names and defaults, file names, commands.

For anything that changes output, include a before/after table:

| Input | Today | After |
|---|---|---|
| | | |

## Options considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| A — <name> | | | Chosen / Rejected |
| B — <name> | | | Chosen / Rejected |

## Consequences

**Positive**

- …

**Negative / accepted trade-offs**

- …

**For consumers**

- What existing code keeps working, what breaks, and what they must change.

## Package invariants

Which invariants in `AGENTS.md` §6 this touches, and how it keeps them. If it departs from
one, say so explicitly. That departure is part of what the owner approves.

## Security considerations

Mandatory — never omit this section (ADR-0005). For a change with no security surface,
"None — this change adds no dependency, no regular expression on untrusted input and no CI
or publishing change" is a valid answer; an omitted section is indistinguishable from not
having thought about it.

Where there is a surface, state: what new input is parsed and how hostile input behaves, what
dependency or action is added and why it is trusted, what token or permission changes, and
what residual risk is accepted.

## Implementation notes

What actually changes in the repo once this is approved. Keep this list checkable — it is
the scope of the implementation that follows the approval.

- [ ] …
- [ ] Tests — the happy path **and** the obvious failure paths (ADR-0007): English and Nepali
      digits, empty, zero, negative, decimal, ≥ 1 crore, invalid.
- [ ] `bun run type-check`, `bun run test` and `bun run build` pass.
- [ ] Built CJS loaded with `node`; outputs match `docs/api/`.

## Docs to update on implementation

Living documents are snapshots of the package as it stands — edit them in place, never as a
log of what changed (ADR-0002). Delete anything in them that is no longer true.

- [ ] `docs/api/<domain>.md` — signature, options, example outputs
- [ ] `docs/api/limitations.md` — if a limitation is fixed or introduced
- [ ] `docs/architecture/` · `docs/guides/` · `docs/release/` · `docs/security/` — whichever the
      change requires
- [ ] `README.md` — API summary, examples
- [ ] `AGENTS.md` — <what changes, if the way we work changed>
- [ ] `docs/adr/README.md` — index row + status
- [ ] Proposed commit message: `<type>: <summary>`
