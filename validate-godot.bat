@echo off
setlocal

set GODOT_EXE=C:\Users\ASUS-KL\AppData\Local\Microsoft\WinGet\Packages\GodotEngine.GodotEngine_Microsoft.Winget.Source_8wekyb3d8bbwe\Godot_v4.6.1-stable_win64_console.exe
set PROJECT_DIR=%~dp0godot

if not exist "%GODOT_EXE%" (
  echo Godot console executable not found:
  echo %GODOT_EXE%
  exit /b 1
)

"%GODOT_EXE%" --headless --path "%PROJECT_DIR%" --quit
