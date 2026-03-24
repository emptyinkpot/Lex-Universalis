extends Control

const CARD_NODE_SCENE := preload("res://scenes/components/CardNode.tscn")
const BATTLE_SLOT_SCENE := preload("res://scenes/components/BattleSlot.tscn")
const DATA_LOADER = preload("res://scripts/data_loader.gd")

var data_loader: RefCounted
var base_cards: Array = []
var battle_seed_template: Dictionary = {}
var draw_pile: Array = []
var hand_cards: Array = []
var discard_pile: Array = []
var battle_slots: Array = []
var selected_hand_index := -1
var is_resolving := false
var player_state: Dictionary = {}
var enemy_state: Dictionary = {}
var active_level: Dictionary = {}
var rendered_hand_nodes: Array = []
var rendered_slot_nodes: Dictionary = {}

@onready var enemy_label: Label = get_node("Root/TopBar/TopPadding/TopRow/EnemyLabel")
@onready var enemy_stats: Label = get_node("Root/TopBar/TopPadding/TopRow/EnemyStats")
@onready var rules_label: RichTextLabel = get_node("Root/Stage/SideRail/RulesPanel/Padding/Body/RulesText")
@onready var log_label: RichTextLabel = get_node("Root/Stage/SideRail/LogPanel/Padding/Body/LogText")
@onready var front_row: HBoxContainer = get_node("Root/Stage/Battlefield/Padding/Body/FrontRow")
@onready var back_row: HBoxContainer = get_node("Root/Stage/Battlefield/Padding/Body/BackRow")
@onready var hand_row: HBoxContainer = get_node("Root/BottomDock/DockPadding/DockBody/HandScroll/HandRow")
@onready var player_stats: Label = get_node("Root/BottomDock/DockPadding/DockBody/MetaRow/PlayerStats")
@onready var queue_label: Label = get_node("Root/BottomDock/DockPadding/DockBody/QueueLabel")
@onready var pile_label: Label = get_node("Root/BottomDock/DockPadding/DockBody/PileLabel")
@onready var end_turn_button: Button = get_node("Root/BottomDock/DockPadding/DockBody/ActionRow/EndTurnButton")
@onready var overlay_layer: Control = get_node("Overlay")

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	battle_seed_template = data_loader.load_battle_seed()
	base_cards = data_loader.load_base_cards()
	rules_label.text = "[b]Battle Rules[/b]\n- Click a hand card to arm it.\n- Click a front or back slot to resolve damage.\n- Counter slots reduce incoming damage once.\n- After playing a card, it moves to discard and a new card is drawn."
	end_turn_button.pressed.connect(_on_end_turn_pressed)
	_reset_battle_state()

func start_level(level_data: Dictionary) -> void:
	active_level = level_data.duplicate(true)
	var enemy_faction := str(active_level.get("enemyFaction", "ENGLAND"))
	_reset_battle_state(_build_level_deck(enemy_faction))
	rules_label.text = "[b]Battle Rules[/b]\n- Click a hand card to arm it.\n- Click a front or back slot to resolve damage.\n- Counter slots reduce incoming damage once.\n- After playing a card, it moves to discard and a new card is drawn.\n\n[b]Scenario[/b]\nEnemy faction: %s" % enemy_faction
	log_label.text = "[b]Scenario Loaded[/b]\n- %s\n- %s\n\n%s" % [
		str(active_level.get("name", "Scenario Battle")),
		str(active_level.get("storyText", "")),
		log_label.text,
	]
	_render_all()

func _render_all() -> void:
	enemy_label.text = str(active_level.get("name", "Enemy Fortress"))
	enemy_stats.text = "HP %d   Gold %d   Influence %d" % [
		int(enemy_state.get("health", 0)),
		int(enemy_state.get("gold", 0)),
		int(enemy_state.get("influence", 0)),
	]
	player_stats.text = "Player HP %d   Gold %d   Influence %d" % [
		int(player_state.get("health", 0)),
		int(player_state.get("gold", 0)),
		int(player_state.get("influence", 0)),
	]
	pile_label.text = "Draw %d   Discard %d" % [draw_pile.size(), discard_pile.size()]
	queue_label.text = "Selected: %s" % ("None" if selected_hand_index < 0 else str(hand_cards[selected_hand_index].get("name", "Card")))
	_render_slots()
	_render_hand()

