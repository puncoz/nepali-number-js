---
name: nepali-number-security-check
description: "Read before a change to nepali-number touches a dependency (dev included), a regular expression, input parsing, package.json files, exports or scripts, a CI or release workflow, or logging and errors, and before a release. Holds the per-change security check row by row (ReDoS, hostile input, npm pack contents, workflow permissions) and the full audit run at release gates."
---

# nepali-number-security-check

Part of this repository's working agreement (ADR-0011): as binding as `AGENTS.md`, which holds the rules every task needs. The text below is the depth of the `AGENTS.md` sections named in each heading; a `§N` in it is a section of `AGENTS.md`. Links are relative to this file; a path that starts with `user-guide/` or `maintainer-guide/` is relative to `docs/docs.nepal-dev.com/content/nepali-number/`.

## First

- The owner decides every security question: a dependency, who may publish, a token's scope, npm provenance. Never guess one.
- No secret is ever a string literal. Nothing runs on install. Library code has no I/O and never logs.
- Findings are reported as: what it is · where it is · how it would be exploited · the fix.

## Per-change check — only the rows the change touches (`AGENTS.md` §9)

| If the change… | Check |
|---|---|
| Adds a dependency (dev included), upgrades one to a new major version, or takes a `tsdown` 0.x minor | ADR approved · well-maintained, widely used · lockfile diff reviewed · no install scripts, or they are understood |
| Takes a minor or patch upgrade of a dependency or action already in use | No ADR needed (ADR-0019) · lockfile diff reviewed · no new install scripts · the owner merges by hand |
| Adds or changes a regular expression | No nested or overlapping quantifiers on unbounded input (ReDoS) · tested with a long hostile string (e.g. 100 000 characters) |
| Adds input parsing | Behaviour on empty, whitespace, huge, `NaN`, `Infinity`, and non-digit input is defined, tested and documented |
| Touches `package.json` `files`, `exports` or scripts | `npm pack --dry-run` lists only `dist/`, `package.json`, `README.md`, `LICENSE` · no `prepare`/`postinstall` scripts that run on consumers' machines |
| Touches CI or release workflows | Least-privilege `permissions:` · every action pinned to a commit SHA · no `pull_request_target` · secrets never echoed · `id-token: write` only on the `publish` job of `release.yml` · the publish step stays in `release.yml`, after the checks (ADR-0020) |
| Adds logging or errors | Nothing in `src/` logs. No `console.*` in library code |

## Full audits at gates

The audit in [`maintainer-guide/security/checklist.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/security/checklist.mdx) runs **before each
release**. Findings are reported as: what it is · where it is · how it would be exploited · the
fix.
