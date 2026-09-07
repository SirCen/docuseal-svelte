import {render} from "@testing-library/svelte"
import {beforeEach, describe, expect, it, vi} from "vitest"
import DocuSealBuilder from "../src/lib/components/DocuSealBuilder.svelte"

const scriptId = "docuseal-builder-script"

const renderBuilder = (props: Record<string, unknown> = {}) => {
  const {container, unmount} = render(DocuSealBuilder, {
    token: "test-token",
    ...props,
  })
  const element = container.querySelector("docuseal-builder")
  if (!element) throw new Error("docuseal-builder element was not rendered")
  return {element, unmount}
}

const pretendScriptIsAlreadyLoaded = () => {
  const script = document.createElement("script")
  script.id = scriptId
  document.head.appendChild(script)
}

const flushScriptLoad = () => new Promise((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  document.getElementById(scriptId)?.remove()
})

describe("DocuSealBuilder", () => {
  it("passes the token through to the embed element", () => {
    expect(renderBuilder().element.getAttribute("data-token")).toBe(
      "test-token",
    )
  })

  it("renders disabled booleans as an explicit false rather than omitting them", () => {
    const {element} = renderBuilder({
      withTitle: false,
      autosave: false,
      inputMode: false,
      withFieldsList: false,
    })

    expect(element.getAttribute("data-with-title")).toBe("false")
    expect(element.getAttribute("data-autosave")).toBe("false")
    expect(element.getAttribute("data-input-mode")).toBe("false")
    expect(element.getAttribute("data-with-fields-list")).toBe("false")
  })

  it("omits with-signature-id when it was never set", () => {
    expect(renderBuilder().element.hasAttribute("data-with-signature-id")).toBe(
      false,
    )
  })

  it.each([
    ["withFieldsDetection", "data-with-fields-detection"],
    ["withDynamicDocuments", "data-with-dynamic-documents"],
    ["withPrefillable", "data-with-prefillable"],
    ["withCustomFieldsTab", "data-with-custom-fields-tab"],
    ["withRevisions", "data-with-revisions"],
    ["onlyDefinedFields", "data-only-defined-fields"],
    ["withAddPageButton", "data-with-add-page-button"],
  ])("maps %s onto %s", (propName, attribute) => {
    const {element} = renderBuilder({[propName]: true})

    expect(element.getAttribute(attribute)).toBe("true")
  })

  it("treats previewMode as an alias for preview", () => {
    expect(
      renderBuilder({previewMode: true}).element.getAttribute("data-preview"),
    ).toBe("true")
  })

  it("joins list props into comma separated attributes", () => {
    const {element} = renderBuilder({
      roles: ["First Party", "Second Party"],
      fieldTypes: ["text", "signature"],
      dateFormats: ["DD/MM/YYYY", "MM/DD/YYYY"],
    })

    expect(element.getAttribute("data-roles")).toBe("First Party,Second Party")
    expect(element.getAttribute("data-field-types")).toBe("text,signature")
    expect(element.getAttribute("data-date-formats")).toBe(
      "DD/MM/YYYY,MM/DD/YYYY",
    )
  })

  it("serialises field, submitter and i18n props as JSON", () => {
    const fields = [{name: "signature", type: "signature"}]
    const submitters = [{email: "ada@example.com", role: "First Party"}]
    const {element} = renderBuilder({fields, submitters, i18n: {send: "Send"}})

    expect(JSON.parse(element.getAttribute("data-fields")!)).toEqual(fields)
    expect(JSON.parse(element.getAttribute("data-submitters")!)).toEqual(
      submitters,
    )
    expect(JSON.parse(element.getAttribute("data-i18n")!)).toEqual({
      send: "Send",
    })
  })

  it("flattens the custom button and email message into their own attributes", () => {
    const {element} = renderBuilder({
      customButton: {title: "Back", url: "https://example.com"},
      emailMessage: {subject: "Please sign", body: "Hello"},
    })

    expect(element.getAttribute("data-custom-button-title")).toBe("Back")
    expect(element.getAttribute("data-custom-button-url")).toBe(
      "https://example.com",
    )
    expect(element.getAttribute("data-email-subject")).toBe("Please sign")
    expect(element.getAttribute("data-email-body")).toBe("Hello")
  })

  it("loads the builder script from the configured host", async () => {
    renderBuilder({host: "docuseal.example.com"})
    await flushScriptLoad()

    const script = document.getElementById(scriptId) as HTMLScriptElement

    expect(script.src).toBe("https://docuseal.example.com/js/builder.js")
    expect(script.async).toBe(true)
  })

  it("reuses an already loaded script instead of adding a second one", async () => {
    pretendScriptIsAlreadyLoaded()
    renderBuilder()
    await flushScriptLoad()

    expect(document.querySelectorAll(`#${scriptId}`)).toHaveLength(1)
  })

  it.each([
    ["load", "onLoad"],
    ["upload", "onUpload"],
    ["send", "onSend"],
    ["save", "onSave"],
    ["change", "onChange"],
  ])("forwards the %s event to %s", async (eventName, propName) => {
    pretendScriptIsAlreadyLoaded()
    const handler = vi.fn()
    const {element} = renderBuilder({[propName]: handler})
    await flushScriptLoad()

    element.dispatchEvent(new CustomEvent(eventName, {detail: {id: 1}}))

    expect(handler).toHaveBeenCalledWith({id: 1})
  })

  it("stops forwarding events once the component is destroyed", async () => {
    pretendScriptIsAlreadyLoaded()
    const onSave = vi.fn()
    const {element, unmount} = renderBuilder({onSave})
    await flushScriptLoad()

    unmount()
    element.dispatchEvent(new CustomEvent("save", {detail: {}}))

    expect(onSave).not.toHaveBeenCalled()
  })
})
