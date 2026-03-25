class_name DataLoader
extends RefCounted

const GENERATED_DIR := "res://data/generated/"
const STORY_PROGRESS_SAVE_PATH := "user://story-progress.save.json"
const CARD_DRAFTS_SAVE_PATH := "user://card-drafts.save.json"
const DECK_SAVE_PATH := "user://deck-list.save.json"
const SETTINGS_SAVE_PATH := "user://settings.save.json"

const TRANSLATIONS := {
	"zh": {
		"app_title": "我即真理 Lex Universalis",
		"app_subtitle": "Godot 桌面版工作台",
		"app_footer": "固定单窗口桌面版：故事、战斗、卡牌编辑与卡组构筑都在 Godot 原生视口中运行。",
		"home_modes_title": "功能列表",
		"home_story_title": "故事模式",
		"home_story_summary": "进入故事章节，选择关卡并直接进入战斗。",
		"home_story_action": "打开故事模式",
		"home_battle_title": "战斗演示",
		"home_battle_summary": "进入固定战场，测试出牌、飞牌、命中与反击。",
		"home_battle_action": "打开战斗页",
		"home_card_editor_title": "卡牌编辑",
		"home_card_editor_summary": "编辑已收编的月球卡草稿，保存本地工作稿。",
		"home_card_editor_action": "打开卡牌编辑",
		"home_deck_builder_title": "卡组构筑",
		"home_deck_builder_summary": "从当前卡池里组建本地卡组并保存。",
		"home_deck_builder_action": "打开卡组构筑",
		"home_cards_title": "卡牌图鉴",
		"home_cards_summary": "浏览卡牌库，查看卡面与收编档案。",
		"home_cards_action": "打开卡牌图鉴",
		"home_results_title": "战后结果",
		"home_results_summary": "查看胜负、星级、奖励与故事进度反馈。",
		"home_results_action": "打开结果页",
		"home_settings_title": "设置",
		"home_settings_summary": "切换中文与英文，调整桌面界面语言。",
		"home_settings_action": "打开设置",
		"home_ai_title": "AI 助手",
		"home_ai_summary": "连接本地 Codex 桥，分析并重写 Godot UI 文件。",
		"home_ai_action": "打开 AI 助手",
		"home_progress": "进度",
		"home_total_stars": "总星级",
		"home_drafts": "草稿",
		"home_deck_cards": "卡组",
		"home_datasets": "数据集",
		"home_language": "语言",
		"story_title": "故事模式",
		"story_subtitle": "章节、关卡与战斗在同一窗口中切换",
		"story_background": "背景设定",
		"story_factions": "阵营",
		"story_chapters": "章节",
		"story_levels": "关卡",
		"story_stars": "星级",
		"story_victory": "胜利条件",
		"story_defeat": "失败条件",
		"story_rewards": "奖励",
		"story_launch": "进入战斗",
		"story_launch_empty": "没有可用关卡",
		"battle_title": "战斗界面",
		"battle_subtitle": "固定视口战场、手牌、槽位与结算动画",
		"battle_rules": "战斗规则",
		"battle_rule_1": "点击或拖动手牌以准备出牌。",
		"battle_rule_2": "松开到敌方槽位上以结算伤害。",
		"battle_rule_3": "带反制的槽位会减免一次伤害。",
		"battle_rule_4": "打出卡牌后会进入弃牌堆，并补进一张新牌。",
		"battle_phase": "阶段",
		"battle_hand": "手牌",
		"battle_board": "战场",
		"battle_order": "指令",
		"battle_draw": "牌堆",
		"battle_discard": "弃牌",
		"battle_selected": "已选",
		"battle_end_turn": "结束回合",
		"battle_enemy": "敌方",
		"battle_player": "我方",
		"battle_hp": "生命",
		"battle_gold": "金币",
		"battle_influence": "影响力",
		"result_title_win": "胜利",
		"result_title_lose": "失败",
		"result_subtitle": "战斗结果",
		"result_outcome": "结果",
		"result_stars": "星级",
		"result_rewards": "奖励",
		"result_progress": "进度已保存",
		"result_objective": "目标",
		"result_battle_summary": "战斗摘要",
		"result_enemy_deck": "敌方卡组",
		"result_return": "返回故事",
		"result_tab_title": "结果",
		"card_editor_title": "卡牌编辑器",
		"card_editor_subtitle": "编辑、预览与保存本地草稿",
		"card_editor_summary": "工作卡 %d 张，基于现有卡池继续编辑。",
		"card_editor_drafts": "草稿",
		"card_editor_selected": "已选",
		"card_editor_storage": "本地保存",
		"card_editor_preview": "预览",
		"card_editor_list": "可编辑卡牌",
		"card_editor_form": "编辑卡牌",
		"card_editor_saved": "已保存本地卡牌草稿。",
		"card_editor_source": "来源编号",
		"deck_builder_title": "卡组构筑",
		"deck_builder_subtitle": "从卡池中编组并保存到本地",
		"deck_builder_summary": "卡池 %d 张，卡组 %d 张。",
		"deck_builder_pool": "卡池",
		"deck_builder_deck": "卡组",
		"deck_builder_selected": "已选",
		"deck_builder_storage": "本地保存",
		"deck_builder_add": "加入卡组",
		"deck_builder_remove": "移出卡组",
		"deck_builder_save": "保存卡组",
		"deck_builder_reset": "重新载入",
		"deck_builder_select_card": "请从卡池或卡组中选择一张卡牌。",
		"cards_title": "卡牌图鉴",
		"cards_subtitle": "查看已收编的卡牌与卡面节点",
		"settings_title": "设置",
		"settings_subtitle": "调整语言与桌面偏好",
		"settings_language": "界面语言",
		"settings_chinese": "中文",
		"settings_english": "英文",
		"settings_back": "返回首页",
		"assistant_title": "AI 助手",
		"assistant_subtitle": "本地 Codex 桥接，可对 Godot UI 进行分析或写回文件。",
		"assistant_request": "请求",
		"assistant_result": "结果",
		"assistant_apply": "直接写入文件",
		"assistant_send": "发送请求",
		"assistant_open_bridge": "打开桥",
		"assistant_waiting": "等待请求",
	},
	"en": {
		"app_title": "Lex Universalis",
		"app_subtitle": "Godot Desktop Workspace",
		"app_footer": "Fixed single-window desktop build: story, battle, card editing, and deck building run inside native Godot viewports.",
		"home_modes_title": "Modes",
		"home_story_title": "Story Mode",
		"home_story_summary": "Enter story chapters, pick a level, and launch battle directly.",
		"home_story_action": "Open Story Mode",
		"home_battle_title": "Battle Demo",
		"home_battle_summary": "Enter the fixed battlefield and test plays, flight paths, hits, and counters.",
		"home_battle_action": "Open Battle",
		"home_card_editor_title": "Card Editor",
		"home_card_editor_summary": "Edit harvested Moon drafts and save local work copies.",
		"home_card_editor_action": "Open Card Editor",
		"home_deck_builder_title": "Deck Builder",
		"home_deck_builder_summary": "Assemble a local deck from the current pool and save it.",
		"home_deck_builder_action": "Open Deck Builder",
		"home_cards_title": "Card Gallery",
		"home_cards_summary": "Browse the card library and review the harvested archive.",
		"home_cards_action": "Open Gallery",
		"home_results_title": "Results Screen",
		"home_results_summary": "Inspect victory, stars, rewards, and progress feedback.",
		"home_results_action": "Open Results",
		"home_settings_title": "Settings",
		"home_settings_summary": "Switch between Chinese and English UI language.",
		"home_settings_action": "Open Settings",
		"home_ai_title": "AI Assistant",
		"home_ai_summary": "Connect to the local Codex bridge and analyze or rewrite Godot UI files.",
		"home_ai_action": "Open AI Assistant",
		"home_progress": "Progress",
		"home_total_stars": "Total Stars",
		"home_drafts": "Drafts",
		"home_deck_cards": "Deck",
		"home_datasets": "Datasets",
		"home_language": "Language",
		"story_title": "Story Mode",
		"story_subtitle": "Chapters, levels, and battles move in one window",
		"story_background": "Background",
		"story_factions": "Factions",
		"story_chapters": "Chapters",
		"story_levels": "Levels",
		"story_stars": "Stars",
		"story_victory": "Victory",
		"story_defeat": "Defeat",
		"story_rewards": "Rewards",
		"story_launch": "Launch Battle",
		"story_launch_empty": "No level available",
		"battle_title": "Battle Screen",
		"battle_subtitle": "Fixed viewport battlefield, hand, slots, and resolution animation",
		"battle_rules": "Battle Rules",
		"battle_rule_1": "Click or drag a hand card to arm it.",
		"battle_rule_2": "Release over an enemy slot to resolve damage.",
		"battle_rule_3": "Counter slots reduce incoming damage once.",
		"battle_rule_4": "After playing a card, it moves to discard and a new card is drawn.",
		"battle_phase": "Phase",
		"battle_hand": "Hand",
		"battle_board": "Board",
		"battle_order": "Order",
		"battle_draw": "Draw",
		"battle_discard": "Discard",
		"battle_selected": "Selected",
		"battle_end_turn": "End Turn",
		"battle_enemy": "Enemy",
		"battle_player": "Player",
		"battle_hp": "HP",
		"battle_gold": "Gold",
		"battle_influence": "Influence",
		"result_title_win": "Victory",
		"result_title_lose": "Defeat",
		"result_subtitle": "Battle Result",
		"result_outcome": "Outcome",
		"result_stars": "Stars",
		"result_rewards": "Rewards",
		"result_progress": "Progress Saved",
		"result_objective": "Objective",
		"result_battle_summary": "Battle Summary",
		"result_enemy_deck": "Enemy Deck",
		"result_return": "Return to Story",
		"result_tab_title": "Results",
		"card_editor_title": "Card Editor",
		"card_editor_subtitle": "Edit, preview, and save local drafts",
		"card_editor_summary": "Working cards: %d, editable from the existing pool.",
		"card_editor_drafts": "Drafts",
		"card_editor_selected": "Selected",
		"card_editor_storage": "Local Save",
		"card_editor_preview": "Preview",
		"card_editor_list": "Working Cards",
		"card_editor_form": "Edit Card",
		"card_editor_saved": "Saved working card drafts locally.",
		"card_editor_source": "Source ID",
		"deck_builder_title": "Deck Builder",
		"deck_builder_subtitle": "Build from the pool and save locally",
		"deck_builder_summary": "Pool %d cards, deck %d cards.",
		"deck_builder_pool": "Pool",
		"deck_builder_deck": "Deck",
		"deck_builder_selected": "Selected",
		"deck_builder_storage": "Local Save",
		"deck_builder_add": "Add to Deck",
		"deck_builder_remove": "Remove from Deck",
		"deck_builder_save": "Save Deck",
		"deck_builder_reset": "Reload",
		"deck_builder_select_card": "Select a card from the pool or deck.",
		"cards_title": "Card Gallery",
		"cards_subtitle": "Inspect the harvested cards and card nodes",
		"settings_title": "Settings",
		"settings_subtitle": "Adjust language and desktop preferences",
		"settings_language": "Language",
		"settings_chinese": "Chinese",
		"settings_english": "English",
		"settings_back": "Back to Home",
		"assistant_title": "AI Assistant",
		"assistant_subtitle": "Local Codex bridge for analyzing or rewriting Godot UI files.",
		"assistant_request": "Request",
		"assistant_result": "Result",
		"assistant_apply": "Write to files",
		"assistant_send": "Send",
		"assistant_open_bridge": "Open Bridge",
		"assistant_waiting": "Waiting",
	}
}

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

