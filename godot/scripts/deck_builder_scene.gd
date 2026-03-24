extends Control

const DATA_LOADER = preload("res://scripts/data_loader.gd")

@onready var summary_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/HeaderBody/TextBlock/Summary")
@onready var status_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/HeaderBody/Status")
@onready var pool_list: ItemList = get_node("Padding/Root/Content/PoolPanel/PoolPadding/PoolBody/PoolList")
@onready var deck_list: ItemList = get_node("Padding/Root/Content/DeckPanel/DeckPadding/DeckBody/DeckList")
@onready var preview_card: Control = get_node("Padding/Root/Content/EditPanel/EditPadding/EditBody/CardPreview")
@onready var detail_title: Label = get_node("Padding/Root/Content/EditPanel/EditPadding/EditBody/DetailTitle")
@onready var pool_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/PoolChip/Padding/Label")
@onready var deck_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/DeckChip/Padding/Label")
@onready var selected_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/SelectedChip/Padding/Label")
@onready var storage_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/StorageChip/Padding/Label")

var data_loader: RefCounted
var pool_cards: Array = []
var deck_cards: Array = []
var selected_pool_index := -1
var selected_deck_index := -1

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	pool_cards = data_loader.load_working_cards()
	deck_cards = data_loader.load_deck_list()
	summary_label.text = "Pool %d cards   Deck %d cards   Build and save a local deck list." % [pool_cards.size(), deck_cards.size()]
	_refresh_lists()
	_show_preview(_get_card_from_pool(0))
	_refresh_header_chips()

func _refresh_lists() -> void:
	pool_list.clear()
	for card in pool_cards:
		if card is Dictionary:
			pool_list.add_item("%s  [%s]" % [str(card.get("name", "Unknown")), str(card.get("type", "CARD"))])
	deck_list.clear()
	for card in deck_cards:
		if card is Dictionary:
			deck_list.add_item("%s  [%s]" % [str(card.get("name", "Unknown")), str(card.get("type", "CARD"))])

func _get_card_from_pool(index: int) -> Dictionary:
	if index < 0 or index >= pool_cards.size():
		return {}
	var card: Variant = pool_cards[index]
	return card if card is Dictionary else {}

func _get_card_from_deck(index: int) -> Dictionary:
	if index < 0 or index >= deck_cards.size():
		return {}
	var card: Variant = deck_cards[index]
	return card if card is Dictionary else {}

func _show_preview(card: Dictionary) -> void:
	if card.is_empty():
		status_label.text = "Select a card from the pool or deck."
		return
	if preview_card.has_method("setup"):
		preview_card.call("setup", card)
	if preview_card.has_method("set_selected"):
		preview_card.call("set_selected", true)
	detail_title.text = "%s  |  %s" % [str(card.get("name", "Unknown")), str(card.get("faction", "NEUTRAL"))]
	status_label.text = "Selected %s" % str(card.get("id", ""))
	_refresh_header_chips()

func _on_pool_selected(index: int) -> void:
	selected_pool_index = index
	selected_deck_index = -1
	_show_preview(_get_card_from_pool(index))

func _on_deck_selected(index: int) -> void:
	selected_deck_index = index
	selected_pool_index = -1
	_show_preview(_get_card_from_deck(index))

func _on_add_pressed() -> void:
	var card := _get_card_from_pool(selected_pool_index)
	if card.is_empty():
		return
	deck_cards.append(card.duplicate(true))
	data_loader.save_deck_list(deck_cards)
	_refresh_lists()
	status_label.text = "Added %s to deck." % str(card.get("name", "Unknown"))
	_refresh_header_chips()

func _on_remove_pressed() -> void:
	if selected_deck_index < 0 or selected_deck_index >= deck_cards.size():
		return
	var removed: Dictionary = deck_cards[selected_deck_index]
	deck_cards.remove_at(selected_deck_index)
	data_loader.save_deck_list(deck_cards)
	_refresh_lists()
	_show_preview(_get_card_from_pool(maxi(selected_pool_index, 0)))
	status_label.text = "Removed %s from deck." % str(removed.get("name", "Unknown"))
	_refresh_header_chips()

func _on_save_pressed() -> void:
	data_loader.save_deck_list(deck_cards)
	status_label.text = "Deck saved locally."
	_refresh_header_chips()

func _on_reset_pressed() -> void:
	deck_cards = data_loader.load_deck_list()
	_refresh_lists()
	_show_preview(_get_card_from_pool(maxi(selected_pool_index, 0)))
	_refresh_header_chips()

func _refresh_header_chips() -> void:
	pool_chip.text = "Pool %d" % pool_cards.size()
	deck_chip.text = "Deck %d" % deck_cards.size()
	if selected_deck_index >= 0 and selected_deck_index < deck_cards.size():
		var deck_card: Dictionary = deck_cards[selected_deck_index]
		selected_chip.text = "Selected %s" % str(deck_card.get("name", "Card"))
	elif selected_pool_index >= 0 and selected_pool_index < pool_cards.size():
		var pool_card: Dictionary = pool_cards[selected_pool_index]
		selected_chip.text = "Selected %s" % str(pool_card.get("name", "Card"))
	else:
		selected_chip.text = "Selected None"
	storage_chip.text = "Saved Locally"
