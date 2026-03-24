# Battle Interaction Architecture

The Godot battle scene is split into three layers:

## Input Layer

- `CardNode` handles card taps and drag gestures.
- `BattleSlot` handles slot clicks and drag hover highlighting.
- The current desktop build uses drag-to-target and click-to-order interaction.
- `BattleScene` keeps the front-line blocking rules in the battle script, not in the view shell.

## Feedback Layer

- `BattleResultScene` handles victory and defeat presentation.
- Floating damage numbers and hit flashes are driven by the battle scene overlay layer.
- Slot death uses a short fade-out before removal so the battle state remains readable.

## Rules Layer

- The battle UI surfaces core rules from `docs/game-design/moon/rules/battle-rules.md`.
- The screen keeps a short battle log to make the current action readable at a glance.
- Target validation, row blocking, keyword effects, and end-of-turn resolution live in the battle script.

## Integration Notes

- Keep the input layer dumb: it should only translate gestures into semantic actions.
- Keep visual effects isolated from rules so damage math stays testable.
- Avoid putting card state, target state, and animation state in one node.
