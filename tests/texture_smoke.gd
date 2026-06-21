extends SceneTree

const TEXTURE_PATHS: Array[String] = [
	"res://assets/art/content/characters/character_orange/character_orange.png",
	"res://assets/art/content/characters/character_orange/character_orange_icon.png",
	"res://assets/art/content/characters/character_orange/character_orange_text_energy.png",
	"res://assets/art/content/enemies/enemy_blue_small.png",
	"res://assets/art/content/enemies/enemy_blue_medium.png",
	"res://assets/art/content/enemies/enemy_blue_large.png",
	"res://assets/art/content/cards/orange/card_orange.png",
]

func _initialize() -> void:
	var file_loader: Variant = load("res://core/autoload/FileLoader.gd").new()
	file_loader._ready()
	var failed_paths: Array[String] = []
	for texture_path in TEXTURE_PATHS:
		var texture: Variant = file_loader.load_texture(texture_path)
		if not texture is Texture2D:
			failed_paths.append(texture_path)
	
	if failed_paths.is_empty():
		print("[texture-smoke] all texture resources loaded")
		quit(0)
		return
	
	for failed_path in failed_paths:
		push_error("[texture-smoke] failed to load texture: " + failed_path)
	quit(1)
