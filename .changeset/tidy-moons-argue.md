---
"docuseal-svelte": patch
---

Remove seven unused helpers from the shipped bundle: `isDocuSealMessage`, `parseDocuSealEvent`,
`createDocuSealIframe`, `sendToDocuSeal`, `calculateIframeHeight`, `retryOperation` and
`prefetchDocuSeal`. None were re-exported from the package entry point, and the `exports` map has no
subpath entry, so none of them were reachable by consumers. The public API is unchanged.
