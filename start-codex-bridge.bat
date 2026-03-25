@echo off
setlocal
cd /d "E:\Lex Universalis\tools\codex-bridge"
if exist ".env" (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if not "%%A"=="" if not "%%A"=="#" set "%%A=%%B"
  )
)
if not exist "node_modules" (
  npm install
)
set CODEX_WORKSPACE=E:\Lex Universalis
set CODEX_BRIDGE_PORT=43987
node server.mjs
