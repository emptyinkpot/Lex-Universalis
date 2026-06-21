extends Node

## ValidatorService 是规则校验入口。
## UI 和 action 可以通过这里执行 validator 列表，避免直接依赖 Global.validate。

func validate(validators: Array[Dictionary], card_data: CardData = null, action: BaseAction = null) -> bool:
	return Global.validate(validators, card_data, action)
