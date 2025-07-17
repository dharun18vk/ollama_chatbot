import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ChatContainer: React.FC = () => {
  const { messages, isLoading, selectedModel, addMessage, setLoading, setAvailableModels } = useChatStore();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Check connection and load models on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setConnectionStatus('connected');
          // Load available models
          const modelsResponse = await fetch('/api/models');
          if (modelsResponse.ok) {
            const data = await modelsResponse.json();
            const modelNames = data.models.map((model: any) => model.name);
            if (modelNames.length > 0) {
              setAvailableModels(modelNames);
            }
          }
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, [setAvailableModels]);

  const sendMessage = async (content: string) => {
    // Add user message
    addMessage({ content, role: 'user' });
    setLoading(true);

    try {
      // Here you would normally make an API call to your backend
      // For now, we'll simulate the API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add assistant response
      addMessage({ 
        content: data.response || 'I apologize, but I cannot connect to the AI model right now. Please make sure Ollama is running on your system.',
        role: 'assistant' 
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      addMessage({ 
        content: `I apologize, but I'm having trouble connecting to the AI model. Please check that:\n\n• Ollama is installed and running\n• The model "${selectedModel}" is available\n• Your backend server is running\n\nYou can start Ollama with: ollama serve`,
        role: 'assistant' 
      });
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI model. Please check your setup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-subtle">
      <ChatHeader />
      
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="max-w-4xl mx-auto py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-main flex items-center justify-center shadow-glow mb-4 animate-glow-pulse">
                  <div className="text-2xl">🤖</div>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to AI Chat
                </h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Start a conversation with your local AI model. 
                  {connectionStatus === 'connected' ? 
                    'Everything is set up and ready to go!' : 
                    'Make sure Ollama is running and your model is available.'
                  }
                </p>
                
                {connectionStatus === 'disconnected' && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md">
                    <h3 className="font-medium text-destructive mb-2">⚠️ Connection Issue</h3>
                    <p className="text-sm text-destructive/80">
                      Cannot connect to Ollama. Please check:
                    </p>
                    <ul className="text-sm text-destructive/80 mt-2 text-left">
                      <li>• Ollama is installed and running</li>
                      <li>• Backend server is running on port 3001</li>
                      <li>• Model "{selectedModel}" is available</li>
                    </ul>
                  </div>
                )}
                
                {connectionStatus === 'connected' && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md">
                    <h3 className="font-medium text-primary mb-2">✅ Connected</h3>
                    <p className="text-sm text-primary/80">
                      Ready to chat with {selectedModel}!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            )}
          </div>
        </ScrollArea>
        
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          placeholder="Ask anything..."
        />
      </div>
    </div>
  );
};