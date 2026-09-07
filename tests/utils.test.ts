import {describe, expect, it} from "vitest"
import {
  DocuSealError,
  DocuSealEventType,
  buildFormUrl,
  isValidDocuSealUrl,
} from "../src/lib/index.js"

describe("isValidDocuSealUrl", () => {
  it.each([
    "https://docuseal.com/s/abc",
    "https://docuseal.co/s/abc",
    "https://docuseal.eu/s/abc",
    "https://app.docuseal.com/d/abc",
    "https://app.docuseal.eu/d/abc",
  ])("accepts %s", (url) => {
    expect(isValidDocuSealUrl(url)).toBe(true)
  })

  it("rejects a url that is not a url at all", () => {
    expect(isValidDocuSealUrl("not a url")).toBe(false)
  })

  it("rejects an unrelated host", () => {
    expect(isValidDocuSealUrl("https://example.com/s/abc")).toBe(false)
  })

  it("rejects a lookalike host that merely contains the docuseal domain", () => {
    expect(isValidDocuSealUrl("https://docuseal.com.attacker.test/s/abc")).toBe(
      false,
    )
  })
})

describe("buildFormUrl", () => {
  it("returns the base url unchanged when no params are given", () => {
    expect(buildFormUrl("https://docuseal.com/s/abc")).toBe(
      "https://docuseal.com/s/abc",
    )
  })

  it("appends the params it is given as query string values", () => {
    const url = new URL(
      buildFormUrl("https://docuseal.com/s/abc", {
        email: "ada@example.com",
        name: "Ada",
      }),
    )

    expect(url.searchParams.get("email")).toBe("ada@example.com")
    expect(url.searchParams.get("name")).toBe("Ada")
  })

  it("skips params that are undefined", () => {
    const url = new URL(
      buildFormUrl("https://docuseal.com/s/abc", {email: undefined}),
    )

    expect(url.searchParams.has("email")).toBe(false)
  })

  it("overwrites a query param that is already present on the base url", () => {
    const url = new URL(
      buildFormUrl("https://docuseal.com/s/abc?email=old@example.com", {
        email: "new@example.com",
      }),
    )

    expect(url.searchParams.getAll("email")).toEqual(["new@example.com"])
  })
})

describe("DocuSealError", () => {
  it("carries the code and details alongside the message", () => {
    const cause = new Error("network down")
    const error = new DocuSealError("boom", "SCRIPT_LOAD_ERROR", cause)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe("DocuSealError")
    expect(error.message).toBe("boom")
    expect(error.code).toBe("SCRIPT_LOAD_ERROR")
    expect(error.details).toBe(cause)
  })
})

describe("DocuSealEventType", () => {
  it("exposes the embed event names", () => {
    expect(DocuSealEventType.COMPLETED).toBe("completed")
    expect(DocuSealEventType.DECLINED).toBe("declined")
  })
})
