---
"docuseal-svelte": minor
---

Add the embed props that were missing from both components.

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
