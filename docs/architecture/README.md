# Architecture

How the package is put together: source layout, the direction of dependencies between
domains, and how the source becomes the files on npm.

> **Living snapshots.** Edit in place so each file describes the package as it is right now. No
> revision tables, no "previously X, now Y" — delete what is no longer true
> ([ADR-0002](../adr/ADR-0002-living-design-documentation.md)).

## Conventions

- `system.md` is the primary document: modules, layering, rules for new code.
- `build-and-distribution.md` covers tsdown, output formats, `package.json` entry points and
  how each consumer environment resolves them.
- A change that adds a domain, adds a cross-domain import, or changes the build or `exports`
  map updates these in the same change.

**Template:** [`../_templates/architecture.md`](../_templates/architecture.md)

## Documents

| Document | Status | ADR |
|---|---|---|
| [System](system.md) | Current | [ADR-0009](../adr/ADR-0009-package-invariants.md) |
| [Build and distribution](build-and-distribution.md) | Current | [ADR-0009](../adr/ADR-0009-package-invariants.md) |
