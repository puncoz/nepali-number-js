# Contributing to nepali-number

Thank you for helping. This guide is for people; [`AGENTS.md`](AGENTS.md) is the authoritative
working agreement, for people and AI agents alike. Where the two differ, `AGENTS.md` is right, and
the difference is a bug in this file.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

| You want to… | Do this |
|---|---|
| Report a function that returns the wrong thing | Open a **bug** [issue](https://github.com/nepal-dev-com/nepali-number-js/issues/new/choose) |
| Report a wrong Nepali word, spelling, ordinal or scale name | Open a **Nepali language** issue, with a source |
| Propose a new function, option or domain | Open a **proposal** issue first. It leads to an ADR |
| Report a wrong, unclear or missing documentation page | Open a **documentation** issue |
| Ask how to use the package | Start a [discussion](https://github.com/nepal-dev-com/nepali-number-js/discussions). See [`SUPPORT.md`](SUPPORT.md) |
| Fix a typo, a broken link or a bug | Open a pull request |
| Report a vulnerability | Follow [`SECURITY.md`](SECURITY.md). Never a public issue |

## The one rule that surprises people: the ADR gate

**Every feature and functional change starts with an Architecture Decision Record, and nothing is
built until the owner approves it.** A pull request with unapproved feature code will be asked to
start again from a proposal.

1. **Propose.** Open a proposal issue. Once the idea has a shape, an ADR is written among the
   [decision records](https://docs.nepal-dev.com/nepali-number/maintainer-guide/adr) from
   [`docs/_templates/adr.md`](docs/_templates/adr.md), with `Status: Proposed`. A change a consumer
   can observe also ships its
   [API reference](https://docs.nepal-dev.com/nepali-number/user-guide/latest/api), with real
   example outputs and a semver decision.
2. **Review.** The maintainer reviews it, and it is revised in place.
3. **Approve.** The maintainer marks it `Approved`.
4. **Build.** Only then is it implemented, in full.

An approved ADR's decision is never rewritten; a change of mind is a new ADR that supersedes it.

**The output of a function is the contract.** People render and compare the strings this package
returns. A changed word, spelling, space, digit, sign or rounding is a breaking change, so it needs
an ADR like any feature.

**No ADR is needed for** a bug fix that restores documented behaviour, tests, typos, comments, and
documentation of existing behaviour. Unsure? Ask in an issue. The full table is in
[`AGENTS.md` §2](AGENTS.md).

## Nepali language questions are asked, never guessed

Which spelling is correct, which form of an ordinal, what a scale is called, how an amount is
rounded: these are not settled by picking something plausible. Say what you are unsure of in the
issue or the pull request, with the output each option would produce, and name a source when you
have one ([`AGENTS.md` §4](AGENTS.md)).

## Set up

You need [Bun](https://bun.sh). Fork the repository, then:

```bash
git clone https://github.com/<your-username>/nepali-number-js.git
cd nepali-number-js
bun install

bun run type-check   # tsc --noEmit, strict
bun run test         # bun test, with coverage
bun run build        # tsdown → dist/ (ESM, CJS, UMD, IIFE, .d.ts)
bun run dev          # rebuild on change
```

The documentation is a git submodule at `docs/docs.nepal-dev.com/`. The three checks run without
it. To edit a documentation page, fetch it with `git submodule update --init`.

```
src/
├── nepali-number.ts   # public entry — re-exports every domain
├── constants.ts       # digits, words, ordinals, scales
├── conversion/        # toNepali, toEnglish, parseNepaliNumber, convert; the exact number reader
├── formatting/        # formatNepaliNumber, addNepaliCommas, formatPercent, removeFormatting
├── utils/             # normalize, detection, validation, padZeros, roundNepali
├── words/             # cardinals, ordinals, short forms, words to numbers
├── currency/          # toNepaliCurrency, currency words, parseNepaliCurrency
├── fractions/         # toNepaliFraction, toNepaliFractionWords, toNepaliMultiplier
├── units/             # land area and weight in traditional units
└── text/              # numbers inside prose, comparing and sorting
```

## Before you open a pull request

Run what CI runs:

```bash
bun run type-check
bun run test
bun run build
```

- **Tests are part of the change**: the happy path and the obvious failures. A bug fix starts with
  a test that fails for the bug's reason.
- **Documentation is part of the change.** The API reference and `README.md` describe the package
  as it stands now; every example output is copied from a run of the built package.
- **The package has no runtime dependencies, and none may be added.** A new dev dependency needs
  an ADR and the maintainer's yes.
- **Language data has one home**, `src/constants.ts`. Other code never hardcodes Devanagari.
- **Comments explain why, never what**, every branch takes braces, and every export carries TSDoc.

The rest is in [`AGENTS.md`](AGENTS.md) §6 and §7, and in
[`docs/agent-skills/nepali-number-writing-code/SKILL.md`](docs/agent-skills/nepali-number-writing-code/SKILL.md).

## Pull requests

- Branch from `main` in your fork, and keep one change to a pull request.
- Fill in the pull request template. Link the issue and the approved ADR.
- Write the title as a [Conventional Commit](https://www.conventionalcommits.org): `fix:`, `feat:`,
  `feat!:`, `docs:`, `test:`, `chore:`. The prefix decides the next version number
  ([versioning](https://docs.nepal-dev.com/nepali-number/maintainer-guide/release/versioning)).
- GitHub Actions runs the three checks on Node.js 20, 22 and 24, packs and installs the package as
  a smoke test, and scans the code with CodeQL. The checks must pass before a merge.
- **Dependency updates come from Dependabot**, once a week. Please don't send version bumps by hand.
- The maintainer merges. After a `fix:`, `feat:` or `perf:` commit reaches `main`, a bot opens a
  release pull request with the next version and the changelog; the maintainer merges that to
  publish. Please don't edit `version` in `package.json` or `CHANGELOG.md` yourself.

## Working with an AI agent

Agents are welcome, under the same rules. Point yours at [`AGENTS.md`](AGENTS.md): it tells the
agent which of this repository's skills in [`docs/agent-skills/`](docs/agent-skills) to read for a
task. Two rules matter most: an agent never commits, pushes or publishes here, and never writes
library code before an ADR is approved. You review what it wrote, and you are responsible for the
pull request.

## Licence of your contribution

By contributing you agree that your contribution is licensed under the [MIT licence](LICENSE).
