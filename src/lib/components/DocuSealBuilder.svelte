<script lang="ts">
  import {onMount} from "svelte"
  import type {
    DocuSealBuilderField,
    DocuSealBuilderSubmitter,
  } from "../types/index.js"
  import {DocuSealError} from "../utils/docuseal.js"

  let {
    token,
    host = "cdn.docuseal.com",
    withRecipientsButton = true,
    withSendButton = true,
    withTitle = true,
    withDocumentsList = true,
    withFieldsList = true,
    withFieldPlaceholder = false,
    onlyDefinedFields = false,
    preview = false,
    previewMode = false,
    inputMode = false,
    language = "en",
    autosave = true,
    roles = [],
    fieldTypes = [],
    drawFieldType = "text",
    fields = [],
    submitters = [],
    requiredFields = [],
    i18n = {},
    withSignYourselfButton = true,
    withUploadButton = true,
    withSignatureId = undefined,
    withAddPageButton = false,
    customButton = {title: "", url: ""},
    emailMessage = {subject: "", body: ""},
    backgroundColor = "",
    saveButtonText = "",
    sendButtonText = "",
    className = "",
    customCss = "",
    style = undefined,
    onLoad = undefined,
    onUpload = undefined,
    onSend = undefined,
    onSave = undefined,
    onChange = undefined,
  }: {
    token: string
    host?: string
    withRecipientsButton?: boolean
    withSendButton?: boolean
    withTitle?: boolean
    withDocumentsList?: boolean
    withFieldsList?: boolean
    withFieldPlaceholder?: boolean
    onlyDefinedFields?: boolean
    preview?: boolean
    previewMode?: boolean
    inputMode?: boolean
    language?: string
    autosave?: boolean
    roles?: string[]
    fieldTypes?: string[]
    drawFieldType?: string
    fields?: DocuSealBuilderField[]
    submitters?: DocuSealBuilderSubmitter[]
    requiredFields?: DocuSealBuilderField[]
    i18n?: object
    withSignYourselfButton?: boolean
    withUploadButton?: boolean
    withSignatureId?: boolean | undefined
    withAddPageButton?: boolean
    customButton?: {title: string; url: string}
    emailMessage?: {subject: string; body: string}
    backgroundColor?: string
    saveButtonText?: string
    sendButtonText?: string
    className?: string
    customCss?: string
    style?: string | undefined
    onLoad?: ((detail: any) => void) | undefined
    onUpload?: ((detail: any) => void) | undefined
    onSend?: ((detail: any) => void) | undefined
    onSave?: ((detail: any) => void) | undefined
    onChange?: ((detail: any) => void) | undefined
  } = $props()

  let el = $state<HTMLElement | null>(null)

  const booleanToAttr = (value: any): string | undefined => {
    if (value === true) return "true"
    if (value === false) return "false"
    return value
  }

  const validateHost = (host: string): void => {
    const testUrl = `https://${host}`
    try {
      new URL(testUrl)
    } catch {
      throw new DocuSealError(`Invalid host: ${host}`, "INVALID_HOST")
    }
  }

  const loadBuilderScript = (host: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const scriptId = "docuseal-builder-script"
      const scriptSrc = `https://${host}/js/builder.js`

      // Check if script already exists
      const existingScript = document.getElementById(scriptId)
      if (existingScript) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.id = scriptId
      script.async = true
      script.src = scriptSrc

      script.onload = () => resolve()
      script.onerror = () =>
        reject(
          new DocuSealError(
            `Failed to load DocuSeal builder script from ${scriptSrc}`,
            "SCRIPT_LOAD_ERROR"
          )
        )

      document.head.appendChild(script)
    })
  }

  const setupEventListeners = (element: HTMLElement): (() => void) => {
    const handleLoad = (e: Event) => {
      if (onLoad && e instanceof CustomEvent) {
        onLoad(e.detail)
      }
    }

    const handleUpload = (e: Event) => {
      if (onUpload && e instanceof CustomEvent) {
        onUpload(e.detail)
      }
    }

    const handleSend = (e: Event) => {
      if (onSend && e instanceof CustomEvent) {
        onSend(e.detail)
      }
    }

    const handleSave = (e: Event) => {
      if (onSave && e instanceof CustomEvent) {
        onSave(e.detail)
      }
    }

    const handleChange = (e: Event) => {
      if (onChange && e instanceof CustomEvent) {
        onChange(e.detail)
      }
    }

    element.addEventListener("load", handleLoad)
    element.addEventListener("upload", handleUpload)
    element.addEventListener("send", handleSend)
    element.addEventListener("save", handleSave)
    element.addEventListener("change", handleChange)

    // Return cleanup function
    return () => {
      element.removeEventListener("load", handleLoad)
      element.removeEventListener("upload", handleUpload)
      element.removeEventListener("send", handleSend)
      element.removeEventListener("save", handleSave)
      element.removeEventListener("change", handleChange)
    }
  }

  onMount(() => {
    let cleanup: (() => void) | undefined

    ;(async () => {
      try {
        validateHost(host)
        await loadBuilderScript(host)
        if (el) {
          cleanup = setupEventListeners(el)
        }
      } catch (error) {
        console.error("DocuSeal Builder initialization error:", error)
        if (error instanceof DocuSealError) {
          throw error
        }
        throw new DocuSealError(
          "Failed to initialize DocuSeal Builder",
          "INIT_ERROR",
          error
        )
      }
    })()

    return () => {
      if (cleanup) cleanup()
    }
  })
</script>

<docuseal-builder
  bind:this={el}
  data-token={token}
  data-preview={booleanToAttr(preview || previewMode)}
  data-input-mode={inputMode}
  data-language={language}
  data-autosave={booleanToAttr(autosave)}
  data-send-button-text={sendButtonText}
  data-save-button-text={saveButtonText}
  data-roles={roles.join(",")}
  data-field-types={fieldTypes.join(",")}
  data-draw-field-type={drawFieldType}
  data-fields={JSON.stringify(fields)}
  data-submitters={JSON.stringify(submitters)}
  data-required-fields={JSON.stringify(requiredFields)}
  data-i18n={JSON.stringify(i18n)}
  data-custom-button-title={customButton.title}
  data-custom-button-url={customButton.url}
  data-email-subject={emailMessage.subject}
  data-email-body={emailMessage.body}
  data-with-recipients-button={booleanToAttr(withRecipientsButton)}
  data-with-send-button={booleanToAttr(withSendButton)}
  data-with-documents-list={booleanToAttr(withDocumentsList)}
  data-with-fields-list={booleanToAttr(withFieldsList)}
  data-with-field-placeholder={booleanToAttr(withFieldPlaceholder)}
  data-with-signature-id={booleanToAttr(withSignatureId)}
  data-with-title={booleanToAttr(withTitle)}
  data-only-defined-fields={booleanToAttr(onlyDefinedFields)}
  data-with-upload-button={booleanToAttr(withUploadButton)}
  data-with-add-page-button={booleanToAttr(withAddPageButton)}
  data-with-sign-yourself-button={booleanToAttr(withSignYourselfButton)}
  data-background-color={backgroundColor}
  data-custom-css={customCss}
  class={className}
  {style}
></docuseal-builder>
