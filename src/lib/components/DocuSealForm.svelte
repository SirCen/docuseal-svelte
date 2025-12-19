<script lang="ts">
  import {onMount} from "svelte"
  import type {DocuSealFormField} from "../types/index.ts"

  export let src: string = ""
  export let token: string = ""
  export let host: string = "cdn.docuseal.com"
  export let role: string = ""
  export let submitter: string = ""
  export let preview: boolean = false
  export let dryRun: boolean = false
  export let expand: boolean = true
  export let minimize: boolean = false
  export let orderAsOnPage: boolean = false
  export let email: string = ""
  export let name: string = ""
  export let backgroundColor: string = ""
  export let sendCopyEmail: boolean | undefined = undefined
  export let applicationKey: string = ""
  export let externalId: string = ""
  export let logo: string = ""
  export let language: string = ""
  export let completedRedirectUrl: string = ""
  export let completedButton: {title: string; url: string} = {
    title: "",
    url: "",
  }
  export let completedMessage: {title?: string; body?: string} = {
    title: "",
    body: "",
  }
  export let goToLast: boolean = true
  export let skipFields: boolean = false
  export let autoscrollFields: boolean = true
  export let withTitle: boolean = true
  export let withDecline: boolean = false
  export let withFieldNames: boolean = true
  export let withFieldPlaceholder: boolean = false
  export let withDownloadButton: boolean = true
  export let allowToResubmit: boolean = true
  export let allowTypedSignature: boolean = true
  export let signature: string = ""
  export let rememberSignature: boolean = false
  export let reuseSignature: boolean = true
  export let withSendCopyButton: boolean = true
  export let withCompleteButton: boolean = false
  export let values: object = {}
  export let metadata: object = {}
  export let i18n: object = {}
  export let fields: DocuSealFormField[] = []
  export let readonlyFields: string[] = []
  export let customCss: string = ""
  export let className: string = ""
  export let style: string | undefined = undefined

  export let onComplete: ((detail: any) => void) | undefined = undefined
  export let onInit: ((detail: any) => void) | undefined = undefined
  export let onDecline: ((detail: any) => void) | undefined = undefined
  export let onLoad: ((detail: any) => void) | undefined = undefined

  let el: HTMLElement | null = null

  const booleanToAttr = (value: any) =>
    value === true ? "true" : value === false ? "false" : value

  onMount(() => {
    const scriptId = "docuseal-form-script"
    const scriptSrc = `https://${host}/js/form.js`

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.async = true
      script.src = scriptSrc
      document.head.appendChild(script)
    }

    const handleCompleted = (e: Event) =>
      onComplete && onComplete((e as CustomEvent).detail)
    const handleInit = (e: Event) => onInit && onInit((e as CustomEvent).detail)
    const handleDecline = (e: Event) =>
      onDecline && onDecline((e as CustomEvent).detail)
    const handleLoad = (e: Event) => onLoad && onLoad((e as CustomEvent).detail)

    if (el) {
      el.addEventListener("completed", handleCompleted)
      el.addEventListener("init", handleInit)
      el.addEventListener("declined", handleDecline)
      el.addEventListener("load", handleLoad)
    }

    return () => {
      if (el) {
        el.removeEventListener("completed", handleCompleted)
        el.removeEventListener("init", handleInit)
        el.removeEventListener("declined", handleDecline)
        el.removeEventListener("load", handleLoad)
      }
    }
  })
</script>

<docuseal-form
  bind:this={el}
  data-src={src}
  data-token={token}
  data-email={email}
  data-name={name}
  data-role={role || submitter}
  data-external-id={externalId || applicationKey}
  data-expand={booleanToAttr(expand)}
  data-minimize={booleanToAttr(minimize)}
  data-order-as-on-page={orderAsOnPage}
  data-preview={booleanToAttr(preview)}
  data-dry-run={booleanToAttr(dryRun)}
  data-go-to-last={booleanToAttr(goToLast)}
  data-skip-fields={booleanToAttr(skipFields)}
  data-autoscroll-fields={booleanToAttr(autoscrollFields)}
  data-send-copy-email={booleanToAttr(sendCopyEmail)}
  data-with-title={booleanToAttr(withTitle)}
  data-with-decline={booleanToAttr(withDecline)}
  data-logo={logo}
  data-language={language}
  data-with-field-names={booleanToAttr(withFieldNames)}
  data-with-field-placeholder={booleanToAttr(withFieldPlaceholder)}
  data-with-download-button={booleanToAttr(withDownloadButton)}
  data-allow-to-resubmit={booleanToAttr(allowToResubmit)}
  data-allow-typed-signature={booleanToAttr(allowTypedSignature)}
  data-signature={signature}
  data-remember-signature={booleanToAttr(rememberSignature)}
  data-reuse-signature={booleanToAttr(reuseSignature)}
  data-completed-redirect-url={completedRedirectUrl}
  data-with-send-copy-button={booleanToAttr(withSendCopyButton)}
  data-with-complete-button={booleanToAttr(withCompleteButton)}
  data-values={JSON.stringify(values)}
  data-metadata={JSON.stringify(metadata)}
  data-fields={JSON.stringify(fields)}
  data-i18n={JSON.stringify(i18n)}
  data-readonly-fields={readonlyFields.join(",")}
  data-completed-message-title={completedMessage.title}
  data-completed-message-body={completedMessage.body}
  data-completed-button-title={completedButton.title}
  data-completed-button-url={completedButton.url}
  data-background-color={backgroundColor}
  data-custom-css={customCss}
  class={className}
  {style}
></docuseal-form>
