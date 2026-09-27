@echo off
setlocal
cd /d "%~dp0"
set "USTA_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "USTA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "node_modules\next\dist\bin\next" (
  echo Dependencies missing. Run pnpm install --frozen-lockfile first.
  pause
  exit /b 1
)
if not exist ".next\BUILD_ID" (
  "%USTA_NODE%" node_modules\next\dist\bin\next build
  if errorlevel 1 exit /b 1
)
echo USTA: http://localhost:3000
echo Keep this window open. Press Ctrl+C to stop.
"%USTA_NODE%" node_modules\next\dist\bin\next start --hostname 127.0.0.1 --port 3000
pause
