extends Control

const DATA_LOADER = preload("res://scripts/data_loader.gd")

@onready var summary_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/HeaderBody/TextBlock/Summary")
@onready var status_label: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/HeaderBody/Status")
@onready var card_list: ItemList = get_node("Padding/Root/Content/CardListPanel/CardListPadding/CardListBody/CardList")
@onready var name_field: LineEdit = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/NameField")
@onready var type_field: LineEdit = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/TypeRow/TypeField")
@onready var faction_field: LineEdit = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/TypeRow/FactionField")
@onready var cost_field: SpinBox = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/StatRow/CostField")
@onready var attack_field: SpinBox = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/StatRow/AttackField")
@onready var health_field: SpinBox = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/StatRow/HealthField")
@onready var description_field: TextEdit = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/DescriptionField")
@onready var flavor_field: TextEdit = get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/FlavorField")
@onready var preview_card: Control = get_node("Padding/Root/Content/PreviewPanel/PreviewPadding/PreviewBody/PreviewCard")
@onready var preview_notes: RichTextLabel = get_node("Padding/Root/Content/PreviewPanel/PreviewPadding/PreviewBody/PreviewNotes")
@onready var draft_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/DraftChip/Padding/Label")
@onready var selected_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/SelectedChip/Padding/Label")
@onready var storage_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/StorageChip/Padding/Label")
@onready var preview_chip: Label = get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/PreviewChip/Padding/Label")

var data_loader: RefCounted
var working_cards: Array = []
var selected_index := -1

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	working_cards = data_loader.load_working_cards()
	_apply_language_texts()
	summary_label.text = data_loader.t("card_editor_summary") % working_cards.size()
	_refresh_list()
	_select_card(0)
	_refresh_header_chips()

func _refresh_list() -> void:
	card_list.clear()
	for card in working_cards:
		if card is Dictionary:
			card_list.add_item("%s  [%s]" % [str(card.get("name", "Unknown")), str(card.get("type", "CARD"))])

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
	card_list.select(index)
	_refresh_header_chips()

func _update_preview(card: Dictionary) -> void:
	if preview_card.has_method("setup"):
		preview_card.call("setup", card)
	if preview_card.has_method("set_selected"):
		preview_card.call("set_selected", true)
	preview_notes.text = "%s: [b]%s[/b]\n本地草稿将保存到 `user://card-drafts.save.json`。\n%s" % [
		data_loader.t("card_editor_source"),
		str(card.get("id", "")),
		data_loader.t("card_editor_subtitle"),
	]

func _read_form() -> Dictionary:
	var source: Dictionary = working_cards[selected_index].duplicate(true)
	source["name"] = name_field.text.strip_edges()
	source["type"] = type_field.text.strip_edges().to_upper()
	source["faction"] = faction_field.text.strip_edges().to_upper()
	source["cost"] = int(cost_field.value)
	source["attack"] = int(attack_field.value)
	source["health"] = int(health_field.value)
	source["description"] = description_field.text.strip_edges()
	source["flavorText"] = flavor_field.text.strip_edges()
	return source

func _on_card_selected(index: int) -> void:
	_select_card(index)

func _on_field_changed(_value = null) -> void:
	if selected_index < 0:
		return
	var draft := _read_form()
	working_cards[selected_index] = draft
	_update_preview(draft)
	card_list.set_item_text(selected_index, "%s  [%s]" % [str(draft.get("name", "Unknown")), str(draft.get("type", "CARD"))])
	_refresh_header_chips()

func _on_save_pressed() -> void:
	if selected_index < 0:
		return
	working_cards[selected_index] = _read_form()
	data_loader.save_working_cards(working_cards)
	status_label.text = data_loader.t("card_editor_saved")
	_refresh_header_chips()

func _on_reset_pressed() -> void:
	working_cards = data_loader.load_working_cards()
	_refresh_list()
	_select_card(maxi(selected_index, 0))
	_refresh_header_chips()

func _apply_language_texts() -> void:
	summary_label.text = data_loader.t("card_editor_summary") % working_cards.size()
	get_node("Padding/Root/Header/HeaderPadding/HeaderStack/HeaderBody/TextBlock/Title").text = data_loader.t("card_editor_title")
	get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/DraftChip/Padding/Label").text = data_loader.t("card_editor_drafts")
	get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/SelectedChip/Padding/Label").text = data_loader.t("card_editor_selected")
	get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/StorageChip/Padding/Label").text = data_loader.t("card_editor_storage")
	get_node("Padding/Root/Header/HeaderPadding/HeaderStack/InfoStrip/PreviewChip/Padding/Label").text = data_loader.t("card_editor_preview")
	get_node("Padding/Root/Content/CardListPanel/CardListPadding/CardListBody/CardListHeader").text = data_loader.t("card_editor_list")
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/FormHeader").text = data_loader.t("card_editor_form")
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/NameField").placeholder_text = "名称" if data_loader.get_language() != "en" else "Name"
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/TypeRow/TypeField").placeholder_text = "类型" if data_loader.get_language() != "en" else "Type"
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/TypeRow/FactionField").placeholder_text = "阵营" if data_loader.get_language() != "en" else "Faction"
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/DescriptionField").placeholder_text = "描述" if data_loader.get_language() != "en" else "Description"
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/FlavorField").placeholder_text = "风味文本" if data_loader.get_language() != "en" else "Flavor text"
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/ActionRow/SaveButton").text = "保存草稿" if data_loader.get_language() != "en" else "Save Draft"
	get_node("Padding/Root/Content/FormPanel/FormPadding/FormBody/ActionRow/ResetButton").text = "重载" if data_loader.get_language() != "en" else "Reset"
	get_node("Padding/Root/Content/PreviewPanel/PreviewPadding/PreviewBody/PreviewHeader").text = "预览" if data_loader.get_language() != "en" else "Preview"

func _refresh_header_chips() -> void:
	draft_chip.text = "%s %d" % [data_loader.t("card_editor_drafts"), working_cards.size()]
	if selected_index >= 0 and selected_index < working_cards.size():
		var card: Dictionary = working_cards[selected_index]
		selected_chip.text = "%s %s" % [data_loader.t("card_editor_selected"), str(card.get("name", "Card"))]
		preview_chip.text = "%s / %s" % [
			str(card.get("type", "CARD")),
			str(card.get("faction", "NEUTRAL")),
		]
	else:
		selected_chip.text = "%s %s" % [data_loader.t("card_editor_selected"), "无"]
		preview_chip.text = "预览就绪" if data_loader.get_language() != "en" else "Preview Ready"
	storage_chip.text = data_loader.t("card_editor_storage")

func refresh_language() -> void:
	_apply_language_texts()
	_refresh_list()
	_select_card(maxi(selected_index, 0))
