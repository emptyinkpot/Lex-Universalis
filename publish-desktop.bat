@echo off
setlocal

set GODOT_CONSOLE=C:\Users\ASUS-KL\AppData\Local\Microsoft\WinGet\Packages\GodotEngine.GodotEngine_Microsoft.Winget.Source_8wekyb3d8bbwe\Godot_v4.6.1-stable_win64_console.exe
set PROJECT_DIR=%~dp0godot
set BUILD_DIR=%~dp0build\windows
set PACK_PATH=%BUILD_DIR%\Lex Universalis.pck
set EXE_PATH=%BUILD_DIR%\Lex Universalis.exe

if not exist "%GODOT_CONSOLE%" (
  echo Godot console executable not found:
  echo %GODOT_CONSOLE%
  exit /b 1
)

if not exist "%BUILD_DIR%" (
  mkdir "%BUILD_DIR%"
)

echo Exporting Windows pack...
"%GODOT_CONSOLE%" --headless --path "%PROJECT_DIR%" --export-pack "Windows Desktop" "%PACK_PATH%"
if errorlevel 1 exit /b 1

echo Refreshing desktop launcher binary...
copy /Y "%GODOT_CONSOLE%" "%EXE_PATH%" >nul
if errorlevel 1 exit /b 1

echo Build complete.
echo   %EXE_PATH%
echo   %PACK_PATH%
