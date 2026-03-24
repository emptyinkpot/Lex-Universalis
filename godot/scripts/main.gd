extends Control

const STORY_PATH := "res://data/generated/story-showcase.json"
const STORY_PROGRESS_PATH := "res://data/generated/story-progress.json"
const MOON_CARDS_PATH := "res://data/generated/moon-card-drafts.json"
const BASE_CARDS_PATH := "res://data/generated/base-cards.json"
const BATTLE_SEED_PATH := "res://data/generated/battle-seed.json"

@onready var top_stats: Label = get_node("Margin/Root/TopBar/TopBarPadding/TopBarRow/TopStats")
@onready var story_summary: RichTextLabel = get_node("Margin/Root/Workspace/LeftColumn/StoryPanel/StoryPadding/StoryBox/StorySummary")
@onready var battle_summary: Label = get_node("Margin/Root/Workspace/LeftColumn/BattlePanel/BattlePadding/BattleBox/BattleSummary")
@onready var card_summary: Label = get_node("Margin/Root/Workspace/RightColumn/CardPanel/CardPadding/CardBox/CardSummary")
@onready var chapter_list: ItemList = get_node("Margin/Root/Workspace/RightColumn/CardPanel/CardPadding/CardBox/ChapterList")


func _ready() -> void:
	var story := _load_json(STORY_PATH)
	var progress := _load_json(STORY_PROGRESS_PATH)
	var moon_cards := _load_json(MOON_CARDS_PATH)
	var base_cards := _load_json(BASE_CARDS_PATH)
	var battle_seed := _load_json(BATTLE_SEED_PATH)

	_apply_shell_theme()
	_render_top_stats(story, progress, moon_cards, base_cards)
	_render_story(story, progress)
	_render_cards(moon_cards, base_cards)
	_render_battle(battle_seed)


func _load_json(file_path: String) -> Variant:
	if not FileAccess.file_exists(file_path):
		return {}

	var file := FileAccess.open(file_path, FileAccess.READ)
	if file == null:
		return {}

	var text := file.get_as_text()
	var parsed := JSON.parse_string(text)
	if parsed == null:
		return {}
	return parsed


func _apply_shell_theme() -> void:
	var title_color := Color("f1e2bf")
	var body_color := Color("dbc8a2")
	top_stats.add_theme_color_override("font_color", title_color)
	card_summary.add_theme_color_override("font_color", body_color)
	battle_summary.add_theme_color_override("font_color", body_color)
	story_summary.add_theme_color_override("default_color", body_color)


func _render_top_stats(story: Variant, progress: Variant, moon_cards: Variant, base_cards: Variant) -> void:
	var chapter_count := 0
	if story is Dictionary:
		chapter_count = (story.get("chapters", []) as Array).size()

	var moon_count := 0 if not (moon_cards is Array) else moon_cards.size()
	var base_count := 0 if not (base_cards is Array) else base_cards.size()
	var stars := 0 if not (progress is Dictionary) else int(progress.get("totalStars", 0))

	top_stats.text = "Chapters %d   Stars %d   Base Cards %d   Moon Drafts %d" % [
		chapter_count,
		stars,
		base_count,
		moon_count,
	]


func _render_story(story: Variant, progress: Variant) -> void:
	if not (story is Dictionary):
		story_summary.text = "[b]Story data missing.[/b]"
		return

	var chapters: Array = story.get("chapters", [])
	var player_factions: Array = story.get("playerFactions", [])
	var completed_levels: Array = []
	if progress is Dictionary:
		completed_levels = progress.get("completedLevels", [])

	story_summary.text = "[b]%s[/b]\n%s\n\n[i]%s[/i]\n\nPlayable factions: %s\nCompleted sample levels: %d" % [
		String(story.get("name", "Unknown Scenario")),
		String(story.get("description", "")),
		String(story.get("historicalBackground", "")),
		", ".join(player_factions),
		completed_levels.size(),
	]

	chapter_list.clear()
	for chapter in chapters:
		if chapter is Dictionary:
			var levels: Array = chapter.get("levels", [])
			chapter_list.add_item("%s  |  %d level(s)" % [
				String(chapter.get("name", "Unnamed Chapter")),
				levels.size(),
			])


func _render_cards(moon_cards: Variant, base_cards: Variant) -> void:
	var moon_count := 0 if not (moon_cards is Array) else moon_cards.size()
	var base_count := 0 if not (base_cards is Array) else base_cards.size()
	var first_moon_name := "N/A"
	if moon_cards is Array and moon_cards.size() > 0 and moon_cards[0] is Dictionary:
		first_moon_name = String(moon_cards[0].get("name", "N/A"))

	card_summary.text = "Current migration keeps data centralized and engine-readable.\n\nBase cards: %d\nMoon draft cards: %d\nFirst draft entry: %s\n\nNext step: instantiate real card scenes from this dataset." % [
		base_count,
		moon_count,
		first_moon_name,
	]


func _render_battle(battle_seed: Variant) -> void:
	if not (battle_seed is Dictionary):
		battle_summary.text = "Battle seed missing."
		return

	var player := battle_seed.get("player", {})
	var enemy := battle_seed.get("enemy", {})
	var slots: Array = battle_seed.get("slots", [])

	battle_summary.text = "Desktop target: one fixed viewport, no long scrolling pages.\n\nPlayer HP %d | Gold %d | Influence %d\nEnemy HP %d | Gold %d | Influence %d\nBattle slots: %d\n\nNext step: rebuild the current prototype battlefield as a Godot scene graph." % [
		int(player.get("health", 0)),
		int(player.get("gold", 0)),
		int(player.get("influence", 0)),
		int(enemy.get("health", 0)),
		int(enemy.get("gold", 0)),
		int(enemy.get("influence", 0)),
		slots.size(),
	]