func _render_slots() -> void:
	rendered_slot_nodes.clear()
	_render_slot_row(front_row, "front")
	_render_slot_row(back_row, "back")

func _render_slot_row(row_node: HBoxContainer, row_name: String) -> void:
	for child in row_node.get_children():
		child.queue_free()
	for slot in battle_slots:
		if str(slot.get("row", "")) != row_name:
			continue
		if bool(slot.get("collapsed", false)):
			continue
		var slot_node := BATTLE_SLOT_SCENE.instantiate()
		slot_node.call("setup", slot, selected_hand_index >= 0)
		slot_node.slot_pressed.connect(_on_slot_pressed)
		row_node.add_child(slot_node)
		rendered_slot_nodes[str(slot.get("id", ""))] = slot_node

func _render_hand() -> void:
	rendered_hand_nodes.clear()
	for child in hand_row.get_children():
		child.queue_free()
	for index in range(hand_cards.size()):
		var card := hand_cards[index] as Dictionary
		var card_node := CARD_NODE_SCENE.instantiate()
		card_node.custom_minimum_size = Vector2(184, 258)
		card_node.base_position = Vector2(card_node.position.x, card_node.position.y)
		card_node.call("setup", card)
		card_node.call("set_selected", index == selected_hand_index)
		card_node.card_pressed.connect(_on_card_pressed.bind(index))
		hand_row.add_child(card_node)
		rendered_hand_nodes.append(card_node)

func _draw_card() -> void:
	if draw_pile.is_empty():
		return
	hand_cards.append(draw_pile.pop_front())

func _on_card_pressed(_card_data: Dictionary, index: int) -> void:
	selected_hand_index = -1 if selected_hand_index == index else index
	_append_log("Hand", "Selected %s" % ("none" if selected_hand_index < 0 else str(hand_cards[selected_hand_index].get("name", "Card"))))
	_render_all()

func _on_slot_pressed(slot_id: String) -> void:
	if selected_hand_index < 0 or is_resolving:
		_append_log("Battle", "Select a card first.")
		return
	is_resolving = true
	var slot_index := _find_slot_index(slot_id)
	if slot_index < 0:
		is_resolving = false
		return
	var card := hand_cards[selected_hand_index] as Dictionary
	var slot := battle_slots[slot_index] as Dictionary
	await _animate_card_play(selected_hand_index, slot_id, card)
	var damage := _get_card_damage(card)
	_spawn_damage_text(rendered_slot_nodes.get(slot_id), damage, false)
	if bool(slot.get("counterArmed", false)):
		damage = maxi(1, damage - 1)
		player_state["health"] = maxi(0, int(player_state.get("health", 0)) - 1)
		slot["counterArmed"] = false
		_spawn_damage_text(self, 1, true)
		_append_log("Counter", "%s countered and hit the player for 1." % str(slot.get("title", "Slot")))
	slot["health"] = maxi(0, int(slot.get("health", 0)) - damage)
	enemy_state["health"] = maxi(0, int(enemy_state.get("health", 0)) - damage)
	_append_log("Play", "%s dealt %d to %s." % [str(card.get("name", "Card")), damage, str(slot.get("title", "Slot"))])
	discard_pile.append(card)
	hand_cards.remove_at(selected_hand_index)
	selected_hand_index = -1
	if int(slot.get("health", 0)) == 0:
		slot["collapsed"] = true
		await _play_slot_break(slot_id)
		_append_log("Break", "%s collapsed." % str(slot.get("title", "Slot")))
	_draw_card()
	_render_all()
	is_resolving = false

func _on_end_turn_pressed() -> void:
	selected_hand_index = -1
	_append_log("Turn", "End turn pressed. Queue cleared.")
	_render_all()

func _find_slot_index(slot_id: String) -> int:
	for index in range(battle_slots.size()):
		if str((battle_slots[index] as Dictionary).get("id", "")) == slot_id:
			return index
	return -1

func _get_card_damage(card: Dictionary) -> int:
	if card.get("attack", null) != null:
		return int(card.get("attack", 0))
	return maxi(1, int(card.get("cost", 0)))

func _append_log(title: String, detail: String) -> void:
	var current := log_label.text
	log_label.text = "[b]%s[/b]\n- %s\n\n%s" % [title, detail, current]

