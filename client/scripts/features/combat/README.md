# Combat Scripts

This folder owns the combat loop and player combat interaction flow.

Keep these here:

- combat start/end orchestration
- player and enemy turn flow
- card play queueing and combat hand rules
- end-turn coordination
- future drag/drop combat services

Keep these outside:

- visual-only card widgets in `res://client/scripts/ui/`
- generic actions in `res://core/runtime/actions/`
- global registries and signals in `res://core/autoload/`
- prototype and runtime data models in `res://core/data/`

