@echo off
setlocal

call "%~dp0scripts\find-godot.bat"
if errorlevel 1 exit /b 1

set "PROJECT_DIR=%~dp0godot"

start "" "%LEX_GODOT_EXE%" --path "%PROJECT_DIR%"
