import {render} from "@testing-library/svelte"
import {describe, expect, it, vi} from "vitest"
import DocuSealForm from "../src/lib/components/DocuSealForm.svelte"

const renderForm = (props: Record<string, unknown> = {}) => {
  const {container} = render(DocuSealForm, {token: "test-token", ...props})
  const element = container.querySelector("docuseal-form")
  if (!element) throw new Error("docuseal-form element was not rendered")
  return element
}

describe("DocuSealForm", () => {
  it("passes the token through to the embed element", () => {
    expect(renderForm().getAttribute("data-token")).toBe("test-token")
  })

  it("renders disabled booleans as an explicit false rather than omitting them", () => {
    const element = renderForm({
      withTitle: false,
      goToLast: false,
      orderAsOnPage: false,
      autoscrollFields: false,
    })

    expect(element.getAttribute("data-with-title")).toBe("false")
    expect(element.getAttribute("data-go-to-last")).toBe("false")
    expect(element.getAttribute("data-order-as-on-page")).toBe("false")
    expect(element.getAttribute("data-autoscroll-fields")).toBe("false")
  })

  it("omits booleans that were never set so the embed can apply its own default", () => {
    expect(renderForm().hasAttribute("data-send-copy-email")).toBe(false)
  })

  it("maps only-required-fields onto the embed attribute", () => {
    expect(
      renderForm({onlyRequiredFields: true}).getAttribute(
        "data-only-required-fields",
      ),
    ).toBe("true")
  })

  it("falls back to the deprecated submitter and applicationKey aliases", () => {
    const element = renderForm({
      submitter: "legacy-role",
      applicationKey: "legacy-key",
    })

    expect(element.getAttribute("data-role")).toBe("legacy-role")
    expect(element.getAttribute("data-external-id")).toBe("legacy-key")
  })

  it("prefers role and externalId over their deprecated aliases", () => {
    const element = renderForm({
      role: "signer",
      submitter: "legacy-role",
      externalId: "id-1",
      applicationKey: "legacy-key",
    })

    expect(element.getAttribute("data-role")).toBe("signer")
    expect(element.getAttribute("data-external-id")).toBe("id-1")
  })

  it("serialises object and array props as JSON", () => {
    const fields = [{name: "full_name", required: true}]
    const element = renderForm({fields, values: {full_name: "Ada"}})

    expect(JSON.parse(element.getAttribute("data-fields")!)).toEqual(fields)
    expect(JSON.parse(element.getAttribute("data-values")!)).toEqual({
      full_name: "Ada",
    })
  })

  it("joins readonly fields into a comma separated list", () => {
    const element = renderForm({readonlyFields: ["email", "name"]})

    expect(element.getAttribute("data-readonly-fields")).toBe("email,name")
  })

  it("flattens the completed message and button into their own attributes", () => {
    const element = renderForm({
      completedMessage: {title: "Done", body: "Thanks"},
      completedButton: {title: "Back", url: "https://example.com"},
    })

    expect(element.getAttribute("data-completed-message-title")).toBe("Done")
    expect(element.getAttribute("data-completed-message-body")).toBe("Thanks")
    expect(element.getAttribute("data-completed-button-title")).toBe("Back")
    expect(element.getAttribute("data-completed-button-url")).toBe(
      "https://example.com",
    )
  })

  it.each([
    ["completed", "onComplete"],
    ["init", "onInit"],
    ["declined", "onDecline"],
    ["load", "onLoad"],
    ["error", "onError"],
  ])("forwards the %s event to %s", (eventName, propName) => {
    const handler = vi.fn()
    const element = renderForm({[propName]: handler})

    element.dispatchEvent(new CustomEvent(eventName, {detail: {id: 1}}))

    expect(handler).toHaveBeenCalledWith({id: 1})
  })

  it("stops forwarding events once the component is destroyed", () => {
    const onComplete = vi.fn()
    const {container, unmount} = render(DocuSealForm, {
      token: "test-token",
      onComplete,
    })
    const element = container.querySelector("docuseal-form")!

    unmount()
    element.dispatchEvent(new CustomEvent("completed", {detail: {}}))

    expect(onComplete).not.toHaveBeenCalled()
  })
})
