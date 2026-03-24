class_name DataLoader
extends RefCounted

const GENERATED_DIR := "res://data/generated/"
const STORY_PROGRESS_SAVE_PATH := "user://story-progress.save.json"

func load_json_file(file_name: String, fallback: Variant = {}) -> Variant:
	var path := GENERATED_DIR + file_name
	if not FileAccess.file_exists(path):
		return fallback
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return fallback
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	return parsed if parsed != null else fallback

func load_manifest() -> Dictionary:
	return load_json_file("manifest.json", {}) as Dictionary

func load_story_showcase() -> Dictionary:
	return load_json_file("story-showcase.json", {}) as Dictionary

func load_campaign_scenarios() -> Array:
	return load_json_file("campaign-scenarios.json", []) as Array

func load_story_progress() -> Dictionary:
	if FileAccess.file_exists(STORY_PROGRESS_SAVE_PATH):
		var user_file := FileAccess.open(STORY_PROGRESS_SAVE_PATH, FileAccess.READ)
		if user_file != null:
			var parsed_user: Variant = JSON.parse_string(user_file.get_as_text())
			if parsed_user is Dictionary:
				return parsed_user as Dictionary
	return load_json_file("story-progress.json", {}) as Dictionary

func save_story_progress(progress: Dictionary) -> bool:
	var file := FileAccess.open(STORY_PROGRESS_SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(progress, "\t"))
	return true

func update_story_progress(level_id: String, stars: int, rewards: Array) -> Dictionary:
	var progress: Dictionary = load_story_progress().duplicate(true)
	var completed_levels: Array = progress.get("completedLevels", []).duplicate(true)
	var found := false
	for index in range(completed_levels.size()):
		var entry: Dictionary = completed_levels[index]
		if entry is Dictionary and str(entry.get("levelId", "")) == level_id:
			entry["stars"] = maxi(int(entry.get("stars", 0)), stars)
			entry["rewards"] = rewards.duplicate(true)
			completed_levels[index] = entry
			found = true
			break
	if not found:
		completed_levels.append({
			"levelId": level_id,
			"stars": stars,
			"rewards": rewards.duplicate(true),
		})
	progress["completedLevels"] = completed_levels
	var total_stars := 0
	for entry in completed_levels:
		if entry is Dictionary:
			total_stars += int(entry.get("stars", 0))
	progress["totalStars"] = total_stars
	save_story_progress(progress)
	return progress

func get_level_stars(level_id: String) -> int:
	var progress := load_story_progress()
	for entry in progress.get("completedLevels", []):
		if entry is Dictionary and str((entry as Dictionary).get("levelId", "")) == level_id:
			return int((entry as Dictionary).get("stars", 0))
	return 0

func load_base_cards() -> Array:
	return load_json_file("base-cards.json", []) as Array

func load_moon_cards() -> Array:
	return load_json_file("moon-card-drafts.json", []) as Array

func load_battle_seed() -> Dictionary:
	return load_json_file("battle-seed.json", {}) as Dictionary
