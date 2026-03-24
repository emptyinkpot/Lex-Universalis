# Git 配置说明

## .gitignore 配置

本项目使用 `.gitignore` 文件来指定哪些文件和目录不应该被 Git 跟踪。

### 会被忽略的文件/目录

#### 依赖和构建产物
- `node_modules/` - npm/pnpm 依赖包
- `dist/` - 打包输出目录
- `build/` - 构建输出目录
- `*.tsbuildinfo` - TypeScript 增量编译缓存

#### Expo 相关
- `.expo/` - Expo 临时文件
- `.expo-shared/` - Expo 共享配置
- `expo/expo-env.d.ts` - Expo 环境类型定义
- `expo-env.d.ts` - Expo 环境类型定义

#### 缓存和日志
- `.eslintcache` - ESLint 缓存
- `.cache/` - 通用缓存目录
- `logs/` - 日志文件目录
- `*.log` - 日志文件
- `npm-debug.log*` - npm 调试日志
- `yarn-debug.log*` - yarn 调试日志
- `yarn-error.log*` - yarn 错误日志
- `pnpm-debug.log*` - pnpm 调试日志

#### 环境变量
- `.env.local` - 本地环境变量
- `.env.*.local` - 任何本地环境变量文件
- `.env.development.local` - 开发环境本地变量
- `.env.test.local` - 测试环境本地变量
- `.env.production.local` - 生产环境本地变量

#### 操作系统文件
- `.DS_Store` - macOS 文件系统元数据
- `Thumbs.db` - Windows 缩略图缓存

#### IDE 配置
- `.vscode/` - VS Code 配置
- `.idea/` - IntelliJ IDEA 配置
- `*.swp`, `*.swo`, `*~` - Vim 临时文件

#### 测试
- `coverage/` - 测试覆盖率报告
- `.nyc_output/` - NYC 测试覆盖率工具输出

#### 临时文件
- `tmp/` - 临时文件目录
- `temp/` - 临时文件目录

### 会被跟踪的重要文件/目录

#### 项目配置
- `.coze` - Coze 项目配置（包含构建和运行脚本路径）
- `.cozeproj/` - Coze 项目脚本（包含 dev_build.sh、dev_run.sh 等）

#### 代码和文档
- `client/` - Expo 前端代码
- `server/` - Express 后端代码
- `ASSETS_GUIDE.md` - 资源导入指南
- `README.md` - 项目说明文档

#### 资源文件
- `assets/` - 项目资源文件（所有子目录都会被跟踪）
  - `assets/fonts/` - 字体文件
  - `assets/images/` - 图片文件
  - `assets/sounds/` - 音效文件（新增）
  - `assets/icons/` - 图标文件（新增）

#### 配置文件
- `package.json` / `pnpm-lock.yaml` - 前端依赖配置
- `server/package.json` / `server/pnpm-lock.yaml` - 后端依赖配置
- `tsconfig.json` - TypeScript 配置
- `.eslintrc.*` - ESLint 配置
- `app.config.ts` - Expo 配置

## 确保资源文件被跟踪

当添加新的资源文件时，请确保：

1. **音效文件** - 放入 `client/assets/sounds/`
   ```bash
   cp /path/to/card_draw.mp3 client/assets/sounds/
   git add client/assets/sounds/card_draw.mp3
   ```

2. **图标文件** - 放入 `client/assets/icons/`
   ```bash
   cp /path/to/icon.svg client/assets/icons/
   git add client/assets/icons/icon.svg
   ```

3. **图片文件** - 放入 `client/assets/images/`
   ```bash
   cp /path/to/image.png client/assets/images/
   git add client/assets/images/image.png
   ```

4. **字体文件** - 放入 `client/assets/fonts/`
   ```bash
   cp /path/to/font.ttf client/assets/fonts/
   git add client/assets/fonts/font.ttf
   ```

## 验证 Git 状态

使用以下命令查看哪些文件被跟踪，哪些被忽略：

```bash
# 查看所有文件（包括被忽略的）
git check-ignore -v *

# 查看当前未被跟踪的文件
git status

# 查看哪些文件会被提交
git diff --cached --name-only
```

## 常见问题

### Q: 为什么我的资源文件没有被 Git 跟踪？

A: 检查以下几点：
1. 确保文件在正确的目录下（`client/assets/`）
2. 检查 `.gitignore` 是否排除了该文件或目录
3. 使用 `git status` 查看文件状态
4. 使用 `git add` 命令添加文件

### Q: 我需要提交 .cozeproj/ 吗？

A: 是的，`.cozeproj/` 包含项目的构建和运行脚本，这些是项目必需的，应该被提交到 Git。

### Q: 为什么不忽略 package.json？

A: `package.json` 和 `pnpm-lock.yaml` 是项目依赖配置，必须被跟踪，以便其他开发者能够安装相同的依赖版本。

### Q: 我应该提交 node_modules 吗？

A: 不应该。`node_modules/` 已经在 `.gitignore` 中，因为依赖包可以通过 `pnpm install` 重新安装，提交它们会导致仓库体积过大。

## 最佳实践

1. **提交前检查**：使用 `git status` 查看将要提交的文件
2. **提交重要文件**：确保代码、资源、配置文件都被提交
3. **忽略临时文件**：不要提交日志、缓存、临时文件
4. **使用 `.gitignore`**：及时更新 `.gitignore`，忽略不必要的文件
5. **团队协作**：团队成员应该使用相同的 `.gitignore` 配置

## 总结

✅ **会被提交的重要文件**：
- 所有代码文件（client/, server/）
- 所有资源文件（assets/）
- 配置文件（.coze, .cozeproj/, package.json, tsconfig.json 等）
- 文档（README.md, ASSETS_GUIDE.md 等）

❌ **不会被提交的文件**：
- 依赖包（node_modules/）
- 构建产物（dist/, build/）
- 缓存和日志（.cache/, logs/, *.log）
- 环境变量（.env.local）
- 临时文件（tmp/, temp/）
- IDE 配置（.vscode/, .idea/）
