// src/lib/utils/docuseal.ts

/**
 * Validates if a URL is a valid DocuSeal URL
 */
export function isValidDocuSealUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('docuseal.co') || 
           parsed.hostname.includes('docuseal.com');
  } catch {
    return false;
  }
}

/**
 * Builds a DocuSeal form URL with query parameters
 */
export function buildFormUrl(
  baseUrl: string, 
  params?: {
    email?: string;
    name?: string;
    phone?: string;
    [key: string]: string | undefined;
  }
): string {
  const url = new URL(baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
  }
  
  return url.toString();
}

/**
 * Message types from DocuSeal iframe
 */
export enum DocuSealEventType {
  COMPLETED = 'completed',
  DECLINED = 'declined',
  ERROR = 'error',
  LOADED = 'loaded',
  RESIZE = 'resize',
}

/**
 * Type guard for DocuSeal messages
 */
export function isDocuSealMessage(event: MessageEvent): boolean {
  return event.data?.source === 'docuseal' || 
         event.data?.type?.startsWith('docuseal.');
}

/**
 * Parse DocuSeal postMessage events
 */
export function parseDocuSealEvent(event: MessageEvent): {
  type: DocuSealEventType;
  data?: any;
} | null {
  if (!isDocuSealMessage(event)) {
    return null;
  }
  
  const { type, data } = event.data;
  return { type, data };
}

/**
 * Create an iframe element with DocuSeal configuration
 */
export function createDocuSealIframe(
  src: string, 
  options?: {
    title?: string;
    className?: string;
    allowFullscreen?: boolean;
  }
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  
  iframe.src = src;
  iframe.title = options?.title || 'DocuSeal Form';
  iframe.className = options?.className || '';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'camera; microphone; clipboard-write');
  
  if (options?.allowFullscreen) {
    iframe.setAttribute('allowfullscreen', 'true');
  }
  
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  
  return iframe;
}

/**
 * Send a message to DocuSeal iframe
 */
export function sendToDocuSeal(
  iframe: HTMLIFrameElement | null,
  message: {
    type: string;
    data?: any;
  }
): void {
  if (!iframe?.contentWindow) {
    console.warn('DocuSeal iframe not ready');
    return;
  }
  
  iframe.contentWindow.postMessage(
    { source: 'parent', ...message },
    '*'
  );
}

/**
 * Calculates optimal iframe height based on content
 */
export function calculateIframeHeight(
  contentHeight?: number,
  minHeight = 400,
  maxHeight = 1200
): number {
  if (!contentHeight) return minHeight;
  return Math.min(Math.max(contentHeight, minHeight), maxHeight);
}

/**
 * Error types that can occur with DocuSeal
 */
export class DocuSealError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'DocuSealError';
  }
}

/**
 * Retry logic for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error = new Error()
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  
  throw new DocuSealError(
    `Operation failed after ${maxRetries} retries`,
    'RETRY_EXCEEDED',
    lastError
  );
}

/**
 * Prefetch DocuSeal resources for faster loading
 */
export function prefetchDocuSeal(url: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}