extends Control

const DATA_LOADER = preload("res://scripts/data_loader.gd")
const CARD_NODE_SCENE := preload("res://scenes/components/CardNode.tscn")

@onready var summary_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/TitleRow/TextBlock/Summary")
@onready var status_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/TitleRow/Status")
@onready var pool_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/PoolChip/Padding/Label")
@onready var deck_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/DeckChip/Padding/Label")
@onready var selected_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/SelectedChip/Padding/Label")
@onready var storage_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/StorageChip/Padding/Label")
@onready var preview_card: Control = get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/CardPreview")
@onready var detail_title: Label = get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/DetailTitle")
@onready var pool_list: LineEdit = get_node("Padding/Root/Content/LibraryColumn/PoolPanel/PoolPadding/PoolBody/SearchField")
@onready var pool_grid: GridContainer = get_node("Padding/Root/Content/LibraryColumn/PoolPanel/PoolPadding/PoolBody/PoolGridScroll/PoolGrid")
@onready var deck_grid: GridContainer = get_node("Padding/Root/Content/LibraryColumn/DeckPanel/DeckPadding/DeckBody/DeckGridScroll/DeckGrid")

var data_loader: RefCounted
var pool_cards: Array = []
var deck_cards: Array = []
var selected_pool_index := -1
var selected_deck_index := -1
var search_query := ""

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	pool_cards = data_loader.load_working_cards()
	deck_cards = data_loader.load_deck_list()
	preview_card.custom_minimum_size = Vector2(220, 308)
	_apply_language_texts()
	summary_label.text = data_loader.t("deck_builder_summary") % [pool_cards.size(), deck_cards.size()]
	_refresh_grids()
	_show_preview(_get_card_from_pool(0))
	_refresh_header_chips()

func _refresh_grids() -> void:
	for child in pool_grid.get_children():
		child.queue_free()
	for child in deck_grid.get_children():
		child.queue_free()
	for index in range(pool_cards.size()):
		var card := _get_card_from_pool(index)
		if card.is_empty():
			continue
		var card_node := CARD_NODE_SCENE.instantiate()
		pool_grid.add_child(card_node)
		if card_node.has_method("set_compact_mode"):
			card_node.call("set_compact_mode", true)
		card_node.call("setup", card)
		card_node.call("set_selected", index == selected_pool_index)
		card_node.card_pressed.connect(_on_pool_selected.bind(index))
	for index in range(deck_cards.size()):
		var deck_card := _get_card_from_deck(index)
		if deck_card.is_empty():
			continue
		if not _matches_search(deck_card):
			continue
		var deck_node := CARD_NODE_SCENE.instantiate()
		deck_grid.add_child(deck_node)
		if deck_node.has_method("set_compact_mode"):
			deck_node.call("set_compact_mode", true)
		deck_node.call("setup", deck_card)
		deck_node.call("set_selected", index == selected_deck_index)
		deck_node.card_pressed.connect(_on_deck_selected.bind(index))

func _matches_search(card: Dictionary) -> bool:
	if search_query.strip_edges().is_empty():
		return true
	var query := search_query.strip_edges().to_lower()
	var haystack := "%s %s %s %s" % [
		str(card.get("name", "")),
		str(card.get("type", "")),
		str(card.get("faction", "")),
		str(card.get("rarity", "")),
	]
	return haystack.to_lower().contains(query)

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
		status_label.text = data_loader.t("deck_builder_select_card")
		return
	if preview_card.has_method("setup"):
		preview_card.call("setup", card)
	if preview_card.has_method("set_selected"):
		preview_card.call("set_selected", true)
	detail_title.text = "%s  |  %s" % [str(card.get("name", "Unknown")), str(card.get("faction", "NEUTRAL"))]
	status_label.text = "%s %s" % [data_loader.t("deck_builder_selected"), str(card.get("id", ""))]
	_refresh_header_chips()

func _on_pool_selected(index: int) -> void:
	selected_pool_index = index
	selected_deck_index = -1
	var card := _get_card_from_pool(index)
	if not _matches_search(card):
		search_query = ""
		pool_list.text = ""
	_refresh_grids()
	_show_preview(card)

func _on_deck_selected(index: int) -> void:
	selected_deck_index = index
	selected_pool_index = -1
	_refresh_grids()
	_show_preview(_get_card_from_deck(index))

