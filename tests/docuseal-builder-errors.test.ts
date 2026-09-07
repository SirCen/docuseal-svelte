import {render} from "@testing-library/svelte"
import {beforeEach, describe, expect, it, vi} from "vitest"
import DocuSealBuilder from "../src/lib/components/DocuSealBuilder.svelte"
import {DocuSealError} from "../src/lib/index.js"

const scriptId = "docuseal-builder-script"

const settleInitialisation = () => new Promise((resolve) => setTimeout(resolve, 0))

const failTheScriptLoad = () => {
  const script = document.getElementById(scriptId) as HTMLScriptElement
  script.onerror?.(new Event("error"))
}

beforeEach(() => {
  document.getElementById(scriptId)?.remove()
})

describe("DocuSealBuilder initialisation failures", () => {
  it("reports an invalid host instead of rejecting into nowhere", async () => {
    const onError = vi.fn()
    render(DocuSealBuilder, {token: "t", host: "not a host", onError})
    await settleInitialisation()

    expect(onError).toHaveBeenCalledOnce()
    const error = onError.mock.calls[0][0] as DocuSealError
    expect(error).toBeInstanceOf(DocuSealError)
    expect(error.code).toBe("INVALID_HOST")
  })

  it("reports a script that fails to load", async () => {
    const onError = vi.fn()
    render(DocuSealBuilder, {token: "t", onError})
    failTheScriptLoad()
    await settleInitialisation()

    expect(onError).toHaveBeenCalledOnce()
    expect((onError.mock.calls[0][0] as DocuSealError).code).toBe(
      "SCRIPT_LOAD_ERROR",
    )
  })

  it("logs the failure when no handler is supplied", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    render(DocuSealBuilder, {token: "t", host: "not a host"})
    await settleInitialisation()

    expect(consoleError).toHaveBeenCalled()
  })

  it("does not log the failure when a handler is supplied", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    render(DocuSealBuilder, {token: "t", host: "not a host", onError: vi.fn()})
    await settleInitialisation()

    expect(consoleError).not.toHaveBeenCalled()
  })

  it("does not attach event listeners when initialisation failed", async () => {
    const onSave = vi.fn()
    const {container} = render(DocuSealBuilder, {
      token: "t",
      host: "not a host",
      onSave,
      onError: vi.fn(),
    })
    await settleInitialisation()

    container
      .querySelector("docuseal-builder")!
      .dispatchEvent(new CustomEvent("save", {detail: {}}))

    expect(onSave).not.toHaveBeenCalled()
  })
})
