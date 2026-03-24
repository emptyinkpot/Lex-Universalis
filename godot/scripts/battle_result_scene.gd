extends Control

signal return_to_story()

@onready var title_label: Label = get_node("Padding/Root/Hero/Padding/HeroStack/Title")
@onready var subtitle_label: Label = get_node("Padding/Root/Hero/Padding/HeroStack/Subtitle")
@onready var outcome_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/OutcomeChip/Padding/Label")
@onready var stars_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/StarsChip/Padding/Label")
@onready var rewards_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/RewardsChip/Padding/Label")
@onready var progress_chip: Label = get_node("Padding/Root/Hero/Padding/HeroStack/InfoStrip/ProgressChip/Padding/Label")
@onready var summary_label: RichTextLabel = get_node("Padding/Root/Body/LeftPanel/Padding/Summary")
@onready var rewards_label: RichTextLabel = get_node("Padding/Root/Body/RightPanel/Padding/Rewards")
@onready var button: Button = get_node("Padding/Root/Footer/ReturnButton")

func _ready() -> void:
	button.pressed.connect(func() -> void: return_to_story.emit())

func setup_result(result_data: Dictionary) -> void:
	var won := bool(result_data.get("won", false))
	title_label.text = "Victory" if won else "Defeat"
	subtitle_label.text = "%s  |  %s" % [
		str(result_data.get("scenarioName", "Story Mode")),
		str(result_data.get("levelName", "Battle")),
	]
	var reward_count := 0
	for reward in result_data.get("rewards", []):
		if reward is Dictionary:
			reward_count += 1
	outcome_chip.text = "Outcome %s" % ("Victory" if won else "Defeat")
	stars_chip.text = "Stars %d" % int(result_data.get("starsEarned", 0))
	rewards_chip.text = "Rewards %d" % reward_count
	progress_chip.text = "Progress Saved"
	summary_label.text = "[b]Objective[/b]\n%s\n\n[b]Outcome[/b]\n%s\n\n[b]Battle Summary[/b]\n%s" % [
		str(result_data.get("victoryCondition", "")),
		"%s\nStars earned: %d" % [str(result_data.get("outcomeText", "")), int(result_data.get("starsEarned", 0))],
		str(result_data.get("logSummary", "")),
	]
	var reward_lines: Array[String] = []
	for reward in result_data.get("rewards", []):
		if reward is Dictionary:
			reward_lines.append("- %s" % str(reward.get("description", "")))
	rewards_label.text = "[b]Rewards[/b]\n%s\n\n[b]Enemy Deck[/b]\n%s" % [
		"\n".join(reward_lines) if not reward_lines.is_empty() else "- None",
		", ".join(result_data.get("enemyDeck", [])),
	]
