# Godot Repo Guide

This repository is now centered on the Godot desktop game project.

## Active Paths

- `godot/` - the active game project
- `docs/` - design, lore, migration, and implementation notes
- `scripts/` - helper scripts for data export and maintenance

## Main Commands

```powershell
.\validate-godot.bat
.\start-godot.bat
```

## Notes

- Keep the Godot project as the source of truth for runtime behavior.
- Keep generated data under `godot/data/generated/`.
- Keep runtime story progress in `user://story-progress.save.json`.
- Do not reintroduce a browser-based runtime into the mainline.
