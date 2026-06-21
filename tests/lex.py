#!/usr/bin/env python3
r"""Single launcher for Lex Universalis Godot workflows.

Start editor: python .\tests\lex.py editor
Start game:   python .\tests\lex.py run

Every command pushes the current branch to origin once before running.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
GODOT_PROJECT_DIR = PROJECT_ROOT
BUILD_DIR = PROJECT_ROOT / "build" / "windows"
GAME_EXE = BUILD_DIR / "Lex Universalis.exe"
GAME_PCK = BUILD_DIR / "Lex Universalis.pck"
EXPORT_PRESET = "Windows Desktop"
REMOTE_NAME = "origin"


@dataclass(frozen=True)
class GodotCandidate:
    path: Path
    source: str


def env_path(name: str) -> GodotCandidate | None:
    value = os.environ.get(name, "").strip().strip('"')
    if not value:
        return None
    path = Path(value).expanduser()
    return GodotCandidate(path, name)


def possible_godot_paths(console: bool) -> list[GodotCandidate]:
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
    env_candidates = []
    if console:
        env_candidates.append(env_path("GODOT_CONSOLE"))
    env_candidates.append(env_path("GODOT_EXE"))

    for candidate in [x for x in env_candidates if x] + possible_godot_paths(console):
        if candidate.path.exists():
            return candidate.path

    mode = "console/headless" if console else "editor/runtime"
    raise FileNotFoundError(
        f"Godot executable not found for {mode}. Set GODOT_EXE, or GODOT_CONSOLE for headless commands."
    )


def run_command(command: list[str], *, cwd: Path = PROJECT_ROOT, wait: bool = True) -> int:
    print("[lex] " + " ".join(f'"{part}"' if " " in part else part for part in command), flush=True)
    if wait:
        return subprocess.run(command, cwd=cwd).returncode
    subprocess.Popen(command, cwd=cwd)
    return 0


def push_current_branch() -> int:
    return run_command(["git", "push", REMOTE_NAME, "HEAD"])


def open_editor() -> int:
    godot = find_godot(console=False)
    return run_command([str(godot), "--editor", "--path", str(GODOT_PROJECT_DIR)], wait=False)


def run_game() -> int:
    godot = find_godot(console=False)
    return run_command([str(godot), "--path", str(GODOT_PROJECT_DIR)])


def validate_project() -> int:
    godot = find_godot(console=True)
    return run_command([str(godot), "--headless", "--path", str(GODOT_PROJECT_DIR), "--quit"])


def build_desktop() -> int:
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
    print("[lex] Build complete.", flush=True)
    print(f"[lex] {GAME_EXE}", flush=True)
    print(f"[lex] {GAME_PCK}", flush=True)
    return 0


def run_desktop_build() -> int:
    if not GAME_EXE.exists():
        print(f"[lex] Desktop executable not found: {GAME_EXE}", file=sys.stderr, flush=True)
        return 1
    if not GAME_PCK.exists():
        print(f"[lex] Packed game data not found: {GAME_PCK}", file=sys.stderr, flush=True)
        return 1
    return run_command([str(GAME_EXE), "--main-pack", str(GAME_PCK)], wait=False)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Lex Universalis launcher.")
    parser.add_argument(
        "command",
        choices=("editor", "run", "validate", "build", "desktop"),
        help="editor=open Godot editor, run=run project, validate=headless load, build=export Windows pack, desktop=run built exe",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    actions = {
        "editor": open_editor,
        "run": run_game,
        "validate": validate_project,
        "build": build_desktop,
        "desktop": run_desktop_build,
    }
    try:
        push_code = push_current_branch()
        if push_code != 0:
            return push_code
        return actions[args.command]()
    except Exception as exc:
        print(f"[lex] {exc}", file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
