@tool
extends EditorPlugin

const BUILDER_PATH := "E:/Program Files(x86)/Godot/4.6.1/addons/lex_universalis_codex_editor/scripts/codex_dock_builder.gd"

var builder: RefCounted
var dock: Control

func _enter_tree() -> void:
	var builder_script: Variant = load(BUILDER_PATH)
	if builder_script is Script:
		builder = (builder_script as Script).new()
	if builder != null and builder.has_method("build_dock"):
		dock = builder.call("build_dock") as Control
		if dock != null:
			add_control_to_dock(DOCK_SLOT_RIGHT_UL, dock)

func _exit_tree() -> void:
	if dock != null:
		remove_control_from_docks(dock)
		dock.queue_free()
		dock = null
	builder = null
