---
"docuseal-svelte": patch
---

`isValidDocuSealUrl` now accepts `docuseal.eu`, DocuSeal's EU Cloud. Only the US Cloud
(`docuseal.com`) and `docuseal.co` were recognised, so signing links for EU-hosted accounts were
rejected as invalid.
