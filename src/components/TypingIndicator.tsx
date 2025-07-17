import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center shadow-glow">
        <Bot className="w-4 h-4 text-white" />
      </div>
      
      <div className="bg-chat-assistant-bg text-chat-assistant-foreground rounded-2xl px-4 py-3 shadow-glass backdrop-blur-sm border border-glass-border">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dots" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dots" style={{ animationDelay: '160ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dots" style={{ animationDelay: '320ms' }} />
          </div>
          <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  );
};