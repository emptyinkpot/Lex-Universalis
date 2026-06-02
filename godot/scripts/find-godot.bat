@echo off
setlocal EnableExtensions

set "WANT_CONSOLE=%~1"

if /I "%WANT_CONSOLE%"=="console" (
  if defined GODOT_CONSOLE if exist "%GODOT_CONSOLE%" (
    endlocal & set "LEX_GODOT_EXE=%GODOT_CONSOLE%" & exit /b 0
  )
) else (
  if defined GODOT_EXE if exist "%GODOT_EXE%" (
    endlocal & set "LEX_GODOT_EXE=%GODOT_EXE%" & exit /b 0
  )
)

for %%N in (
  godot
  godot4
  Godot_v4.6.1-stable_win64
  Godot_v4.6.1-stable_win64_console
) do (
  for /f "delims=" %%P in ('where %%N 2^>nul') do (
    endlocal & set "LEX_GODOT_EXE=%%P" & exit /b 0
  )
)

for %%P in (
  "%LOCALAPPDATA%\Microsoft\WinGet\Packages\GodotEngine.GodotEngine_Microsoft.Winget.Source_8wekyb3d8bbwe\Godot_v4.6.1-stable_win64.exe"
  "%LOCALAPPDATA%\Microsoft\WinGet\Packages\GodotEngine.GodotEngine_Microsoft.Winget.Source_8wekyb3d8bbwe\Godot_v4.6.1-stable_win64_console.exe"
  "%ProgramFiles%\Godot\Godot_v4.6.1-stable_win64.exe"
  "%ProgramFiles%\Godot\Godot_v4.6.1-stable_win64_console.exe"
  "%ProgramFiles(x86)%\Godot\Godot_v4.6.1-stable_win64.exe"
  "%ProgramFiles(x86)%\Godot\Godot_v4.6.1-stable_win64_console.exe"
) do (
  if exist "%%~P" (
    endlocal & set "LEX_GODOT_EXE=%%~P" & exit /b 0
  )
)

echo Godot executable not found.
echo Install Godot 4.6.x, add it to PATH, or set GODOT_EXE/GODOT_CONSOLE.
exit /b 1
