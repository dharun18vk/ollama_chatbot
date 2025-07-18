import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  agentId?: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  purpose: string;
  tone: string;
  systemPrompt: string;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

export const TONE_OPTIONS = [
  'Friendly',
  'Professional',
  'Sarcastic',
  'Empathetic',
  'Humorous',
  'Formal',
  'Casual',
  'Enthusiastic'
] as const;

export const PURPOSE_OPTIONS = [
  'General Assistant',
  'Code Assistant',
  'Therapist',
  'Study Buddy',
  'Creative Writer',
  'Business Advisor',
  'Language Teacher',
  'Technical Support'
] as const;

interface ChatState {
  // Chat state
  messages: Message[];
  isLoading: boolean;
  
  // Agent state
  agents: Agent[];
  currentAgent: Agent | null;
  
  // Model state
  availableModels: string[];
  
  // Chat actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  
  // Agent actions
  createAgent: (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => Agent;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  setCurrentAgent: (agent: Agent | null) => void;
  
  // Model actions
  setAvailableModels: (models: string[]) => void;
  
  // Utility actions
  exportAgents: () => string;
  importAgents: (data: string) => void;
}

const defaultAgent: Agent = {
  id: 'default',
  name: 'Default Assistant',
  model: 'llama3',
  purpose: 'General Assistant',
  tone: 'Friendly',
  systemPrompt: 'You are a helpful AI assistant. Be friendly, informative, and concise in your responses.',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Chat state
      messages: [],
      isLoading: false,
      
      // Agent state
      agents: [defaultAgent],
      currentAgent: defaultAgent,
      
      // Model state
      availableModels: ['llama3', 'gemma', 'deepseek-r1', 'mistral', 'codellama'],
      
      // Chat actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: Date.now().toString(),
          timestamp: Date.now(),
          agentId: state.currentAgent?.id
        }]
      })),
      
      clearMessages: () => set({ messages: [] }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Agent actions
      createAgent: (agentData) => {
        const newAgent: Agent = {
          ...agentData,
          id: `agent_${Date.now()}`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set((state) => ({
          agents: [...state.agents, newAgent]
        }));
        
        return newAgent;
      },
      
      updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map(agent =>
          agent.id === id 
            ? { ...agent, ...updates, updatedAt: Date.now() }
            : agent
        ),
        currentAgent: state.currentAgent?.id === id 
          ? { ...state.currentAgent, ...updates, updatedAt: Date.now() }
          : state.currentAgent
      })),
      
      deleteAgent: (id) => set((state) => {
        const remainingAgents = state.agents.filter(agent => agent.id !== id);
        const isCurrentAgent = state.currentAgent?.id === id;
        
        return {
          agents: remainingAgents,
          currentAgent: isCurrentAgent ? remainingAgents[0] || null : state.currentAgent,
          messages: state.messages.filter(msg => msg.agentId !== id)
        };
      }),
      
      setCurrentAgent: (agent) => set({ currentAgent: agent }),
      
      // Model actions
      setAvailableModels: (models) => set({ availableModels: models }),
      
      // Utility actions
      exportAgents: () => {
        const { agents } = get();
        return JSON.stringify(agents, null, 2);
      },
      
      importAgents: (data) => {
        try {
          const importedAgents = JSON.parse(data) as Agent[];
          set((state) => ({
            agents: [...state.agents, ...importedAgents]
          }));
        } catch (error) {
          console.error('Failed to import agents:', error);
        }
      }
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        agents: state.agents,
        currentAgent: state.currentAgent
      })
    }
  )
);