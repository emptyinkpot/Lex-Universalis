extends Control

signal open_page(page_id: String)

@onready var hero_stats: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroBody/HeroStats")
@onready var mode_list: ItemList = get_node("Padding/Root/Content/ModePanel/ModePadding/ModeBody/ModeList")
@onready var detail_title: Label = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/DetailTitle")
@onready var detail_text: RichTextLabel = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/DetailText")
@onready var launch_button: Button = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/ActionRow/LaunchButton")
@onready var secondary_button: Button = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/ActionRow/SecondaryButton")
@onready var story_chip: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/InfoStrip/StoryChip/Padding/Label")
@onready var editor_chip: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/InfoStrip/EditorChip/Padding/Label")
@onready var deck_chip: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/InfoStrip/DeckChip/Padding/Label")
@onready var build_chip: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/InfoStrip/BuildChip/Padding/Label")
@onready var hero_panel: PanelContainer = get_node("Padding/Root/Hero")
@onready var mode_panel: PanelContainer = get_node("Padding/Root/Content/ModePanel")
@onready var detail_panel: PanelContainer = get_node("Padding/Root/Content/DetailPanel")

var data_loader: RefCounted
var story_progress: Dictionary = {}
var selected_mode_id := "story"
var mode_entries := [
	{
		"id": "story",
		"title": "",
		"summary": "",
		"action": "",
	},
	{
		"id": "battle",
		"title": "",
		"summary": "",
		"action": "",
	},
	{
		"id": "card_editor",
		"title": "",
		"summary": "",
		"action": "",
	},
	{
		"id": "deck_builder",
		"title": "",
		"summary": "",
		"action": "",
	},
	{
		"id": "cards",
		"title": "",
		"summary": "",
		"action": "",
	},
	{
		"id": "results",
		"title": "",
		"summary": "",
		"action": "",
	},
	{
		"id": "settings",
		"title": "",
		"summary": "",
		"action": "",
	},
	{
		"id": "ai_assistant",
		"title": "",
		"summary": "",
		"action": "",
	},
]

func _ready() -> void:
	data_loader = preload("res://scripts/data_loader.gd").new()
	_apply_language_texts()
	_refresh_progress_stats()
	_populate_modes()
	_select_mode(0)
	_play_intro()

func refresh_home() -> void:
	_refresh_progress_stats()

func _refresh_progress_stats() -> void:
	story_progress = data_loader.load_story_progress()
	var completed_levels: Array = story_progress.get("completed_levels", [])
	var total_stars := int(story_progress.get("totalStars", 0))
	var working_cards: Array = data_loader.load_working_cards()
	var deck_cards: Array = data_loader.load_deck_list()
	var manifest: Dictionary = data_loader.load_manifest()
	var datasets: Array = manifest.get("datasets", [])
	hero_stats.text = "%s %s | %s %s | %s %s | %s %s | %s %s" % [
		data_loader.t("home_progress"),
		str(completed_levels.size()),
		data_loader.t("home_total_stars"),
		str(total_stars),
		data_loader.t("home_drafts"),
		str(working_cards.size()),
		data_loader.t("home_deck_cards"),
		str(deck_cards.size()),
		data_loader.t("home_datasets"),
		str(datasets.size()),
	]
	story_chip.text = "%s %s" % [data_loader.t("story_chapters"), str(completed_levels.size())]
	editor_chip.text = "%s %s" % [data_loader.t("card_editor_drafts"), str(working_cards.size())]
	deck_chip.text = "%s %s" % [data_loader.t("deck_builder_deck"), str(deck_cards.size())]
	build_chip.text = "%s %s" % [data_loader.t("home_language"), ("中文" if data_loader.get_language() != "en" else "EN")]

func _populate_modes() -> void:
	mode_list.clear()
	for entry in mode_entries:
		mode_list.add_item(str(entry.get("title", "Mode")))

