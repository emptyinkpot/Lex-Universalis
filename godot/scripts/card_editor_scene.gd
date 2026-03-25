extends Control

const DATA_LOADER = preload("res://scripts/data_loader.gd")
const CARD_NODE_SCENE := preload("res://scenes/components/CardNode.tscn")

@onready var summary_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/TitleRow/TextBlock/Summary")
@onready var status_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/TitleRow/Status")
@onready var draft_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/DraftChip/Padding/Label")
@onready var selected_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/SelectedChip/Padding/Label")
@onready var storage_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/StorageChip/Padding/Label")
@onready var preview_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/PreviewChip/Padding/Label")
@onready var preview_card: Control = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/PreviewCard")
@onready var preview_notes: RichTextLabel = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/PreviewNotes")
@onready var name_field: LineEdit = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/NameField")
@onready var type_field: LineEdit = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/TypeRow/TypeField")
@onready var faction_field: LineEdit = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/TypeRow/FactionField")
@onready var cost_field: SpinBox = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/StatRow/CostField")
@onready var attack_field: SpinBox = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/StatRow/AttackField")
@onready var health_field: SpinBox = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/StatRow/HealthField")
@onready var description_field: TextEdit = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/DescriptionField")
@onready var flavor_field: TextEdit = get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/FlavorField")
@onready var search_field: LineEdit = get_node("Padding/Root/Content/LibraryPanel/LibraryPadding/LibraryBody/SearchField")
@onready var library_grid: GridContainer = get_node("Padding/Root/Content/LibraryPanel/LibraryPadding/LibraryBody/LibraryGridScroll/LibraryGrid")

var data_loader: RefCounted
var working_cards: Array = []
var selected_index := -1
var search_query := ""

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	working_cards = data_loader.load_working_cards()
	preview_card.custom_minimum_size = Vector2(220, 308)
	_apply_language_texts()
	_refresh_header_chips()
	_refresh_library()
	if not working_cards.is_empty():
		_select_card(0)
	_refresh_header_chips()

func _refresh_library() -> void:
	for child in library_grid.get_children():
		child.queue_free()
	var filtered_cards := _get_filtered_cards()
	for card in filtered_cards:
		if not (card is Dictionary):
			continue
		var card_dict := card as Dictionary
		var card_node := CARD_NODE_SCENE.instantiate()
		library_grid.add_child(card_node)
		if card_node.has_method("set_compact_mode"):
			card_node.call("set_compact_mode", true)
		card_node.call("setup", card_dict)
		card_node.call("set_selected", _card_matches_selected(card_dict))
		card_node.card_pressed.connect(_on_library_card_pressed.bind(str(card_dict.get("id", ""))))

func _get_filtered_cards() -> Array:
	if search_query.strip_edges().is_empty():
		return working_cards
	var query := search_query.strip_edges().to_lower()
	var results: Array = []
	for card in working_cards:
		if not (card is Dictionary):
			continue
		var card_dict: Dictionary = card as Dictionary
		var haystack := "%s %s %s %s" % [
			str(card_dict.get("name", "")),
			str(card_dict.get("type", "")),
			str(card_dict.get("faction", "")),
			str(card_dict.get("rarity", "")),
		]
		if haystack.to_lower().contains(query):
			results.append(card_dict)
	return results

func _card_matches_selected(card: Dictionary) -> bool:
	if selected_index < 0 or selected_index >= working_cards.size():
		return false
	var selected_card: Variant = working_cards[selected_index]
	if not (selected_card is Dictionary):
		return false
	return str((selected_card as Dictionary).get("id", "")) == str(card.get("id", ""))

func _select_card(index: int) -> void:
	if index < 0 or index >= working_cards.size():
		return
	selected_index = index
	var card: Dictionary = working_cards[index]
	name_field.text = str(card.get("name", ""))
	type_field.text = str(card.get("type", "CARD"))
	faction_field.text = str(card.get("faction", "NEUTRAL"))
	cost_field.value = float(card.get("cost", 0))
	attack_field.value = float(card.get("attack", 0))
	health_field.value = float(card.get("health", 0))
	description_field.text = str(card.get("description", ""))
	flavor_field.text = str(card.get("flavorText", ""))
	_update_preview(card)
	status_label.text = "%s  |  %s" % [str(card.get("id", "")), str(card.get("rarity", "BASE"))]
	_refresh_header_chips()
	_refresh_library()

func _on_library_card_pressed(_card_data: Dictionary, card_id: String) -> void:
	var index := _find_card_index_by_id(card_id)
	if index >= 0:
		_select_card(index)

func _find_card_index_by_id(card_id: String) -> int:
	for index in range(working_cards.size()):
		var card: Variant = working_cards[index]
		if card is Dictionary and str((card as Dictionary).get("id", "")) == card_id:
			return index
	return -1

