# Environment Branch Runbook

## Branches

```text
main        integration truth
local       local Windows debug lane
remote-ide  remote IDE debug lane
```

## Local Debug

```powershell
.\scripts\git-env-sync.ps1 start-local
```

Use this lane for Windows Godot installs, launcher behavior, local file paths,
and optional Codex bridge testing.

## Remote IDE Debug

```powershell
.\scripts\git-env-sync.ps1 start-remote-ide
```

Use this lane for Linux/server-like validation, repository metadata checks, and
remote workspace edits.

## Sync Environment Branches

```powershell
.\scripts\git-env-sync.ps1 sync-env
```

This fast-forwards `local` and `remote-ide` to `main`.
