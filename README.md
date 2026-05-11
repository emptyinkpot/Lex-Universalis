# Lex Universalis

Lex Universalis is a Godot 4 desktop card roguelike prototype. The repository
truth is portable: clone it anywhere, open `godot/project.godot`, and keep
runtime paths relative to the checkout.

## Repository Identity

- Canonical repo: <https://github.com/emptyinkpot/Lex-Universalis>
- Machine-readable entry: `project.json`
- Runtime root: `godot/`
- Godot project: `godot/project.godot`
- Main scene: `godot/scenes/Main.tscn`
- Design plan: `docs/game-design/planning/Lex Universalis 项目企划书（Godot）_v1_2026_5_3.md`

## Structure

- `godot/` - active Godot 4 desktop game project
- `docs/` - design notes, planning docs, migration records, and reference notes
- `config/` - retained project configuration and reference data
- `scripts/` - portable helper scripts
- `tools/codex-bridge/` - optional local AI bridge used by the in-game assistant

## Run

Install Godot 4.6.x first. The launcher resolves Godot from `GODOT_EXE`,
`GODOT_CONSOLE`, `PATH`, or common Windows install paths.

```bat
.\start-godot.bat
```

Headless validation:

```bat
.\validate-godot.bat
```

Build a Windows desktop package:

```bat
.\publish-desktop.bat
```

Optional local Codex bridge:

```bat
.\start-codex-bridge.bat
```

## Read Order

1. `README.md`
2. `project.json`
3. `godot/README.md`
4. `docs/game-design/planning/Lex Universalis 项目企划书（Godot）_v1_2026_5_3.md`
5. `docs/game-design/moon/README.md`
6. `docs/reference/README.md`
7. `docs/reference/dev/godot-repo-guide.md`
8. `docs/reference/dev/godot-migration-checklist.md`

## Portability Rules

- Do not commit user-specific paths such as `E:\...` or
  `C:\Users\<name>\...`.
- Use `res://` for Godot resources.
- Use `%~dp0` in Windows launchers.
- Use `GODOT_EXE` or `GODOT_CONSOLE` only as optional local overrides.
- Keep generated gameplay data under `godot/data/generated/`.
