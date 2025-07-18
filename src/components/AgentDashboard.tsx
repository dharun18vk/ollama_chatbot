import { useChatStore } from '@/store/chatStore';
import { Bot, MessageSquare, Clock, Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const AgentDashboard: React.FC = () => {
  const { agents, currentAgent, messages } = useChatStore();

  const getAgentStats = (agentId: string) => {
    const agentMessages = messages.filter(msg => msg.agentId === agentId);
    const lastUsed = agentMessages.length > 0 
      ? Math.max(...agentMessages.map(m => m.timestamp))
      : null;
    
    return {
      messageCount: agentMessages.length,
      lastUsed
    };
  };

  if (agents.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-glass-border">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Bot className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No agents created yet. Create your first AI agent to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Agent Dashboard</h2>
        <Badge variant="secondary" className="ml-auto">
          {agents.length} {agents.length === 1 ? 'Agent' : 'Agents'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => {
          const stats = getAgentStats(agent.id);
          const isActive = currentAgent?.id === agent.id;
          
          return (
            <Card 
              key={agent.id} 
              className={cn(
                'bg-card/50 backdrop-blur-sm border-glass-border transition-all duration-200',
                'hover:bg-card/70 hover:shadow-elegant',
                isActive && 'ring-2 ring-primary/50 bg-primary/5'
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      isActive ? 'bg-gradient-main shadow-glow' : 'bg-muted'
                    )}>
                      <Bot className={cn(
                        'w-5 h-5',
                        isActive ? 'text-white' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {agent.name}
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {agent.purpose} • {agent.tone} tone
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    {agent.model}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{stats.messageCount} messages</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {stats.lastUsed 
                        ? `Last used ${new Date(stats.lastUsed).toLocaleDateString()}`
                        : 'Never used'
                      }
                    </span>
                  </div>
                </div>
                
                {agent.systemPrompt && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {agent.systemPrompt}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};