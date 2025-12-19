interface CompletedMessage {
  title?: string
  body?: string
}

interface CompletedButton {
  title: string
  url: string
}

interface ValidationBase {
  pattern?: string
  message?: string
}

interface PreferencesBase {
  font_size?: number
  font_type?: "bold" | "italic" | "bold_italic"
  mask?: boolean | number
  font?: "Times" | "Helvetica" | "Courier"
  color?: "black" | "white" | "blue"
  align?: "left" | "center" | "right"
  valign?: "top" | "center" | "bottom"
  format?: string
  price?: number
  currency?: "USD" | "EUR" | "GBP" | "CAD" | "AUD"
}

export interface DocuSealFormField {
  name: string
  title?: string
  description?: string
  type?: string
  position?: number
  required?: boolean
  readonly?: boolean
  validation?: ValidationBase
  preferences?: PreferencesBase
}

export interface DocuSealFormProps {
  src?: string
  token?: string
  host?: string
  role?: string
  submitter?: string
  expand?: boolean
  minimize?: boolean
  orderAsOnPage?: boolean
  preview?: boolean
  dryRun?: boolean
  email?: string
  name?: string
  applicationKey?: string
  externalId?: string
  backgroundColor?: string
  logo?: string
  language?: string
  completedMessage?: CompletedMessage
  completedRedirectUrl?: string
  completedButton?: CompletedButton
  goToLast?: boolean
  skipFields?: boolean
  autoscrollFields?: boolean
  withTitle?: boolean
  withDecline?: boolean
  withFieldNames?: boolean
  withFieldPlaceholder?: boolean
  sendCopyEmail?: boolean
  withDownloadButton?: boolean
  withSendCopyButton?: boolean
  withCompleteButton?: boolean
  allowToResubmit?: boolean
  allowTypedSignature?: boolean
  signature?: string
  rememberSignature?: boolean
  reuseSignature?: boolean
  values?: object
  metadata?: object
  i18n?: object
  fields?: DocuSealFormField[]
  readonlyFields?: string[]
  customCss?: string
  className?: string
  style?: string | undefined
}

interface BuilderValidation extends ValidationBase {
  min?: number | string
  max?: number | string
  step?: number
}

interface BuilderPreferences extends PreferencesBase {
  with_signature_id?: boolean
}

export interface DocuSealBuilderField {
  name: string
  type?: string
  role?: string
  title?: string
  description?: string
  required?: boolean
  readonly?: boolean
  default_value?: string
  width?: number
  height?: number
  options?: string[]
  preferences?: BuilderPreferences
  validation?: BuilderValidation
}

export interface DocuSealBuilderSubmitter {
  email?: string
  role?: string
  name?: string
  phone?: string
}