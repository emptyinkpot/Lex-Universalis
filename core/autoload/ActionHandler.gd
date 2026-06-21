## ActionHandler 是运行时 action 队列的执行中心。
## 它负责接收 ActionGenerator 生成的 BaseAction，把它们按栈/队列顺序执行，
## 并在异步 action、延迟 action、战斗结束或玩家死亡时统一清理执行状态。
## 相关类：BaseAction、BaseActionInterceptor、ActionInterceptorProcessor、ActionGenerator。
extends Node

@onready var action_timer: Timer = Timer.new()

# action 执行状态
var action_stack: Array[Array] = []	# BaseAction 队列栈。
var current_action_queue: Array[BaseAction] = []
var current_action: BaseAction = null # 当前正在执行的 action。
var actions_being_performed: bool = false	# 防止多个 action 执行循环同时启动，也用于判断阻塞状态。

# action interceptor 注册表
var _registered_action_interceptor_object_ids: Dictionary	= {}	# 对象到 interceptor ID 列表的映射，对象参与 action 时会读取。

# 信号
signal actions_ended	# 所有 action 执行完毕，通常表示敌方攻击或出牌流程结束。

func _ready():
	# 所有中断类事件都集中清理 action，避免旧 action 在下一场战斗或下一局继续执行。
	Signals.combat_ended.connect(_on_combat_ended)
	Signals.player_killed.connect(_on_player_killed)
	Signals.run_ended.connect(_on_run_ended)
	
	# 创建可暂停计时器，用于 action 延迟。
	add_child(action_timer)
	action_timer.process_mode = Node.PROCESS_MODE_PAUSABLE
	action_timer.one_shot = true
	action_timer.name = "ActionTimer"

### Action 执行

func add_action(action: BaseAction, enqueue: bool = false, front_of_queue: bool = false):
	add_actions([action], enqueue, front_of_queue)

## 把 action 加到执行栈顶部；enqueue 为 true 时则追加到当前队列末尾。
## front_of_queue 为 true 时会插到当前队列前面，让这些 action 优先执行。
func add_actions(actions: Array[BaseAction], enqueue: bool = false, front_of_queue: bool = false):
	if enqueue:
		# 加入当前队列。
		if len(action_stack) == 0:
			if actions_being_performed:
				# 已有 action 正在执行，把新 action 插入当前队列。
				if front_of_queue:
					current_action_queue = actions + current_action_queue
				else:
					current_action_queue += actions
			else:
				# 当前没有执行循环，把这批 action 作为新队列压栈。
				action_stack.append(actions)
		else:
			if front_of_queue:
				current_action_queue = actions + current_action_queue
			else:
				current_action_queue += actions
	else:
		# 加入执行栈；每个 action 单独成为一个队列。
		for action in actions:
			action_stack += [[action]]
	
	if len(actions) > 0:	# action 加入后自动启动执行。
		if not actions_being_performed:	# 防止重复启动执行循环。
			_perform_actions()

func _perform_actions() -> void:	
	# 主执行循环：每次弹出一个 action 队列，然后逐个执行队列里的 action。
	actions_being_performed = true
	while len(action_stack) > 0:
		# 从栈中弹出下一组 action 队列。
		var action_queue = action_stack.pop_back()
		
		# 把弹出的队列设为当前队列。
		current_action_queue = []
		current_action_queue.assign(action_queue) # Godot 类型化数组要求重新 assign 才能保持元素类型。
		
		# 依次执行当前队列，直到队列清空。
		while len(current_action_queue) > 0:
			current_action = current_action_queue.pop_front()
			# 跳过已被短路的 action。
			if current_action.is_action_short_circuited():
				if len(Global.get_tree().get_nodes_in_group("enemies")) == 0:
					continue
			# 执行 action。
			current_action.perform_action()
			# 异步 action 需要等它自己发出完成信号。
			if current_action.is_async_action():
				await current_action.action_async_finished
			# 如果 action 设置了延迟，则等待计时器。
			if current_action.time_delay > 0.0 and !current_action.is_instant_action():
				action_timer.start(current_action.time_delay)
				await action_timer.timeout
				# 这里不用 create_timer，避免分散计时器管理。
			else:
				await get_tree().process_frame
			
			current_action = null
	
	actions_being_performed = false
	actions_ended.emit()

## 清理当前异步 action。默认只清理已短路 action；force_end 为 true 时强制终止。
func _clear_current_async_action(force_end: bool = false) -> void:
	if current_action != null:
		if current_action is BaseAsyncAction:
			if current_action.async_awaiting:
				if current_action.is_action_short_circuited() or force_end:
					current_action.force_action_end() # 强制 action 停止等待。
					current_action.action_async_finished.emit() # 补发完成信号，防止等待方卡住。
					current_action = null

func clear_all_actions() -> void:
	# 强制终止当前异步 action，并清空所有等待执行的 action。
	_clear_current_async_action(true)
	
	action_stack.clear()
	current_action_queue.clear()
	
	if actions_being_performed:
		actions_being_performed = false
		actions_ended.emit()

### Action Interceptor 注册

func register_action_interceptor(base_combatant: BaseCombatant, action_interceptor_object_id: String) -> void:
	# 为对象注册一个 action interceptor。
	# 通常同一个 interceptor 只应有一个注册来源；如果要叠加同类效果，应交给带层数的状态效果处理。
	var interceptor_ids: Array = _registered_action_interceptor_object_ids.get(base_combatant, [])
	if not interceptor_ids.has(action_interceptor_object_id):
		interceptor_ids.append(action_interceptor_object_id)
	_registered_action_interceptor_object_ids[base_combatant] = interceptor_ids
	
func unregister_action_interceptor(base_combatant: BaseCombatant, action_interceptor_object_id: String) -> void:
	var interceptor_ids: Array = _registered_action_interceptor_object_ids.get(base_combatant, [])
	interceptor_ids.erase(action_interceptor_object_id)
	_registered_action_interceptor_object_ids[base_combatant] = interceptor_ids
	if len(interceptor_ids) == 0:
		_registered_action_interceptor_object_ids.erase(base_combatant)

func clear_all_action_interceptors() -> void:
	_registered_action_interceptor_object_ids.clear()


func _on_combat_ended():
	_clear_current_async_action()

func _on_player_killed(_player: Player):
	clear_all_actions()

func _on_run_ended():
	clear_all_action_interceptors()
	clear_all_actions()
