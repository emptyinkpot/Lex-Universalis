# Git Workflow Contract

This repository uses GitHub Flow plus two environment debug branches.

## Stable Branches

```text
main        stable integration and release truth
local       local Windows debugging lane
remote-ide  remote IDE / code-server debugging lane
```

`main` is the only durable integration branch. `local` and `remote-ide` are
debugging lanes, not product truth.

## Pull Before Push

Before pushing durable changes:

```powershell
git fetch origin --prune
git switch main
git pull --ff-only origin main
```

Before local Windows debugging:

```powershell
.\scripts\git-env-sync.ps1 start-local
```

Before remote IDE debugging:

```powershell
.\scripts\git-env-sync.ps1 start-remote-ide
```

## Promotion Rule

Do not merge `local` or `remote-ide` wholesale into `main`.

Promote only the intentional patch:

```text
local / remote-ide
  -> task branch from origin/main
  -> checks
  -> pull request or scoped direct merge
  -> main
```

Environment-only logs, temporary probes, debug flags, and machine paths must be
removed before promotion.
