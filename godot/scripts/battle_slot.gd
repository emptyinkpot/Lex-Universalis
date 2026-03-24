extends PanelContainer

signal slot_pressed(slot_id: String)

var slot_id := ""
var is_armed := false
var is_hovered := false

func _ready() -> void:
	gui_input.connect(_on_gui_input)
	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)

func setup(slot: Dictionary, armed: bool) -> void:
	slot_id = str(slot.get("id", ""))
	is_armed = armed
	var title_label: Label = get_node("Padding/Body/Title")
	var stats_label: Label = get_node("Padding/Body/Stats")
	var occupant_name := str(slot.get("occupantName", ""))
	title_label.text = occupant_name if not occupant_name.is_empty() else str(slot.get("title", "Slot"))
	stats_label.text = "ATK %d   HP %d / %d   Counter %s" % [
		int(slot.get("attack", 0)),
		int(slot.get("health", 0)),
		int(slot.get("maxHealth", 0)),
		"On" if bool(slot.get("counterArmed", false)) else "Off",
	]
	_apply_style(armed)

func play_hit_feedback() -> void:
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "scale", Vector2.ONE * 1.04, 0.08)
	tween.tween_property(self, "modulate", Color("ffd7a1"), 0.08)
	await tween.finished
	var settle := create_tween()
	settle.set_parallel(true)
	settle.tween_property(self, "scale", Vector2.ONE, 0.14)
	settle.tween_property(self, "modulate", Color.WHITE, 0.14)

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
