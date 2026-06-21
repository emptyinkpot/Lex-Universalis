extends Node

## LayoutService 负责运行时 UI 适配。
## 当前项目以 720x1280 竖屏为设计基准，这里在不同视口下调整根控件、
## 背景和已知页面，减少 PC/手机尺寸切换时的错位。

const DESIGN_SIZE: Vector2 = Vector2(720, 1280)
const MOBILE_WIDTH_THRESHOLD: float = 760.0
const SCREEN_MARGIN: float = 24.0

func refresh_from(node: Node) -> void:
	# 从任意节点向上找到当前场景，再刷新整棵根 UI。
	if not node:
		return
	var root := node.get_tree().current_scene
	if root:
		fit_root_controls(root)

func fit_root_controls(root: Node) -> void:
	var viewport_size: Vector2 = root.get_viewport().get_visible_rect().size
	for child in root.get_children():
		if child is Control:
			fit_fullscreen_control(child, viewport_size)

func fit_fullscreen_control(control: Control, viewport_size: Vector2) -> void:
	# 保持 720x1280 设计画布比例，窗口拉伸时整体居中缩放，避免子 UI 被挤散。
	var scale_factor: float = min(viewport_size.x / DESIGN_SIZE.x, viewport_size.y / DESIGN_SIZE.y)
	if scale_factor <= 0.0:
		scale_factor = 1.0
	var scaled_size: Vector2 = DESIGN_SIZE * scale_factor
	control.set_anchors_preset(Control.PRESET_TOP_LEFT)
	control.position = (viewport_size - scaled_size) * 0.5
	control.size = DESIGN_SIZE
	control.scale = Vector2(scale_factor, scale_factor)
	control.custom_minimum_size = DESIGN_SIZE
	_fit_backgrounds(control)
	_fit_known_screens(control, DESIGN_SIZE)

func _fit_backgrounds(root: Control) -> void:
	for node in root.find_children("Background", "Control", true, false):
		var control := node as Control
		control.set_anchors_preset(Control.PRESET_FULL_RECT)
		control.offset_left = 0
		control.offset_top = 0
		control.offset_right = 0
		control.offset_bottom = 0

func _fit_known_screens(root: Control, viewport_size: Vector2) -> void:
	if root.name == "TitleScreen":
		_fit_title_screen(root, viewport_size)
	if root.name == "RunScreen":
		_fit_run_screen(root, viewport_size)

func _fit_title_screen(title_screen: Control, viewport_size: Vector2) -> void:
	_fit_main_menu(title_screen.get_node_or_null("MainMenu") as Control, viewport_size)
	_fit_new_run_menu(title_screen.get_node_or_null("NewRunMenu") as Control, viewport_size)
	_fit_codex_menu(title_screen.get_node_or_null("CodexMenu") as Control, viewport_size)

func _fit_run_screen(run_screen: Control, viewport_size: Vector2) -> void:
	_fit_combat_screen(run_screen.get_node_or_null("Combat") as Control, viewport_size)
	for screen_name in [
		"RestOverlay",
		"ShopOverlay",
		"DialogueOverlay",
		"RunSummaryOverlay",
		"RunStartOptions",
		"RewardOverlay",
		"CardSelectionOverlay",
		"CardDraftSelectionOverlay",
		"Map",
		"PauseOverlay",
	]:
		var screen := run_screen.get_node_or_null(screen_name) as Control
		if screen:
			_fill_rect(screen)
			_fit_backgrounds(screen)
	_fit_card_grid(run_screen.get_node_or_null("CardSelectionOverlay/ScrollContainer/MarginContainer/CardContainer") as GridContainer, viewport_size)
	_fit_card_grid(run_screen.get_node_or_null("Map/ScrollContainer/LocationContainer") as GridContainer, viewport_size)

func _fit_combat_screen(combat: Control, viewport_size: Vector2) -> void:
	if not combat:
		return
	_fill_rect(combat)
	var battle_layout := combat.get_node_or_null("BattleLayout") as Control
	if battle_layout:
		_fill_rect(battle_layout)
	var top_bar := combat.get_node_or_null("BattleLayout/TopBar") as Control
	if top_bar:
		_fit_node_rect(top_bar, SCREEN_MARGIN, 12.0, viewport_size.x - SCREEN_MARGIN, 72.0)
	var enemy_zone := combat.get_node_or_null("BattleLayout/EnemyZone") as Control
	if enemy_zone:
		_fit_node_rect(enemy_zone, SCREEN_MARGIN, 80.0, viewport_size.x - SCREEN_MARGIN, viewport_size.y * 0.58)
	var player_stats := combat.get_node_or_null("BattleLayout/PlayerStatsBar") as Control
	if player_stats:
		_fit_node_rect(player_stats, SCREEN_MARGIN, viewport_size.y * 0.58, viewport_size.x - SCREEN_MARGIN, viewport_size.y * 0.64)
	var hand_zone := combat.get_node_or_null("BattleLayout/HandZone") as Control
	if hand_zone:
		_fit_node_rect(hand_zone, SCREEN_MARGIN, viewport_size.y * 0.64, viewport_size.x - SCREEN_MARGIN, viewport_size.y - 104.0)
	var bottom_bar := combat.get_node_or_null("BattleLayout/BottomBar") as Control
	if bottom_bar:
		_fit_node_rect(bottom_bar, SCREEN_MARGIN, viewport_size.y - 92.0, viewport_size.x - SCREEN_MARGIN, viewport_size.y - 16.0)
	var hand := combat.get_node_or_null("BattleLayout/HandZone/Hand") as Control
	if hand:
		_fit_node_rect(hand, 0.0, 0.0, max(0.0, viewport_size.x - SCREEN_MARGIN * 2.0), max(0.0, viewport_size.y * 0.24))

