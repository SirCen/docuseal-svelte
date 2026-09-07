const DOCUSEAL_DOMAINS = ["docuseal.co", "docuseal.com", "docuseal.eu"]

export function isValidDocuSealUrl(url: string): boolean {
  try {
    const {hostname} = new URL(url)
    return DOCUSEAL_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    )
  } catch {
    return false
  }
}

export function buildFormUrl(
  baseUrl: string,
  params?: {
    email?: string
    name?: string
    phone?: string
    [key: string]: string | undefined
  },
): string {
  const url = new URL(baseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value)
      }
    })
  }

  return url.toString()
}

export enum DocuSealEventType {
  COMPLETED = "completed",
  DECLINED = "declined",
  ERROR = "error",
  LOADED = "loaded",
  RESIZE = "resize",
}

export class DocuSealError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any,
  ) {
    super(message)
    this.name = "DocuSealError"
  }
}
