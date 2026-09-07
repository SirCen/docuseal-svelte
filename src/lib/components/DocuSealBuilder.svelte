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
    withFieldsDetection = false,
    withFieldPlaceholder = false,
    withDynamicDocuments = false,
    withPrefillable = false,
    withCustomFieldsTab = false,
    withRevisions = false,
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
    dateFormats = [],
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
    onError = undefined,
  }: {
    token: string
    host?: string
    withRecipientsButton?: boolean
    withSendButton?: boolean
    withTitle?: boolean
    withDocumentsList?: boolean
    withFieldsList?: boolean
    withFieldsDetection?: boolean
    withFieldPlaceholder?: boolean
    withDynamicDocuments?: boolean
    withPrefillable?: boolean
    withCustomFieldsTab?: boolean
    withRevisions?: boolean
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
    dateFormats?: string[]
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
    onError?: ((error: DocuSealError) => void) | undefined
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
            "SCRIPT_LOAD_ERROR",
          ),
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

  const asDocuSealError = (error: unknown): DocuSealError =>
    error instanceof DocuSealError
      ? error
      : new DocuSealError(
          "Failed to initialize DocuSeal Builder",
          "INIT_ERROR",
          error,
        )

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
        const initError = asDocuSealError(error)
        if (onError) {
          onError(initError)
        } else {
          console.error("DocuSeal Builder initialization error:", initError)
        }
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
  data-input-mode={booleanToAttr(inputMode)}
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
  data-date-formats={dateFormats.join(",")}
  data-i18n={JSON.stringify(i18n)}
  data-custom-button-title={customButton.title}
  data-custom-button-url={customButton.url}
  data-email-subject={emailMessage.subject}
  data-email-body={emailMessage.body}
  data-with-recipients-button={booleanToAttr(withRecipientsButton)}
  data-with-send-button={booleanToAttr(withSendButton)}
  data-with-documents-list={booleanToAttr(withDocumentsList)}
  data-with-dynamic-documents={booleanToAttr(withDynamicDocuments)}
  data-with-fields-list={booleanToAttr(withFieldsList)}
  data-with-fields-detection={booleanToAttr(withFieldsDetection)}
  data-with-field-placeholder={booleanToAttr(withFieldPlaceholder)}
  data-with-prefillable={booleanToAttr(withPrefillable)}
  data-with-custom-fields-tab={booleanToAttr(withCustomFieldsTab)}
  data-with-signature-id={booleanToAttr(withSignatureId)}
  data-with-revisions={booleanToAttr(withRevisions)}
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
