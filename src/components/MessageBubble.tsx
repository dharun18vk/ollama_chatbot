import { Message } from '@/store/chatStore';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      'flex items-start gap-3 animate-slide-up',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center shadow-glow">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        'max-w-[70%] rounded-2xl px-4 py-3 shadow-glass backdrop-blur-sm',
        'border border-glass-border transition-all duration-300 hover:shadow-elegant',
        isUser 
          ? 'bg-chat-user-bg text-chat-user-foreground ml-auto' 
          : 'bg-chat-assistant-bg text-chat-assistant-foreground'
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs opacity-60">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center shadow-glow">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};