# Security — <change or area>

- **Status:** Draft
- **Last updated:** YYYY-MM-DD
- **Related ADRs:** ADR-NNNN

> Snapshot of the package as it stands today. Edit in place; never record what changed.

## Surface

What is new or changed: an input parser, a regular expression, a dependency, a CI step, a
token, a publishing path.

## How it would be attacked

| Attack | How | Control | Tested by |
|---|---|---|---|
| ReDoS | Crafted long input to `<function>` | Linear-time pattern | `<test name>` |

## Residual risk

What is accepted, and why. Who accepted it (the owner, in the ADR).
