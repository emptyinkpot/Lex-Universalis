@tool
extends EditorPlugin

var dock: Control

func _enter_tree() -> void:
	dock = _build_dock()
	add_control_to_dock(DOCK_SLOT_RIGHT_UL, dock)

func _exit_tree() -> void:
	if dock != null:
		remove_control_from_docks(dock)
		dock.queue_free()
		dock = null

func _build_dock() -> Control:
	var root := VBoxContainer.new()
	root.name = "LexUniversalisCodexDock"
	root.custom_minimum_size = Vector2(280, 160)

	var title := Label.new()
	title.text = "Lex Universalis Codex Bridge"
	title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	root.add_child(title)

	var hint := RichTextLabel.new()
	hint.fit_content = true
	hint.bbcode_enabled = true
	hint.text = "[b]Local bridge:[/b] run start-codex-bridge.bat from the repository root, then open the in-game AI Assistant page."
	root.add_child(hint)

	var button := Button.new()
	button.text = "Health: http://127.0.0.1:43987/health"
	button.tooltip_text = "Open this URL in a browser after starting the bridge."
	root.add_child(button)

	return root
