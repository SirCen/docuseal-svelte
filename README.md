# DocuSeal Svelte

A SvelteKit component library for integrating DocuSeal electronic signatures into your Svelte applications.

## Installation

```bash
npm install docuseal-svelte
```

## Usage

```svelte
<script lang="ts">
  import { DocuSealForm, DocuSealFormBuilder } from 'docuseal-svelte';
</script>

<DocuSealForm src="<YOUR_DOCUSEAL_FORM_SRC>" />
<DocuSealFormBuilder src="<YOUR_DOCUSEAL_FORM_SRC>" token="<YOUR_DOCUSEAL_TOKEN>" />
```

## How to Contribute

Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to create a changeset for any significant updates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
