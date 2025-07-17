import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: string;
  availableModels: string[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedModel: (model: string) => void;
  setAvailableModels: (models: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  selectedModel: 'llama3',
  availableModels: ['llama3', 'mistral', 'codellama'],
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now()
    }]
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  setAvailableModels: (models) => set({ availableModels: models })
}));