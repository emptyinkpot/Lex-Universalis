## UIDGenerator 负责为运行时生成的 PrototypeData 实例创建唯一 ID。
## 它把对象前缀、时间戳和递增计数拼起来，避免同一局里临时对象互相覆盖。
##
## 辅助单例。
## 负责为 PrototypeData 对象生成唯一 ID。
extends Node

var unique_id_counter = 0

func generate_unique_id(prototype_data: PrototypeData) -> String:
	var prefix: String = prototype_data.get_unique_id_prefix()
	self.unique_id_counter += 1
	if self.unique_id_counter >= 10000000:
		self.unique_id_counter = 0
	return prefix + "-" + str(Time.get_unix_time_from_system() * 1000) + str(Time.get_ticks_msec()) + "-" + str(unique_id_counter)
