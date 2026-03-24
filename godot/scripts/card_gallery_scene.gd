extends Control

const CARD_NODE_SCENE := preload("res://scenes/components/CardNode.tscn")
const DATA_LOADER = preload("res://scripts/data_loader.gd")
var data_loader: RefCounted

@onready var summary_label: Label = get_node("Root/Header/HeaderPadding/HeaderRow/Summary")
@onready var cards_grid: GridContainer = get_node("Root/Body/BodyPadding/GridScroll/CardsGrid")

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	var base_cards: Array = data_loader.load_base_cards()
	var moon_cards: Array = data_loader.load_moon_cards()
	summary_label.text = "Base cards %d   Moon drafts %d   CardNode is now the shared Godot renderer." % [
		base_cards.size(),
		moon_cards.size(),
	]
	for child in cards_grid.get_children():
		child.queue_free()
	var combined: Array = []
	combined.append_array(base_cards.slice(0, mini(6, base_cards.size())))
	combined.append_array(moon_cards.slice(0, mini(6, moon_cards.size())))
	for card in combined:
		if card is Dictionary:
			var card_node := CARD_NODE_SCENE.instantiate()
			card_node.call("setup", card)
			cards_grid.add_child(card_node)
