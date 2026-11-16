import { describe, expect, test } from "bun:test"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"

// Which files the repository carries for GitHub is decided in ADR-0019.
const FORMS_DIR = ".github/ISSUE_TEMPLATE"
const FORMS_CONFIG = "config.yml"
const REQUIRED_FILES = [
  "LICENSE",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "SUPPORT.md",
  "CITATION.cff",
  ".github/CODEOWNERS",
  ".github/FUNDING.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/dependabot.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/release.yml",
  `${FORMS_DIR}/${FORMS_CONFIG}`,
  `${FORMS_DIR}/bug.yml`,
  `${FORMS_DIR}/language.yml`,
  `${FORMS_DIR}/proposal.yml`,
  `${FORMS_DIR}/docs.yml`,
]
const LINKED_FILES = ["README.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "SUPPORT.md"]
const ADDRESSED_FILES = ["README.md", "package.json", ...REQUIRED_FILES]
const OLD_ADDRESS = "puncoz-official/nepali-number-js"

const repositoryRoot = resolve(import.meta.dir, "..")

const isYaml = (file: string): boolean => /\.(yml|cff)$/.test(file)

const parseYaml = (text: string): unknown => {
  try {
    return Bun.YAML.parse(text)
  } catch {
    return undefined
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const hasText = (value: unknown): boolean => typeof value === "string" && value.trim() !== ""

const relativeLinks = (markdown: string): string[] => {
  // The target may not hold "(": each match then ends at the next bracket, so the scan stays linear.
  const targets = Array.from(markdown.matchAll(/\]\(([^()\s]+)\)/g), (match) => match[1] ?? "")

  return targets
    .filter((target) => !/^(https?:|mailto:|#)/.test(target))
    .map((target) => target.split("#")[0] ?? "")
}

const checkCommunityFiles = (root: string): string[] => {
  const problems: string[] = []
  const formsPath = join(root, FORMS_DIR)
  const forms = existsSync(formsPath)
    ? readdirSync(formsPath).filter((name) => name.endsWith(".yml") && name !== FORMS_CONFIG)
    : []
  const yamlFiles = new Set([
    ...REQUIRED_FILES.filter(isYaml),
    ...forms.map((name) => `${FORMS_DIR}/${name}`),
  ])

  for (const file of REQUIRED_FILES) {
    if (!existsSync(join(root, file))) {
      problems.push(`${file} is missing`)
    }
  }

  for (const file of yamlFiles) {
    if (!existsSync(join(root, file))) {
      continue
    }

    const parsed = parseYaml(readFileSync(join(root, file), "utf8"))

    if (!isRecord(parsed)) {
      problems.push(`${file} does not parse as a YAML mapping`)
      continue
    }

    if (!file.startsWith(`${FORMS_DIR}/`) || file.endsWith(`/${FORMS_CONFIG}`)) {
      continue
    }

    if (!hasText(parsed["name"]) || !hasText(parsed["description"])) {
      problems.push(`${file} has no name or description`)
    }

    if (!Array.isArray(parsed["body"]) || parsed["body"].length === 0) {
      problems.push(`${file} has no body`)
    }
  }

  for (const file of LINKED_FILES) {
    if (!existsSync(join(root, file))) {
      continue
    }

    for (const target of relativeLinks(readFileSync(join(root, file), "utf8"))) {
      if (!existsSync(join(root, dirname(file), target))) {
        problems.push(`${file} links to ${target}, which does not exist`)
      }
    }
  }

  for (const file of ADDRESSED_FILES) {
    if (existsSync(join(root, file)) && readFileSync(join(root, file), "utf8").includes(OLD_ADDRESS)) {
      problems.push(`${file} names the repository's old address`)
    }
  }

  return problems
}

const FORM = "name: Sample\ndescription: A sample form.\nbody:\n  - type: textarea\n    id: what\n    attributes:\n      label: What\n"

const makeFixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), "community-files-"))

  for (const file of REQUIRED_FILES) {
    const text = file.startsWith(`${FORMS_DIR}/`) ? FORM : isYaml(file) ? "key: value\n" : "Text.\n"
    mkdirSync(dirname(join(root, file)), { recursive: true })
    writeFileSync(join(root, file), text)
  }

  writeFileSync(join(root, "README.md"), "Read [the guide](CONTRIBUTING.md#set-up).\n")
  writeFileSync(join(root, "package.json"), "{}\n")

  return root
}

const withFixture = (breakIt: (root: string) => void): string[] => {
  const root = makeFixture()

  try {
    breakIt(root)

    return checkCommunityFiles(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

describe("the repository's files for GitHub (ADR-0019)", () => {
  test("the repository passes every check", () => {
    expect(checkCommunityFiles(repositoryRoot)).toEqual([])
  })

  test("a valid fixture passes", () => {
    expect(withFixture(() => {})).toEqual([])
  })

  test("a missing file is reported", () => {
    const problems = withFixture((root) => {
      rmSync(join(root, "SECURITY.md"))
    })

    expect(problems).toEqual(["SECURITY.md is missing"])
  })

  test("a file that is not YAML is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, ".github/dependabot.yml"), "updates: [unclosed\n")
    })

    expect(problems).toEqual([".github/dependabot.yml does not parse as a YAML mapping"])
  })

  test("a YAML file that is not a mapping is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, "CITATION.cff"), "- one\n- two\n")
    })

    expect(problems).toEqual(["CITATION.cff does not parse as a YAML mapping"])
  })

  test("a form without a name is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, FORMS_DIR, "bug.yml"), FORM.replace("name: Sample\n", ""))
    })

    expect(problems).toEqual([`${FORMS_DIR}/bug.yml has no name or description`])
  })

  test("a form without a body is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, FORMS_DIR, "extra.yml"), "name: Extra\ndescription: No body.\n")
    })

    expect(problems).toEqual([`${FORMS_DIR}/extra.yml has no body`])
  })

  test("the forms' config needs no body", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, FORMS_DIR, FORMS_CONFIG), "blank_issues_enabled: false\n")
    })

    expect(problems).toEqual([])
  })

  test("a link to a file that does not exist is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, "SUPPORT.md"), "See [the policy](docs/POLICY.md) or [the site](https://example.com).\n")
    })

    expect(problems).toEqual(["SUPPORT.md links to docs/POLICY.md, which does not exist"])
  })

  test("the old repository address is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, "package.json"), `{ "homepage": "https://github.com/${OLD_ADDRESS}" }\n`)
    })

    expect(problems).toEqual(["package.json names the repository's old address"])
  })

  test("a long line of brackets is read in linear time", () => {
    const started = performance.now()

    expect(relativeLinks("](".repeat(100_000))).toEqual([])
    expect(performance.now() - started).toBeLessThan(1000)
  })
})
