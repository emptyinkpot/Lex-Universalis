extends Control

const DATA_LOADER = preload("res://scripts/data_loader.gd")

@onready var bridge_url_edit: LineEdit = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/BridgeRow/BridgeUrl")
@onready var ping_button: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/BridgeRow/PingButton")
@onready var model_edit: LineEdit = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ModelRow/ModelEdit")
@onready var target_edit: LineEdit = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/TargetRow/TargetEdit")
@onready var battle_preset: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/BattlePreset")
@onready var home_preset: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/HomePreset")
@onready var story_preset: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/StoryPreset")
@onready var editor_preset: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/EditorPreset")
@onready var deck_preset: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/DeckPreset")
@onready var apply_check: CheckBox = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/ApplyCheck")
@onready var analyze_button: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/AnalyzeButton")
@onready var open_bridge_button: Button = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/OpenBridgeButton")
@onready var instruction_edit: TextEdit = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/InstructionEdit")
@onready var context_edit: TextEdit = get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ContextEdit")
@onready var status_label: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroRow/Status")
@onready var response_status: Label = get_node("Padding/Root/Content/ResponsePanel/ResponsePadding/ResponseBody/ResponseStatus")
@onready var response_text: RichTextLabel = get_node("Padding/Root/Content/ResponsePanel/ResponsePadding/ResponseBody/ResponseText")
@onready var hero_panel: PanelContainer = get_node("Padding/Root/Hero")
@onready var request_panel: PanelContainer = get_node("Padding/Root/Content/RequestPanel")
@onready var response_panel: PanelContainer = get_node("Padding/Root/Content/ResponsePanel")
@onready var http_request: HTTPRequest = get_node("HTTPRequest")

var data_loader: RefCounted

const PRESETS := {
	"battle": {
		"target": "res://scenes/battle/BattleScene.tscn",
		"context": [
			"res://scenes/battle/BattleScene.tscn",
			"res://scripts/battle_scene.gd",
			"res://scenes/components/BattleSlot.tscn",
			"res://scripts/battle_slot.gd",
			"res://scenes/components/CardNode.tscn",
			"res://scripts/card_node.gd",
		],
		"instruction": "请把战斗页简化成清晰的 Godot 三段式桌面布局，减少拥挤、重叠和被截断的元素，优先保证页面完整可见。",
	},
	"home": {
		"target": "res://scenes/home/HomeScene.tscn",
		"context": [
			"res://scenes/home/HomeScene.tscn",
			"res://scripts/home_scene.gd",
			"res://scenes/Main.tscn",
		],
		"instruction": "请把首页做成更干净的 Godot 原生桌面入口，减少重复标题和过长信息条。",
	},
	"story": {
		"target": "res://scenes/story/StoryModeScene.tscn",
		"context": [
			"res://scenes/story/StoryModeScene.tscn",
			"res://scripts/story_mode_scene.gd",
		],
		"instruction": "请把故事模式整理成更简洁的 Godot 场景页，降低卡片堆叠感并减少纵向拥挤。",
	},
	"card_editor": {
		"target": "res://scenes/cards/CardEditorScene.tscn",
		"context": [
			"res://scenes/cards/CardEditorScene.tscn",
			"res://scripts/card_editor_scene.gd",
			"res://scenes/components/CardNode.tscn",
			"res://scripts/card_node.gd",
		],
		"instruction": "请把卡牌编辑器简化为清楚的工作台布局，减少重叠，统一比例，并保留可编辑区域。",
	},
	"deck_builder": {
		"target": "res://scenes/deck/DeckBuilderScene.tscn",
		"context": [
			"res://scenes/deck/DeckBuilderScene.tscn",
			"res://scripts/deck_builder_scene.gd",
			"res://scenes/components/CardNode.tscn",
			"res://scripts/card_node.gd",
		],
		"instruction": "请把卡组构筑页整理成更清楚的双栏 Godot 工作台，减少卡片重叠和滚动挤压。",
	},
}

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	bridge_url_edit.text = "http://127.0.0.1:43987"
	model_edit.text = "gpt-5.2-codex"
	_connect_buttons()
	http_request.request_completed.connect(_on_request_completed)
	_refresh_language()
	_ping_bridge()
	_play_intro()

