extends Node

func validate(validators: Array[Dictionary], card_data: CardData = null, action: BaseAction = null) -> bool:
	return Global.validate(validators, card_data, action)
