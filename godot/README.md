# Lex Universalis Godot Project

This directory is the desktop-game migration target.

## Current Scope

- Fixed desktop viewport baseline
- Data-driven bootstrap from JSON exports
- Main shell scene for story/card/battle migration

## Data Source

Generated JSON lives in:

- [`E:\Lex Universalis\godot\data\generated`](/E:/Lex%20Universalis/godot/data/generated)

Refresh it with:

```powershell
corepack pnpm --dir client exec tsx ..\scripts\export-godot-data.ts
```

## Open In Godot

Open [`E:\Lex Universalis\godot\project.godot`](/E:/Lex%20Universalis/godot/project.godot) in Godot 4.x.

The first target is a true desktop single-viewport layout, not a scroll-page UI.
