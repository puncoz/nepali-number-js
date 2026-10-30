# Guides

Task-oriented documentation for people **using** the package: how to install and import it in
each environment, common recipes, and moving from v1.

> **Living snapshots.** Edit in place so each file describes the package as it is right now. No
> revision tables, no "previously X, now Y" — delete what is no longer true
> ([ADR-0002](../adr/ADR-0002-living-design-documentation.md)). The migration guide is the one
> document whose subject is a difference between versions.

## Conventions

- One task per guide, named for what the reader wants to do.
- Every output is from a run of the built package.
- Pitfalls link to [`../api/limitations.md`](../api/limitations.md) rather than restating them.

**Template:** [`../_templates/guide.md`](../_templates/guide.md)

## Documents

| Guide | For |
|---|---|
| [Getting started](getting-started.md) | Installing and importing in Node (ESM / CJS), Bun, Deno, bundlers, TypeScript and the browser |
| [Recipes](recipes.md) | Form input, displaying amounts, prices in words, mixed-language text, framework helpers |
| [Migrating from v1 to v2](migration-v1-to-v2.md) | Replacing each v1 function with its v2 equivalent |
