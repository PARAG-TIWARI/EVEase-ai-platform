@echo off
setlocal
cd /d "%~dp0"

echo Starting EVEase AI recommendation API on port 8000...
if exist "services\ev-ai-agent\.venv\Scripts\python.exe" (
    start "EVEase AI API" cmd /k "cd /d ""%~dp0services\ev-ai-agent"" && .venv\Scripts\python.exe api.py"
) else (
    start "EVEase AI API" cmd /k "cd /d ""%~dp0services\ev-ai-agent"" && py -3 api.py"
)

echo Starting legacy Flask prototype on port 5000...
if exist "server\.venv\Scripts\python.exe" (
    start "EVEase Flask prototype" cmd /k "cd /d ""%~dp0server"" && .venv\Scripts\python.exe app.py"
) else (
    start "EVEase Flask prototype" cmd /k "cd /d ""%~dp0server"" && py -3 app.py"
)

echo Starting React + Vite frontend on port 5173...
cd /d "%~dp0client"
if not exist "node_modules" (
    echo Dependencies not found. Run npm ci in the client folder before using this launcher.
    pause
    exit /b 1
)
npm run dev

endlocal
