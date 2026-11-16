---
name: nepali-number-stack-and-map
description: "Read before looking for where something lives in nepali-number, and before touching package.json, tsconfig, tsdown, bunfig, dependencies, the build, CI or the release workflow. Holds the current state of the package (version, exports, tests), what is installed today concern by concern, and the full repository map."
---

# nepali-number-stack-and-map

Part of this repository's working agreement (ADR-0011): as binding as `AGENTS.md`, which holds the rules every task needs. The text below is the depth of the `AGENTS.md` sections named in each heading; a `§N` in it is a section of `AGENTS.md`. Links are relative to this file; a path that starts with `user-guide/` or `maintainer-guide/` is relative to `docs/docs.nepal-dev.com/content/nepali-number/`.

## First

- Read the installed tool, not recall: check `node_modules/tsdown/`, `node_modules/typescript/` and the emitted `dist/` before asserting how a tool behaves.
- No runtime dependency may be added. A new dev dependency, a major upgrade, a `tsdown` 0.x minor, or any change to build, test, CI or release tooling, needs an approved ADR.
- Never edit `dist/` or `coverage/`, and never edit `sample/`.

## Current state (`AGENTS.md` §1)

**Current state:** `package.json` is at `2.0.0`, but npm's `latest` is still **1.0.3** — no
2.x has been published. The first release pull request that release-please opens on `main`
proposes 2.0.0, and merging it publishes
([`maintainer-guide/release/releasing.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/release/releasing.mdx)). 45 functions are exported across eight domains
(conversion, formatting, words, currency, fractions, units, text, utils), with their input, option
and result types (`NumericInput`, `FormatOptions`, `CurrencyOptions`, `NumberSystem` and the rest
of `src/*/types.ts`). Every export that reads a number goes through one exact decimal reader,
`parseDecimal` in `src/conversion/decimal.ts` (ADR-0012). 313 tests pass: 13 of them check this working agreement (`src/agent-docs.test.ts`), 11 the files for GitHub (`src/community-files.test.ts`) and 15 the workflows and release files (`src/workflows.test.ts`); `bun run type-check`
and `bun run build` are clean. Every function and line is covered. The minified ESM build is
about 22.1 kB (7.5 kB gzipped).

## What is installed today (`AGENTS.md` §5)

What is installed **today** (verified from `package.json`, the lockfile and the config files):

| Concern | In the repo |
|---|---|
| Language | TypeScript **5.9.3**, `strict` plus `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `isolatedDeclarations`; `@/*` → `src/*`; `include` is `src` and `tsdown.config.ts` only (ADR-0010) |
| Module system | `"type": "module"`; `module: "Preserve"`, `moduleResolution: "bundler"`, `verbatimModuleSyntax` |
| Bundler | **tsdown 0.15.12** (rolldown), `tsdown.config.ts`: entry `src/nepali-number.ts`, formats ESM + CJS + IIFE + UMD, minified, `.d.ts` + `.d.cts`, global name `nepaliNumber` |
| Testing | `bun test` with coverage always on and the test root set to `src` (`bunfig.toml`, text + lcov to `coverage/`); tests beside the code as `*.test.ts` |
| Runtime dependencies | **None**, and none may be added (§6) |
| Dev dependencies | `typescript`, `tsdown`, `@types/bun`, `del-cli` |
| Package manager | Bun **1.4.4**, locally and in CI, from `.bun-version`; it moves by hand with `@types/bun`. `bun.lock` is committed |
| CI | `.github/workflows/ci.yml`, on pull requests and pushes to `main`: type-check, test, build on Node 20 / 22 / 24; Codecov upload; pack, install, `require` and `import` smoke test. Every action in every workflow is pinned to a commit SHA |
| Release | `.github/workflows/release.yml`, on a push to `main`: release-please keeps a release pull request with the next version and `CHANGELOG.md`; merging it tags, writes the GitHub release, and the `publish` job checks, builds and publishes to npm by trusted publishing, with no token (ADR-0020). Configured in `release-please-config.json` and `.release-please-manifest.json` — see [`maintainer-guide/release/releasing.mdx`](../../../docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/release/releasing.mdx) |
| Code scanning | `.github/workflows/codeql.yml`: CodeQL on the TypeScript and the workflows, on pull requests and pushes to `main` and weekly; actions pinned to commit SHAs (ADR-0019) |
| Dependency updates | `.github/dependabot.yml`: weekly, grouped, 7-day cooldown, for the dev dependencies and the actions. Minor and patch are approved as a class; a major version, and any `tsdown` 0.x minor, needs its own ADR (ADR-0019) |
| Linting / formatting | **None installed.** Adopting one is a tooling ADR |

## Repository map (`AGENTS.md` §10)

```
.
├── AGENTS.md              # this working agreement (CLAUDE.md imports it)
├── CLAUDE.md              # → @AGENTS.md
├── README.md              # consumer-facing overview — npm shows this page
├── LICENSE                # MIT
├── CONTRIBUTING.md        # how to contribute, for people; AGENTS.md stays the authority (ADR-0019)
├── CODE_OF_CONDUCT.md     # Contributor Covenant 2.1
├── SECURITY.md            # how to report a vulnerability: GitHub private report, then email
├── SUPPORT.md             # where a question, a bug or an idea goes
├── CITATION.cff           # GitHub's "Cite this repository"; no version field, so nothing to bump
├── docs/
│   ├── agent-skills/      # this repository's own skills, nepali-number-<topic>/SKILL.md (ADR-0011)
│   ├── _templates/        # a starting point for each document type
│   └── docs.nepal-dev.com/  # git submodule: the Nepal Dev Verse documentation site (§8)
│       ├── PROJECT_AGENTS.md         # the rules for writing documentation there
│       ├── content/nepali-number/
│       │   ├── index.mdx             # the overview
│       │   ├── user-guide/dev/       # user docs for main: getting started, guides/, api/
│       │   ├── user-guide/v2/        # user docs for the released 2.x line
│       │   └── maintainer-guide/     # adr/, architecture/, release/, security/
│       └── diagrams/nepali-number/   # each diagram's Archify view and its source
├── .claude/skills/        # a link to each skill in docs/agent-skills/, for Claude Code
├── .agents/skills/        # the same links, for tools that read that folder
├── src/
│   ├── nepali-number.ts   # public barrel — the only build entry
│   ├── constants.ts       # digits, words, ordinals, scales — all language data
│   ├── agent-docs.test.ts # checks AGENTS.md, the skills and their links (ADR-0011)
│   ├── community-files.test.ts # checks the files for GitHub exist, parse and link (ADR-0019)
│   ├── workflows.test.ts  # checks pinned actions, permissions and the release files (ADR-0020)
│   ├── conversion/        # toNepali, toEnglish, parseNepaliNumber, convert; NumericInput
│   │   └── decimal.ts     # internal: the exact decimal reader, rounding, grouping, comparing (ADR-0012)
│   ├── formatting/        # formatNepaliNumber, addNepaliCommas, formatPercent, removeFormatting
│   │   └── internal.ts    # internal: formatDecimal, shared by words and currency
│   ├── words/             # cardinals, ordinals, digit ordinals, toDecimalWord, parseNepaliWords, parseEnglishWords
│   ├── currency/          # toNepaliCurrency, currency words in Nepali and English, parseNepaliCurrency
│   ├── fractions/         # toNepaliFraction, toNepaliFractionWords, toNepaliMultiplier (ADR-0016)
│   ├── units/             # land (ropani, bigha) and weight (tola) conversion and formatting (ADR-0017)
│   ├── text/              # numbers inside prose; compareNumbers, sortNumbers (ADR-0018)
│   └── utils/             # normalize, detection, validation, padZeros, roundNepali; NumberSystem
├── .gitmodules            # the documentation submodule
├── .github/
│   ├── ISSUE_TEMPLATE/    # bug, language, proposal, docs forms; config.yml turns blank issues off
│   ├── PULL_REQUEST_TEMPLATE.md, CODEOWNERS, FUNDING.yml
│   ├── dependabot.yml     # weekly grouped updates, 7 days old at the least (ADR-0019)
│   └── workflows/         # ci.yml, release.yml, codeql.yml
├── package.json           # exports map, scripts, files: ["dist"]
├── tsconfig.json          # strict; isolatedDeclarations; @/* → src/*; includes src only
├── tsdown.config.ts       # ESM + CJS + IIFE + UMD, global nepaliNumber
├── bunfig.toml            # coverage always on; test root src
├── .bun-version           # the Bun version CI and the release install
├── release-please-config.json      # how release-please versions and writes the changelog (ADR-0020)
├── .release-please-manifest.json   # the last released version; written by release-please only
├── dist/                  # generated by `bun run build` — git-ignored, never edited
└── sample/                # reference material from another project — not part of the package
```

Each domain folder holds `<domain>.ts`, `<domain>.test.ts`, `index.ts`, and `types.ts` when the
domain exports a type. `decimal.ts` and `internal.ts` are imported by other domains by path
(`@/conversion/decimal`, `@/formatting/internal`) and are **not** re-exported from the barrel.
