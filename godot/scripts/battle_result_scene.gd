extends Control

signal return_to_story()

const DATA_LOADER = preload("res://scripts/data_loader.gd")

@onready var title_label: Label = get_node("Padding/Root/Hero/Padding/HeroStack/Title")
@onready var subtitle_label: Label = get_node("Padding/Root/Hero/Padding/HeroStack/Subtitle")
@onready var outcome_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/OutcomeChip/Padding/Label")
@onready var stars_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/StarsChip/Padding/Label")
@onready var rewards_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/RewardsChip/Padding/Label")
@onready var progress_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/ProgressChip/Padding/Label")
@onready var summary_label: RichTextLabel = get_node("Padding/Root/Body/LeftPanel/Padding/Summary")
@onready var rewards_label: RichTextLabel = get_node("Padding/Root/Body/RightPanel/Padding/Rewards")
@onready var button: Button = get_node("Padding/Root/Footer/ReturnButton")
@onready var hero_panel: PanelContainer = get_node("Padding/Root/Hero")
@onready var left_panel: PanelContainer = get_node("Padding/Root/Body/LeftPanel")
@onready var right_panel: PanelContainer = get_node("Padding/Root/Body/RightPanel")
@onready var footer_row: HBoxContainer = get_node("Padding/Root/Footer")

var data_loader: RefCounted

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	button.pressed.connect(func() -> void: return_to_story.emit())
	_apply_language_labels()
	_play_intro()

func setup_result(result_data: Dictionary) -> void:
	var won := bool(result_data.get("won", false))
	title_label.text = data_loader.t("result_title_win") if won else data_loader.t("result_title_lose")
	subtitle_label.text = "%s  |  %s" % [
		str(result_data.get("scenarioName", "Story Mode")),
		str(result_data.get("levelName", "Battle")),
	]
	var reward_count := 0
	for reward in result_data.get("rewards", []):
		if reward is Dictionary:
			reward_count += 1
	outcome_chip.text = "%s %s" % [data_loader.t("result_outcome"), ("胜利" if won else "失败")]
	stars_chip.text = "%s %d" % [data_loader.t("result_stars"), int(result_data.get("starsEarned", 0))]
	rewards_chip.text = "%s %d" % [data_loader.t("result_rewards"), reward_count]
	progress_chip.text = data_loader.t("result_progress")
	summary_label.text = "[b]%s[/b]\n%s\n\n[b]%s[/b]\n%s\n\n[b]%s[/b]\n%s" % [
		data_loader.t("result_objective"),
		str(result_data.get("victoryCondition", "")),
		data_loader.t("result_outcome"),
		"%s\n%s: %d" % [str(result_data.get("outcomeText", "")), data_loader.t("result_stars"), int(result_data.get("starsEarned", 0))],
		data_loader.t("result_battle_summary"),
		str(result_data.get("logSummary", "")),
	]
	var reward_lines: Array[String] = []
	for reward in result_data.get("rewards", []):
		if reward is Dictionary:
			reward_lines.append("- %s" % str(reward.get("description", "")))
	rewards_label.text = "[b]%s[/b]\n%s\n\n[b]%s[/b]\n%s" % [
		data_loader.t("result_rewards"),
		"\n".join(reward_lines) if not reward_lines.is_empty() else "- 无",
		data_loader.t("result_enemy_deck"),
		", ".join(result_data.get("enemyDeck", [])),
	]

func _play_intro() -> void:
	hero_panel.modulate = Color(1, 1, 1, 0)
	hero_panel.scale = Vector2(0.985, 0.985)
	left_panel.modulate = Color(1, 1, 1, 0)
	left_panel.scale = Vector2(0.96, 0.96)
	right_panel.modulate = Color(1, 1, 1, 0)
	right_panel.scale = Vector2(0.96, 0.96)
	footer_row.modulate = Color(1, 1, 1, 0)
	footer_row.scale = Vector2(0.98, 0.98)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(hero_panel, "modulate", Color(1, 1, 1, 1), 0.36)
	tween.tween_property(hero_panel, "scale", Vector2.ONE, 0.4)
	tween.tween_property(left_panel, "modulate", Color(1, 1, 1, 1), 0.44).set_delay(0.08)
	tween.tween_property(left_panel, "scale", Vector2.ONE, 0.44).set_delay(0.08)
	tween.tween_property(right_panel, "modulate", Color(1, 1, 1, 1), 0.48).set_delay(0.12)
	tween.tween_property(right_panel, "scale", Vector2.ONE, 0.48).set_delay(0.12)
	tween.tween_property(footer_row, "modulate", Color(1, 1, 1, 1), 0.34).set_delay(0.18)
	tween.tween_property(footer_row, "scale", Vector2.ONE, 0.34).set_delay(0.18)

func _apply_language_labels() -> void:
	title_label.text = data_loader.t("result_title_win")
	subtitle_label.text = data_loader.t("result_subtitle")
	outcome_chip.text = data_loader.t("result_outcome")
	stars_chip.text = data_loader.t("result_stars")
	rewards_chip.text = data_loader.t("result_rewards")
	progress_chip.text = data_loader.t("result_progress")
	button.text = data_loader.t("result_return")

func refresh_language() -> void:
	_apply_language_labels()