func _apply_language_texts() -> void:
	mode_entries[0]["title"] = data_loader.t("home_story_title")
	mode_entries[0]["summary"] = data_loader.t("home_story_summary")
	mode_entries[0]["action"] = data_loader.t("home_story_action")
	mode_entries[1]["title"] = data_loader.t("home_battle_title")
	mode_entries[1]["summary"] = data_loader.t("home_battle_summary")
	mode_entries[1]["action"] = data_loader.t("home_battle_action")
	mode_entries[2]["title"] = data_loader.t("home_card_editor_title")
	mode_entries[2]["summary"] = data_loader.t("home_card_editor_summary")
	mode_entries[2]["action"] = data_loader.t("home_card_editor_action")
	mode_entries[3]["title"] = data_loader.t("home_deck_builder_title")
	mode_entries[3]["summary"] = data_loader.t("home_deck_builder_summary")
	mode_entries[3]["action"] = data_loader.t("home_deck_builder_action")
	mode_entries[4]["title"] = data_loader.t("home_cards_title")
	mode_entries[4]["summary"] = data_loader.t("home_cards_summary")
	mode_entries[4]["action"] = data_loader.t("home_cards_action")
	mode_entries[5]["title"] = data_loader.t("home_results_title")
	mode_entries[5]["summary"] = data_loader.t("home_results_summary")
	mode_entries[5]["action"] = data_loader.t("home_results_action")
	mode_entries[6]["title"] = data_loader.t("home_settings_title")
	mode_entries[6]["summary"] = data_loader.t("home_settings_summary")
	mode_entries[6]["action"] = data_loader.t("home_settings_action")
	mode_entries[7]["title"] = data_loader.t("home_ai_title")
	mode_entries[7]["summary"] = data_loader.t("home_ai_summary")
	mode_entries[7]["action"] = data_loader.t("home_ai_action")
	get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroBody/HeroText/Title").text = data_loader.t("app_title")
	get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroBody/HeroText/Subtitle").text = data_loader.t("app_subtitle")
	get_node("Padding/Root/Content/ModePanel/ModePadding/ModeBody/ModeHeader").text = data_loader.t("home_modes_title")
	_populate_modes()

func _select_mode(index: int) -> void:
	if index < 0 or index >= mode_entries.size():
		return
	var entry: Dictionary = mode_entries[index]
	selected_mode_id = str(entry.get("id", "story"))
	detail_title.text = str(entry.get("title", "Mode"))
	detail_text.text = "[b]%s[/b]\n\n%s\n\n%s" % [
		str(entry.get("title", "Mode")),
		str(entry.get("summary", "")),
		data_loader.t("app_footer"),
	]
	launch_button.text = str(entry.get("action", data_loader.t("home_story_action")))
	if selected_mode_id == "settings":
		secondary_button.text = data_loader.t("settings_back")
	elif selected_mode_id == "ai_assistant":
		secondary_button.text = data_loader.t("home_ai_action")
	else:
		secondary_button.text = data_loader.t("home_settings_action")

func _on_mode_selected(index: int) -> void:
	_select_mode(index)

func _on_launch_pressed() -> void:
	open_page.emit(selected_mode_id)

func _on_secondary_pressed() -> void:
	open_page.emit(selected_mode_id)

func _play_intro() -> void:
	hero_panel.modulate = Color(1, 1, 1, 0)
	hero_panel.scale = Vector2(0.985, 0.985)
	mode_panel.modulate = Color(1, 1, 1, 0)
	mode_panel.scale = Vector2(0.96, 0.96)
	detail_panel.modulate = Color(1, 1, 1, 0)
	detail_panel.scale = Vector2(0.96, 0.96)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(hero_panel, "modulate", Color(1, 1, 1, 1), 0.38)
	tween.tween_property(hero_panel, "scale", Vector2.ONE, 0.42)
	tween.tween_property(mode_panel, "modulate", Color(1, 1, 1, 1), 0.46).set_delay(0.08)
	tween.tween_property(mode_panel, "scale", Vector2.ONE, 0.46).set_delay(0.08)
	tween.tween_property(detail_panel, "modulate", Color(1, 1, 1, 1), 0.5).set_delay(0.12)
	tween.tween_property(detail_panel, "scale", Vector2.ONE, 0.5).set_delay(0.12)

func refresh_language() -> void:
	_apply_language_texts()
	refresh_home()
	var selected_items := mode_list.get_selected_items()
	var selected_index := selected_items[0] if selected_items.size() > 0 else 0
	_select_mode(selected_index)
