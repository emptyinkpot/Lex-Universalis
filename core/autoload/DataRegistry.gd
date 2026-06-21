extends Node

func get_card_data(card_object_id: String) -> CardData:
	return Global.get_card_data(card_object_id)

func get_all_cards() -> Array[CardData]:
	return Global.get_all_cards()

func get_card_data_from_prototype(card_object_id: String) -> CardData:
	return Global.get_card_data_from_prototype(card_object_id)

func get_card_data_from_prototypes(card_object_ids: Array[String]) -> Array[CardData]:
	return Global.get_card_data_from_prototypes(card_object_ids)

func get_enemy_data(enemy_object_id: String) -> EnemyData:
	return Global.get_enemy_data(enemy_object_id)

func get_enemy_data_from_prototype(enemy_object_id: String) -> EnemyData:
	return Global.get_enemy_data_from_prototype(enemy_object_id)

func get_artifact_data(artifact_id: String) -> ArtifactData:
	return Global.get_artifact_data(artifact_id)

func get_all_artifacts() -> Array[ArtifactData]:
	return Global.get_all_artifacts()

func get_artifact_data_from_prototype(artifact_id: String) -> ArtifactData:
	return Global.get_artifact_data_from_prototype(artifact_id)

func get_character_data(character_object_id: String) -> CharacterData:
	return Global.get_character_data(character_object_id)

func get_player_data_from_prototype(player_id: String) -> PlayerData:
	return Global.get_player_data_from_prototype(player_id)

func get_status_effect_data(status_effect_object_id: String) -> StatusEffectData:
	return Global.get_status_effect_data(status_effect_object_id)

func get_action_interceptor_data(action_interceptor_object_id: String) -> ActionInterceptorData:
	return Global.get_action_interceptor_data(action_interceptor_object_id)

func get_card_pack_data(card_pack_object_id: String) -> CardPackData:
	return Global.get_card_pack_data(card_pack_object_id)

func get_artifact_pack_data(artifact_pack_object_id: String) -> ArtifactPackData:
	return Global.get_artifact_pack_data(artifact_pack_object_id)

func get_cached_card_filter(card_filter_cache_id: String) -> CardFilter:
	return Global.get_cached_card_filter(card_filter_cache_id)

func get_cached_artifact_filter(artifact_filter_cache_id: String) -> ArtifactFilter:
	return Global.get_cached_artifact_filter(artifact_filter_cache_id)
