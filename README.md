# Lex Universalis

PvE 优先的卡牌肉鸽，基于 Godot 4.6 开发。战斗内核参考杀戮尖塔，双方都按同一规则打牌。

## Repository

- Canonical repo: https://github.com/emptyinkpot/Lex-Universalis
- Engine: Godot 4.6
- Framework base: [Slay-The-Robot](https://github.com/DesirePathGames/Slay-The-Robot) (MIT)

## Structure

- `godot/` - Godot 4 game project (runtime root)
- `docs/` - design notes, planning docs
- `config/` - project configuration
- `scripts/` - portable helper scripts

## Run

```bat
.\start-godot.bat
```

## Content Editing

Cards, enemies, and scenarios are defined via JSON in `godot/external/mods/`.
The "Edit Resources as Table" plugin is also available inside the Godot editor.

## Design Document

See `docs/game-design/planning/Lex Universalis 项目企划书（Godot）_v1_2026_5_3.md`