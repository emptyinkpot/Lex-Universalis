extends Control

signal launch_level(level_data: Dictionary)

const DATA_LOADER = preload("res://scripts/data_loader.gd")

var story: Dictionary = {}
var data_loader: RefCounted
var campaign_scenarios: Array = []
var progress: Dictionary = {}
var selected_chapter_index := 0
var selected_level_index := 0

@onready var scenario_title: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/TitleBlock/Title")
@onready var scenario_meta: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/TitleBlock/Meta")
@onready var background_label: RichTextLabel = get_node("Padding/Root/Content/RightPanel/Padding/Body/Background")
@onready var chapter_list: ItemList = get_node("Padding/Root/Content/LeftPanel/Padding/Body/ChapterList")
@onready var level_list: ItemList = get_node("Padding/Root/Content/MiddlePanel/Padding/Body/LevelList")
@onready var level_detail: RichTextLabel = get_node("Padding/Root/Content/RightPanel/Padding/Body/LevelDetail")
@onready var launch_button: Button = get_node("Padding/Root/Content/RightPanel/Padding/Body/LaunchButton")
@onready var chapter_chip: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/InfoStrip/ChapterChip/Padding/Label")
@onready var level_chip: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/InfoStrip/LevelChip/Padding/Label")
@onready var progress_chip: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/InfoStrip/ProgressChip/Padding/Label")
@onready var hero_panel: PanelContainer = get_node("Padding/Root/Hero")
@onready var left_panel: PanelContainer = get_node("Padding/Root/Content/LeftPanel")
@onready var middle_panel: PanelContainer = get_node("Padding/Root/Content/MiddlePanel")
@onready var right_panel: PanelContainer = get_node("Padding/Root/Content/RightPanel")

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	story = data_loader.load_story_showcase()
	campaign_scenarios = data_loader.load_campaign_scenarios()
	progress = data_loader.load_story_progress()
	_apply_theme()
	launch_button.pressed.connect(_on_launch_button_pressed)
	_render_story()
	_play_intro()

func _apply_theme() -> void:
	scenario_title.add_theme_color_override("font_color", Color("f1e2bf"))
	scenario_meta.add_theme_color_override("font_color", Color("dbc8a2"))
	background_label.add_theme_color_override("default_color", Color("dbc8a2"))
	level_detail.add_theme_color_override("default_color", Color("dbc8a2"))

func _render_story() -> void:
	var factions: Array = story.get("playerFactions", [])
	var chapters: Array = story.get("chapters", [])
	var total_levels := 0
	for chapter in chapters:
		if chapter is Dictionary:
			total_levels += (chapter as Dictionary).get("levels", []).size()
	scenario_title.text = str(story.get("name", "Story Mode"))
	scenario_meta.text = "%s  |  %s  |  Factions: %s" % [
		str(story.get("year", "")),
		str(story.get("era", "")),
		", ".join(factions),
	]
	background_label.text = "[b]Historical Background[/b]\n%s" % str(story.get("historicalBackground", ""))
	chapter_list.clear()
	for chapter in chapters:
		if chapter is Dictionary:
			chapter_list.add_item(str(chapter.get("name", "Unnamed Chapter")))
	chapter_chip.text = "Chapters %d" % chapters.size()
	level_chip.text = "Levels %d" % total_levels
	progress_chip.text = "Stars %d" % int(progress.get("totalStars", 0))
	if chapters.size() > 0:
		chapter_list.select(0)
		selected_chapter_index = 0
		_render_levels_for_chapter(0)

func _render_levels_for_chapter(index: int) -> void:
	level_list.clear()
	level_detail.text = ""
	var chapters: Array = story.get("chapters", [])
	if index < 0 or index >= chapters.size():
		return
	var chapter := chapters[index] as Dictionary
	var levels: Array = chapter.get("levels", [])
	for level in levels:
		if level is Dictionary:
			var stars: int = data_loader.get_level_stars(str(level.get("id", "")))
			level_list.add_item("%s  |  %s  |  %s" % [
				str(level.get("name", "Unnamed Level")),
				str(level.get("difficulty", "NORMAL")),
				("%d star" % stars) if stars == 1 else ("%d stars" % stars),
			])
	if levels.size() > 0:
		level_list.select(0)
		selected_level_index = 0
		_render_level_detail(index, 0)

