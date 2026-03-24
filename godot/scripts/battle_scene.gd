extends Control

const CARD_NODE_SCENE := preload("res://scenes/components/CardNode.tscn")
const DATA_LOADER = preload("res://scripts/data_loader.gd")
var data_loader: RefCounted

@onready var enemy_label: Label = get_node("Root/TopBar/TopPadding/TopRow/EnemyLabel")
@onready var enemy_stats: Label = get_node("Root/TopBar/TopPadding/TopRow/EnemyStats")
@onready var rules_label: RichTextLabel = get_node("Root/Stage/SideRail/RulesPanel/Padding/Body/RulesText")
@onready var log_label: RichTextLabel = get_node("Root/Stage/SideRail/LogPanel/Padding/Body/LogText")
@onready var front_row: HBoxContainer = get_node("Root/Stage/Battlefield/Padding/Body/FrontRow")
@onready var back_row: HBoxContainer = get_node("Root/Stage/Battlefield/Padding/Body/BackRow")
@onready var hand_row: HBoxContainer = get_node("Root/BottomDock/DockPadding/DockBody/HandScroll/HandRow")
@onready var player_stats: Label = get_node("Root/BottomDock/DockPadding/DockBody/MetaRow/PlayerStats")

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	var battle_seed: Dictionary = data_loader.load_battle_seed()
	var cards: Array = data_loader.load_base_cards()
	var enemy: Dictionary = battle_seed.get("enemy", {})
	var player: Dictionary = battle_seed.get("player", {})
	var slots: Array = battle_seed.get("slots", [])
	enemy_label.text = "Enemy Fortress"
	enemy_stats.text = "HP %d   Gold %d   Influence %d" % [
		int(enemy.get("health", 0)),
		int(enemy.get("gold", 0)),
		int(enemy.get("influence", 0)),
	]
	player_stats.text = "Player HP %d   Gold %d   Influence %d   Hand %d" % [
		int(player.get("health", 0)),
		int(player.get("gold", 0)),
		int(player.get("influence", 0)),
		int(player.get("handSize", 0)),
	]
	rules_label.text = "[b]Battle Rules[/b]\n- Front line takes direct clashes.\n- Back line supports and can be pressured by tactics.\n- Targeting and counter windows stay visible.\n- Bottom dock is reserved for the hand."
	log_label.text = "[b]Combat Log[/b]\n- Godot migration shell initialized.\n- Fixed PC battlefield layout active.\n- Next step: queue resolution and animation graph."
	_fill_slots(front_row, slots.filter(func(slot): return slot.get("row", "") == "front"))
	_fill_slots(back_row, slots.filter(func(slot): return slot.get("row", "") == "back"))
	_fill_hand(cards, int(player.get("handSize", 5)))

func _fill_slots(row_node: HBoxContainer, slots: Array) -> void:
	for child in row_node.get_children():
		child.queue_free()
	for slot in slots:
		var panel := PanelContainer.new()
		panel.custom_minimum_size = Vector2(0, 144)
		panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var style := StyleBoxFlat.new()
		style.bg_color = Color("19120d")
		style.border_color = Color("9b7447")
		style.border_width_left = 2
		style.border_width_top = 2
		style.border_width_right = 2
		style.border_width_bottom = 2
		style.corner_radius_top_left = 16
		style.corner_radius_top_right = 16
		style.corner_radius_bottom_right = 16
		style.corner_radius_bottom_left = 16
		panel.add_theme_stylebox_override("panel", style)
		var margin := MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 14)
		margin.add_theme_constant_override("margin_top", 12)
		margin.add_theme_constant_override("margin_right", 14)
		margin.add_theme_constant_override("margin_bottom", 12)
		panel.add_child(margin)
		var box := VBoxContainer.new()
		box.add_theme_constant_override("separation", 8)
		margin.add_child(box)
		var title := Label.new()
		title.text = str(slot.get("title", "Slot"))
		title.add_theme_font_size_override("font_size", 18)
		box.add_child(title)
		var stats := Label.new()
		stats.text = "HP %d / %d   Counter %s" % [
			int(slot.get("health", 0)),
			int(slot.get("maxHealth", 0)),
			"On" if bool(slot.get("counterArmed", false)) else "Off",
		]
		stats.add_theme_font_size_override("font_size", 13)
		box.add_child(stats)
		row_node.add_child(panel)

func _fill_hand(cards: Array, count: int) -> void:
	for child in hand_row.get_children():
		child.queue_free()
	for index in range(mini(count, cards.size())):
		var card := cards[index] as Dictionary
		var card_node := CARD_NODE_SCENE.instantiate()
		card_node.custom_minimum_size = Vector2(176, 246)
		card_node.call("setup", card)
		hand_row.add_child(card_node)
