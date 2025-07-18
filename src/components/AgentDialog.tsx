import { useState, useEffect } from 'react';
import { Bot, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChatStore, Agent, TONE_OPTIONS, PURPOSE_OPTIONS } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: Agent | null;
}

export const AgentDialog: React.FC<AgentDialogProps> = ({ open, onOpenChange, agent }) => {
  const { 
    createAgent, 
    updateAgent, 
    deleteAgent, 
    setCurrentAgent, 
    availableModels, 
    currentAgent 
  } = useChatStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    model: 'llama3',
    purpose: 'General Assistant',
    tone: 'Friendly',
    systemPrompt: ''
  });

  const isEditing = !!agent;

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        model: agent.model,
        purpose: agent.purpose,
        tone: agent.tone,
        systemPrompt: agent.systemPrompt
      });
    } else {
      setFormData({
        name: '',
        model: availableModels[0] || 'llama3',
        purpose: 'General Assistant',
        tone: 'Friendly',
        systemPrompt: ''
      });
    }
  }, [agent, availableModels, open]);

  const generateSystemPrompt = () => {
    const prompt = `You are a ${formData.tone.toLowerCase()} AI assistant specialized as a ${formData.purpose.toLowerCase()}. 

Your primary role is to assist users with ${formData.purpose.toLowerCase()} related tasks and questions. 

Personality traits:
- Maintain a ${formData.tone.toLowerCase()} tone in all interactions
- Be helpful, informative, and ${formData.tone === 'Professional' ? 'professional' : formData.tone === 'Empathetic' ? 'understanding and compassionate' : formData.tone === 'Humorous' ? 'witty and engaging' : 'warm and approachable'}
- Provide clear, concise responses
- Ask clarifying questions when needed

Remember to stay in character and maintain consistency with your defined purpose and tone.`;

    setFormData(prev => ({ ...prev, systemPrompt: prompt }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Agent name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.systemPrompt.trim()) {
      toast({
        title: "Validation Error", 
        description: "System prompt is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && agent) {
        updateAgent(agent.id, formData);
        toast({
          title: "Agent updated",
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        const newAgent = createAgent(formData);
        setCurrentAgent(newAgent);
        toast({
          title: "Agent created",
          description: `${formData.name} has been created and activated`,
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save agent",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (agent && agent.id !== 'default') {
      deleteAgent(agent.id);
      toast({
        title: "Agent deleted",
        description: `${agent.name} has been removed`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-sm border-glass-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            {isEditing ? 'Edit Agent' : 'Create New Agent'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modify the agent\'s configuration and personality.'
              : 'Define a new AI agent with custom personality and behavior.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Code Assistant"
                className="bg-input/50 border-glass-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                <SelectTrigger className="bg-input/50 border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}>
                <SelectTrigger className="bg-input/50 border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSE_OPTIONS.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                <SelectTrigger className="bg-input/50 border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSystemPrompt}
                className="text-xs"
              >
                Generate
              </Button>
            </div>
            <Textarea
              id="systemPrompt"
              value={formData.systemPrompt}
              onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
              placeholder="Define the agent's behavior, personality, and instructions..."
              rows={6}
              className="bg-input/50 border-glass-border resize-none"
            />
          </div>

          <DialogFooter className="flex items-center justify-between">
            <div>
              {isEditing && agent?.id !== 'default' && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-main text-white">
                {isEditing ? 'Update Agent' : 'Create Agent'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};