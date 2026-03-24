class_name DataLoader
extends RefCounted

const GENERATED_DIR := "res://data/generated/"

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

func load_story_progress() -> Dictionary:
	return load_json_file("story-progress.json", {}) as Dictionary

func load_base_cards() -> Array:
	return load_json_file("base-cards.json", []) as Array

func load_moon_cards() -> Array:
	return load_json_file("moon-card-drafts.json", []) as Array

func load_battle_seed() -> Dictionary:
	return load_json_file("battle-seed.json", {}) as Dictionary
