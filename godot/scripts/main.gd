extends Control

const STORY_SCENE := preload("res://scenes/story/StoryModeScene.tscn")
const BATTLE_SCENE := preload("res://scenes/battle/BattleScene.tscn")
const CARD_SCENE := preload("res://scenes/cards/CardGalleryScene.tscn")
const DATA_LOADER = preload("res://scripts/data_loader.gd")

@onready var top_stats: Label = get_node("Margin/Root/TopBar/TopBarPadding/TopBarRow/TopStats")
@onready var tab_container: TabContainer = get_node("Margin/Root/Modes")
var data_loader: RefCounted
var story_view: Control
var battle_view: Control
var card_view: Control

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	top_stats.add_theme_color_override("font_color", Color("f1e2bf"))
	_render_stats()
	story_view = _mount_scene("StoryTab", STORY_SCENE)
	battle_view = _mount_scene("BattleTab", BATTLE_SCENE)
	card_view = _mount_scene("CardsTab", CARD_SCENE)
	if story_view.has_signal("launch_level"):
		story_view.launch_level.connect(_on_story_launch_level)

func _render_stats() -> void:
	var manifest: Dictionary = data_loader.load_manifest()
	var datasets: Array = manifest.get("datasets", [])
	var summary: Array[String] = []
	for dataset in datasets:
		if dataset is Dictionary:
			var count: Variant = dataset.get("count", null)
			if count == null:
				summary.append(str(dataset.get("id", "dataset")))
			else:
				summary.append("%s %s" % [str(dataset.get("id", "dataset")), str(count)])
	top_stats.text = "Loaded datasets: %s" % "   |   ".join(summary)

func _mount_scene(tab_name: String, scene: PackedScene) -> Control:
	var host := tab_container.get_node(tab_name) as Control
	for child in host.get_children():
		child.queue_free()
	var instance := scene.instantiate() as Control
	instance.set_anchors_preset(Control.PRESET_FULL_RECT)
	host.add_child(instance)
	return instance

func _on_story_launch_level(level_data: Dictionary) -> void:
	tab_container.current_tab = 1
	if battle_view.has_method("start_level"):
		battle_view.start_level(level_data)
