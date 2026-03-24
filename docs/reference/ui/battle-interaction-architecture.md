# Battle Interaction Architecture

The battle screen is being split into three layers:

## Input Layer

- `BattleSwipeZone` handles swipe and tap gestures on the battlefield.
- Card taps still come from `KardsCard`.
- The current prototype uses swipe directions to switch focus, enter target mode, confirm a play, or cancel a selection.
- `BattleTargetSlot` is the concrete clickable target surface for front and back rows.

## Feedback Layer

- `BattleFeedbackLayer` renders large combat feedback: hit flashes, rings, and battle callouts.
- `BattleDamageOverlay` renders floating damage numbers and quick resource feedback.
- `expo-haptics` provides tactile feedback on supported devices.
- Slot death uses a short fade-out before removal so the battle state remains readable.

## Rules Layer

- The battle UI surfaces core rules from `docs/game-design/moon/rules/battle-rules.md`.
- The screen keeps a short battle log to make the current action readable at a glance.
- Future work should add deeper target validation, per-turn action limits, and card-specific collision rules here.

## Integration Notes

- Keep the input layer dumb: it should only translate gestures into semantic actions.
- Keep visual effects isolated from rules so damage math stays testable.
- Avoid putting card state, target state, and animation state in one component.