func load_settings() -> Dictionary:
	var default_settings := {
		"language": "zh",
	}
	if FileAccess.file_exists(SETTINGS_SAVE_PATH):
		var file := FileAccess.open(SETTINGS_SAVE_PATH, FileAccess.READ)
		if file != null:
			var parsed: Variant = JSON.parse_string(file.get_as_text())
			if parsed is Dictionary:
				var settings: Dictionary = default_settings.duplicate(true)
				for key in (parsed as Dictionary).keys():
					settings[key] = (parsed as Dictionary)[key]
				if str(settings.get("language", "zh")).strip_edges().is_empty():
					settings["language"] = "zh"
				return settings
	return default_settings.duplicate(true)

func save_settings(settings: Dictionary) -> bool:
	var file := FileAccess.open(SETTINGS_SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(settings, "\t"))
	return true

func get_language() -> String:
	return str(load_settings().get("language", "zh"))

func set_language(language: String) -> bool:
	var settings := load_settings()
	settings["language"] = "en" if language.to_lower() == "en" else "zh"
	return save_settings(settings)

func t(key: String, fallback: String = "") -> String:
	var language := get_language()
	var dictionary: Dictionary = TRANSLATIONS.get(language, TRANSLATIONS["zh"])
	if dictionary.has(key):
		return str(dictionary.get(key, fallback if not fallback.is_empty() else key))
	if TRANSLATIONS["zh"].has(key):
		return str(TRANSLATIONS["zh"].get(key, fallback if not fallback.is_empty() else key))
	return fallback if not fallback.is_empty() else key

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

func load_working_cards() -> Array:
	if FileAccess.file_exists(CARD_DRAFTS_SAVE_PATH):
		var file := FileAccess.open(CARD_DRAFTS_SAVE_PATH, FileAccess.READ)
		if file != null:
			var parsed: Variant = JSON.parse_string(file.get_as_text())
			if parsed is Array:
				return parsed as Array
	var working: Array = []
	working.append_array(load_base_cards())
	working.append_array(load_moon_cards())
	return working

func save_working_cards(cards: Array) -> bool:
	var file := FileAccess.open(CARD_DRAFTS_SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(cards, "\t"))
	return true

func load_deck_list() -> Array:
	if FileAccess.file_exists(DECK_SAVE_PATH):
		var file := FileAccess.open(DECK_SAVE_PATH, FileAccess.READ)
		if file != null:
			var parsed: Variant = JSON.parse_string(file.get_as_text())
			if parsed is Array:
				return parsed as Array
	return []

func save_deck_list(deck_cards: Array) -> bool:
	var file := FileAccess.open(DECK_SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(deck_cards, "\t"))
	return true

func load_battle_seed() -> Dictionary:
	return load_json_file("battle-seed.json", {}) as Dictionary
