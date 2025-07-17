# AI Chat Application Setup Guide

This is a beautiful local AI chatbot application that connects to Ollama for running local LLMs like Llama3, Mistral, etc.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Ollama** installed on your system

### Step 1: Install Ollama

Visit [ollama.ai](https://ollama.ai) and install Ollama for your operating system.

**macOS/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download the installer from the official website.

### Step 2: Pull AI Models

After installing Ollama, pull the models you want to use:

```bash
# Pull Llama3 (recommended)
ollama pull llama3

# Pull Mistral
ollama pull mistral

# Pull CodeLlama for coding tasks
ollama pull codellama

# List available models
ollama list
```

### Step 3: Start Ollama Server

Start the Ollama server (it will run on http://localhost:11434):

```bash
ollama serve
```

Keep this terminal open - Ollama needs to be running for the chat to work.

### Step 4: Start the Backend Server

In a new terminal, navigate to your project directory and set up the backend:

```bash
# Install backend dependencies
npm install express cors node-fetch

# Start the backend server
node server.js
```

The backend will run on http://localhost:3001

### Step 5: Start the Frontend

In another terminal, start the React frontend:

```bash
# Install frontend dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:8080

## 🎨 Features

- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **Multiple Models**: Support for Llama3, Mistral, CodeLlama, and more
- **Real-time Chat**: Instant messaging with typing indicators
- **Dark/Light Mode**: Toggle between themes
- **Message History**: Persistent chat history during your session
- **Model Switching**: Change AI models on the fly
- **Responsive Design**: Works on desktop and mobile

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend server port
PORT=3001

# Ollama server URL
OLLAMA_URL=http://localhost:11434
```

### Adding Custom Models

If you have custom GGUF models, you can add them to Ollama:

```bash
# Create a Modelfile
echo 'FROM ./my-custom-model.gguf' > Modelfile

# Create the model
ollama create my-custom-model -f Modelfile
```

Then update the `availableModels` array in `src/store/chatStore.ts`.

## 🛠️ Troubleshooting

### Common Issues

1. **"Connection Error"**: Make sure Ollama is running (`ollama serve`)
2. **"Model not found"**: Pull the model first (`ollama pull llama3`)
3. **CORS errors**: Ensure the backend server is running on port 3001
4. **Slow responses**: Larger models need more RAM and processing power

### Checking Ollama Status

```bash
# Test if Ollama is running
curl http://localhost:11434/api/tags

# Check available models
ollama list

# Test a model
ollama run llama3 "Hello, world!"
```

### Performance Tips

- Use smaller models (7B parameters) for faster responses
- Increase system RAM for better performance
- Use GPU acceleration if available (CUDA/ROCm)

## 📚 API Endpoints

### Backend API

- `GET /api/health` - Check server health
- `GET /api/models` - Get available models
- `POST /api/chat` - Send a chat message
- `POST /api/generate` - Generate a response (alternative)

### Request Format

```json
{
  "message": "Hello, how are you?",
  "model": "llama3",
  "history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

## 🎯 Next Steps

1. **Streaming Responses**: Implement real-time streaming for faster perceived response times
2. **Message Persistence**: Add database storage for chat history
3. **File Uploads**: Support for document and image inputs
4. **Voice Chat**: Add speech-to-text and text-to-speech
5. **Multi-user Support**: User authentication and separate chat sessions

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the application!

## 📝 License

This project is open source and available under the MIT License.