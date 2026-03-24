extends PanelContainer

signal card_pressed(card_data: Dictionary)
signal drag_started(card_data: Dictionary)
signal drag_moved(card_data: Dictionary, global_position: Vector2)
signal drag_ended(card_data: Dictionary, global_position: Vector2)

var card_data: Dictionary = {}
var is_selected := false
var is_dragging := false
var base_position := Vector2.ZERO

func _ready() -> void:
	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)
	gui_input.connect(_on_gui_input)
	pivot_offset = size * 0.5

func setup(card: Dictionary) -> void:
	card_data = card.duplicate(true)
	var title_label: Label = get_node("Frame/Padding/Body/Header/TitleBlock/Title")
	var meta_label: Label = get_node("Frame/Padding/Body/Header/TitleBlock/Meta")
	var cost_label: Label = get_node("Frame/Padding/Body/Header/CostBadge/Cost")
	var art_label: Label = get_node("Frame/Padding/Body/Illustration/IllustrationLabel")
	var type_label: Label = get_node("Frame/Padding/Body/TypeLine")
	var description_label: RichTextLabel = get_node("Frame/Padding/Body/Description")
	var stat_label: Label = get_node("Frame/Padding/Body/Footer/Stats")
	var tag_label: Label = get_node("Frame/Padding/Body/Footer/Tag")
	var faction := str(card.get("faction", "NEUTRAL"))
	var card_type := str(card.get("type", "CARD"))
	var rarity := str(card.get("rarity", "BASE"))

	title_label.text = str(card.get("name", "Unknown Card"))
	meta_label.text = "%s  |  %s" % [faction, rarity]
	cost_label.text = str(int(card.get("cost", 0)))
	art_label.text = "Illustration\nReserved"
	type_label.text = card_type

	var description := str(card.get("description", ""))
	var flavor := str(card.get("flavorText", ""))
	description_label.text = description if flavor.strip_edges().is_empty() else "%s\n\n[i]%s[/i]" % [description, flavor]

	var stats := ["Cost %d" % int(card.get("cost", 0))]
	if card.get("attack", null) != null:
		stats.append("ATK %s" % str(card.get("attack")))
	if card.get("health", null) != null:
		stats.append("HP %s" % str(card.get("health")))
	stat_label.text = "   ".join(stats)
	tag_label.text = "%s CARD" % card_type

	add_theme_stylebox_override("panel", _build_style(card_type, faction))
	_apply_selected_state(false)

func set_selected(value: bool) -> void:
	is_selected = value
	_apply_selected_state(value)

func _apply_selected_state(value: bool) -> void:
	var frame: PanelContainer = get_node("Frame")
	var style := frame.get_theme_stylebox("panel")
	if style is StyleBoxFlat:
		var duplicated := style.duplicate() as StyleBoxFlat
		duplicated.shadow_size = 24 if value else 12
		duplicated.shadow_color = Color("d9ba7a") if value else Color(0, 0, 0, 0.35)
		duplicated.border_width_left = 4 if value else 2
		duplicated.border_width_top = 4 if value else 2
		duplicated.border_width_right = 4 if value else 2
		duplicated.border_width_bottom = 4 if value else 2
		frame.add_theme_stylebox_override("panel", duplicated)

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			is_dragging = true
			card_pressed.emit(card_data)
			drag_started.emit(card_data)
		else:
			if is_dragging:
				drag_ended.emit(card_data, get_global_mouse_position())
			is_dragging = false
	elif event is InputEventMouseMotion and is_dragging:
		drag_moved.emit(card_data, get_global_mouse_position())

func _on_mouse_entered() -> void:
	var target_position := base_position + Vector2(0, -18 if not is_selected else -28)
	_animate_to(target_position, Vector2.ONE * (1.03 if not is_selected else 1.05), 0.12)

func _on_mouse_exited() -> void:
	var target_position := base_position + Vector2(0, -20 if is_selected else 0)
	_animate_to(target_position, Vector2.ONE, 0.12)

func _animate_to(target_position: Vector2, target_scale: Vector2, duration: float) -> void:
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "position", target_position, duration)
	tween.tween_property(self, "scale", target_scale, duration)

func _build_style(card_type: String, faction: String) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.corner_radius_top_left = 22
	style.corner_radius_top_right = 22
	style.corner_radius_bottom_right = 22
	style.corner_radius_bottom_left = 22
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.shadow_size = 12
	style.shadow_color = Color(0, 0, 0, 0.35)
	style.bg_color = Color("1a130e")
	style.border_color = Color("c8a86b")
	if card_type == "TACTIC":
		style.bg_color = Color("14211f")
	elif card_type == "BUILDING":
		style.bg_color = Color("23180f")
	if faction == "FRANCE":
		style.border_color = Color("587fe3")
	elif faction == "ENGLAND":
		style.border_color = Color("cf7455")
	elif faction == "VIKING":
		style.border_color = Color("71b9de")
	elif faction == "BYZANTIUM":
		style.border_color = Color("9677d9")
	return style