func _connect_buttons() -> void:
	ping_button.pressed.connect(_ping_bridge)
	analyze_button.pressed.connect(_send_request)
	open_bridge_button.pressed.connect(_open_bridge)
	battle_preset.pressed.connect(func() -> void: _load_preset("battle"))
	home_preset.pressed.connect(func() -> void: _load_preset("home"))
	story_preset.pressed.connect(func() -> void: _load_preset("story"))
	editor_preset.pressed.connect(func() -> void: _load_preset("card_editor"))
	deck_preset.pressed.connect(func() -> void: _load_preset("deck_builder"))

func _refresh_language() -> void:
	var language: String = data_loader.get_language()
	status_label.text = "Bridge: %s" % ("运行中" if language != "en" else "Running")
	response_status.text = "等待请求" if language != "en" else "Waiting"
	if language == "en":
		get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroRow/TitleBlock/Title").text = "Codex Bridge / UI Assistant"
		get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroRow/TitleBlock/Subtitle").text = "Send a Godot scene path and a refactor instruction to the local bridge."
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/RequestTitle").text = "Request"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/TargetRow/TargetLabel").text = "Target Scene"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/InstructionLabel").text = "Instruction"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ContextLabel").text = "Context Paths (one per line)"
		get_node("Padding/Root/Content/ResponsePanel/ResponsePadding/ResponseBody/ResponseTitle").text = "Result"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/BattlePreset").text = "Battle"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/HomePreset").text = "Home"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/StoryPreset").text = "Story"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/EditorPreset").text = "Editor"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/DeckPreset").text = "Deck"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/ApplyCheck").text = "Write to files"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/AnalyzeButton").text = "Send"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/OpenBridgeButton").text = "Open Bridge"
	else:
		get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroRow/TitleBlock/Title").text = "AI 助手 / Codex Bridge"
		get_node("Padding/Root/Hero/HeroPadding/HeroStack/HeroRow/TitleBlock/Subtitle").text = "把 Godot UI 目标、场景路径和修改意图发给本地 Codex 桥。"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/RequestTitle").text = "请求"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/TargetRow/TargetLabel").text = "目标场景"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/InstructionLabel").text = "修改意图"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ContextLabel").text = "上下文路径（每行一个）"
		get_node("Padding/Root/Content/ResponsePanel/ResponsePadding/ResponseBody/ResponseTitle").text = "结果"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/BattlePreset").text = "战斗页"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/HomePreset").text = "首页"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/StoryPreset").text = "故事页"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/EditorPreset").text = "卡牌编辑"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/PresetRow/DeckPreset").text = "卡组构筑"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/ApplyCheck").text = "直接写入文件"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/AnalyzeButton").text = "发送请求"
		get_node("Padding/Root/Content/RequestPanel/RequestPadding/RequestBody/ApplyRow/OpenBridgeButton").text = "打开桥"
	_refresh_status("ready", "ready")

func _load_preset(preset_id: String) -> void:
	if not PRESETS.has(preset_id):
		return
	var preset: Dictionary = PRESETS[preset_id]
	target_edit.text = str(preset.get("target", ""))
	context_edit.text = "\n".join(preset.get("context", []))
	instruction_edit.text = str(preset.get("instruction", instruction_edit.text))
	response_status.text = "Preset loaded: %s" % preset_id if data_loader.get_language() == "en" else "已加载预设：%s" % preset_id

func _open_bridge() -> void:
	var path := "E:/Lex Universalis/start-codex-bridge.bat"
	OS.shell_open(path)

