extends Node

## RunState 是当前局/暂停/玩家状态的薄服务层。
## 目前主要转发到 Global，目的是让调用方不要直接依赖 Global 的内部实现。

func start_run(character_object_id: String, run_seed: int, difficulty_level: int = 0, custom_run_modifier_object_ids: Array[String] = []) -> void:
	Global.start_run(character_object_id, run_seed, difficulty_level, custom_run_modifier_object_ids)

func end_run(run_end_state: int = Global.RUN_ENDS.QUIT) -> void:
	Global.end_run(run_end_state)

func pause_game() -> void:
	Global.pause_game()

func unpause_game() -> void:
	Global.unpause_game()

func is_run_active() -> bool:
	return Global.is_run

func get_player_data() -> PlayerData:
	return Global.player_data

func get_profile_data() -> ProfileData:
	return Global.profile_data

func get_user_settings_data() -> UserSettingsData:
	return Global.user_settings_data

func get_player() -> Player:
	return Global.get_player()

func get_combat_stats() -> CombatStatsData:
	return Global.get_combat_stats()

func is_player_in_combat() -> bool:
	return Global.is_player_in_combat()

func is_player_turn() -> bool:
	return Global.is_player_turn()