func _render_level_detail(chapter_index: int, level_index: int) -> void:
	var chapters: Array = story.get("chapters", [])
	if chapter_index < 0 or chapter_index >= chapters.size():
		return
	var chapter := chapters[chapter_index] as Dictionary
	var levels: Array = chapter.get("levels", [])
	if level_index < 0 or level_index >= levels.size():
		return
	var level := levels[level_index] as Dictionary
	var reward_lines: Array[String] = []
	for reward in level.get("rewards", []):
		if reward is Dictionary:
			reward_lines.append("- %s" % str(reward.get("description", "")))
	level_detail.text = "[b]%s[/b]\n%s\n\n[i]%s[/i]\n\n[b]Victory[/b]\n%s\n\n[b]Defeat[/b]\n%s\n\n[b]Rewards[/b]\n%s" % [
		str(level.get("name", "")),
		str(level.get("description", "")),
		str(level.get("storyText", "")),
		str(level.get("victoryCondition", "")),
		str(level.get("defeatCondition", "")),
		"\n".join(reward_lines),
	]

func _on_chapter_list_item_selected(index: int) -> void:
	selected_chapter_index = index
	_render_levels_for_chapter(index)

func _on_level_list_item_selected(index: int) -> void:
	var selected := chapter_list.get_selected_items()
	var chapter_index := selected[0] if selected.size() > 0 else 0
	selected_chapter_index = chapter_index
	selected_level_index = index
	_render_level_detail(chapter_index, index)

func _on_launch_button_pressed() -> void:
	var chapters: Array = story.get("chapters", [])
	if selected_chapter_index < 0 or selected_chapter_index >= chapters.size():
		return
	var chapter := chapters[selected_chapter_index] as Dictionary
	var levels: Array = chapter.get("levels", [])
	if selected_level_index < 0 or selected_level_index >= levels.size():
		return
	var level := (levels[selected_level_index] as Dictionary).duplicate(true)
	var canonical_level := _find_campaign_level(str(level.get("id", "")))
	if not canonical_level.is_empty():
		for key in canonical_level.keys():
			level[key] = canonical_level[key]
	level["playerFaction"] = str(story.get("recommendedFaction", "ENGLAND"))
	level["scenarioName"] = str(story.get("name", "Story Mode"))
	level["scenarioYear"] = int(story.get("year", 0))
	level["scenarioEra"] = str(story.get("era", ""))
	level["chapterName"] = str(chapter.get("name", "Chapter"))
	launch_level.emit(level)

func _find_campaign_level(level_id: String) -> Dictionary:
	for scenario in campaign_scenarios:
		if not (scenario is Dictionary):
			continue
		for chapter in (scenario as Dictionary).get("chapters", []):
			if not (chapter is Dictionary):
				continue
			for level in (chapter as Dictionary).get("levels", []):
				if level is Dictionary and str(level.get("id", "")) == level_id:
					return (level as Dictionary).duplicate(true)
	return {}

func refresh_progress() -> void:
	progress = data_loader.load_story_progress()
	_render_story()

func _play_intro() -> void:
	hero_panel.modulate = Color(1, 1, 1, 0)
	hero_panel.scale = Vector2(0.985, 0.985)
	left_panel.modulate = Color(1, 1, 1, 0)
	left_panel.scale = Vector2(0.96, 0.96)
	middle_panel.modulate = Color(1, 1, 1, 0)
	middle_panel.scale = Vector2(0.96, 0.96)
	right_panel.modulate = Color(1, 1, 1, 0)
	right_panel.scale = Vector2(0.96, 0.96)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(hero_panel, "modulate", Color(1, 1, 1, 1), 0.38)
	tween.tween_property(hero_panel, "scale", Vector2.ONE, 0.42)
	tween.tween_property(left_panel, "modulate", Color(1, 1, 1, 1), 0.46).set_delay(0.06)
	tween.tween_property(left_panel, "scale", Vector2.ONE, 0.46).set_delay(0.06)
	tween.tween_property(middle_panel, "modulate", Color(1, 1, 1, 1), 0.5).set_delay(0.1)
	tween.tween_property(middle_panel, "scale", Vector2.ONE, 0.5).set_delay(0.1)
	tween.tween_property(right_panel, "modulate", Color(1, 1, 1, 1), 0.54).set_delay(0.14)
	tween.tween_property(right_panel, "scale", Vector2.ONE, 0.54).set_delay(0.14)
