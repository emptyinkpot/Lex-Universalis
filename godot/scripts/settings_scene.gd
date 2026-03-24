extends Control

signal language_changed(language: String)
signal return_home()

const DATA_LOADER = preload("res://scripts/data_loader.gd")

@onready var title_label: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/TitleBlock/Title")
@onready var subtitle_label: Label = get_node("Padding/Root/Hero/HeroPadding/HeroStack/TitleBlock/Meta")
@onready var language_label: Label = get_node("Padding/Root/Content/LanguagePanel/LanguagePadding/LanguageBody/LanguageTitle")
@onready var current_label: Label = get_node("Padding/Root/Content/LanguagePanel/LanguagePadding/LanguageBody/CurrentLanguage")
@onready var chinese_button: Button = get_node("Padding/Root/Content/LanguagePanel/LanguagePadding/LanguageBody/ButtonRow/ChineseButton")
@onready var english_button: Button = get_node("Padding/Root/Content/LanguagePanel/LanguagePadding/LanguageBody/ButtonRow/EnglishButton")
@onready var back_button: Button = get_node("Padding/Root/Footer/BackButton")
@onready var hero_panel: PanelContainer = get_node("Padding/Root/Hero")
@onready var body_panel: PanelContainer = get_node("Padding/Root/Content/LanguagePanel")
@onready var footer_row: HBoxContainer = get_node("Padding/Root/Footer")

var data_loader: RefCounted

func _ready() -> void:
	data_loader = DATA_LOADER.new()
	chinese_button.pressed.connect(func() -> void: _set_language("zh"))
	english_button.pressed.connect(func() -> void: _set_language("en"))
	back_button.pressed.connect(func() -> void: return_home.emit())
	_refresh_language()
	_play_intro()

func _set_language(language: String) -> void:
	language_changed.emit(language)
	_refresh_language()

func _refresh_language() -> void:
	var current: String = data_loader.get_language()
	title_label.text = data_loader.t("settings_title")
	subtitle_label.text = data_loader.t("settings_subtitle")
	language_label.text = data_loader.t("settings_language")
	current_label.text = "%s: %s" % [
		data_loader.t("home_language"),
		data_loader.t("settings_chinese") if current != "en" else data_loader.t("settings_english"),
	]
	chinese_button.text = data_loader.t("settings_chinese")
	english_button.text = data_loader.t("settings_english")
	back_button.text = data_loader.t("settings_back")
	chinese_button.disabled = current == "zh"
	english_button.disabled = current == "en"

func refresh_language() -> void:
	_refresh_language()

func _play_intro() -> void:
	hero_panel.modulate = Color(1, 1, 1, 0)
	hero_panel.scale = Vector2(0.985, 0.985)
	body_panel.modulate = Color(1, 1, 1, 0)
	body_panel.scale = Vector2(0.96, 0.96)
	footer_row.modulate = Color(1, 1, 1, 0)
	footer_row.scale = Vector2(0.98, 0.98)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(hero_panel, "modulate", Color(1, 1, 1, 1), 0.34)
	tween.tween_property(hero_panel, "scale", Vector2.ONE, 0.38)
	tween.tween_property(body_panel, "modulate", Color(1, 1, 1, 1), 0.4).set_delay(0.08)
	tween.tween_property(body_panel, "scale", Vector2.ONE, 0.4).set_delay(0.08)
	tween.tween_property(footer_row, "modulate", Color(1, 1, 1, 1), 0.3).set_delay(0.16)
	tween.tween_property(footer_row, "scale", Vector2.ONE, 0.3).set_delay(0.16)
