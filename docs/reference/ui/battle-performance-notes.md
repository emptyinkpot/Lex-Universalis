# Battle Performance Notes

The battle screen now uses a few lightweight building blocks:

- `FlashList` for the battle log feed, so the log can grow without forcing a full re-render of every row.
- `BattleSwipeZone` for gesture translation.
- `BattleDamageOverlay` for floating damage text.
- `BattleFeedbackLayer` for high-impact combat moments.

Why this split helps:

- Input logic stays isolated from rendering.
- Visual effects can be swapped without rewriting combat state.
- The log feed can scale up when more rules and combat events are added.

Potential follow-ups:

- Batch log entries by turn.
- Add a compact event timeline above the battlefield.
- Reuse the same pattern for deck-builder change history.
