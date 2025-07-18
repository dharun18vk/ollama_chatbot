import { AgentDashboard } from '@/components/AgentDashboard';
import { AgentSelector } from '@/components/AgentSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Agents = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Agent Management</h1>
        </div>
        
        <div className="space-y-6">
          <AgentSelector />
          <AgentDashboard />
        </div>
      </div>
    </div>
  );
};

export default Agents;