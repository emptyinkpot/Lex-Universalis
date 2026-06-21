# 贡献规范

## 仓库布局

- `godot/`: 当前桌面版 Godot 4 工程真源
- `build/`: 打包后的桌面输出
- `docs/`: 设计、规则、世界观与迁移记录
- `config/`: 项目配置与参考数据

## 常用命令

```powershell
python .\lex.py validate
python .\lex.py editor
python .\lex.py run
python .\lex.py build
```

## Reviewer / Sourcery 会重点看什么

- scene / script / resource / signal / node path 是否保持一致
- `godot/data/generated/` 的更新是否有明确来源与目标
- Godot 桌面版是否仍然是唯一 canonical runtime
- `lex.py` 的启动、验证、导出入口是否仍可执行且含义明确

## 提交规则

- 优先使用 `type(scope): subject`
- 一个 commit / PR 尽量只做一个清晰主题

## PR 期望内容

每个 PR 请说明：

1. 改动影响了哪些 scene / script / generated data / build 脚本
2. 你的验证步骤是什么
3. 是否有截图、录屏或等价证据
4. 如果改了导出或启动链路，如何最短回滚

## 跳过 Sourcery 的规则

默认不要跳过。如果确实需要跳过，请在 PR 上加：

- `skip-sourcery`
- `no-sourcery`
- `sourcery-ignore`

并在 PR 描述里说明原因。
