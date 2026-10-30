# API — Types

- **Status:** Current
- **Last updated:** 2026-10-30
- **Related ADRs:** [ADR-0008](../adr/ADR-0008-public-api-changes-ship-their-reference.md)
- **Source:** [`src/formatting/types.ts`](../../src/formatting/types.ts),
  [`src/currency/types.ts`](../../src/currency/types.ts),
  [`src/utils/types.ts`](../../src/utils/types.ts)

> Snapshot of the package as it stands today. Edit in place; never record what changed.

The package defines three public-facing types. **None of them is exported today**: the domain
`index.ts` files re-export only the functions, so `dist/nepali-number.d.ts` declares the types
but does not export them. `import type { FormatOptions } from "nepali-number"` fails to compile.

## Deriving them in your code

Until they are exported, derive them from the functions — this is stable across versions
because it follows the signatures:

```ts
import type { formatNepaliNumber, toNepaliCurrency, detectNumberSystem } from "nepali-number"

type FormatOptions = NonNullable<Parameters<typeof formatNepaliNumber>[1]>
type CurrencyOptions = NonNullable<Parameters<typeof toNepaliCurrency>[1]>
type NumberSystem = Extract<ReturnType<typeof detectNumberSystem>, string>
```

## `FormatOptions`

Options for [`formatNepaliNumber`](formatting.md#formatnepalinumbernumber-options).

```ts
interface FormatOptions {
  useNepaliDigits?: boolean   // default true
  addCommas?: boolean         // default true
  currency?: boolean          // accepted, currently ignored
  currencySymbol?: string     // accepted, currently ignored
  precision?: number          // default 2
  trimZero?: boolean          // default true
}
```

## `CurrencyOptions`

Options for [`toNepaliCurrency`](currency.md#tonepalicurrencyamount-options).

```ts
interface CurrencyOptions {
  useNepaliDigits?: boolean   // default true
  showPaisa?: boolean         // default true
  currencySymbol?: string     // default "रू"
  precision?: number          // default 2
}
```

## `NumberSystem`

Result of [`detectNumberSystem`](utils.md#detectnumbersysteminput) when the input contains
digits.

```ts
type NumberSystem = "english" | "nepali" | "mixed"
```