func _fit_main_menu(main_menu: Control, viewport_size: Vector2) -> void:
	if not main_menu:
		return
	_fill_rect(main_menu)
	var title := main_menu.get_node_or_null("Label") as Label
	if title:
		_fit_node_rect(title, SCREEN_MARGIN, 80.0, viewport_size.x - SCREEN_MARGIN, 180.0)
		title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		title.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	var buttons := main_menu.get_node_or_null("VBoxContainer") as Control
	if buttons:
		buttons.set_anchors_preset(Control.PRESET_CENTER)
		buttons.offset_left = -min(220.0, viewport_size.x * 0.42)
		buttons.offset_right = min(220.0, viewport_size.x * 0.42)
		buttons.offset_top = viewport_size.y * 0.18
		buttons.offset_bottom = viewport_size.y * 0.18 + 280.0

func _fit_new_run_menu(new_run_menu: Control, viewport_size: Vector2) -> void:
	if not new_run_menu:
		return
	_fill_rect(new_run_menu)
	_fit_scroll_panel(new_run_menu.get_node_or_null("CharacterButtonContainer") as Control, SCREEN_MARGIN, viewport_size.y * 0.42, viewport_size.x - SCREEN_MARGIN, viewport_size.y * 0.62)
	_fit_scroll_panel(new_run_menu.get_node_or_null("CustomRunModifierButtonContainer") as Control, SCREEN_MARGIN, viewport_size.y * 0.66, viewport_size.x - SCREEN_MARGIN, viewport_size.y * 0.82)
	_fit_bottom_button(new_run_menu.get_node_or_null("StartRunButton") as Control, viewport_size, 84.0)
	_fit_bottom_button(new_run_menu.get_node_or_null("BackButton") as Control, viewport_size, 24.0)
	_fit_node_rect(new_run_menu.get_node_or_null("SeedInput") as Control, SCREEN_MARGIN, viewport_size.y * 0.84, viewport_size.x - SCREEN_MARGIN, viewport_size.y * 0.88)
	_fit_card_grid(new_run_menu.get_node_or_null("CharacterButtonContainer/GridContainer") as GridContainer, viewport_size)

func _fit_codex_menu(codex_menu: Control, viewport_size: Vector2) -> void:
	if not codex_menu:
		return
	_fill_rect(codex_menu)
	_fit_scroll_panel(codex_menu.get_node_or_null("ScrollContainer") as Control, SCREEN_MARGIN, SCREEN_MARGIN, viewport_size.x - SCREEN_MARGIN, viewport_size.y - 96.0)
	_fit_bottom_button(codex_menu.get_node_or_null("BackButton") as Control, viewport_size, 24.0)
	_fit_card_grid(codex_menu.get_node_or_null("ScrollContainer/MarginContainer/CodexCardContainer") as GridContainer, viewport_size)

func _fill_rect(control: Control) -> void:
	control.set_anchors_preset(Control.PRESET_FULL_RECT)
	control.offset_left = 0
	control.offset_top = 0
	control.offset_right = 0
	control.offset_bottom = 0

func _fit_scroll_panel(control: Control, left: float, top: float, right: float, bottom: float) -> void:
	_fit_node_rect(control, left, top, right, bottom)

func _fit_bottom_button(control: Control, viewport_size: Vector2, bottom_margin: float) -> void:
	if not control:
		return
	var width: float = min(360.0, viewport_size.x - SCREEN_MARGIN * 2.0)
	control.position = Vector2((viewport_size.x - width) * 0.5, viewport_size.y - bottom_margin - 48.0)
	control.size = Vector2(width, 48.0)

func _fit_node_rect(control: Control, left: float, top: float, right: float, bottom: float) -> void:
	if not control:
		return
	control.position = Vector2(left, top)
	control.size = Vector2(max(0.0, right - left), max(0.0, bottom - top))

func _fit_card_grid(grid: GridContainer, viewport_size: Vector2) -> void:
	if not grid:
		return
	grid.columns = 2 if viewport_size.x < MOBILE_WIDTH_THRESHOLD else 4
