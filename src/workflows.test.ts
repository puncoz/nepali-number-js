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
import { join, resolve } from "node:path"

// How the workflows test, build and release is decided in ADR-0019 and ADR-0020.
const WORKFLOWS_DIR = ".github/workflows"
const PUBLISHING_WORKFLOW = "release.yml"
const RELEASE_CONFIG = "release-please-config.json"
const RELEASE_MANIFEST = ".release-please-manifest.json"
const BUN_VERSION_FILE = ".bun-version"

const repositoryRoot = resolve(import.meta.dir, "..")

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const parse = (text: string, parser: (text: string) => unknown): unknown => {
  try {
    return parser(text)
  } catch {
    return undefined
  }
}

const isPinned = (action: string): boolean => {
  const [name = "", ref = ""] = action.split("@")

  return name.includes("/") && ref.length === 40 && Array.from(ref).every((c) => "0123456789abcdef".includes(c))
}

const jobsOf = (workflow: Record<string, unknown>): Record<string, unknown>[] => {
  const jobs = workflow["jobs"]

  return isRecord(jobs) ? Object.values(jobs).filter(isRecord) : []
}

const actionsOf = (workflow: Record<string, unknown>): string[] =>
  jobsOf(workflow).flatMap((job) => {
    const steps = Array.isArray(job["steps"]) ? job["steps"].filter(isRecord) : []

    return [job, ...steps].map((holder) => holder["uses"]).filter((uses) => typeof uses === "string")
  })

const asksForIdentity = (workflow: Record<string, unknown>): boolean =>
  [workflow, ...jobsOf(workflow)].some((holder) => {
    const permissions = holder["permissions"]

    return permissions === "write-all" || (isRecord(permissions) && permissions["id-token"] === "write")
  })

const checkWorkflows = (root: string): string[] => {
  const problems: string[] = []
  const workflowsPath = join(root, WORKFLOWS_DIR)
  const files = existsSync(workflowsPath)
    ? readdirSync(workflowsPath).filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
    : []

  if (!files.includes(PUBLISHING_WORKFLOW)) {
    problems.push(`${WORKFLOWS_DIR}/${PUBLISHING_WORKFLOW} is missing`)
  }

  for (const file of files) {
    const text = readFileSync(join(workflowsPath, file), "utf8")
    const workflow = parse(text, Bun.YAML.parse)

    if (!isRecord(workflow)) {
      problems.push(`${file} does not parse as a YAML mapping`)
      continue
    }

    if (!("permissions" in workflow)) {
      problems.push(`${file} declares no permissions`)
    }

    if (text.includes("pull_request_target")) {
      problems.push(`${file} uses pull_request_target`)
    }

    for (const action of actionsOf(workflow)) {
      if (!isPinned(action)) {
        problems.push(`${file}: ${action} is not pinned to a commit`)
      }
    }

    if (file !== PUBLISHING_WORKFLOW && asksForIdentity(workflow)) {
      problems.push(`${file} asks for id-token: write`)
    }
  }

  const config = parse(readFileSync(join(root, RELEASE_CONFIG), "utf8"), JSON.parse)
  const packages = isRecord(config) ? config["packages"] : undefined

  if (!isRecord(packages) || !("." in packages)) {
    problems.push(`${RELEASE_CONFIG} does not name the root package`)
  }

  const manifest = parse(readFileSync(join(root, RELEASE_MANIFEST), "utf8"), JSON.parse)
  const released = isRecord(manifest) ? manifest["."] : undefined

  if (typeof released !== "string" || released.split(".").length !== 3) {
    problems.push(`${RELEASE_MANIFEST} holds no version for the root package`)
  }

  const bunVersion = readFileSync(join(root, BUN_VERSION_FILE), "utf8").trim().split(".")

  if (bunVersion.length !== 3 || bunVersion.some((part) => part === "" || Number.isNaN(Number(part)))) {
    problems.push(`${BUN_VERSION_FILE} does not hold an exact version`)
  }

  return problems
}

const PIN = "0123456789abcdef0123456789abcdef01234567"

const workflowText = (uses: string, jobPermissions = "contents: read"): string =>
  `name: Sample\non:\n  push:\n    branches: [main]\npermissions:\n  contents: read\njobs:\n  check:\n    runs-on: ubuntu-24.04\n    permissions:\n      ${jobPermissions}\n    steps:\n      - uses: ${uses}\n      - run: echo done\n`

const makeFixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), "workflows-"))

  mkdirSync(join(root, WORKFLOWS_DIR), { recursive: true })
  writeFileSync(join(root, WORKFLOWS_DIR, "ci.yml"), workflowText(`actions/checkout@${PIN}`))
  writeFileSync(
    join(root, WORKFLOWS_DIR, PUBLISHING_WORKFLOW),
    workflowText(`actions/checkout@${PIN}`, "id-token: write"),
  )
  writeFileSync(join(root, RELEASE_CONFIG), `{ "packages": { ".": {} } }\n`)
  writeFileSync(join(root, RELEASE_MANIFEST), `{ ".": "1.0.3" }\n`)
  writeFileSync(join(root, BUN_VERSION_FILE), "1.4.4\n")

  return root
}

const withFixture = (breakIt: (root: string) => void): string[] => {
  const root = makeFixture()

  try {
    breakIt(root)

    return checkWorkflows(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

const ci = (root: string): string => join(root, WORKFLOWS_DIR, "ci.yml")

describe("the GitHub workflows and the release files (ADR-0019, ADR-0020)", () => {
  test("the repository passes every check", () => {
    expect(checkWorkflows(repositoryRoot)).toEqual([])
  })

  test("a valid fixture passes", () => {
    expect(withFixture(() => {})).toEqual([])
  })

  test("a missing release workflow is reported", () => {
    const problems = withFixture((root) => {
      rmSync(join(root, WORKFLOWS_DIR, PUBLISHING_WORKFLOW))
    })

    expect(problems).toEqual([`${WORKFLOWS_DIR}/${PUBLISHING_WORKFLOW} is missing`])
  })

  test("a workflow that is not YAML is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(ci(root), "jobs: [unclosed\n")
    })

    expect(problems).toEqual(["ci.yml does not parse as a YAML mapping"])
  })

  test("a workflow without permissions is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(ci(root), readFileSync(ci(root), "utf8").replace("permissions:\n  contents: read\n", ""))
    })

    expect(problems).toEqual(["ci.yml declares no permissions"])
  })

  test("pull_request_target is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(ci(root), readFileSync(ci(root), "utf8").replace("  push:", "  pull_request_target:"))
    })

    expect(problems).toEqual(["ci.yml uses pull_request_target"])
  })

  test("an action pinned to a tag is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(ci(root), workflowText("actions/checkout@v7"))
    })

    expect(problems).toEqual(["ci.yml: actions/checkout@v7 is not pinned to a commit"])
  })

  test("an action pinned to a short commit is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(ci(root), workflowText(`actions/checkout@${PIN.slice(0, 7)}`))
    })

    expect(problems).toEqual([`ci.yml: actions/checkout@${PIN.slice(0, 7)} is not pinned to a commit`])
  })

  test("a called workflow pinned to a branch is reported", () => {
    const problems = withFixture((root) => {
      const called = "  call:\n    uses: octo/repo/.github/workflows/build.yml@main\n"
      writeFileSync(ci(root), readFileSync(ci(root), "utf8") + called)
    })

    expect(problems).toEqual(["ci.yml: octo/repo/.github/workflows/build.yml@main is not pinned to a commit"])
  })

  test("id-token: write outside the release workflow is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(ci(root), workflowText(`actions/checkout@${PIN}`, "id-token: write"))
    })

    expect(problems).toEqual(["ci.yml asks for id-token: write"])
  })

  test("write-all outside the release workflow is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(ci(root), readFileSync(ci(root), "utf8").replace("permissions:\n  contents: read", "permissions: write-all"))
    })

    expect(problems).toEqual(["ci.yml asks for id-token: write"])
  })

  test("a release config without the root package is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, RELEASE_CONFIG), `{ "packages": {} }\n`)
    })

    expect(problems).toEqual([`${RELEASE_CONFIG} does not name the root package`])
  })

  test("a release config that is not JSON is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, RELEASE_CONFIG), "{ packages\n")
    })

    expect(problems).toEqual([`${RELEASE_CONFIG} does not name the root package`])
  })

  test("a manifest without a version is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, RELEASE_MANIFEST), `{ ".": "next" }\n`)
    })

    expect(problems).toEqual([`${RELEASE_MANIFEST} holds no version for the root package`])
  })

  test("a Bun version that is not exact is reported", () => {
    const problems = withFixture((root) => {
      writeFileSync(join(root, BUN_VERSION_FILE), "latest\n")
    })

    expect(problems).toEqual([`${BUN_VERSION_FILE} does not hold an exact version`])
  })
})
