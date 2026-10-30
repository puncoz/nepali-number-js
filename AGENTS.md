# nepali-number — working agreement

This file governs how work is done in this repository, by humans and by AI agents alike.
`CLAUDE.md` imports it, so it applies to every Claude Code session.

Read this file **before** touching anything. If a change alters how work is done here,
updating this file is part of that change.

> **Status.** The working agreement is set out in ADR-0001 to ADR-0009, all **Proposed**. Until
> the owner approves them, treat them as the intended rules: follow them, and raise any
> disagreement as a question.

## 1. What this project is

**`nepali-number`** is a zero-dependency TypeScript library, published to npm, for working with
numbers in Nepali (Devanagari) script: converting digits between `0-9` and `०-९`, formatting
with lakh/crore grouping, writing numbers as Nepali or English words and ordinals, and
formatting Nepali Rupee amounts. It ships ESM, CommonJS, UMD and IIFE builds with type
declarations, so the same code runs in Node.js, Bun, Deno, bundlers and a plain `<script>` tag.

- The overview, installation and examples for consumers are in [`README.md`](README.md). The
  documentation map is [`docs/README.md`](docs/README.md).
- The **public API** is the product. Its reference lives in [`docs/api/`](docs/api/README.md);
  its known limitations in [`docs/api/limitations.md`](docs/api/limitations.md).

