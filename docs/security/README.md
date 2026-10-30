# Security

How `nepali-number` keeps the applications that install it safe. Security is a property of
**every change**, not a pre-release event — see
[ADR-0005](../adr/ADR-0005-security-as-a-standing-practice.md).

> **Living snapshots.** Edit in place so each file describes the package as it is right now. No
> revision tables, no "previously X, now Y" — delete what is no longer true
> ([ADR-0002](../adr/ADR-0002-living-design-documentation.md)).

## Documents

| File | Answers |
|---|---|
| [`threat-model.md`](threat-model.md) | What could make this package harmful to its consumers, and what stops it |
| [`secrets.md`](secrets.md) | Every secret the repository's automation uses: what it is, where it lives, what it can do |
| [`checklist.md`](checklist.md) | The audit that runs before each release |
| `<change-slug>.md` | A change's own analysis, when it warrants one |

**Template:** [`../_templates/security.md`](../_templates/security.md)

## The rules that matter most

**1. Never guess at a security decision.** Adding a dependency, a token's scope, how the
package is published — the owner decides, and it is recorded
([ADR-0004](../adr/ADR-0004-ask-never-guess.md)).

**2. Zero runtime dependencies.** The package's main supply-chain control. Every consumer
trusts exactly this repository's code and nothing else
([ADR-0009](../adr/ADR-0009-package-invariants.md)).

**3. Nothing runs on install, nothing does I/O.** No lifecycle scripts for consumers; no
network, filesystem, environment or global access in `src/`.

**4. Input is hostile.** Functions are called with whatever a person typed. New regular
expressions must be linear-time and tested with a long hostile string; recursion stays bounded
by the number's magnitude; invalid input returns a safe default. Two existing patterns are
quadratic — see the [threat model](threat-model.md#measured-on-hostile-input).

## Reporting a vulnerability

Report privately to the maintainer at info@puncoz.com rather than in a public issue.
