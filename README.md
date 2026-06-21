# Lex Universalis

PvE 优先的卡牌肉鸽，基于 Godot 4.6.1 开发。战斗内核参考杀戮尖塔，双方都按同一规则打牌。

## 项目信息

- 仓库地址：https://github.com/emptyinkpot/Lex-Universalis
- 引擎版本：Godot 4.6.1
- Godot 工程根目录：仓库根目录
- 主场景：`client/scenes/Root.tscn`
- 启动入口：`python .\tests\lex.py <command>`
- 基础框架：[Slay-The-Robot](https://github.com/DesirePathGames/Slay-The-Robot) (MIT)

## 目录分工

- `client/`：客户端表现层。放 Godot 场景、UI 脚本、输入交互和直接绑定画面的功能编排。这里可以引用 `core/` 的规则和数据，但不应该承载核心规则本身。
- `core/`：游戏核心层。放 autoload 服务、数据模型、战斗规则、运行时 action、validator、状态机和内容加载逻辑。这里尽量不写具体画面布局。
- `core/external/mods/`：游戏内容数据。卡牌、敌人、角色、事件、关卡池等 JSON 内容放这里，属于可编辑的内容配置。
- `assets/`：美术和 Godot 资源。图片、图标、主题、曲线等资源统一放这里；业务脚本和规则代码不要放进来。
- `addons/`：第三方 Godot 插件。只放引擎插件或编辑器插件，不放项目业务代码。
- `docs/`：设计文档、企划、整理说明和参考资料。这里不作为运行时依赖。
- `config/`：项目级配置。放不属于 Godot `project.godot` 的仓库配置或外部工具配置。
- `project.godot`：Godot 工程配置文件。仓库根目录就是 Godot 工程根。
- `tests/lex.py`：统一测试和启动脚本。打开编辑器、运行游戏、验证工程、打包桌面版都从这里进。

## 运行方式

打开 Godot 编辑器：

```powershell
python .\tests\lex.py editor
```

从源码运行游戏：

```powershell
python .\tests\lex.py run
```

无头验证项目能否加载：

```powershell
python .\tests\lex.py validate
```

打包桌面版：

```powershell
python .\tests\lex.py build
```

运行已打包的桌面版：

```powershell
python .\tests\lex.py desktop
```

`tests/lex.py` 会从 `GODOT_EXE`、`GODOT_CONSOLE`、`PATH` 和常见 Godot 安装目录里自动寻找 Godot。

## 运行时状态

存档、用户档案和本地设置是运行时状态，不是源码。以下路径已忽略，不应该提交：

- `core/external/profile.json`
- `core/external/user_settings.json`
- `core/external/saves/`

## 内容编辑

卡牌、敌人、角色、事件和关卡池等内容通过 `core/external/mods/` 下的 JSON 定义。
Godot 编辑器内也可以使用表格编辑插件辅助查看和编辑资源。

## 设计文档

见 `docs/game-design/planning/Lex Universalis 项目企划书（Godot）_v1_2026_5_3.md`
