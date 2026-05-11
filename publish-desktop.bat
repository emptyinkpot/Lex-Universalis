@echo off
setlocal

call "%~dp0scripts\find-godot.bat" console
if errorlevel 1 exit /b 1

set "GODOT_CONSOLE=%LEX_GODOT_EXE%"
set "PROJECT_DIR=%~dp0godot"
set "BUILD_DIR=%~dp0build\windows"
set "PACK_PATH=%BUILD_DIR%\Lex Universalis.pck"
set "EXE_PATH=%BUILD_DIR%\Lex Universalis.exe"

if not exist "%BUILD_DIR%" (
  mkdir "%BUILD_DIR%"
)

echo Exporting Windows pack...
"%GODOT_CONSOLE%" --headless --path "%PROJECT_DIR%" --export-pack "Windows Desktop" "%PACK_PATH%"
if errorlevel 1 exit /b 1

call "%~dp0scripts\find-godot.bat"
if errorlevel 1 exit /b 1
set "GODOT_GUI=%LEX_GODOT_EXE%"

echo Refreshing desktop launcher binary...
copy /Y "%GODOT_GUI%" "%EXE_PATH%" >nul
if errorlevel 1 exit /b 1

echo Build complete.
echo   %EXE_PATH%
echo   %PACK_PATH%