func _animate_card_play(hand_index: int, slot_id: String, card: Dictionary) -> void:
	if hand_index < 0 or hand_index >= rendered_hand_nodes.size():
		return
	if not rendered_slot_nodes.has(slot_id):
		return
	var source: Control = rendered_hand_nodes[hand_index]
	var target: Control = rendered_slot_nodes[slot_id]
	var ghost := CARD_NODE_SCENE.instantiate()
	ghost.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ghost.custom_minimum_size = Vector2(184, 258)
	overlay_layer.add_child(ghost)
	ghost.call("setup", card)
	ghost.global_position = source.global_position
	ghost.size = source.size
	ghost.scale = Vector2.ONE
	var target_position := target.global_position + Vector2(target.size.x * 0.5 - ghost.size.x * 0.5, target.size.y * 0.5 - ghost.size.y * 0.5)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(ghost, "global_position", target_position, 0.24)
	tween.tween_property(ghost, "scale", Vector2.ONE * 0.82, 0.24)
	tween.tween_property(ghost, "modulate", Color(1, 1, 1, 0.82), 0.24)
	await tween.finished
	if rendered_slot_nodes.has(slot_id):
		await rendered_slot_nodes[slot_id].play_hit_feedback()
	ghost.queue_free()

func _reset_battle_state(deck_override: Array = []) -> void:
	draw_pile = deck_override.duplicate(true) if not deck_override.is_empty() else base_cards.duplicate(true)
	hand_cards.clear()
	discard_pile.clear()
	selected_hand_index = -1
	is_resolving = false
	player_state = battle_seed_template.get("player", {}).duplicate(true)
	enemy_state = battle_seed_template.get("enemy", {}).duplicate(true)
	battle_slots = battle_seed_template.get("slots", []).duplicate(true)
	if active_level.is_empty():
		log_label.text = "[b]Combat Log[/b]\n- Godot migration shell initialized.\n- Fixed PC battlefield layout active.\n- Next step: queue resolution and animation graph."
	for _index in range(int(player_state.get("handSize", 5))):
		_draw_card()
	_render_all()

func _build_level_deck(enemy_faction: String) -> Array:
	var filtered: Array = []
	for card in base_cards:
		if card is Dictionary and _normalize_faction(str(card.get("faction", ""))) == _normalize_faction(enemy_faction):
			filtered.append(card.duplicate(true))
	if filtered.is_empty():
		filtered = base_cards.duplicate(true)
	var deck: Array = []
	for index in range(maxi(8, filtered.size())):
		deck.append((filtered[index % filtered.size()] as Dictionary).duplicate(true))
	return deck

func _normalize_faction(faction: String) -> String:
	return "HRE" if faction == "HOLY_ROMAN_EMPIRE" else faction

func _spawn_damage_text(target_node: Control, amount: int, counter: bool) -> void:
	if target_node == null:
		return
	var label := Label.new()
	label.text = ("-%d" % amount) if not counter else ("Counter -%d" % amount)
	label.add_theme_font_size_override("font_size", 22 if not counter else 18)
	label.add_theme_color_override("font_color", Color("ffcf7a") if not counter else Color("ff8f8f"))
	overlay_layer.add_child(label)
	var offset := Vector2(0, -18)
	label.global_position = target_node.global_position + Vector2(target_node.size.x * 0.5 - 30, 18)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(label, "global_position", label.global_position + offset, 0.42)
	tween.tween_property(label, "modulate", Color(1, 1, 1, 0), 0.42)
	await tween.finished
	label.queue_free()

func _play_slot_break(slot_id: String) -> void:
	if not rendered_slot_nodes.has(slot_id):
		return
	var slot_node: Control = rendered_slot_nodes[slot_id]
	var crack := ColorRect.new()
	crack.color = Color(1, 0.86, 0.65, 0.55)
	crack.mouse_filter = Control.MOUSE_FILTER_IGNORE
	crack.size = slot_node.size
	slot_node.add_child(crack)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(slot_node, "scale", Vector2.ONE * 0.92, 0.16)
	tween.tween_property(slot_node, "modulate", Color(0.65, 0.55, 0.5, 0.0), 0.32)
	tween.tween_property(crack, "modulate", Color(1, 1, 1, 0), 0.26)
	await tween.finished
