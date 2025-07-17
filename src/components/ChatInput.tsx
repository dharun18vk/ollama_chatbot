import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-subtle border-t border-glass-border backdrop-blur-sm p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              'min-h-12 max-h-32 resize-none rounded-xl pr-12',
              'bg-card/50 backdrop-blur-sm border-glass-border',
              'focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
              'placeholder:text-muted-foreground',
              'shadow-glass transition-all duration-200',
              'hover:shadow-elegant focus:shadow-elegant'
            )}
          />
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            size="sm"
            className={cn(
              'absolute right-2 bottom-2 h-8 w-8 p-0',
              'bg-primary hover:bg-primary/90 shadow-glow',
              'transition-all duration-200 hover:shadow-elegant',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};