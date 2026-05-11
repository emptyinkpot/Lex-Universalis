@echo off
setlocal
set "REPO_ROOT=%~dp0"
cd /d "%REPO_ROOT%tools\codex-bridge"
if exist ".env" (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if not "%%A"=="" if not "%%A"=="#" set "%%A=%%B"
  )
)
if not exist "node_modules" (
  npm install
)
if not defined CODEX_WORKSPACE set "CODEX_WORKSPACE=%REPO_ROOT%"
if not defined CODEX_BRIDGE_PORT set "CODEX_BRIDGE_PORT=43987"
node server.mjs
