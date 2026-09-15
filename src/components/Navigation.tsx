import React from 'react';
import { ActiveTab } from '../types';
import { 
  Globe, 
  Workflow, 
  Cpu, 
  ShieldCheck, 
  Network, 
  CheckCircle2, 
  Database, 
  FolderTree, 
  Terminal,
  Layers
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingApprovalsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'website', label: 'Solution Discovery Web', icon: Globe },
    { id: 'agent-gateway', label: 'Agent Gateway (LangGraph)', icon: Workflow },
    { id: 'mcp-gateway', label: 'MCP Gateway (Tools)', icon: Network },
    { id: 'llm-gateway', label: 'LLM Gateway (Ollama)', icon: Cpu },
    { id: 'workflows-approvals', label: 'Temporal & Approvals', icon: CheckCircle2, badge: pendingApprovalsCount },
    { id: 'knowledge', label: 'Knowledge (pgvector)', icon: Database },
    { id: 'c4-architecture', label: 'C4 & System Design', icon: Layers },
    { id: 'plane-codebase', label: '6-Plane Monorepo', icon: FolderTree },
    { id: 'local-m2-runner', label: 'Local M2 Runner', icon: Terminal },
    { id: 'test-suite', label: 'Test Suite & Coverage', icon: ShieldCheck },
    { id: 'enterprise-review', label: 'Review & 10/10 Scorecard', icon: CheckCircle2 },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Platform Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('website')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">light-weight-agentic-engineering</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                  ENTERPRISE CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">Light-Weight Agentic Engineering · Full-Stack 6-Plane Architecture</p>
            </div>
          </div>

          {/* Quick Environment Status Pill */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Runtime:</span>
            <span className="text-emerald-400 font-mono font-semibold">Mac M2 (Apple Silicon)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">Model:</span>
            <span className="text-amber-300 font-mono">ollama/llama3.2:3b</span>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none pt-1" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
