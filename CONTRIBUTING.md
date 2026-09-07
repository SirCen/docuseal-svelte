# Contributing to docuseal-svelte

Thanks for your interest in contributing. This project uses the standard fork-and-pull
workflow — you don't need write access to the repository.

## Getting set up

Fork the repository on GitHub, then:

```bash
git clone https://github.com/<your-username>/docuseal-svelte.git
cd docuseal-svelte
npm ci
```

Create a branch for your work:

```bash
git switch -c my-change
```

## Before you open a pull request

Run the same checks CI runs:

```bash
npm run check   # type-check the library and the tests
npm test        # run the test suite once
npm run build   # package the library
```

`npm run test:watch` re-runs the tests as you edit.

Tests live in the top-level `tests/` directory rather than beside the source, because
`svelte-package` copies everything under `src/lib` into `dist`. `npm run prepack` fails if a
test file ever reaches the built package.

## Add a changeset

Any change that affects the published package needs a changeset, which is how the release
notes and the version bump are generated:

```bash
npx changeset
```

Pick the bump type for the change you made:

- **patch** — bug fix, or a change with no effect on the public API
- **minor** — new component, prop, or export
- **major** — a breaking change to the public API

Commit the generated file in `.changeset/` along with your code. Changes that touch nothing
shipped in the package — CI config, this file, the README — don't need one.

## Opening the pull request

Push your branch to your fork and open a pull request against `main`. CI runs automatically
on the pull request, and a maintainer review is required before it can be merged. Pull
requests are merged with a squash, so a tidy branch history is helpful but not required.

Please keep one logical change per pull request; it makes review much faster.

## Reporting bugs

Open an issue describing what you expected, what happened instead, and the versions of
`docuseal-svelte` and `svelte` you're using. A minimal reproduction is the single most useful
thing you can include.
