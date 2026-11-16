# nepali-number — working agreement

This file governs how work is done in this repository, by humans and by AI agents alike.
`CLAUDE.md` imports it, so it applies to every Claude Code session.

Read this file **before** touching anything. If a change alters how work is done here,
updating this file is part of that change.

**How it is laid out** ([ADR-0011](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0011-agents-md-keeps-the-standing-rules-and-in-house-skills-hold-the-rest.mdx)).
This file holds the rules every task needs. The depth is in this repository's own skills,
`docs/agent-skills/nepali-number-<topic>/SKILL.md`. They are part of this working agreement and
as binding as this file. **Before starting a task, check it against the table in §11 and read
every skill it names, in full.** Where a section below says **Depth:**, the skill it names holds
the rest of that section.

**The skills folder.** `.claude/skills/` and `.agents/skills/` hold a link to each
`nepali-number-*` skill. If your tool reads neither folder, or a link cannot be made, read the
`SKILL.md` files directly from `docs/agent-skills/`. A skill your tool does not list is still
read from its path in §11.

> **Status.** The working agreement is set out in ADR-0001 to ADR-0011, all **Approved** by the
> owner on 2026-11-14, and ADR-0019 and ADR-0020, approved on 2026-11-15. Where two of them disagree, the
> newer one holds.

## 1. What this project is

**`nepali-number`** is a zero-dependency TypeScript library, published to npm, for working with
numbers in Nepali (Devanagari) script: converting digits between `0-9` and `०-९`, formatting
with lakh/crore grouping, writing numbers as Nepali or English words and ordinals and reading
them back, formatting and parsing Nepali Rupee amounts, spoken fractions and multipliers,
traditional land and weight units, and finding, comparing and sorting numbers inside text.
Every number is read once into exact decimal digits, so `bigint` and long digit strings stay
exact (ADR-0012). It ships ESM, CommonJS, UMD and IIFE builds with type
declarations, so the same code runs in Node.js, Bun, Deno, bundlers and a plain `<script>` tag.

