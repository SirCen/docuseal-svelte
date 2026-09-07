# docuseal-svelte

## 0.1.1

### Patch Changes

- 41daab8: `isValidDocuSealUrl` now accepts `docuseal.eu`, DocuSeal's EU Cloud. Only the US Cloud
  (`docuseal.com`) and `docuseal.co` were recognised, so signing links for EU-hosted accounts were
  rejected as invalid.
- 41daab8: Remove seven unused helpers from the shipped bundle: `isDocuSealMessage`, `parseDocuSealEvent`,
  `createDocuSealIframe`, `sendToDocuSeal`, `calculateIframeHeight`, `retryOperation` and
  `prefetchDocuSeal`. None were re-exported from the package entry point, and the `exports` map has no
  subpath entry, so none of them were reachable by consumers. The public API is unchanged.

## 0.1.0

### Minor Changes

- e49aef5: Add the embed props that were missing from both components.

  - `DocuSealBuilder`: `withFieldsDetection`, `withDynamicDocuments`, `withPrefillable`,
    `withCustomFieldsTab`, `withRevisions` and `dateFormats`.
  - `DocuSealForm`: `onlyRequiredFields`.

  Fix `data-input-mode` and `data-order-as-on-page` dropping a `false` value from the DOM instead of
  rendering it as `"false"`, which left the embed applying its own default rather than the one you
  asked for.

  Fix `DocuSealBuilder` rethrowing initialisation failures inside a detached async function, where
  nothing could catch them and every failure surfaced as an unhandled promise rejection. It now takes
  an `onError` prop that receives the `DocuSealError`, and logs the failure when no handler is given.

  Tighten `isValidDocuSealUrl` to match the DocuSeal domains on a label boundary, so lookalike hosts
  such as `docuseal.com.example.test` are no longer treated as valid.

### Patch Changes

- d813596: add error handler

## 0.0.3

### Patch Changes

- 6580d07: Update Readme, add backwards compatibility for svelte 4
