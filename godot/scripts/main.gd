extends Control

const STORY_SCENE := preload("res://scenes/story/StoryModeScene.tscn")
const BATTLE_SCENE := preload("res://scenes/battle/BattleScene.tscn")
const CARD_EDITOR_SCENE := preload("res://scenes/cards/CardEditorScene.tscn")
const DECK_BUILDER_SCENE := preload("res://scenes/deck/DeckBuilderScene.tscn")
const CARD_SCENE := preload("res://scenes/cards/CardGalleryScene.tscn")
const RESULT_SCENE := preload("res://scenes/results/BattleResultScene.tscn")
const HOME_SCENE := preload("res://scenes/home/HomeScene.tscn")
const DATA_LOADER = preload("res://scripts/data_loader.gd")

@onready var top_stats: Label = get_node("Margin/Root/TopBar/TopBarPadding/TopBarRow/TopStats")
@onready var tab_container: TabContainer = get_node("Margin/Root/Modes")
var data_loader: RefCounted
var home_view: Control
var story_view: Control
var battle_view: Control
var card_editor_view: Control
var deck_builder_view: Control
var card_view: Control
var result_view: Control
var ui_theme: Theme

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	ui_theme = _build_desktop_theme()
	theme = ui_theme
	top_stats.add_theme_color_override("font_color", Color("f1e2bf"))
	_render_stats()
	home_view = _mount_scene("HomeTab", HOME_SCENE)
	story_view = _mount_scene("StoryTab", STORY_SCENE)
	battle_view = _mount_scene("BattleTab", BATTLE_SCENE)
	card_editor_view = _mount_scene("CardEditorTab", CARD_EDITOR_SCENE)
	deck_builder_view = _mount_scene("DeckBuilderTab", DECK_BUILDER_SCENE)
	card_view = _mount_scene("CardsTab", CARD_SCENE)
	result_view = _mount_scene("ResultsTab", RESULT_SCENE)
	if home_view.has_signal("open_page"):
		home_view.open_page.connect(_on_home_open_page)
	if story_view.has_signal("launch_level"):
		story_view.launch_level.connect(_on_story_launch_level)
	if battle_view.has_signal("battle_finished"):
		battle_view.battle_finished.connect(_on_battle_finished)
	if result_view.has_signal("return_to_story"):
		result_view.return_to_story.connect(_on_return_to_story)

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

func _on_battle_finished(result_data: Dictionary) -> void:
	if bool(result_data.get("won", false)):
		var level_id := str(result_data.get("levelId", ""))
		if not level_id.is_empty():
			data_loader.update_story_progress(level_id, int(result_data.get("starsEarned", 0)), result_data.get("rewards", []))
		_render_stats()
	tab_container.current_tab = 3
	if result_view.has_method("setup_result"):
		result_view.setup_result(result_data)

func _on_return_to_story() -> void:
	tab_container.current_tab = 1
	if story_view.has_method("refresh_progress"):
		story_view.refresh_progress()

func _on_home_open_page(page_id: String) -> void:
	match page_id:
		"story":
			tab_container.current_tab = 1
		"battle":
			tab_container.current_tab = 2
		"card_editor":
			tab_container.current_tab = 3
		"deck_builder":
			tab_container.current_tab = 4
		"cards":
			tab_container.current_tab = 5
		"results":
			tab_container.current_tab = 6
		_:
			tab_container.current_tab = 0

