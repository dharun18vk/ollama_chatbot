import { Trash2, Cpu, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const ChatHeader: React.FC = () => {
  const { currentAgent, clearMessages, messages } = useChatStore();
  const { toast } = useToast();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleClearChat = () => {
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  return (
    <div className="sticky top-0 z-10 bg-gradient-subtle border-b border-glass-border backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center shadow-glow">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Modular AI Platform</h1>
                <p className="text-xs text-muted-foreground">
                  {messages.length} messages
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn(
              'px-3 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-glass-border',
              'text-sm text-foreground min-w-40 text-center'
            )}>
              {currentAgent?.name || 'No Agent Selected'}
            </div>

            <Link to="/agents">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-9 h-9 p-0 hover:bg-primary/10 hover:text-primary',
                  'transition-all duration-200 hover:shadow-elegant'
                )}
                title="Manage agents"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className={cn(
                'w-9 h-9 p-0 hover:bg-muted/50',
                'transition-all duration-200 hover:shadow-elegant'
              )}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              disabled={messages.length === 0}
              className={cn(
                'w-9 h-9 p-0 hover:bg-destructive/10 hover:text-destructive',
                'transition-all duration-200 hover:shadow-elegant',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};