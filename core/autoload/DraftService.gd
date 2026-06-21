extends Node

func generate_unweighted_card_draft(rng: RandomNumberGenerator, number_of_cards: int) -> Array[CardData]:
	return Random.generate_unweighted_card_draft(rng, number_of_cards)

func generate_unweighted_card_draft_from_card_pack_id(rng: RandomNumberGenerator, card_pack_id: String, number_of_cards: int) -> Array[CardData]:
	return Random.generate_unweighted_card_draft_from_card_pack_id(rng, card_pack_id, number_of_cards)

func generate_card_draft(rng: RandomNumberGenerator, card_draft_table_type: int, card_pack_id: String, number_of_cards: int) -> Array[CardData]:
	return Random.generate_card_draft(rng, card_draft_table_type, card_pack_id, number_of_cards)

func generate_artifact_draft(rng: RandomNumberGenerator, artifact_pack_id: String, number_of_artifacts: int) -> Array[ArtifactData]:
	return Random.generate_artifact_draft(rng, artifact_pack_id, number_of_artifacts)
