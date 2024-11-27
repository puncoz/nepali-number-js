import { describe, expect, it } from "vitest"

import NepaliNumber from "@/NepaliNumber"

describe("NepaliNumber", () => {
  it("should add two numbers", () => {
    const nepaliNumber = new NepaliNumber()
    expect(nepaliNumber.add(1, 2)).toBe(3)
  })
})
