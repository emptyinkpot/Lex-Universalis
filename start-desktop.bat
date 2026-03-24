@echo off
setlocal

set GAME_EXE=%~dp0build\windows\Lex Universalis.exe
set GAME_PCK=%~dp0build\windows\Lex Universalis.pck

if not exist "%GAME_EXE%" (
  echo Desktop executable not found:
  echo %GAME_EXE%
  exit /b 1
)

if not exist "%GAME_PCK%" (
  echo Packed game data not found:
  echo %GAME_PCK%
  exit /b 1
)

start "" "%GAME_EXE%" --main-pack "%GAME_PCK%"
