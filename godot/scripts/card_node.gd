extends PanelContainer

func setup(card: Dictionary) -> void:
	var title_label: Label = get_node("Padding/Body/Title")
	var meta_label: Label = get_node("Padding/Body/Meta")
	var description_label: RichTextLabel = get_node("Padding/Body/Description")
	var stat_label: Label = get_node("Padding/Body/Stats")
	title_label.text = str(card.get("name", "Unknown Card"))
	var faction := str(card.get("faction", "NEUTRAL"))
	var card_type := str(card.get("type", "CARD"))
	var rarity := str(card.get("rarity", "BASE"))
	meta_label.text = "%s  |  %s  |  %s" % [faction, card_type, rarity]
	var description := str(card.get("description", ""))
	var flavor := str(card.get("flavorText", ""))
	description_label.text = description if flavor.strip_edges().is_empty() else "%s\n\n[i]%s[/i]" % [description, flavor]
	var stats := ["Cost %d" % int(card.get("cost", 0))]
	if card.get("attack", null) != null:
		stats.append("ATK %s" % str(card.get("attack")))
	if card.get("health", null) != null:
		stats.append("HP %s" % str(card.get("health")))
	if not str(card.get("effect", "")).is_empty():
		stats.append("Effect")
	stat_label.text = "   ".join(stats)
	add_theme_stylebox_override("panel", _build_style(card_type, faction))

func _build_style(card_type: String, faction: String) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.corner_radius_top_left = 18
	style.corner_radius_top_right = 18
	style.corner_radius_bottom_right = 18
	style.corner_radius_bottom_left = 18
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.bg_color = Color("1b140f")
	style.border_color = Color("c8a86b")
	if card_type == "TACTIC":
		style.bg_color = Color("15221f")
	elif card_type == "BUILDING":
		style.bg_color = Color("231a12")
	if faction == "FRANCE":
		style.border_color = Color("5278d8")
	elif faction == "ENGLAND":
		style.border_color = Color("b95b4d")
	elif faction == "VIKING":
		style.border_color = Color("70a9cf")
	elif faction == "BYZANTIUM":
		style.border_color = Color("8b69c4")
	return style
