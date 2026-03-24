# Battle Performance Notes

The Godot battle screen uses a few lightweight building blocks:

- `RichTextLabel` for the battle log feed.
- `Line2D` for drag guidance.
- `Control` overlays for floating damage text and card fly-ins.
- Slot feedback is kept on the slot nodes so the battlefield stays readable.

Why this split helps:

- Input logic stays isolated from rendering.
- Visual effects can be swapped without rewriting combat state.
- The log feed can scale up when more rules and combat events are added.

Potential follow-ups:

- Batch log entries by turn.
- Add a compact event timeline above the battlefield.
- Reuse the same pattern for the story result screen and deck workspace.
