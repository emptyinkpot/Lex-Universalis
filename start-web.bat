@echo off
setlocal

cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing root dependencies...
  corepack pnpm install
  if errorlevel 1 (
    echo Failed to install root dependencies.
    exit /b 1
  )
)

if not exist "client\node_modules" (
  echo Installing client dependencies...
  corepack pnpm --dir client install
  if errorlevel 1 (
    echo Failed to install client dependencies.
    exit /b 1
  )
)

echo Starting Expo web preview...
corepack pnpm --dir client start
