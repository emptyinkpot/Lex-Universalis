extends Node

var CARD: PackedScene = load("res://client/scenes/ui/Card.tscn")

var ARTIFACT: PackedScene = load("res://client/scenes/ui/Artifact.tscn")

var MAP_LOCATION: PackedScene = load("res://client/scenes/ui/MapLocation.tscn")

var ENEMY: PackedScene = load("res://client/scenes/combatants/Enemy.tscn")
var PLAYER: PackedScene = load("res://client/scenes/combatants/Player.tscn")
var STATUS_EFFECT: PackedScene = load("res://client/scenes/combatants/StatusEffect.tscn")
var HEALTH_LAYER = load("res://client/scenes/combatants/HealthLayer.tscn")

var BASE_REWARD_BUTTON: PackedScene = load("res://client/scenes/ui/rewards/BaseRewardButton.tscn")
var MONEY_REWARD_BUTTON: PackedScene = load("res://client/scenes/ui/rewards/MoneyRewardButton.tscn")
var CARD_REWARD_BUTTON: PackedScene = load("res://client/scenes/ui/rewards/CardRewardButton.tscn")
var ARTIFACT_REWARD_BUTTON: PackedScene = load("res://client/scenes/ui/rewards/ArtifactRewardButton.tscn")

var REST_ACTION_BUTTON: PackedScene = load("res://client/scenes/ui/RestActionButton.tscn")

var CONSUMABLE_BUTTON: PackedScene = load("res://client/scenes/ui/ConsumableButton.tscn")
var CHARACTER_SELECTION_BUTTON: PackedScene = load("res://client/scenes/ui/CharacterSelectionButton.tscn")

var CUSTOM_RUN_MODIFIER_CHECKBOX: PackedScene = load("res://client/scenes/ui/CustomRunModifierCheckbox.tscn")

var BASE_SHOP_BUTTON: PackedScene = load("res://client/scenes/ui/shop/BaseShopButton.tscn")
var CARD_SHOP_BUTTON: PackedScene = load("res://client/scenes/ui/shop/CardShopButton.tscn")
var ARTIFACT_SHOP_BUTTON: PackedScene = load("res://client/scenes/ui/shop/ArtifactShopButton.tscn")
var CONSUMABLE_SHOP_BUTTON: PackedScene = load("res://client/scenes/ui/shop/ConsumableShopButton.tscn")

var TEXT_FADE: PackedScene = load("res://client/scenes/combatants/fades/TextFade.tscn")
var ARTIFACT_FADE: PackedScene = load("res://client/scenes/combatants/fades/ArtifactFade.tscn")

var KEYWORD_TOOLTIP: PackedScene = load("res://client/scenes/ui/general/KeywordTooltip.tscn")
var TOOLTIP: PackedScene = load("res://client/scenes/ui/general/Tooltip.tscn")
var DIALOGUE_OPTION = load("res://client/scenes/ui/general/DialogueOption.tscn")