func _build_desktop_theme() -> Theme:
	var theme := Theme.new()
	var panel_bg := Color("1b140f")
	var panel_bg_alt := Color("241915")
	var panel_border := Color("9d7b4a")
	var panel_border_strong := Color("d7bf86")
	var text_main := Color("f2e2bf")
	var text_soft := Color("d8c39a")
	var text_dim := Color("8f7757")

	theme.set_color("font_color", "Label", text_main)
	theme.set_color("font_color", "Button", text_main)
	theme.set_color("font_hover_color", "Button", Color("fff0c5"))
	theme.set_color("font_pressed_color", "Button", Color("fff8df"))
	theme.set_color("font_disabled_color", "Button", text_dim)
	theme.set_color("default_color", "RichTextLabel", text_soft)
	theme.set_color("font_color", "TabBar", text_main)
	theme.set_color("font_hover_color", "TabBar", Color("fff0c5"))
	theme.set_color("font_selected_color", "TabBar", Color("fff6de"))
	theme.set_color("font_color", "ItemList", text_main)
	theme.set_color("font_selected_color", "ItemList", Color("20140f"))
	theme.set_color("font_hover_color", "ItemList", text_main)
	theme.set_color("selected_font_color", "ItemList", Color("20140f"))
	theme.set_color("font_color", "LineEdit", text_main)
	theme.set_color("font_selected_color", "LineEdit", Color("20140f"))
	theme.set_color("font_color", "TextEdit", text_main)
	theme.set_color("font_selected_color", "TextEdit", Color("20140f"))
	theme.set_color("font_color", "SpinBox", text_main)
	theme.set_font_size("font_size", "Label", 16)
	theme.set_font_size("font_size", "Button", 16)
	theme.set_font_size("font_size", "ItemList", 14)
	theme.set_font_size("font_size", "LineEdit", 15)
	theme.set_font_size("font_size", "TextEdit", 15)
	theme.set_font_size("font_size", "SpinBox", 15)
	theme.set_font_size("normal_font_size", "RichTextLabel", 14)
	theme.set_font_size("font_size", "TabBar", 16)

	theme.set_stylebox("panel", "PanelContainer", _make_panel_style(panel_bg, panel_border, 16, 2))
	theme.set_stylebox("panel", "ScrollContainer", _make_panel_style(panel_bg, panel_border, 12, 1))
	theme.set_stylebox("panel", "TabContainer", _make_panel_style(panel_bg_alt, panel_border, 12, 1))
	theme.set_stylebox("panel", "RichTextLabel", _make_panel_style(panel_bg, panel_border, 8, 1))
	theme.set_stylebox("normal", "Button", _make_button_style(panel_bg_alt, panel_border, 14, 2))
	theme.set_stylebox("hover", "Button", _make_button_style(Color("2f2219"), panel_border_strong, 14, 2))
	theme.set_stylebox("pressed", "Button", _make_button_style(Color("3a2a1e"), panel_border_strong, 14, 2))
	theme.set_stylebox("focus", "Button", _make_button_style(Color("2f2219"), panel_border_strong, 14, 2))
	theme.set_stylebox("disabled", "Button", _make_button_style(Color("19130f"), text_dim, 14, 1))
	theme.set_stylebox("panel", "ItemList", _make_panel_style(Color("17100d"), panel_border, 10, 1))
	theme.set_stylebox("selected", "ItemList", _make_button_style(Color("d0b06e"), Color("f5ddb0"), 10, 2))
	theme.set_stylebox("cursor", "ItemList", _make_button_style(Color("2c2017"), panel_border_strong, 10, 1))
	theme.set_stylebox("tab_selected", "TabBar", _make_button_style(Color("312116"), panel_border_strong, 12, 2))
	theme.set_stylebox("tab_unselected", "TabBar", _make_button_style(Color("1e1711"), panel_border, 12, 1))
	theme.set_stylebox("panel", "TabBar", _make_panel_style(panel_bg, panel_border, 10, 1))
	theme.set_stylebox("normal", "LineEdit", _make_input_style(panel_bg_alt, panel_border, 12))
	theme.set_stylebox("focus", "LineEdit", _make_input_style(Color("2d2017"), panel_border_strong, 12))
	theme.set_stylebox("normal", "TextEdit", _make_input_style(panel_bg_alt, panel_border, 12))
	theme.set_stylebox("focus", "TextEdit", _make_input_style(Color("2d2017"), panel_border_strong, 12))
	theme.set_stylebox("normal", "SpinBox", _make_input_style(panel_bg_alt, panel_border, 12))
	theme.set_stylebox("focus", "SpinBox", _make_input_style(Color("2d2017"), panel_border_strong, 12))
	return theme

func _make_panel_style(bg_color: Color, border_color: Color, shadow_size: int, border_width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg_color
	style.border_color = border_color
	style.border_width_left = border_width
	style.border_width_top = border_width
	style.border_width_right = border_width
	style.border_width_bottom = border_width
	style.corner_radius_top_left = 18
	style.corner_radius_top_right = 18
	style.corner_radius_bottom_left = 18
	style.corner_radius_bottom_right = 18
	style.shadow_size = shadow_size
	style.shadow_color = Color(0, 0, 0, 0.35)
	return style

func _make_button_style(bg_color: Color, border_color: Color, radius: int, border_width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg_color
	style.border_color = border_color
	style.border_width_left = border_width
	style.border_width_top = border_width
	style.border_width_right = border_width
	style.border_width_bottom = border_width
	style.corner_radius_top_left = radius
	style.corner_radius_top_right = radius
	style.corner_radius_bottom_left = radius
	style.corner_radius_bottom_right = radius
	style.shadow_size = 8
	style.shadow_color = Color(0, 0, 0, 0.28)
	return style

func _make_input_style(bg_color: Color, border_color: Color, radius: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg_color
	style.border_color = border_color
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = radius
	style.corner_radius_top_right = radius
	style.corner_radius_bottom_left = radius
	style.corner_radius_bottom_right = radius
	style.shadow_size = 6
	style.shadow_color = Color(0, 0, 0, 0.22)
	return style
