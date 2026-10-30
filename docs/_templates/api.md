# API — <domain>

- **Status:** Current
- **Last updated:** YYYY-MM-DD
- **Related ADRs:** ADR-NNNN
- **Source:** [`src/<domain>/<domain>.ts`](../../src/<domain>/<domain>.ts)

> Snapshot of the package as it stands today. Edit in place; never record what changed.
> Every output below was produced by running the built package.

## Exports

| Export | Signature | Returns |
|---|---|---|
| `name` | `(input: string \| number) => string` | One line |

---

## `name(input, options?)`

One-sentence description of what it does.

```ts
name(input: string | number, options?: Options): string
```

| Parameter | Type | Default | Notes |
|---|---|---|---|
| `input` | `string \| number` | — | English or Nepali digits |

**Returns.** What, and the safe default for input it cannot handle.

```ts
import { name } from "nepali-number"

name(123)          // → "…"   typical
name("१२३")        // → "…"   Nepali digits
name(0)            // → "…"   zero
name(-45)          // → "…"   negative
name(12.5)         // → "…"   decimal
name(12345678)     // → "…"   ≥ 1 crore
name("abc")        // → "…"   invalid input
```

**Notes.** Edge cases, rounding, and links to [`limitations.md`](limitations.md) entries.
