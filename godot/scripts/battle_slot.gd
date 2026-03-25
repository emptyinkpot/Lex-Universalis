extends PanelContainer

signal slot_pressed(slot_id: String)

const CARD_NODE_SCENE := preload("res://scenes/components/CardNode.tscn")
const BASE_OCCUPANT_SIZE := Vector2(96, 134)
const BASE_OCCUPANT_SCALE := 0.54

var slot_id := ""
var is_armed := false
var is_hovered := false
var occupant_card_node: Control

func _ready() -> void:
	gui_input.connect(_on_gui_input)
	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)

func setup(slot: Dictionary, armed: bool) -> void:
	slot_id = str(slot.get("id", ""))
	is_armed = armed
	var title_label: Label = get_node("Padding/Body/Title")
	var stats_label: Label = get_node("Padding/Body/Stats")
	var occupant_anchor: Control = get_node("Padding/Body/OccupantWrap/OccupantAnchor")
	var occupant_name := str(slot.get("occupantName", ""))
	title_label.text = occupant_name if not occupant_name.is_empty() else str(slot.get("title", "Slot"))
	stats_label.text = "%s  ATK %d  HP %d/%d  Ctr %s" % [
		"Front" if str(slot.get("row", "front")) == "front" else "Back",
		int(slot.get("attack", 0)),
		int(slot.get("health", 0)),
		int(slot.get("maxHealth", 0)),
		"On" if bool(slot.get("counterArmed", false)) else "Off",
	]
	for child in occupant_anchor.get_children():
		child.queue_free()
	if slot.has("occupantCard"):
		occupant_card_node = CARD_NODE_SCENE.instantiate()
		occupant_card_node.mouse_filter = Control.MOUSE_FILTER_IGNORE
		if occupant_card_node.has_method("set_compact_mode"):
			occupant_card_node.call("set_compact_mode", true)
		occupant_card_node.custom_minimum_size = BASE_OCCUPANT_SIZE
		occupant_card_node.scale = Vector2.ONE * BASE_OCCUPANT_SCALE
		occupant_anchor.add_child(occupant_card_node)
		occupant_card_node.position = Vector2(occupant_anchor.custom_minimum_size.x * 0.08, 0)
		occupant_card_node.call("setup", slot.get("occupantCard", {}))
	_apply_style(armed)

func play_hit_feedback() -> void:
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "scale", Vector2.ONE * 1.04, 0.08)
	tween.tween_property(self, "modulate", Color("ffd7a1"), 0.08)
	if occupant_card_node != null:
		tween.tween_property(occupant_card_node, "rotation", 0.06, 0.08)
	await tween.finished
	var settle := create_tween()
	settle.set_parallel(true)
	settle.tween_property(self, "scale", Vector2.ONE, 0.14)
	settle.tween_property(self, "modulate", Color.WHITE, 0.14)
	if occupant_card_node != null:
		settle.tween_property(occupant_card_node, "rotation", 0.0, 0.14)

func play_death_feedback() -> void:
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "modulate", Color(0.65, 0.55, 0.5, 0.0), 0.28)
	tween.tween_property(self, "scale", Vector2.ONE * 0.9, 0.28)
	if occupant_card_node != null:
		tween.tween_property(occupant_card_node, "rotation", -0.12, 0.2)
		tween.tween_property(occupant_card_node, "modulate", Color(1, 1, 1, 0), 0.24)
	await tween.finished

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		slot_pressed.emit(slot_id)

func _on_mouse_entered() -> void:
	is_hovered = true
	_apply_style(is_armed)

func _on_mouse_exited() -> void:
	is_hovered = false
	_apply_style(is_armed)

func set_drag_highlight(active: bool) -> void:
	is_hovered = active
	_apply_style(is_armed)

func set_card_scale(scale: Vector2) -> void:
	if not is_instance_valid(occupant_card_node):
		return
	var scale_factor := maxf(0.72, minf(scale.x, scale.y))
	occupant_card_node.custom_minimum_size = BASE_OCCUPANT_SIZE * scale_factor
	occupant_card_node.scale = Vector2.ONE * BASE_OCCUPANT_SCALE * scale_factor
	occupant_card_node.position = Vector2(occupant_card_node.position.x, occupant_card_node.position.y)

func _apply_style(armed: bool) -> void:
	var style := StyleBoxFlat.new()
	style.bg_color = Color("19120d")
	style.border_color = Color("f0cf84") if is_hovered and armed else (Color("d0b06e") if armed else Color("8f6c45"))
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 16
	style.corner_radius_top_right = 16
	style.corner_radius_bottom_right = 16
	style.corner_radius_bottom_left = 16
	style.shadow_size = 18 if is_hovered and armed else (12 if armed else 6)
	style.shadow_color = Color("f0cf84", 0.36) if is_hovered and armed else (Color("d0b06e", 0.28) if armed else Color(0, 0, 0, 0.18))
	add_theme_stylebox_override("panel", style)
