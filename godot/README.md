# Lex Universalis Godot Project

This directory is now the active desktop game project.

## Current Scope

- Fixed desktop viewport baseline
- Data-driven bootstrap from JSON exports
- Main shell scene for story/card/battle flow
- Story mode, card editor, deck builder, battle, result screen, and persistent story progress
- Player-side unit deployment, orders, and enemy turn resolution

## Open In Godot

Open [`E:\Lex Universalis\godot\project.godot`](/E:/Lex%20Universalis/godot/project.godot) in Godot 4.6.x.

Or use:

- [`E:\Lex Universalis\start-godot.bat`](/E:/Lex%20Universalis/start-godot.bat)

To validate the project without opening the editor:

- [`E:\Lex Universalis\validate-godot.bat`](/E:/Lex%20Universalis/validate-godot.bat)

To use the packaged desktop build:

- [`E:\Lex Universalis\build\windows\Lex Universalis.exe`](/E:/Lex%20Universalis/build/windows/Lex%20Universalis.exe)

## Data

Generated runtime data lives in:

- [`E:\Lex Universalis\godot\data\generated`](/E:/Lex%20Universalis/godot/data/generated)

Story progress is written at runtime to:

- `user://story-progress.save.json`

The project target remains a true desktop single-viewport layout, not a scroll-page UI.
