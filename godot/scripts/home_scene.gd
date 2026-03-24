extends Control

signal open_page(page_id: String)

@onready var hero_stats: Label = get_node("Padding/Root/Hero/HeroPadding/HeroBody/HeroStats")
@onready var mode_list: ItemList = get_node("Padding/Root/Content/ModePanel/ModePadding/ModeBody/ModeList")
@onready var detail_title: Label = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/DetailTitle")
@onready var detail_text: RichTextLabel = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/DetailText")
@onready var launch_button: Button = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/ActionRow/LaunchButton")
@onready var secondary_button: Button = get_node("Padding/Root/Content/DetailPanel/DetailPadding/DetailBody/ActionRow/SecondaryButton")

var data_loader: RefCounted
var story_progress: Dictionary = {}
var selected_mode_id := "story"
var mode_entries := [
	{
		"id": "story",
		"title": "Story Mode",
		"summary": "Play the campaign showcase and launch battles from a single desktop viewport.",
		"action": "Open Story Mode",
	},
	{
		"id": "battle",
		"title": "Battle Demo",
		"summary": "Jump straight into the mirrored battlefield and test combat flow.",
		"action": "Open Battle Scene",
	},
	{
		"id": "card_editor",
		"title": "Card Editor",
		"summary": "Edit harvested Moon cards, tweak drafts, and save local working copies.",
		"action": "Open Card Editor",
	},
	{
		"id": "deck_builder",
		"title": "Deck Builder",
		"summary": "Assemble a local deck from the current card pool and save it to disk.",
		"action": "Open Deck Builder",
	},
	{
		"id": "cards",
		"title": "Card Gallery",
		"summary": "Browse the card library, inspect card frames, and review the harvested Moon archive cards.",
		"action": "Open Card Gallery",
	},
	{
		"id": "results",
		"title": "Results Screen",
		"summary": "Inspect battle rewards, stars, and story progress feedback.",
		"action": "Open Result View",
	},
]

func _ready() -> void:
	data_loader = preload("res://scripts/data_loader.gd").new()
	refresh_home()
	_populate_modes()
	_select_mode(0)

func refresh_home() -> void:
	story_progress = data_loader.load_story_progress()
	var completed_levels: Array = story_progress.get("completed_levels", [])
	var total_stars := int(story_progress.get("totalStars", 0))
	hero_stats.text = "Story progress: %s completed | %s stars" % [str(completed_levels.size()), str(total_stars)]

func _populate_modes() -> void:
	mode_list.clear()
	for entry in mode_entries:
		mode_list.add_item(str(entry.get("title", "Mode")))

func _select_mode(index: int) -> void:
	if index < 0 or index >= mode_entries.size():
		return
	var entry: Dictionary = mode_entries[index]
	selected_mode_id = str(entry.get("id", "story"))
	detail_title.text = str(entry.get("title", "Mode"))
	detail_text.text = "[b]%s[/b]\n\n%s\n\nThis is the desktop launcher-style entry for the current Godot build." % [str(entry.get("title", "Mode")), str(entry.get("summary", ""))]
	launch_button.text = str(entry.get("action", "Launch"))
	secondary_button.text = "Select"

func _on_mode_selected(index: int) -> void:
	_select_mode(index)

func _on_launch_pressed() -> void:
	open_page.emit(selected_mode_id)

func _on_secondary_pressed() -> void:
	open_page.emit(selected_mode_id)
