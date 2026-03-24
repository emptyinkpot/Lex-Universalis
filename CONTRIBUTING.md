# Contributing Guide

## Repository layout

- `client/`: Expo React Native app
- `server/`: Express API
- `docs/`: game design docs and source materials
- `config/`: standalone config files, including theme settings
- `.cozeproj/`: local runner scripts used by the workspace

## Common commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

## Package rules

- Add frontend dependencies in `client/package.json`
- Add backend dependencies in `server/package.json`
- Keep shared root tooling minimal and focused on workspace orchestration

## Commit rules

- Use the template in `.gitmessage`
- Prefer `type(scope): subject`
- Keep each commit focused on one change

## File hygiene

- Keep generated archives out of the repository
- Keep binary assets as binary files
- Use LF line endings for text files
