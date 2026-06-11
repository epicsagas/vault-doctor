# Contributing to vault-doctor

Thanks for your interest! Here's how to get started.

## Setup

```bash
git clone https://github.com/epicsagas/vault-doctor.git
cd vault-doctor
npm install
```

## Development

```bash
npm run dev      # watch mode
npm run lint     # type check
npm test         # run tests
npm run build    # production build
```

## Making changes

1. Create a branch from `main`
2. Make your changes with tests
3. Ensure `npm run lint && npm test` pass
4. Open a pull request

## Adding a new check

1. Add a checker function in `src/checks/`
2. Add tests in `src/__tests__/`
3. Register the check in the scan pipeline
4. If auto-fixable, add a fixer and the `Auto-fix` column in README

## Adding a new fix

1. Add a fixer function alongside the corresponding check
2. Guard it behind `--dry-run` by default
3. Test against a fixture vault

## Reporting issues

- Use [GitHub Issues](https://github.com/epicsagas/vault-doctor/issues)
- Include `vault-doctor --version`, OS, and steps to reproduce

## Code style

- TypeScript, ESM modules
- Match existing patterns in the codebase
- Keep it simple — no abstractions for single-use code
