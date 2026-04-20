# Lex-Universalis Review Guide

## 常用命令

```bash
.\validate-godot.bat
.\start-godot.bat
.\publish-desktop.bat
.\start-codex-bridge.bat
```

## 仓库专属审查重点

1. `godot/scenes/**`、`godot/scripts/**`、`godot/addons/**` 相关变更要重点检查：
   - Scene / script / resource 引用是否仍一致；
   - 节点路径、信号连接、脚本绑定与导出资源是否被破坏；
   - Godot 4 桌面运行链路是否仍然成立。
2. `godot/data/generated/**` 相关变更要重点检查：
   - 只接受明确目标下的生成数据更新；
   - 不要把临时调试数据、一次性导出结果或无来源说明的数据混进来。
3. 文档、脚本与配置相关变更要重点检查：
   - 继续把 Godot 桌面版视为 canonical runtime；
   - 不要重新引入已经退役的 Web runtime 假设或历史路径。

## PR 要求

- PR 描述必须写清影响了哪些 scene / script / generated data / desktop build 脚本。
- 如果改了可见界面、剧情、卡牌、战斗流程或桌面运行行为，必须附截图、录屏或等价证据。
- 如果改了导出、验证或 codex-bridge 脚本，必须写清你如何验证。
- 只有在明确需要跳过审查时才使用 `skip-sourcery`、`no-sourcery` 或 `sourcery-ignore`。
