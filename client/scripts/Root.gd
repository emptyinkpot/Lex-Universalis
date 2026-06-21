extends Node2D

func _ready() -> void:
	get_viewport().size_changed.connect(_apply_mobile_layout)
	call_deferred("_apply_mobile_layout")

func _apply_mobile_layout() -> void:
	LayoutService.fit_root_controls(self)