func _update_preview(card: Dictionary) -> void:
	if preview_card.has_method("setup"):
		preview_card.call("setup", card)
	if preview_card.has_method("set_selected"):
		preview_card.call("set_selected", true)
	preview_notes.text = "%s: [b]%s[/b]\n本地草稿会保存到 `user://card-drafts.save.json`。\n%s" % [
		data_loader.t("card_editor_source"),
		str(card.get("id", "")),
		data_loader.t("card_editor_subtitle"),
	]

func _read_form() -> Dictionary:
	if selected_index < 0 or selected_index >= working_cards.size():
		return {}
	var source: Dictionary = (working_cards[selected_index] as Dictionary).duplicate(true)
	source["name"] = name_field.text.strip_edges()
	source["type"] = type_field.text.strip_edges().to_upper()
	source["faction"] = faction_field.text.strip_edges().to_upper()
	source["cost"] = int(cost_field.value)
	source["attack"] = int(attack_field.value)
	source["health"] = int(health_field.value)
	source["description"] = description_field.text.strip_edges()
	source["flavorText"] = flavor_field.text.strip_edges()
	return source

func _on_field_changed(_value = null) -> void:
	if selected_index < 0:
		return
	var draft := _read_form()
	if draft.is_empty():
		return
	working_cards[selected_index] = draft
	_update_preview(draft)
	status_label.text = "%s  |  %s" % [str(draft.get("id", "")), str(draft.get("rarity", "BASE"))]
	_refresh_header_chips()
	_refresh_library()

func _on_search_changed(value: String) -> void:
	search_query = value
	_refresh_library()

func _on_save_pressed() -> void:
	if selected_index < 0:
		return
	working_cards[selected_index] = _read_form()
	data_loader.save_working_cards(working_cards)
	status_label.text = data_loader.t("card_editor_saved")
	_refresh_header_chips()
	_refresh_library()

func _on_reset_pressed() -> void:
	working_cards = data_loader.load_working_cards()
	_refresh_library()
	_select_card(maxi(selected_index, 0))
	_refresh_header_chips()

func _apply_language_texts() -> void:
	summary_label.text = data_loader.t("card_editor_summary") % working_cards.size()
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/TitleRow/TextBlock/Title").text = data_loader.t("card_editor_title")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/DraftChip/Padding/Label").text = data_loader.t("card_editor_drafts")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/SelectedChip/Padding/Label").text = data_loader.t("card_editor_selected")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/StorageChip/Padding/Label").text = data_loader.t("card_editor_storage")
	get_node("Padding/Root/Header/HeaderPadding/HeaderBody/InfoStrip/PreviewChip/Padding/Label").text = data_loader.t("card_editor_preview")
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/PreviewTitle").text = data_loader.t("card_editor_preview")
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/DetailTitle").text = data_loader.t("card_editor_form")
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/NameField").placeholder_text = "Name" if data_loader.get_language() == "en" else "名称"
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/TypeRow/TypeField").placeholder_text = "Type" if data_loader.get_language() == "en" else "类型"
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/TypeRow/FactionField").placeholder_text = "Faction" if data_loader.get_language() == "en" else "阵营"
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/DescriptionField").placeholder_text = "Description" if data_loader.get_language() == "en" else "描述"
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/FlavorField").placeholder_text = "Flavor text" if data_loader.get_language() == "en" else "风味文本"
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/ActionRow/SaveButton").text = "Save Draft" if data_loader.get_language() == "en" else "保存草稿"
	get_node("Padding/Root/Content/EditorPanel/EditorPadding/EditorBody/FormGrid/ActionRow/ResetButton").text = "Reset" if data_loader.get_language() == "en" else "重载"
	get_node("Padding/Root/Content/LibraryPanel/LibraryPadding/LibraryBody/LibraryHeader").text = "Library" if data_loader.get_language() == "en" else "卡池"
	get_node("Padding/Root/Content/LibraryPanel/LibraryPadding/LibraryBody/SearchField").placeholder_text = "Search cards..." if data_loader.get_language() == "en" else "搜索名称 / 类型 / 阵营"

func _refresh_header_chips() -> void:
	draft_chip.text = "%s %d" % [data_loader.t("card_editor_drafts"), working_cards.size()]
	if selected_index >= 0 and selected_index < working_cards.size():
		var card: Dictionary = working_cards[selected_index]
		selected_chip.text = "%s %s" % [data_loader.t("card_editor_selected"), str(card.get("name", "Card"))]
		preview_chip.text = "%s / %s" % [str(card.get("type", "CARD")), str(card.get("faction", "NEUTRAL"))]
	else:
		selected_chip.text = "%s %s" % [data_loader.t("card_editor_selected"), "None"]
		preview_chip.text = data_loader.t("card_editor_preview")
	storage_chip.text = data_loader.t("card_editor_storage")

func refresh_language() -> void:
	_apply_language_texts()
	_refresh_header_chips()
	_refresh_library()
	if selected_index >= 0 and selected_index < working_cards.size():
		_select_card(selected_index)
