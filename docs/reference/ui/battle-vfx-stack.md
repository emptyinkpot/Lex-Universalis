# Battle VFX Stack

Battle page feedback currently leans on three layers in Godot:

- `Control` overlays for hit flashes, impact rings, and slash cards.
- `Tween`-driven motion for fan-layout, selection, and shake animation.
- Windows haptics are not part of the current desktop build; feedback is visual and audio-first.

Possible future additions:

- `AnimatedSprite2D` or particle scenes for one-shot spell, victory, or defeat sequences.
- `TextureRect` overlays for lightweight icons and battle timeline markers.

Notes:

- Keep the battle rules visible in the UI, not only in markdown.
- Keep the effect layer separate from the combat resolution layer.
