#!/bin/bash

# AI Chat Application Launcher
echo "🚀 Starting AI Chat Application..."
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install it first:"
    echo "   Visit: https://ollama.ai"
    echo "   Or run: curl -fsSL https://ollama.ai/install.sh | sh"
    exit 1
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags &> /dev/null; then
    echo "⚠️  Ollama is not running. Starting Ollama..."
    ollama serve &
    sleep 3
    echo "✅ Ollama started"
else
    echo "✅ Ollama is already running"
fi

# Check if models are available
echo "📦 Checking available models..."
models=$(ollama list 2>/dev/null | grep -v "NAME" | wc -l)
if [ $models -eq 0 ]; then
    echo "⚠️  No models found. Let's install llama3..."
    ollama pull llama3
    echo "✅ llama3 installed"
else
    echo "✅ Found $models model(s)"
fi

# Start the backend server
echo "🔧 Starting backend server..."
if [ ! -f "package-server.json" ]; then
    echo "❌ Backend package.json not found. Please run: npm install express cors node-fetch"
    exit 1
fi

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "node_modules_backend" ]; then
    echo "📦 Installing backend dependencies..."
    npm install express cors node-fetch
    mkdir -p node_modules_backend
fi

# Start backend in background
node server.js &
BACKEND_PID=$!
sleep 2
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Start the frontend
echo "🎨 Starting frontend..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 AI Chat Application is running!"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:3001"
echo "   Ollama:   http://localhost:11434"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt signal
trap "echo '🛑 Stopping services...' && kill $BACKEND_PID $FRONTEND_PID 2>/dev/null && exit 0" INT
wait