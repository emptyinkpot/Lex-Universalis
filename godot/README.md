# Lex Universalis Godot Project

This directory is the active Godot 4 desktop runtime.

## Current Scope

- Fixed desktop viewport baseline
- Data-driven bootstrap from JSON exports
- Main shell scene for story/card/battle flow
- Story mode, card editor, deck builder, battle, result screen, and persistent story progress
- AI Assistant page for local Codex bridge-driven UI analysis and rewrites
- Player-side unit deployment, orders, and enemy turn resolution

## Open In Godot

Open `project.godot` in Godot 4.6.x, or run from the repository root:

```bat
.\start-godot.bat
```

Headless validation:

```bat
.\validate-godot.bat
```

Windows export:

```bat
.\publish-desktop.bat
```

## Runtime Notes

- Main scene: `scenes/Main.tscn`
- Generated data: `data/generated/`
- Story progress: `user://story-progress.save.json`
- Editor plugin: `addons/lex_universalis_codex_editor/`
- Resource paths should stay as `res://...` so the project works from any checkout path.
