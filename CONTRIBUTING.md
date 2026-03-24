# Contributing Guide

## Repository layout

- `godot/`: active Godot game project
- `build/`: packaged desktop output
- `docs/`: design notes, rules, lore, and Godot implementation records
- `config/`: retained project configuration and reference data
- `scripts/`: helper scripts for export and maintenance

## Common commands

```bash
.\validate-godot.bat
.\start-godot.bat
```

## Package rules

- Keep runtime behavior in the Godot project.
- Keep generated data under `godot/data/generated/`.
- Keep packaged build outputs under `build/windows/`.

## Commit rules

- Use the template in `.gitmessage`
- Prefer `type(scope): subject`
- Keep each commit focused on one change

## File hygiene

- Keep generated archives out of the repository
- Keep binary assets as binary files
- Use LF line endings for text files
