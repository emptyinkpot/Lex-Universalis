## ActionGenerator 是 action 工厂。
## UI、地图、奖励、商店等系统只描述“要做什么”，这里负责把 JSON/字典配置
## 转成真正可执行的 BaseAction 实例，再交给 ActionHandler 或直接执行。
extends Node

## 通用 action 创建方法。
## 根据脚本路径和参数创建并初始化 action。
## action 数据格式是 [{"script_path": {values}}]。
## 注意：这里不会自动加入执行栈；需要调用方交给 ActionHandler.add_actions()。
func create_actions(_parent_combatant: BaseCombatant, _card_play_request: CardPlayRequest, _targets: Array[BaseCombatant], actions_data: Array[Dictionary], _parent_action: BaseAction) -> Array[BaseAction]:
	# actions_data 的键是脚本路径，值是初始化参数；这让卡牌和事件能用 JSON 描述行为。
	
	var actions: Array[BaseAction] = []
	
	for action_data in actions_data:
		for action_path in action_data:
			var action_asset = load(action_path)
			var action: BaseAction = action_asset.new()
			
			var action_values: Dictionary[String, Variant] = {}
			action_values.assign(action_data[action_path]) # 强制转成类型化字典。
			
			action.init(_parent_combatant, _card_play_request, _targets, action_values, _parent_action)
			actions.append(action)
	
	return actions

## 创建 CardPlayEnded action，供 Hand 使用。
func generate_card_play_finished(card_play_request: CardPlayRequest) -> BaseAction:
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_CARD_PLAY_END: {}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), card_play_request, [], action_data, null)[0]
	
	return generated_action

## 供 Hand 在回合开始时抽牌。
func generate_start_of_turn_draw_actions(number_of_cards: int = PlayerData.PLAYER_CARD_DRAW_PER_TURN) -> void:
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_DRAW_GENERATOR: {
			"draw_count": number_of_cards,
			"is_start_of_turn_draw": true # interceptor 通过这个标记调整抽牌数量。
		}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()

## 通过 action 生成指定章节地图。
func generate_act(act_id: String, act_number: int = 1) -> void:
	var act_data: ActData = Global.get_act_data(act_id)
	var action_data: Array[Dictionary] = [{
		act_data.act_action_script_path: {
			"act_id": act_id,
			"act_number": act_number,
			}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()

## 根据玩家当前章节随机选择并生成下一章。
func generate_next_act() -> void:
	var act_number: int = Global.player_data.player_act
	var act_data: ActData = Global.get_act_data(Global.player_data.player_act_id)
	
	var rng_act_selection: RandomNumberGenerator = Global.player_data.get_player_rng("rng_act_selection")
	
	if len(act_data.act_next_act_ids) > 0:
		# 随机选择下一章类型。
		var act_next_act_ids: Array[String] = Random.shuffle_array(rng_act_selection, act_data.act_next_act_ids.duplicate())
		var next_act_id: String = act_next_act_ids[0]
		# 生成下一章。
		generate_act(next_act_id, act_number + 1)
	else:
		push_error("No next acts defined")

## 通过 action 系统强制访问指定地点。
## Map 选择地点时调用。
func generate_visit_location(location_id: String, autosave_before_visit = true) -> void:
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_VISIT_LOCATION: {
			"location_id": location_id,
			"autosave_before_visit": autosave_before_visit
			}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()

func generate_chest_open() -> void:
	# 生成可被 interceptor 修改的奖励载荷。
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_OPEN_CHEST: {
			"chest_has_money": true,
			"chest_has_artifacts": true,
			"chest_has_consumables": true,
			"chest_has_cards": true,
			
			"chest_generates_money": true,
			"chest_generates_artifacts": true,
			"chest_generates_consumables": true,
			"chest_generates_cards": true,

			"chest_money_amount": 25,
			"chest_artifact_count": 1,
			"chest_consumable_count": 1,
			"chest_card_amount_draft": Global.player_data.reward_drafts,
			"chest_cards_per_draft": Global.player_data.reward_cards_per_draft,
			}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()

## 生成并执行商店填充 action，把商品和对应价格写入商店。
## 由 ShopData.visit_shop() 调用。
func generate_populate_shop_items(shop_cards: Array[CardData], shop_card_prices: Array[int],
shop_artifact_ids: Array[String], shop_artifact_prices: Array[int], 
shop_consumable_ids: Array[String], shop_consumable_prices: Array[int]) -> void:
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_SHOP_POPULATE_ITEMS: {
			"shop_cards": shop_cards,
			"shop_card_prices": shop_card_prices,
			"shop_artifact_ids": shop_artifact_ids,
			"shop_artifact_prices": shop_artifact_prices,
			"shop_consumable_ids": shop_consumable_ids,
			"shop_consumable_prices": shop_consumable_prices,
			}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()



## 强制开始一场可被 interceptor 修改的战斗。
## event_object_id 为空时使用当前地点的事件。
func generate_combat_start(event_object_id: String) -> void:
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_START_COMBAT: {
			"event_object_id": event_object_id
			}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()


func generate_use_consumable(selected_target: BaseCombatant, consumable_slot_index: int) -> void:
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_USE_CONSUMABLE: {
			"consumable_slot_index": consumable_slot_index
			}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [selected_target], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()

## 生成一个立即执行、可被 interceptor 修改的状态衰减 action。由 BaseCombatant 使用。
func generate_decay_status_effect(selected_target: BaseCombatant, status_effect_object_id: String, decay_amount: int) -> void:
	var action_data: Array[Dictionary] = [{
		Scripts.ACTION_DECAY_STATUS: {
			"status_effect_object_id": status_effect_object_id,
			"status_charge_amount": decay_amount
			}
		}]
	var generated_action: BaseAction = ActionGenerator.create_actions(Global.get_player(), null, [selected_target], action_data, null)[0]
	
	# 不进 ActionHandler 队列，直接执行这个 action。
	generated_action.perform_action()
