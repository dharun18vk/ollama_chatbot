@echo off
echo 🚀 Starting AI Chat Application...
echo.

REM Check if Ollama is installed
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Ollama is not installed. Please install it first:
    echo    Visit: https://ollama.ai
    pause
    exit /b 1
)

REM Check if Ollama is running
curl -s http://localhost:11434/api/tags >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Ollama is not running. Starting Ollama...
    start "Ollama" ollama serve
    timeout /t 3 /nobreak >nul
    echo ✅ Ollama started
) else (
    echo ✅ Ollama is already running
)

REM Check if models are available
echo 📦 Checking available models...
ollama list 2>nul | find /c /v "NAME" >nul
if %errorlevel% neq 0 (
    echo ⚠️  No models found. Let's install llama3...
    ollama pull llama3
    echo ✅ llama3 installed
) else (
    echo ✅ Models found
)

REM Start the backend server
echo 🔧 Starting backend server...
if not exist "package-server.json" (
    echo ❌ Backend package.json not found. Please run: npm install express cors node-fetch
    pause
    exit /b 1
)

REM Install backend dependencies if node_modules doesn't exist
if not exist "node_modules_backend" (
    echo 📦 Installing backend dependencies...
    npm install express cors node-fetch
    mkdir node_modules_backend
)

REM Start backend in background
start "Backend" node server.js
timeout /t 2 /nobreak >nul
echo ✅ Backend server started

REM Start the frontend
echo 🎨 Starting frontend...
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Start frontend
start "Frontend" npm run dev
echo ✅ Frontend started

echo.
echo 🎉 AI Chat Application is running!
echo    Frontend: http://localhost:8080
echo    Backend:  http://localhost:3001
echo    Ollama:   http://localhost:11434
echo.
echo Press any key to exit...
pause >nul