func _on_search_changed(value: String) -> void:
	search_query = value
	_refresh_grids()

func _on_add_pressed() -> void:
	var card := _get_card_from_pool(selected_pool_index)
	if card.is_empty():
		return
	deck_cards.append(card.duplicate(true))
	data_loader.save_deck_list(deck_cards)
	_refresh_grids()
	status_label.text = "%s %s" % [data_loader.t("deck_builder_add"), str(card.get("name", "Unknown"))]
	_refresh_header_chips()

func _on_remove_pressed() -> void:
	if selected_deck_index < 0 or selected_deck_index >= deck_cards.size():
		return
	var removed: Dictionary = deck_cards[selected_deck_index]
	deck_cards.remove_at(selected_deck_index)
	data_loader.save_deck_list(deck_cards)
	_refresh_grids()
	_show_preview(_get_card_from_pool(maxi(selected_pool_index, 0)))
	status_label.text = "%s %s" % [data_loader.t("deck_builder_remove"), str(removed.get("name", "Unknown"))]
	_refresh_header_chips()

func _on_save_pressed() -> void:
	data_loader.save_deck_list(deck_cards)
	status_label.text = data_loader.t("deck_builder_storage")
	_refresh_header_chips()

func _on_reset_pressed() -> void:
	deck_cards = data_loader.load_deck_list()
	_refresh_grids()
	_show_preview(_get_card_from_pool(maxi(selected_pool_index, 0)))
	_refresh_header_chips()

func _apply_language_texts() -> void:
	summary_label.text = data_loader.t("deck_builder_summary") % [pool_cards.size(), deck_cards.size()]
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/TitleRow/TextBlock/Title").text = data_loader.t("deck_builder_title")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/PoolChip/Padding/Label").text = data_loader.t("deck_builder_pool")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/DeckChip/Padding/Label").text = data_loader.t("deck_builder_deck")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/SelectedChip/Padding/Label").text = data_loader.t("deck_builder_selected")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/StorageChip/Padding/Label").text = data_loader.t("deck_builder_storage")
	get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/PreviewTitle").text = data_loader.t("deck_builder_deck")
	get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/DetailTitle").text = data_loader.t("deck_builder_selected")
	get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/ActionRow/AddButton").text = data_loader.t("deck_builder_add")
	get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/ActionRow/RemoveButton").text = data_loader.t("deck_builder_remove")
	get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/ActionRow/SaveButton").text = data_loader.t("deck_builder_save")
	get_node("Padding/Root/Content/WorkbenchPanel/WorkbenchPadding/WorkbenchBody/ActionRow/ResetButton").text = data_loader.t("deck_builder_reset")
	get_node("Padding/Root/Content/LibraryColumn/PoolPanel/PoolPadding/PoolBody/PoolHeader").text = data_loader.t("deck_builder_pool")
	get_node("Padding/Root/Content/LibraryColumn/PoolPanel/PoolPadding/PoolBody/SearchField").placeholder_text = "Search cards..." if data_loader.get_language() == "en" else "搜索名称 / 类型 / 阵营"
	get_node("Padding/Root/Content/LibraryColumn/DeckPanel/DeckPadding/DeckBody/DeckHeader").text = data_loader.t("deck_builder_deck")

func _refresh_header_chips() -> void:
	pool_chip.text = "%s %d" % [data_loader.t("deck_builder_pool"), pool_cards.size()]
	deck_chip.text = "%s %d" % [data_loader.t("deck_builder_deck"), deck_cards.size()]
	if selected_deck_index >= 0 and selected_deck_index < deck_cards.size():
		var deck_card: Dictionary = deck_cards[selected_deck_index]
		selected_chip.text = "%s %s" % [data_loader.t("deck_builder_selected"), str(deck_card.get("name", "Card"))]
	elif selected_pool_index >= 0 and selected_pool_index < pool_cards.size():
		var pool_card: Dictionary = pool_cards[selected_pool_index]
		selected_chip.text = "%s %s" % [data_loader.t("deck_builder_selected"), str(pool_card.get("name", "Card"))]
	else:
		selected_chip.text = "%s None" % data_loader.t("deck_builder_selected")
	storage_chip.text = data_loader.t("deck_builder_storage")
