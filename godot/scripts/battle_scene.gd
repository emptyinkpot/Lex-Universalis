extends Control

const CARD_NODE_SCENE := preload("res://scenes/components/CardNode.tscn")
const DATA_LOADER = preload("res://scripts/data_loader.gd")

var data_loader: RefCounted
var draw_pile: Array = []
var hand_cards: Array = []
var discard_pile: Array = []
var battle_slots: Array = []
var selected_hand_index := -1
var player_state: Dictionary = {}
var enemy_state: Dictionary = {}

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

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	var battle_seed: Dictionary = data_loader.load_battle_seed()
	var cards: Array = data_loader.load_base_cards()
	draw_pile = cards.duplicate(true)
	player_state = battle_seed.get("player", {}).duplicate(true)
	enemy_state = battle_seed.get("enemy", {}).duplicate(true)
	battle_slots = battle_seed.get("slots", []).duplicate(true)
	rules_label.text = "[b]Battle Rules[/b]\n- Click a hand card to arm it.\n- Click a front or back slot to resolve damage.\n- Counter slots reduce incoming damage once.\n- After playing a card, it moves to discard and a new card is drawn."
	end_turn_button.pressed.connect(_on_end_turn_pressed)
	for _index in range(int(player_state.get("handSize", 5))):
		_draw_card()
	_render_all()

func _render_all() -> void:
	enemy_label.text = "Enemy Fortress"
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
	_render_slot_row(front_row, "front")
	_render_slot_row(back_row, "back")

func _render_slot_row(row_node: HBoxContainer, row_name: String) -> void:
	for child in row_node.get_children():
		child.queue_free()
	for slot in battle_slots:
		if str(slot.get("row", "")) != row_name:
			continue
		var button := Button.new()
		button.custom_minimum_size = Vector2(0, 148)
		button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		button.text = "%s\nHP %d / %d\nCounter %s" % [
			str(slot.get("title", "Slot")),
			int(slot.get("health", 0)),
			int(slot.get("maxHealth", 0)),
			"On" if bool(slot.get("counterArmed", false)) else "Off",
		]
		button.alignment = HORIZONTAL_ALIGNMENT_LEFT
		button.vertical_icon_alignment = VERTICAL_ALIGNMENT_CENTER
		button.focus_mode = Control.FOCUS_NONE
		button.clip_text = false
		button.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		button.add_theme_font_size_override("font_size", 16)
		var style := StyleBoxFlat.new()
		style.bg_color = Color("19120d")
		style.border_color = Color("d0b06e") if selected_hand_index >= 0 else Color("8f6c45")
		style.border_width_left = 2
		style.border_width_top = 2
		style.border_width_right = 2
		style.border_width_bottom = 2
		style.corner_radius_top_left = 16
		style.corner_radius_top_right = 16
		style.corner_radius_bottom_right = 16
		style.corner_radius_bottom_left = 16
		button.add_theme_stylebox_override("normal", style)
		button.add_theme_stylebox_override("hover", style)
		button.add_theme_stylebox_override("pressed", style)
		button.pressed.connect(_on_slot_pressed.bind(str(slot.get("id", ""))))
		row_node.add_child(button)

func _render_hand() -> void:
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

func _draw_card() -> void:
	if draw_pile.is_empty():
		return
	hand_cards.append(draw_pile.pop_front())

func _on_card_pressed(_card_data: Dictionary, index: int) -> void:
	selected_hand_index = -1 if selected_hand_index == index else index
	_append_log("Hand", "Selected %s" % ("none" if selected_hand_index < 0 else str(hand_cards[selected_hand_index].get("name", "Card"))))
	_render_all()

func _on_slot_pressed(slot_id: String) -> void:
	if selected_hand_index < 0:
		_append_log("Battle", "Select a card first.")
		return
	var slot_index := _find_slot_index(slot_id)
	if slot_index < 0:
		return
	var card := hand_cards[selected_hand_index] as Dictionary
	var slot := battle_slots[slot_index] as Dictionary
	var damage := _get_card_damage(card)
	if bool(slot.get("counterArmed", false)):
		damage = maxi(1, damage - 1)
		player_state["health"] = maxi(0, int(player_state.get("health", 0)) - 1)
		slot["counterArmed"] = false
		_append_log("Counter", "%s countered and hit the player for 1." % str(slot.get("title", "Slot")))
	slot["health"] = maxi(0, int(slot.get("health", 0)) - damage)
	enemy_state["health"] = maxi(0, int(enemy_state.get("health", 0)) - damage)
	_append_log("Play", "%s dealt %d to %s." % [str(card.get("name", "Card")), damage, str(slot.get("title", "Slot"))])
	discard_pile.append(card)
	hand_cards.remove_at(selected_hand_index)
	selected_hand_index = -1
	if int(slot.get("health", 0)) == 0:
		_append_log("Break", "%s collapsed." % str(slot.get("title", "Slot")))
	_draw_card()
	_render_all()

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
