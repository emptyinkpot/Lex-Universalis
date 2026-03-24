# Battle Interaction Architecture

The battle screen is being split into three layers:

## Input Layer

- `BattleSwipeZone` handles swipe and tap gestures on the battlefield.
- Card taps still come from `KardsCard`.
- The current prototype uses swipe directions to switch focus, confirm a play, or cancel a selection.

## Feedback Layer

- `BattleFeedbackLayer` renders large combat feedback: hit flashes, rings, and battle callouts.
- `BattleDamageOverlay` renders floating damage numbers and quick resource feedback.
- `expo-haptics` provides tactile feedback on supported devices.

## Rules Layer

- The battle UI surfaces core rules from `docs/game-design/moon/rules/battle-rules.md`.
- The screen keeps a short battle log to make the current action readable at a glance.
- Future work should add target validation, counters, and per-turn action limits here.

## Integration Notes

- Keep the input layer dumb: it should only translate gestures into semantic actions.
- Keep visual effects isolated from rules so damage math stays testable.
- Avoid putting card state, target state, and animation state in one component.
