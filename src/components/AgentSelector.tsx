import { useState } from 'react';
import { Plus, Bot, Settings, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore, Agent } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AgentDialog } from './AgentDialog';

export const AgentSelector: React.FC = () => {
  const { 
    agents, 
    currentAgent, 
    setCurrentAgent, 
    exportAgents, 
    importAgents 
  } = useChatStore();
  const { toast } = useToast();
  const [showAgentDialog, setShowAgentDialog] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleAgentChange = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setCurrentAgent(agent);
      toast({
        title: "Agent switched",
        description: `Now using ${agent.name}`,
      });
    }
  };

  const handleCreateAgent = () => {
    setEditingAgent(null);
    setShowAgentDialog(true);
  };

  const handleEditAgent = () => {
    if (currentAgent) {
      setEditingAgent(currentAgent);
      setShowAgentDialog(true);
    }
  };

  const handleExportAgents = () => {
    try {
      const data = exportAgents();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-agents.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Agents exported",
        description: "Agent configurations saved to file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export agent configurations",
        variant: "destructive",
      });
    }
  };

  const handleImportAgents = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            importAgents(data);
            toast({
              title: "Agents imported",
              description: "Agent configurations loaded successfully",
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Invalid agent configuration file",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-gradient-subtle border-b border-glass-border">
        <div className="flex items-center gap-2 flex-1">
          <Bot className="w-5 h-5 text-primary" />
          <Select 
            value={currentAgent?.id || ''} 
            onValueChange={handleAgentChange}
          >
            <SelectTrigger className={cn(
              'flex-1 max-w-xs bg-card/50 backdrop-blur-sm border-glass-border',
              'hover:bg-card/70 transition-all duration-200'
            )}>
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent className="bg-card/90 backdrop-blur-sm border-glass-border">
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id} className="hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{agent.name}</span>
                    <span className="text-xs text-muted-foreground">({agent.model})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateAgent}
            className={cn(
              'w-9 h-9 p-0 hover:bg-primary/10 hover:text-primary',
              'transition-all duration-200 hover:shadow-elegant'
            )}
            title="Create new agent"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditAgent}
            disabled={!currentAgent}
            className={cn(
              'w-9 h-9 p-0 hover:bg-muted/50',
              'transition-all duration-200 hover:shadow-elegant',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Edit current agent"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportAgents}
            className={cn(
              'w-9 h-9 p-0 hover:bg-muted/50',
              'transition-all duration-200 hover:shadow-elegant'
            )}
            title="Export agents"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleImportAgents}
            className={cn(
              'w-9 h-9 p-0 hover:bg-muted/50',
              'transition-all duration-200 hover:shadow-elegant'
            )}
            title="Import agents"
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AgentDialog
        open={showAgentDialog}
        onOpenChange={setShowAgentDialog}
        agent={editingAgent}
      />
    </>
  );
};