**Current state:** `package.json` is at `2.0.0`, but npm's `latest` is still **1.0.3** — no
2.x has been published, and the release workflow cannot publish yet
([`docs/release/releasing.md`](docs/release/releasing.md#current-gaps)). 21 functions are exported across five domains
(conversion, formatting, words, currency, utils). The option and result types
(`FormatOptions`, `CurrencyOptions`, `NumberSystem`) exist in `src/*/types.ts` but are **not**
re-exported, so consumers cannot import them yet. 149 tests pass; `bun run type-check` and
`bun run build` are clean. Every function and line is covered except three unreachable
fallbacks in `src/words/words.ts`.

## 2. The ADR gate — non-negotiable

**Every feature and functional change starts with an ADR, and no implementation begins
before the repository owner approves it.** The full decision is
[ADR-0001](docs/adr/ADR-0001-adr-driven-development-workflow.md).

### Workflow

1. **Propose.** Copy [`docs/_templates/adr.md`](docs/_templates/adr.md) to
   `docs/adr/ADR-NNNN-kebab-title.md` using the *next free number* from
   [`docs/adr/README.md`](docs/adr/README.md). Set **`Status: Proposed`** and add the index
   row straight away, so ADRs in flight cannot collide on a number.
   **If the change touches the public API, write its reference in the same change**
   ([ADR-0008](docs/adr/ADR-0008-public-api-changes-ship-their-reference.md)): the affected
   `docs/api/<domain>.md` page, with the signature, defaults and example outputs the change
   will produce. See *Public API reference* below.
2. **Stop.** Do not write library code. Tell the owner the ADR, and its API reference if it has
   one, are ready for review.
3. **Revise** in place while the owner has feedback — status stays `Proposed`.
4. **On explicit approval only:** set `Status: Approved`, fill `Approved by: Puncoz Nepal`
   and `Approved on: <date>`, update the index row, *then* implement.
5. **Never** edit an approved ADR's Decision section. Supersede it with a new ADR and
   cross-link both files.

### Does my change need an ADR?

| Change | ADR? |
|---|---|
| New exported function, type, option or domain | **Yes** |
| Changed signature, default, or return type of an export | **Yes** |
| Changed **output** of an export — a word, spelling, spacing, digit, sign or rounding | **Yes** |
| Anything that touches Nepali language data in `src/constants.ts` | **Yes** |
| New dependency (runtime *or* dev), or a change to build / test / CI / release tooling | **Yes** |
| Changing the published shape: `exports`, `main`/`module`/`types`, output formats, global name, supported runtimes | **Yes** |
| Changing something an approved ADR already decided | **Yes — superseding ADR** |
| Departing from a package invariant (§6) | **Yes** |
| Cross-cutting conventions (layout, naming, error handling, comments) | **Yes** |
| Bug fix restoring documented behaviour, no output changes beyond the bug | No |
| Tests only, typos, comments, documentation that describes existing behaviour | No |

Unclear which side the change falls on? It needs an ADR.

### Public API reference — required with every ADR that changes the API

[ADR-0008](docs/adr/ADR-0008-public-api-changes-ship-their-reference.md). An ADR that adds or
changes anything a consumer can import or observe ships the updated `docs/api/<domain>.md`,
and the two are reviewed together. For each affected export it shows:

- **the signature** exactly as it will appear in `dist/nepali-number.d.ts`;
- **every option and default**;
- **example outputs** — typical input, English and Nepali digits, zero, negative, decimal,
  large (≥ 1 crore), and invalid input — as the code will produce them;
- **the semver impact**: patch, minor or major, and why
  ([`docs/release/versioning.md`](docs/release/versioning.md)).

Not needed for a change no consumer can observe. Unsure whether one could? Write it.
Template: [`docs/_templates/api.md`](docs/_templates/api.md).

## 3. Execution rules

- **Never commit.** No `git commit`, no `git push`, no rebase, no history rewriting, no
  branch switching, no tags. Leave every change in the working tree — the owner reviews the
  whole set and commits by hand. Reading git state (`status`, `diff`, `log`) is fine. When work
  is done, **propose** a Conventional Commit message (§5) for the owner to use.
- **Never publish.** No `npm publish`, `npm version`, `bun publish`, `npm pack` into the repo,
  `npm deprecate`, or editing `version` in `package.json`. Releases are cut by the release
  workflow (`.github/workflows/release.yml`) after the owner merges.
- **Don't stop for per-change review.** Once an ADR is approved, carry out *all* the work it
  covers, end to end. The owner reviews the finished set, not each step.
- **Keep docs in the same change.** An implementation is incomplete until `AGENTS.md`,
  `README.md`, `docs/api/` and the other affected documents reflect it (§8).
- **Keep tests in the same change.** A change is not complete without tests for its happy path
  and its obvious failure paths — small changes included
  ([ADR-0007](docs/adr/ADR-0007-tests-are-part-of-every-change.md)). A bug fix starts with a
  test that fails for the bug's reason.
- **Never edit `dist/` or `coverage/`.** Both are generated and git-ignored.
- **`sample/` is reference material** copied from another project. It is not part of this
  package, is not published (`files` is `["dist"]`), and is not edited.
- **Use the skills — they do not outrank this file.** See §12.
- **Never guess — ask.** See §4.
- **Report honestly.** If something is blocked, unverified, or skipped, say so plainly,
  including anything taken on trust because it could not be checked.

## 4. Never guess — ask

[ADR-0004](docs/adr/ADR-0004-ask-never-guess.md). Picking something plausible and moving on
is the failure mode this rule exists to stop: the assumption looks finished, gives no signal
it was made, and is found late. In a language library a plausible wrong guess — a spelling, an
ordinal form, a scale name, a rounding rule — ships to every consumer and becomes something
they depend on.

**First, decide which kind of question it is.**

| The question is… | Response |
|---|---|
| **Verifiable** — what existing code returns, a TypeScript flag, tsdown or Bun behaviour, what a config sets, what the build emits | **Go and check.** Run the function, read the source, `node_modules/tsdown/`, `node_modules/typescript/`, the built `dist/`. Never assert from memory what can be run — and don't ask the owner either. |
| **Undetermined** — Nepali spelling or grammar, which form of a word is correct, rounding or sign conventions, output format, API naming, semver classification, supported runtimes, scope | **Ask.** |

If it is unclear which it is, check first; what survives checking is a real question.

**Every question carries:**

1. The decision in one line, and why the code and the docs cannot settle it.
2. **Two to four concrete options**, each with its actual consequence — not the same idea
   reworded. For language questions, show the actual output strings each option produces.
3. **A recommendation, listed first and marked as such**, with the reason.
4. What follows from each: what gets built, what it costs, what it forecloses — including
   whether it is a breaking change for consumers.

The owner should be able to answer by picking, not by writing a specification. Ask with
selectable options where the tool allows it.

**Assumptions are never silent.** If work proceeds on an assumption, state it explicitly in
the response and write it into the ADR or design document where it shapes the design. An
assumption that lives only in the code is a guess.

**Ask at ADR time.** Most of these questions belong in the ADR's *Options considered* table,
before anything is built. If one surfaces mid-implementation: finish everything that does not
depend on the answer, then ask.

## 5. Stack and package rules

What is installed **today** (verified from `package.json`, the lockfile and the config files):

| Concern | In the repo |
|---|---|
| Language | TypeScript **5.9.3**, `strict` plus `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `isolatedDeclarations`; `@/*` → `src/*` |
| Module system | `"type": "module"`; `module: "Preserve"`, `moduleResolution: "bundler"`, `verbatimModuleSyntax` |
| Bundler | **tsdown 0.15.12** (rolldown), `tsdown.config.ts`: entry `src/nepali-number.ts`, formats ESM + CJS + IIFE + UMD, minified, `.d.ts` + `.d.cts`, global name `nepaliNumber` |
| Testing | `bun test` with coverage always on (`bunfig.toml`, text + lcov to `coverage/`); tests beside the code as `*.test.ts` |
| Runtime dependencies | **None**, and none may be added (§6) |
| Dev dependencies | `typescript`, `tsdown`, `@types/bun`, `del-cli` |
| Package manager | Bun (1.4.4 locally; CI uses `latest`); `bun.lock` is committed |
| CI | `.github/workflows/ci.yml`: type-check, test, build on Node 20 / 22 / 24; Codecov upload; pack-and-require smoke test |
| Release | `.github/workflows/release.yml`: runs `bun run release` after CI passes on `main`, `beta`, `alpha` — see [`docs/release/releasing.md`](docs/release/releasing.md) for its current gaps |
| Linting / formatting | **None installed.** Adopting one is a tooling ADR |

- **Read the installed tool, not recall.** tsdown is pre-1.0 and changes between minors;
  check `node_modules/tsdown/` and the emitted `dist/` before asserting how it behaves.
- **Use `@/` imports inside `src/`**, never relative paths across domains. Never import from
  `dist/` in source or tests.
- **Explicit return types on every export** — `isolatedDeclarations` refuses to build without
  them. Exported constants carry an explicit type annotation too.
- **No `any`, no `// @ts-ignore`, no `// @ts-expect-error` without a reason.** Index access
  returns `T | undefined`: guard it or fall back (`NEPALI_WORDS[n] || ""`), as the existing code
  does.
- **Dependencies between domains point one way**, as drawn in
  [`docs/architecture/system.md`](docs/architecture/system.md): `constants` ← `conversion` ←
  `formatting` ← `utils` ← `words` ← `currency`. A new import that points back up, or creates a
  cycle, needs an ADR.

### Adding a new export (after the ADR is approved)

1. **Pick the domain** that fits semantically. A new domain is its own ADR decision.
2. **Implement** in `src/<domain>/<domain>.ts` as an arrow function `export const name = (…): T =>`,
   with a verb-led name (`toNepaliX`, `formatX`, `parseX`, `isX`, `detectX`), an explicit return
   type, and TSDoc (§7). Language data goes in `src/constants.ts`, never inline.
3. **Options** get an interface in `src/<domain>/types.ts`; every field optional, defaults
   applied by destructuring in the function signature.
4. **Re-export.** Domain `index.ts` files use `export * from "./<domain>"`; a new domain also adds
   `export * from "@/<domain>"` to `src/nepali-number.ts`. A public type must also be
   re-exported (`export type * from "./types"`) — today's `index.ts` files do not do this, which
   is why the existing option types are unreachable for consumers.
5. **Test** in `src/<domain>/<domain>.test.ts`, importing from `"."` (§ ADR-0007 for coverage).
6. **Document** in `docs/api/<domain>.md` and the README's API summary.
7. **Verify**: `bun run type-check`, `bun run test`, `bun run build`, then load the built CJS
   file with `node` and check the new export's outputs match the docs.

### Commands

| Task | Command |
|---|---|
| Install | `bun install` (`--frozen-lockfile` in CI) |
| Type-check | `bun run type-check` |
| Test (with coverage) | `bun run test` (or `bun test`) |
| Build `dist/` | `bun run build` |
| Rebuild on change | `bun run dev` |
| Clean `dist/` and `coverage/` | `bun run clean` |
| Clean reinstall | `bun run clean:fresh` |
| Add a dependency | `bun add -d <pkg>` — **requires an approved ADR first**; runtime deps are not allowed (§6) |

Run `bun run type-check`, `bun run test` and `bun run build` before declaring work complete.

### Commit messages (proposed by agents, made by the owner)

[Conventional Commits](https://www.conventionalcommits.org). The prefix carries the semver
intent ([`docs/release/versioning.md`](docs/release/versioning.md)):

| Prefix | Bump | Use for |
|---|---|---|
| `feat:` | minor | New export or option |
| `feat!:` / `BREAKING CHANGE:` footer | major | Removed or renamed export, changed signature or default, changed output |
| `fix:` | patch | Bug fix with no change beyond the bug |
| `perf:` | patch | Faster, same output |
| `docs:` `test:` `chore:` `ci:` `refactor:` | none | Docs, tests, tooling, CI, internal restructuring with identical output |

## 6. Package invariants

These hold for every change. Departing from one needs an ADR that says so
([ADR-0009](docs/adr/ADR-0009-package-invariants.md)).

1. **Zero runtime dependencies.** `dependencies` and `peerDependencies` stay empty. Nothing in
   `src/` imports a third-party package.
2. **Environment-agnostic.** No `window`, `document`, `navigator`, `process`, `Buffer`, `fs`,
   `Intl`-locale assumptions or any other host global in `src/`. The same build runs in Node,
   Bun, Deno, browsers and workers.
3. **Pure and stateless.** Every export is a pure function of its arguments. No module-level
   mutable state, no side effects on import, no classes in the public API.
4. **No throwing for declared input types.** For any value of its declared parameter types a
   function returns a value; invalid content yields a documented safe default (`""`, `0`,
   `"०"`, `NaN`, `false`). The default is part of the contract and is documented in
   `docs/api/`.
5. **Output strings are the contract.** Consumers render and compare them. Any change to what
   an export returns for an existing input is a semver decision (ADR-0008).
6. **Language data has one home.** Digits, words, ordinals and scales live in
   `src/constants.ts`. Domain code references them; it never hardcodes Devanagari.
7. **Unicode-aware.** String logic that walks characters uses explicit Devanagari ranges
   (`[०-९]`) or `Array.from`. `\d` does not match Nepali digits; `.length` and `.slice()` count
   UTF-16 units, not characters.
8. **Small and tree-shakeable.** Named exports only, no default export, no side effects. A
   change that grows the minified build noticeably says so in its ADR.

## 7. Code style

[ADR-0003](docs/adr/ADR-0003-code-comment-policy.md). **Comments explain *why*. The code
explains *what*. If the code is self-explanatory, write no comment at all.**

A comment is warranted only when the reasoning, trade-off, edge case or constraint cannot be
recovered from the code: why a workaround exists, why this approach beat the obvious one, why a
value is hardcoded, a non-obvious language rule (an irregular ordinal, why 1–4 are exceptions),
a floating-point or Unicode constraint.

```ts
// Bad — restates what is visible
// remove commas
const cleaned = input.replace(/,/g, "")

// Good — states what the code cannot
// \d only matches ASCII digits, so Nepali input must be converted before grouping.
```

- **Prefer a reference to an ADR over prose** (`// Ordinals 1–4 are irregular — ADR-00NN.`).
- **Keep them short** — a line or two, directly above what they explain. No paragraphs, no
  banners, no `=====` section headers.
- **Confusing code is not a comment problem.** Rewrite it.
- **Every branch takes a block.** `if`, `else`, `for`, `while` and `do` bodies are braced even
  for a single statement. There is no linter yet, so this is enforced in review; the ADR that
  adopts a linter turns on `curly: ["error", "all"]`.
- **Every export carries TSDoc** — a one-line summary, `@param` for each parameter, `@returns`
  including the safe default for invalid input, and an `@example`. It is emitted into
  `dist/nepali-number.d.ts` and is what consumers read in their editor. Several exports in
  `currency`, `words` and `utils` lack it today; add it when you touch them.
- **Configuration files may describe what a key does** (`tsconfig.json`, `tsdown.config.ts`,
  `bunfig.toml`, CI workflows), still briefly, still linking the ADR that governs the value.
- **Existing code is not rewritten to match** unless the change already touches it.

## 8. Documentation duties

[ADR-0002](docs/adr/ADR-0002-living-design-documentation.md). The map of what lives where is
[`docs/README.md`](docs/README.md); each directory's `README.md` holds its own conventions.

### Two kinds of document

| Kind | Where | Rule |
|---|---|---|
| **Decisions** | `docs/adr/` | Immutable once approved. Superseded, never edited. |
| **Living documents** | `README.md` and everything else under `docs/` | Describe the package **as it stands right now**, and are edited in place. |

### Living documents are snapshots, not changelogs

No revision tables. No "previously X, now Y". No strikethrough, no "new in v2". **What is no
longer true is deleted, not annotated.** Anyone opening the file sees the current package and
nothing else — git, the ADRs and the GitHub release notes hold the history. The one exception
is [`docs/guides/migration-v1-to-v2.md`](docs/guides/migration-v1-to-v2.md), whose subject *is*
the difference between two versions.

**Every example output is real.** Run it against the built package before writing it down. An
example that does not match the code is a bug in the docs.

### Write before building

With the change's ADR, before implementation — then update during the build if the design
moves.

| Document | Directory | Required when |
|---|---|---|
| **API reference** | `docs/api/` | **Any change a consumer can observe (§2, ADR-0008)** |
| Limitations | `docs/api/limitations.md` | A limitation is found, fixed, or introduced |
| Architecture | `docs/architecture/` | A new domain, a new cross-domain import, or a change to the build, formats or `exports` map |
| Guides | `docs/guides/` | A new way to use the package, a new runtime, or a breaking change that needs a migration path |
| Versioning / releasing | `docs/release/` | The semver policy, CI, or release process changes |
| Security | `docs/security/` | The change touches the supply chain, CI secrets, publishing, or adds input handling worth its own analysis |

Judgement applies — a small change may need none of them. **If it is unclear whether one is
required, write it.** Start from [`docs/_templates/`](docs/_templates/).

**Diagrams are Mermaid** in fenced blocks. They render on GitHub and diff as text. No binary or
externally hosted images.

### Always check these

| File | Update when |
|---|---|
| `docs/api/` | An export's signature, default, output or limitation changes. An implementation is **not complete** while the reference contradicts it. |
| `README.md` | What the package does, how to install or import it, or its API summary changes. README is what npm shows. |
| `AGENTS.md` (this file) | The way work is done changes — conventions, commands, structure, rules, stack |
| `docs/adr/README.md` | An ADR is written or changes status — keep the index and the next free number accurate |

## 9. Security and supply chain

[ADR-0005](docs/adr/ADR-0005-security-as-a-standing-practice.md). This package holds no data,
makes no network calls and reads no secrets. Its risk is **what it can do inside every
application that installs it**: a compromised release, a malicious dependency, or a regular
expression that hangs a server on crafted input reaches every consumer at once.

Full documents live in [`docs/security/`](docs/security/README.md).

### Never guess at a security decision

Whether to add a dependency, who may publish, which CI token has which scope, whether to use
npm provenance — **the owner decides, and it is recorded** (§4).

### Per-change check — only the rows the change touches

| If the change… | Check |
|---|---|
| Adds or upgrades a dependency (dev included) | ADR approved · well-maintained, widely used · lockfile diff reviewed · no install scripts, or they are understood |
| Adds or changes a regular expression | No nested or overlapping quantifiers on unbounded input (ReDoS) · tested with a long hostile string (e.g. 100 000 characters) |
| Adds input parsing | Behaviour on empty, whitespace, huge, `NaN`, `Infinity`, and non-digit input is defined, tested and documented |
| Touches `package.json` `files`, `exports` or scripts | `npm pack --dry-run` lists only `dist/`, `package.json`, `README.md`, `LICENSE` · no `prepare`/`postinstall` scripts that run on consumers' machines |
| Touches CI or release workflows | Least-privilege `permissions:` · third-party actions pinned to a major or SHA · secrets never echoed · release runs only after CI passes |
| Adds logging or errors | Nothing in `src/` logs. No `console.*` in library code |

### Full audits at gates

The audit in [`docs/security/checklist.md`](docs/security/checklist.md) runs **before each
release**. Findings are reported as: what it is · where it is · how it would be exploited · the
fix.

### Principles that hold regardless of tooling

- **No secret is ever a string literal** — not in source, config, workflows, comments or tests.
  CI secrets live in GitHub repository secrets, listed in
  [`docs/security/secrets.md`](docs/security/secrets.md).
- **The published tarball contains only what consumers need.**
- **Nothing runs on install.** The package never has lifecycle scripts that execute on a
  consumer's machine.
- **Library code has no I/O** — no network, filesystem, environment or global access (§6).

## 10. Repository map

```
.
├── AGENTS.md              # this working agreement (CLAUDE.md imports it)
├── CLAUDE.md              # → @AGENTS.md
├── README.md              # consumer-facing overview — npm shows this page
├── LICENSE                # MIT
├── docs/
│   ├── README.md          # documentation map — what lives where
│   ├── _templates/        # a starting point for each document type
│   ├── adr/               # binding decisions — immutable once approved
│   ├── api/               # public API reference, one page per domain, plus limitations
│   ├── architecture/      # module layering, build and distribution
│   ├── guides/            # getting started, recipes, migration from v1
│   ├── release/           # semver policy, CI and release process
│   └── security/          # threat model, secrets, release audit checklist
├── src/
│   ├── nepali-number.ts   # public barrel — the only build entry
│   ├── constants.ts       # digits, words, ordinals, scales — all language data
│   ├── conversion/        # toNepali, toEnglish, parseNepaliNumber, convert
│   ├── formatting/        # formatNepaliNumber, addNepaliCommas, removeFormatting; FormatOptions
│   ├── words/             # toNepaliWords, toEnglishWords, toNepaliOrdinal, toDecimalWord
│   ├── currency/          # toNepaliCurrency, toNepaliCurrencyWords; CurrencyOptions
│   └── utils/             # normalize, detection, validation, padZeros, roundNepali; NumberSystem
├── .github/workflows/     # ci.yml, release.yml
├── package.json           # exports map, scripts, files: ["dist"]
├── tsconfig.json          # strict; isolatedDeclarations; @/* → src/*
├── tsdown.config.ts       # ESM + CJS + IIFE + UMD, global nepaliNumber
├── bunfig.toml            # coverage always on
├── dist/                  # generated by `bun run build` — git-ignored, never edited
└── sample/                # reference material from another project — not part of the package
```

Each domain folder holds `<domain>.ts`, `<domain>.test.ts`, `index.ts`, and `types.ts` when the
domain exports a type.

## 11. Quick checklist

- [ ] Read `AGENTS.md`, [`docs/README.md`](docs/README.md), the relevant ADRs and the
      `docs/api/` pages for the exports involved.
- [ ] Which skills fit this task? Load only those, and name them — process skills first (§12).
- [ ] Does this need an ADR? If yes — write it, `Status: Proposed`, index it, and stop.
- [ ] Does a consumer see a difference? Then write the `docs/api/` change with it, with real
      example outputs and the semver impact.
- [ ] Any undetermined language, rounding or naming decision? Ask with options and a
      recommendation (§4).
- [ ] ADR approved by the owner? Only then write code.
- [ ] Package invariants respected (§6)?
- [ ] Complete the whole approved scope in one pass.
- [ ] TSDoc on every export touched; other comments only where they explain *why* (§7).
- [ ] Security: run the per-change rows that apply (§9). Any doubt → ask, never assume.
- [ ] `docs/api/`, `README.md`, `AGENTS.md`, `docs/adr/README.md` updated as needed; every
      example output checked against the build.
- [ ] Tests written or updated — happy path **and** the obvious failures (ADR-0007).
- [ ] `bun run type-check`, `bun run test` and `bun run build` pass.
- [ ] Leave everything uncommitted for the owner's review, with a proposed commit message.

## 12. Skills

[ADR-0006](docs/adr/ADR-0006-agent-skills-are-advisory.md). Contributors here — human and AI —
may have installed **skills**: packaged workflows for brainstorming, debugging, TDD, code
review, TypeScript and more. **Use them.** Left alone, they go unused, and the same task gets a
rigorous treatment one day and an ad-hoc one the next.

They are recommendations about *method*. This file is *authority*.

### 12.1 Order of precedence

```
1. AGENTS.md and docs/   binding   — ADRs, design documents, this working agreement
2. Skills                advisory  — invoke freely; follow unless (1) says otherwise
3. Default behaviour     last      — only where neither of the above covers the situation
```

**A skill never grants permission this repository withholds:**

| No skill authorises… | Because |
|---|---|
| Writing library code before an approved ADR | §2 · ADR-0001 |
| `git commit`, `git push`, tags, rebase, or switching branches | §3 |
| `npm publish`, `npm version`, or editing the package version | §3 |
| Adding a dependency, or changing build / test / CI / release tooling | §2 · §6 |
| A documentation layout other than `docs/` and `docs/_templates/`, including a skill's own spec or plan folder | §8 · ADR-0002 |
| Changing an export's output without a semver decision | §6 · ADR-0008 |
| Explanatory *what*-comments, banners, or `=====` section headers | §7 · ADR-0003 |
| Deciding a Nepali-language, rounding or security question on the owner's behalf | §4 · §9 · ADR-0004 · ADR-0005 |
| Asserting tsdown, Bun or TypeScript behaviour from recall | §5 — check the installed tool |

An agent following a skill faithfully can produce work that looks disciplined, cites a
recognised process, and has quietly bypassed the gate this project exists around. The
violation is invisible in the diff, because the diff looks like good work.

### 12.2 Which skill, when

- **Process skills come first** (brainstorming, systematic debugging, test-driven development,
  verification before completion). They set the approach; implementation skills (TypeScript,
  code review, documentation) carry it out.
- **Any installed skill may be used, under this file.** No skills are vendored into this
  repository; doing so would be its own ADR.
- **Skills' scripts and CLI commands are proposals.** They run only when the approved ADR
  covers them or the owner says yes — especially anything that installs, publishes or writes
  outside the working tree.

### 12.3 Skills stop at the gate

```
brainstorming ──> ADR (Proposed) + docs/api ──> OWNER APPROVES ──> implementation skills
                                                       ▲
                                    nothing crosses this line without it
```

A skill whose workflow ends with "now implement" ends, here, at `Status: Proposed`. A skill
whose workflow ends with "commit" or "open a PR" ends at a proposed commit message.

### 12.4 Name the skill; report what you dropped

**Name it.** When a skill is invoked, say so, so the owner can see what method produced the
change.

**Report what you dropped.** When a rule above cuts a skill's workflow short, say which skill,
which step, and which rule overrode it.
