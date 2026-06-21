# Script Layers

The script root is split by abstraction level. Do not add feature, domain, or runtime mechanism folders directly under `scripts/`.

- `domain/`: game-domain objects and rule attachments, such as combatants, artifacts, status effects, run modifiers, and card listeners.
- `features/`: feature orchestration and workflows, such as the combat loop.
- `runtime/`: generic execution machinery, such as actions, validators, and action interceptors.
- `ui/`: visual controls, overlays, menus, and input-facing widgets.

