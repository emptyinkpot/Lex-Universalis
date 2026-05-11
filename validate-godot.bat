@echo off
setlocal

call "%~dp0scripts\find-godot.bat" console
if errorlevel 1 exit /b 1

set "PROJECT_DIR=%~dp0godot"

"%LEX_GODOT_EXE%" --headless --path "%PROJECT_DIR%" --quit
