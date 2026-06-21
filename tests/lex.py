#!/usr/bin/env python3
r"""Lex Universalis 的统一工程入口。

这个脚本放在 tests/ 下，但它操作的是仓库根目录里的 Godot 工程。
常用命令：

- 打开编辑器：python .\tests\lex.py editor
- 运行游戏：python .\tests\lex.py run
- 无头验证：python .\tests\lex.py validate

注意：每个命令都会先从 origin 拉取当前分支，命令成功后再推送当前分支到 origin。
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent  # tests/ 的上一层就是 Godot 工程根。
GODOT_PROJECT_DIR = PROJECT_ROOT  # project.godot 直接放在仓库根目录。
BUILD_DIR = PROJECT_ROOT / "build" / "windows"  # Windows 桌面构建输出目录。
GAME_EXE = BUILD_DIR / "Lex Universalis.exe"  # 复制 Godot 可执行文件后得到的启动器。
GAME_PCK = BUILD_DIR / "Lex Universalis.pck"  # Godot 导出的游戏数据包。
EXPORT_PRESET = "Windows Desktop"  # 必须对应 Godot export preset 的名称。
REMOTE_NAME = "origin"  # 每次运行前推送到这个 Git 远端。


@dataclass(frozen=True)
class GodotCandidate:
    """一个可能的 Godot 可执行文件位置。"""

    path: Path
    source: str


def env_path(name: str) -> GodotCandidate | None:
    """从环境变量读取 Godot 路径。"""

    value = os.environ.get(name, "").strip().strip('"')
    if not value:
        return None
    path = Path(value).expanduser()
    return GodotCandidate(path, name)


def possible_godot_paths(console: bool) -> list[GodotCandidate]:
    """列出 Windows 上常见的 Godot 安装位置。"""

    local_appdata = Path(os.environ.get("LOCALAPPDATA", ""))
    program_files = Path(os.environ.get("ProgramFiles", r"C:\Program Files"))
    program_files_x86 = Path(os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"))
    user_profile = Path(os.environ.get("USERPROFILE", str(Path.home())))

    names = [
        "Godot_v4.6.1-stable_win64_console.exe" if console else "Godot_v4.6.1-stable_win64.exe",
        "Godot_v4.6-stable_win64_console.exe" if console else "Godot_v4.6-stable_win64.exe",
        "Godot_v4.5-stable_win64_console.exe" if console else "Godot_v4.5-stable_win64.exe",
        "godot4.exe",
        "godot.exe",
        "Godot.exe",
    ]

    candidates: list[GodotCandidate] = []
    for name in names:
        resolved = shutil.which(name)
        if resolved:
            candidates.append(GodotCandidate(Path(resolved), f"PATH:{name}"))

    package_root = local_appdata / "Microsoft" / "WinGet" / "Packages" / "GodotEngine.GodotEngine_Microsoft.Winget.Source_8wekyb3d8bbwe"
    fixed_roots = [
        local_appdata / "Programs" / "Godot",
        package_root,
        program_files / "Godot",
        program_files_x86 / "Godot",
        user_profile / "scoop" / "shims",
    ]
    for root in fixed_roots:
        for name in names:
            candidates.append(GodotCandidate(root / name, str(root)))
    return candidates


def find_godot(console: bool = False) -> Path:
    """按环境变量、PATH、常见安装目录的顺序寻找 Godot。"""

    env_candidates = []
    if console:
        env_candidates.append(env_path("GODOT_CONSOLE"))
    env_candidates.append(env_path("GODOT_EXE"))

    for candidate in [x for x in env_candidates if x] + possible_godot_paths(console):
        if candidate.path.exists():
            return candidate.path

    mode = "console/headless" if console else "editor/runtime"
    raise FileNotFoundError(
        f"没有找到 {mode} 模式需要的 Godot 可执行文件。请设置 GODOT_EXE；无头命令可额外设置 GODOT_CONSOLE。"
    )


def run_command(command: list[str], *, cwd: Path = PROJECT_ROOT, wait: bool = True) -> int:
    """打印并执行外部命令，保证所有工程命令都有同一份日志格式。"""

    print("[lex] " + " ".join(f'"{part}"' if " " in part else part for part in command), flush=True)
    if wait:
        return subprocess.run(command, cwd=cwd).returncode
    subprocess.Popen(command, cwd=cwd)
    return 0


def pull_current_branch() -> int:
    """先从 origin 拉取当前分支，保证本地在远端最新提交之后运行。"""

    return run_command(["git", "pull", "--ff-only", REMOTE_NAME, "HEAD"])


def push_current_branch() -> int:
    """把当前分支已有提交推到 origin；不自动提交工作区改动。"""

    return run_command(["git", "push", REMOTE_NAME, "HEAD"])


def open_editor() -> int:
    """打开 Godot 编辑器，不阻塞当前终端。"""

    godot = find_godot(console=False)
    return run_command([str(godot), "--editor", "--path", str(GODOT_PROJECT_DIR)], wait=False)


def run_game() -> int:
    """从源码直接运行 Godot 工程。"""

    godot = find_godot(console=False)
    return run_command([str(godot), "--path", str(GODOT_PROJECT_DIR)])


def validate_project() -> int:
    """用 headless Godot 加载项目，检查脚本和资源能否启动。"""

    godot = find_godot(console=True)
    return run_command([str(godot), "--headless", "--path", str(GODOT_PROJECT_DIR), "--quit"])


def build_desktop() -> int:
    """导出 Windows pck，并复制 Godot 可执行文件作为桌面启动器。"""

    console_godot = find_godot(console=True)
    gui_godot = find_godot(console=False)
    BUILD_DIR.mkdir(parents=True, exist_ok=True)

    export_code = run_command([
        str(console_godot),
        "--headless",
        "--path",
        str(GODOT_PROJECT_DIR),
        "--export-pack",
        EXPORT_PRESET,
        str(GAME_PCK),
    ])
    if export_code != 0:
        return export_code

    shutil.copyfile(gui_godot, GAME_EXE)
    print("[lex] 构建完成。", flush=True)
    print(f"[lex] {GAME_EXE}", flush=True)
    print(f"[lex] {GAME_PCK}", flush=True)
    return 0


def run_desktop_build() -> int:
    """运行已经导出的 Windows 桌面构建。"""

    if not GAME_EXE.exists():
        print(f"[lex] 没有找到桌面可执行文件：{GAME_EXE}", file=sys.stderr, flush=True)
        return 1
    if not GAME_PCK.exists():
        print(f"[lex] 没有找到打包后的游戏数据：{GAME_PCK}", file=sys.stderr, flush=True)
        return 1
    return run_command([str(GAME_EXE), "--main-pack", str(GAME_PCK)], wait=False)


def parse_args(argv: list[str]) -> argparse.Namespace:
    """解析命令行参数，并限制入口命令集合。"""

    parser = argparse.ArgumentParser(description="Lex Universalis 统一启动脚本。")
    parser.add_argument(
        "command",
        choices=("editor", "run", "validate", "build", "desktop"),
        help="editor=打开 Godot 编辑器，run=运行项目，validate=无头加载验证，build=导出 Windows 数据包，desktop=运行已构建 exe",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """主流程：解析命令，先拉取，执行指定 Godot 工作流，成功后再推送。"""

    args = parse_args(argv or sys.argv[1:])
    actions = {
        "editor": open_editor,
        "run": run_game,
        "validate": validate_project,
        "build": build_desktop,
        "desktop": run_desktop_build,
    }
    try:
        pull_code = pull_current_branch()
        if pull_code != 0:
            return pull_code

        action_code = actions[args.command]()
        if action_code != 0:
            return action_code

        return push_current_branch()
    except Exception as exc:
        print(f"[lex] {exc}", file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
