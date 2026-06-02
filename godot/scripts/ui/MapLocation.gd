extends TextureButton
class_name MapLocation

var location_data: LocationData = null
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var map_label: Label = $MapLabel

signal map_location_button_up(map_location: MapLocation)

func _ready():
	button_up.connect(_on_button_up)

var LOCATION_TYPE_NAMES: Dictionary = {
	LocationData.LOCATION_TYPES.STARTING: "起点",
	LocationData.LOCATION_TYPES.COMBAT: "战斗",
	LocationData.LOCATION_TYPES.MINIBOSS: "精英",
	LocationData.LOCATION_TYPES.BOSS: "首领",
	LocationData.LOCATION_TYPES.EVENT: "事件",
	LocationData.LOCATION_TYPES.TREASURE: "宝箱",
	LocationData.LOCATION_TYPES.SHOP: "商店",
	LocationData.LOCATION_TYPES.REST_SITE: "休息",
}

func init(_location_data: LocationData):
	location_data = _location_data
	position = location_data.location_position

	# display the type of location
	if location_data.location_obfuscated and not location_data.location_visited:
		map_label.text = "???"
	else:
		map_label.text = LOCATION_TYPE_NAMES.get(location_data.location_type, "未知")

func flash_location() -> void:
	animation_player.play("flash_map_location")

func _on_button_up():
	location_data.location_visited = true
	map_location_button_up.emit(self)
