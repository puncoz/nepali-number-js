# API reference

- **Status:** Current
- **Last updated:** 2026-10-30
- **Related ADRs:** [ADR-0008](../adr/ADR-0008-public-api-changes-ship-their-reference.md), [ADR-0009](../adr/ADR-0009-package-invariants.md)
- **Package version:** 2.0.0

> **Living snapshots.** Edit in place so each file describes the package as it is right now.
> No revision tables, no "previously X, now Y" — delete what is no longer true
> ([ADR-0002](../adr/ADR-0002-living-design-documentation.md)). Every output on these pages was
> produced by running the built package.

Every export is a named, pure function, imported from the package root:

```ts
import { toNepali, formatNepaliNumber, toNepaliWords } from "nepali-number"
```

There is no default export and no sub-path import. In the browser builds the same functions
hang off the global `nepaliNumber` ([getting started](../guides/getting-started.md)).

## All exports

| Domain | Export | Signature | Example |
|---|---|---|---|
| [Conversion](conversion.md) | [`toNepali`](conversion.md#tonepaliinput) | `(input: string \| number) => string` | `123` → `"१२३"` |
| | [`toEnglish`](conversion.md#toenglishinput) | `(input: string \| number) => string` | `"१२३"` → `"123"` |
| | [`parseNepaliNumber`](conversion.md#parsenepalinumbernepalinumber) | `(nepaliNumber: string) => number` | `"१२,३४५.६७"` → `12345.67` |
| | [`convert`](conversion.md#converttext-tonepalinumber) | `(text: string, toNepaliNumber?: boolean) => string` | `"Age 25"` → `"Age २५"` |
| [Formatting](formatting.md) | [`formatNepaliNumber`](formatting.md#formatnepalinumbernumber-options) | `(number: number \| string, options?: FormatOptions) => string` | `1234567` → `"१२,३४,५६७"` |
| | [`addNepaliCommas`](formatting.md#addnepalicommasnumber) | `(number: string \| number) => string` | `1234567` → `"12,34,567"` |
| | [`removeFormatting`](formatting.md#removeformattingformattedstring) | `(formattedString: string \| number) => number` | `"रू १२,३४,५६७.८९"` → `1234567.89` |
| [Words](words.md) | [`toNepaliWords`](words.md#tonepaliwordsnumber) | `(number: number \| string) => string` | `123` → `"एक सय तेईस"` |
| | [`toEnglishWords`](words.md#toenglishwordsnumber) | `(number: number \| string) => string` | `123` → `"one hundred twenty three"` |
| | [`toNepaliOrdinal`](words.md#tonepaliordinalnumber) | `(number: number \| string) => string` | `1` → `"पहिलो"` |
| | [`toDecimalWord`](words.md#todecimalwordnumber) | `(number: number \| string) => string` | `1200000` → `"१२ लाख"` |
| [Currency](currency.md) | [`toNepaliCurrency`](currency.md#tonepalicurrencyamount-options) | `(amount: number \| string, options?: CurrencyOptions) => string` | `1234567.89` → `"रू १२,३४,५६७.८९"` |
| | [`toNepaliCurrencyWords`](currency.md#tonepalicurrencywordsamount) | `(amount: number \| string) => string` | `250` → `"दुई सय पचास रुपैयाँ"` |
| [Utils](utils.md) | [`normalize`](utils.md#normalizeinput) | `(input: string) => string` | `"  १२३  ४५६  "` → `"१२३४५६"` |
| | [`detectNumberSystem`](utils.md#detectnumbersysteminput) | `(input: string) => NumberSystem \| number` | `"12३४"` → `"mixed"` |
| | [`validateNepaliNumber`](utils.md#validatenepalinumberinput) | `(input: string) => boolean` | `"१२३.४५"` → `true` |
| | [`isNepaliDigit`](utils.md#isnepalidigitchar) | `(char: string) => boolean` | `"५"` → `true` |
| | [`isEnglishDigit`](utils.md#isenglishdigitchar) | `(char: string) => boolean` | `"5"` → `true` |
| | [`isMixedNumber`](utils.md#ismixednumberinput) | `(input: string) => boolean` | `"12३४"` → `true` |
| | [`padZeros`](utils.md#padzerosnumber-length) | `(number: number \| string, length: number) => string` | `(42, 5)` → `"०००४२"` |
| | [`roundNepali`](utils.md#roundnepalinumber-decimals) | `(number: number \| string, decimals?: number) => string` | `3.14159` → `"३.१४"` |

Types: [`FormatOptions`, `CurrencyOptions`, `NumberSystem`](types.md) — defined, but **not yet
importable** from the package.

## Behaviour that holds across the API

- **Both digit systems are accepted everywhere** a number is read: `"123"`, `"१२३"` and mixed
  `"12३"` are the same number.
- **Invalid input never throws** (for the declared parameter types). Each function documents
  its safe default — usually `0`, `"०"`, `"शून्य"`, `""` or `false`.
- **Grouping is Nepali/Indian**: the last three digits, then pairs — `1,23,45,678`.
- **Scales** used by words and abbreviations, from `src/constants.ts`:

  | Value | Nepali | English label | Ordinal |
  |---|---|---|---|
  | 10² | सय | hundred | सयौं |
  | 10³ | हजार | thousand | हजारौं |
  | 10⁵ | लाख | lakh | लाखौं |
  | 10⁷ | करोड | crore | करोडौं |
  | 10⁹ | अर्ब | arab | अरबौं |
  | 10¹¹ | खर्ब | kharab | खरबौं |
  | 10¹³ | नील | neel | नीलौं |
  | 10¹⁵ | पद्म | padma | पदमौं |
  | 10¹⁷ | शंख | shankh | शंखौं |
  | 10¹⁹ | महाशंख | maha-shankh | महाशंखौं |

- **Numbers are JavaScript `number`s.** Values beyond `Number.MAX_SAFE_INTEGER`
  (9 007 199 254 740 991) lose precision, and decimals follow binary floating point.

Read [**limitations**](limitations.md) before relying on edge-case behaviour.

## Conventions for this directory

- One page per domain, matching `src/<domain>/`, written from
  [`../_templates/api.md`](../_templates/api.md).
- Each export: signature exactly as in `dist/nepali-number.d.ts`, parameter table with defaults,
  return value and safe default, and examples covering typical, Nepali digits, zero, negative,
  decimal, ≥ 1 crore and invalid input.
- Outputs are copied from a run of the built package, never typed from expectation.
- Surprising behaviour links to its entry in [`limitations.md`](limitations.md).