- The overview, installation and examples for consumers are in [`README.md`](README.md).
- **The documentation is published on Nepal Dev Verse**, at
  [docs.nepal-dev.com/nepali-number](https://docs.nepal-dev.com/nepali-number), and written in
  a git submodule of this repository (§8). In this file a path that starts with `user-guide/` or
  `maintainer-guide/` is relative to `docs/docs.nepal-dev.com/content/nepali-number/`. The documentation map is
  [`maintainer-guide/index.mdx`](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/index.mdx).
- The **public API** is the product. Its reference lives in [`user-guide/dev/api/`](docs/docs.nepal-dev.com/content/nepali-number/user-guide/dev/api/index.mdx);
  its known limitations in [`user-guide/dev/api/limitations.mdx`](docs/docs.nepal-dev.com/content/nepali-number/user-guide/dev/api/limitations.mdx).

**Depth:** `docs/agent-skills/nepali-number-stack-and-map/SKILL.md` holds the current state: the
version in `package.json` and on npm, what is exported, what is not yet reachable for consumers,
and the test and coverage numbers.

## 2. The ADR gate — non-negotiable

**Every feature and functional change starts with an ADR, and no implementation begins
before the repository owner approves it.** The full decision is
[ADR-0001](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0001-adr-driven-development-workflow.mdx).

### Workflow

1. **Propose.** Write the ADR from [`docs/_templates/adr.md`](docs/_templates/adr.md) with the
   next free number, `Status: Proposed`, and add its index row straight away. If the change
   touches the public API, write its reference in the same change (ADR-0008).
2. **Stop.** Do not write library code. Tell the owner the ADR, and its API reference if it has
   one, are ready for review.
3. **Revise** in place while the owner has feedback — status stays `Proposed`.
4. **On explicit approval only:** mark it `Approved`, with who and when, update the index row,
   *then* implement.
5. **Never** edit an approved ADR's Decision section. Supersede it with a new ADR and
   cross-link both files.

**Depth:** `docs/agent-skills/nepali-number-adr-workflow/SKILL.md` holds each step in full (the
file name, the index, the approval fields) and what the public API reference must show for each
affected export: signature, options and defaults, example outputs, semver impact. Read it before
writing, revising or approving an ADR, and before changing anything a consumer can observe.

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

## 3. Execution rules

- **Never commit.** No `git commit`, no `git push`, no rebase, no history rewriting, no
  branch switching, no tags. Leave every change in the working tree — the owner reviews the
  whole set and commits by hand. Reading git state (`status`, `diff`, `log`) is fine. When work
  is done, **propose** a Conventional Commit message (§5) for the owner to use.
- **Never publish.** No `npm publish`, `npm version`, `bun publish`, `npm pack` into the repo,
  `npm deprecate`, or editing `version` in `package.json`, `CHANGELOG.md` or
  `.release-please-manifest.json`. release-please writes those three in its release pull request,
  and the release workflow (`.github/workflows/release.yml`) publishes when the owner merges it
  (ADR-0020).
- **Don't stop for per-change review.** Once an ADR is approved, carry out *all* the work it
  covers, end to end. The owner reviews the finished set, not each step.
- **Keep docs in the same change.** An implementation is incomplete until `AGENTS.md`, the
  skills in `docs/agent-skills/`, `README.md`, `user-guide/dev/api/` and the other affected
  documents reflect it (§8).
- **Keep tests in the same change.** A change is not complete without tests for its happy path
  and its obvious failure paths — small changes included
  ([ADR-0007](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0007-tests-are-part-of-every-change.mdx)). A bug fix starts with a
  test that fails for the bug's reason.
- **Never edit `dist/` or `coverage/`.** Both are generated and git-ignored.
- **`sample/` is reference material** copied from another project. It is not part of this
  package, is not published (`files` is `["dist"]`), and is not edited.
- **Use the skills — they do not outrank this file.** See §12.
- **Never guess — ask.** See §4.
- **Report honestly.** If something is blocked, unverified, or skipped, say so plainly,
  including anything taken on trust because it could not be checked.

## 4. Never guess — ask

[ADR-0004](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0004-ask-never-guess.mdx). Picking something plausible and moving on
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

**Depth:**

- `docs/agent-skills/nepali-number-stack-and-map/SKILL.md`: what is installed today, concern by
  concern (language, module system, bundler, testing, dependencies, package manager, CI, release,
  linting). Read it before touching `package.json`, config, the build, CI or the release workflow.
- `docs/agent-skills/nepali-number-writing-code/SKILL.md`: the import, typing and
  domain-direction rules, and the steps for adding a new export. Read it before writing or
  changing anything under `src/`.

- **Read the installed tool, not recall.** tsdown is pre-1.0 and changes between minors;
  check `node_modules/tsdown/` and the emitted `dist/` before asserting how it behaves.

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
| Upgrade a dependency or an action | Dependabot proposes it weekly. Minor and patch need no ADR; a major version, and any `tsdown` 0.x minor, does (ADR-0019) |

Run `bun run type-check`, `bun run test` and `bun run build` before declaring work complete.

### Commit messages (proposed by agents, made by the owner)

[Conventional Commits](https://www.conventionalcommits.org). The prefix carries the semver
intent ([`maintainer-guide/release/versioning.mdx`](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/release/versioning.mdx)):

| Prefix | Bump | Use for |
|---|---|---|
| `feat:` | minor | New export or option |
| `feat!:` / `BREAKING CHANGE:` footer | major | Removed or renamed export, changed signature or default, changed output |
| `fix:` | patch | Bug fix with no change beyond the bug |
| `perf:` | patch | Faster, same output |
| `docs:` `test:` `chore:` `ci:` `refactor:` | none | Docs, tests, tooling, CI, internal restructuring with identical output |

release-please reads these prefixes to propose the next version and to write `CHANGELOG.md`
(ADR-0020), so a wrong prefix proposes a wrong release.

## 6. Package invariants

These hold for every change. Departing from one needs an ADR that says so
([ADR-0009](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0009-package-invariants.mdx)).

1. **Zero runtime dependencies.** `dependencies` and `peerDependencies` stay empty. Nothing in
   `src/` imports a third-party package.
2. **Environment-agnostic.** No `window`, `document`, `navigator`, `process`, `Buffer`, `fs`,
   `Intl`-locale assumptions or any other host global in `src/`. The same build runs in Node,
   Bun, Deno, browsers and workers. A test file is not library code and may read files.
3. **Pure and stateless.** Every export is a pure function of its arguments. No module-level
   mutable state, no side effects on import, no classes in the public API.
4. **No throwing for declared input types.** For any value of its declared parameter types a
   function returns a value; invalid content yields the safe default of its return type:
   `NaN` for a number, `""` for a string, `false` for a boolean, `[]` for an array (ADR-0012).
   `null` and `undefined` passed from JavaScript get the same default. The default is part of
   the contract and is documented in `user-guide/dev/api/`.
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

[ADR-0003](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0003-code-comment-policy.mdx). **Comments explain *why*. The code
explains *what*. If the code is self-explanatory, write no comment at all.**

- **Every branch takes a block.** `if`, `else`, `for`, `while` and `do` bodies are braced even
  for a single statement.
- **Every export carries TSDoc** — a one-line summary, `@param` for each parameter, `@returns`
  including the safe default for invalid input, and an `@example`.
- **Existing code is not rewritten to match** unless the change already touches it.

**Depth:** `docs/agent-skills/nepali-number-writing-code/SKILL.md` holds when a comment is
warranted, with an example, how short it stays, and what configuration files may say. Read it
before writing or changing anything under `src/`.

## 8. Documentation duties

[ADR-0002](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0002-living-design-documentation.mdx). [ADR-0010](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0010-documentation-lives-in-nepal-dev-verse.mdx).
The two tracks are named **User guide** and **Maintainer guide**, in the folders `user-guide/` and
`maintainer-guide/`, by the documentation site's ADR-0048; ADR-0010 still writes them *Use* and
*Maintain*, `use/` and `maintain/`.
The map of what lives where is [`maintainer-guide/index.mdx`](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/index.mdx); each directory's
`index.mdx` holds its own conventions.

### Documentation (git submodule)

`docs/docs.nepal-dev.com/` is the puncoz-packages-docs repository, where this project's documentation
is published. Before changing anything in it, read `docs/docs.nepal-dev.com/PROJECT_AGENTS.md` and follow
it. In short: edit only `docs/docs.nepal-dev.com/content/nepali-number/` and
`docs/docs.nepal-dev.com/diagrams/nepali-number/`; keep both the User guide docs (for users, versioned) and the
Maintainer guide docs (for maintainers, not versioned) current in the same change as the code; give every
diagram both a Mermaid fence and its Archify view; give every page a frontmatter `description`,
written for someone reading a search result; never commit, push or switch branches inside the
submodule; never put private content there; ask the owner when anything is unclear.

The submodule's own skills are named `nepal-dev-*` and hold that site's rules. They are not this
repository's: only the ones `PROJECT_AGENTS.md` names apply to work done from here.

### Living documents are snapshots, not changelogs

No revision tables. No "previously X, now Y". No strikethrough, no "new in v2". **What is no
longer true is deleted, not annotated.** Anyone opening the file sees the current package and
nothing else — git, the ADRs and the GitHub release notes hold the history. The one exception
is [`user-guide/dev/guides/migration-v1-to-v2.mdx`](docs/docs.nepal-dev.com/content/nepali-number/user-guide/dev/guides/migration-v1-to-v2.mdx), whose subject *is*
the difference between two versions.

**Every example output is real.** Run it against the built package before writing it down. An
example that does not match the code is a bug in the docs.

**Every diagram is Mermaid and Archify together**: a Mermaid fence inside a `<Diagram>`, with its
Archify view in the submodule's `diagrams/nepali-number/`. No binary or externally hosted images.

**Depth:** `docs/agent-skills/nepali-number-docs-duties/SKILL.md` holds the tracks and what each
folder holds, the two kinds of document, which documents a change requires before building
(*Write before building*) and the files to check before finishing (*Always check these*). Read it
before adding or editing a page in the submodule or `README.md`, and before finishing any
implementation.

## 9. Security and supply chain

[ADR-0005](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0005-security-as-a-standing-practice.mdx). This package holds no data,
makes no network calls and reads no secrets. Its risk is **what it can do inside every
application that installs it**: a compromised release, a malicious dependency, or a regular
expression that hangs a server on crafted input reaches every consumer at once.

Full documents live in [`maintainer-guide/security/`](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/security/index.mdx).

### Never guess at a security decision

Whether to add a dependency, who may publish, which CI token has which scope, whether to use
npm provenance — **the owner decides, and it is recorded** (§4).

**Depth:** `docs/agent-skills/nepali-number-security-check/SKILL.md` holds the per-change check
(dependencies, regular expressions, input parsing, `package.json`, workflows, logging) and the
full audit that runs before each release. Read it before a change touches any of those.

### Principles that hold regardless of tooling

- **No secret is ever a string literal** — not in source, config, workflows, comments or tests.
  CI secrets live in GitHub repository secrets, listed in
  [`maintainer-guide/security/secrets.mdx`](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/security/secrets.mdx).
- **The published tarball contains only what consumers need.**
- **Nothing runs on install.** The package never has lifecycle scripts that execute on a
  consumer's machine.
- **Library code has no I/O** — no network, filesystem, environment or global access (§6).

## 10. Repository map

```
.
├── AGENTS.md, CLAUDE.md   # this working agreement; CLAUDE.md imports it
├── README.md, LICENSE     # consumer-facing overview (npm shows it); MIT
├── CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, SUPPORT.md, CITATION.cff
│                          # for people on GitHub; they add no rule (ADR-0019)
├── docs/
│   ├── agent-skills/      # this repository's own skills, nepali-number-* (ADR-0011)
│   ├── _templates/        # a starting point for each document type
│   └── docs.nepal-dev.com/  # git submodule: the documentation site (§8)
├── .claude/skills/, .agents/skills/   # links into docs/agent-skills/
├── src/                   # nepali-number.ts (the only build entry), constants.ts, one folder per domain
├── .github/               # issue forms, PR template, CODEOWNERS, FUNDING.yml, dependabot.yml;
│                          # workflows/: ci.yml, release.yml, codeql.yml (ADR-0019)
├── package.json, tsconfig.json, tsdown.config.ts, bunfig.toml
├── release-please-config.json, .release-please-manifest.json, .bun-version   # release and CI (ADR-0020)
├── dist/, coverage/       # generated, git-ignored, never edited
└── sample/                # reference material from another project — not part of the package
```

**Depth:** `docs/agent-skills/nepali-number-stack-and-map/SKILL.md` holds the full map, file by
file, and what each domain folder holds.

## 11. Quick checklist

**Check the task against every row. Read each skill a row names, in full, before the work it
covers.** The rows are binding (ADR-0011). The skills are in `docs/agent-skills/<name>/SKILL.md`.

| Before you… | Read |
|---|---|
| propose, write, revise or approve an ADR, or change anything a consumer can observe | `nepali-number-adr-workflow` |
| look for where something lives, or touch `package.json`, config, the build, CI or the release workflow | `nepali-number-stack-and-map` |
| write or change anything under `src/`, tests included | `nepali-number-writing-code` |
| add or edit a page in the submodule or `README.md`, or finish any implementation | `nepali-number-docs-duties` |
| touch a dependency, a regular expression, input parsing, `package.json`, a workflow or logging | `nepali-number-security-check` |

A typo or copy fix that touches none of these needs none of them. After a long conversation is
summarised, read the skill again before relying on it.

- [ ] Read `AGENTS.md`, [`maintainer-guide/index.mdx`](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/index.mdx), the relevant ADRs and the
      `user-guide/dev/api/` pages for the exports involved.
- [ ] Read every `nepali-number-*` skill the table above names for this task, in full.
- [ ] Which other skills fit this task? Load only those, and name them — process skills first (§12).
- [ ] Does this need an ADR? If yes — write it, `Status: Proposed`, index it, and stop.
- [ ] Does a consumer see a difference? Then write the `user-guide/dev/api/` change with it, with real
      example outputs and the semver impact.
- [ ] Any undetermined language, rounding or naming decision? Ask with options and a
      recommendation (§4).
- [ ] ADR approved by the owner? Only then write code.
- [ ] Package invariants respected (§6)?
- [ ] Complete the whole approved scope in one pass.
- [ ] TSDoc on every export touched; other comments only where they explain *why* (§7).
- [ ] Security: run the per-change rows that apply (§9). Any doubt → ask, never assume.
- [ ] `user-guide/dev/api/`, `README.md`, `AGENTS.md`, the skills, `maintainer-guide/adr/index.mdx`
      updated as needed; every example output checked against the build.
- [ ] Tests written or updated — happy path **and** the obvious failures (ADR-0007).
- [ ] `bun run type-check`, `bun run test` and `bun run build` pass.
- [ ] Leave everything uncommitted for the owner's review, with a proposed commit message.

## 12. Skills

[ADR-0006](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0006-agent-skills-are-advisory.mdx),
[ADR-0011](docs/docs.nepal-dev.com/content/nepali-number/maintainer-guide/adr/ADR-0011-agents-md-keeps-the-standing-rules-and-in-house-skills-hold-the-rest.mdx). Contributors here — human and AI —
may have installed **skills**: packaged workflows for brainstorming, debugging, TDD, code
review, TypeScript and more. **Use them.** Left alone, they go unused, and the same task gets a
rigorous treatment one day and an ad-hoc one the next.

They are recommendations about *method*. This file is *authority*.

### 12.1 Order of precedence

```
1. AGENTS.md, maintainer-guide/  binding   — ADRs, design documents, this working agreement,
                                             and its own nepali-number-* skills (ADR-0011)
2. Other skills                  advisory  — invoke freely; follow unless (1) says otherwise
3. Default behaviour             last      — only where neither of the above covers the situation
```

**A skill never grants permission this repository withholds:**

| No skill authorises… | Because |
|---|---|
| Writing library code before an approved ADR | §2 · ADR-0001 |
| `git commit`, `git push`, tags, rebase, or switching branches | §3 |
| `npm publish`, `npm version`, or editing the package version | §3 |
| Adding a dependency, or changing build / test / CI / release tooling | §2 · §6 |
| A documentation layout other than the User guide and the Maintainer guide and `docs/_templates/`, including a skill's own spec or plan folder | §8 · ADR-0002 · ADR-0010 |
| Changing an export's output without a semver decision | §6 · ADR-0008 |
| Explanatory *what*-comments, banners, or `=====` section headers | §7 · ADR-0003 |
| Deciding a Nepali-language, rounding or security question on the owner's behalf | §4 · §9 · ADR-0004 · ADR-0005 |
| Asserting tsdown, Bun or TypeScript behaviour from recall | §5 — check the installed tool |

An agent following a skill faithfully can produce work that looks disciplined, cites a
recognised process, and has quietly bypassed the gate this project exists around. The
violation is invisible in the diff, because the diff looks like good work.

### 12.2 Which skill, when

- **This repository's own, `nepali-number-*`.** In `docs/agent-skills/`, part of this working
  agreement, and binding. Routed in §11. The prefix is this repository's alone: no skill from
  anywhere else takes it.
- **Process skills come first** (brainstorming, systematic debugging, test-driven development,
  verification before completion). They set the approach; implementation skills (TypeScript,
  code review, documentation) carry it out.
- **Any installed skill may be used, under this file.** No third-party skills are vendored into
  this repository; doing so would be its own ADR.
- **Skills' scripts and CLI commands are proposals.** They run only when the approved ADR
  covers them or the owner says yes — especially anything that installs, publishes or writes
  outside the working tree.

### 12.3 Skills stop at the gate

```
brainstorming ──> ADR (Proposed) + user-guide/dev/api ──> OWNER APPROVES ──> implementation skills
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