func _ping_bridge() -> void:
	var url := _bridge_url().trim_suffix("/")
	if url.is_empty():
		_refresh_status("offline", "bridge url is empty")
		return
	var req := HTTPRequest.new()
	add_child(req)
	req.request_completed.connect(func(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
		req.queue_free()
		if result == HTTPRequest.RESULT_SUCCESS and response_code == 200:
			var payload: Variant = JSON.parse_string(body.get_string_from_utf8())
			if payload is Dictionary and not bool((payload as Dictionary).get("has_api_key", false)):
				_refresh_status("online", "bridge online | missing OPENAI_API_KEY")
			else:
				_refresh_status("online", "bridge online")
		else:
			_refresh_status("offline", "bridge unavailable")
	)
	var err := req.request("%s/health" % url)
	if err != OK:
		req.queue_free()
		_refresh_status("offline", "request failed")

func _send_request() -> void:
	var url := _bridge_url().trim_suffix("/")
	if url.is_empty():
		_refresh_status("offline", "bridge url is empty")
		return
	var payload := {
		"instruction": instruction_edit.text.strip_edges(),
		"target_path": target_edit.text.strip_edges(),
		"context_paths": _parse_context_paths(context_edit.text),
		"model": model_edit.text.strip_edges(),
		"apply": apply_check.button_pressed,
	}
	if String(payload.get("instruction", "")).is_empty():
		response_status.text = "Instruction required."
		return
	analyze_button.disabled = true
	response_status.text = "Sending request..."
	response_text.text = "Waiting for Codex bridge..."
	var json_body := JSON.stringify(payload)
	var headers := PackedStringArray(["Content-Type: application/json"])
	var err := http_request.request("%s/assist" % url, headers, HTTPClient.METHOD_POST, json_body)
	if err != OK:
		analyze_button.disabled = false
		response_status.text = "Request failed."
		response_text.text = "Could not send request."
		_refresh_status("offline", "request error")

func _on_request_completed(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	analyze_button.disabled = false
	var text := body.get_string_from_utf8()
	if result != HTTPRequest.RESULT_SUCCESS:
		response_status.text = "Bridge request failed."
		response_text.text = text
		return
	var parsed: Variant = JSON.parse_string(text)
	if parsed is Dictionary:
		var data: Dictionary = parsed
		if int(response_code) >= 200 and int(response_code) < 300 and bool(data.get("ok", false)):
			response_status.text = "OK | %s | loaded %d files" % [str(data.get("model", "")), int(data.get("files_loaded", 0))]
			response_text.text = JSON.stringify(data, "\t")
			_refresh_status("online", "response received")
			return
		response_status.text = "Bridge returned an error."
		response_text.text = JSON.stringify(data, "\t")
		_refresh_status("offline", "bridge error")
		return
	response_status.text = "Invalid bridge response."
	response_text.text = text
	_refresh_status("offline", "invalid json")

func _bridge_url() -> String:
	return bridge_url_edit.text.strip_edges()

func _parse_context_paths(raw_text: String) -> Array[String]:
	var result: Array[String] = []
	for line in raw_text.split("\n"):
		var trimmed := line.strip_edges()
		if not trimmed.is_empty():
			result.append(trimmed)
	return result

func _refresh_status(state: String, detail: String) -> void:
	if state == "online":
		status_label.text = "Bridge: online"
	elif state == "offline":
		status_label.text = "Bridge: offline"
	else:
		status_label.text = "Bridge: ready"
	if detail.is_empty():
		return
	response_status.text = detail

func refresh_language() -> void:
	_refresh_language()

func _play_intro() -> void:
	hero_panel.modulate = Color(1, 1, 1, 0)
	hero_panel.scale = Vector2(0.985, 0.985)
	request_panel.modulate = Color(1, 1, 1, 0)
	request_panel.scale = Vector2(0.97, 0.97)
	response_panel.modulate = Color(1, 1, 1, 0)
	response_panel.scale = Vector2(0.97, 0.97)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(hero_panel, "modulate", Color(1, 1, 1, 1), 0.32)
	tween.tween_property(hero_panel, "scale", Vector2.ONE, 0.36)
	tween.tween_property(request_panel, "modulate", Color(1, 1, 1, 1), 0.38).set_delay(0.06)
	tween.tween_property(request_panel, "scale", Vector2.ONE, 0.38).set_delay(0.06)
	tween.tween_property(response_panel, "modulate", Color(1, 1, 1, 1), 0.42).set_delay(0.1)
	tween.tween_property(response_panel, "scale", Vector2.ONE, 0.42).set_delay(0.1)
