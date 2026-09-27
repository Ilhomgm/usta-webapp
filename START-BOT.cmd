@echo off
setlocal
cd /d "%~dp0"
set "USTA_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "USTA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist ".env.local" (
  echo Configure .env.local first. See docs/AI.md.
  pause
  exit /b 1
)
echo USTA bot. Keep this window open. Ctrl+C stops the bot.
"%USTA_NODE%" --env-file=.env.local bot.js
pause
