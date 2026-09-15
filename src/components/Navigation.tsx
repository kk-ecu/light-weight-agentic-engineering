import React, { useState } from 'react';
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
  Layers,
  Activity,
  Clock
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingApprovalsCount: number;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
  highlight?: boolean;
  category: 'runtime' | 'architecture';
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount
}) => {
  const [navFilter, setNavFilter] = useState<'all' | 'runtime' | 'architecture'>('all');

  const navItems: NavItem[] = [
    // RUNTIME & ENGINES (6 tabs)
    { id: 'local-m2-runner', label: '🚀 Local M2 Runner', icon: Terminal, highlight: true, category: 'runtime' },
    { id: 'port-doctor', label: '🩺 12-Port Doctor', icon: Activity, highlight: true, category: 'runtime' },
    { id: 'temporal', label: '⏱️ Temporal Workflows', icon: Clock, badge: pendingApprovalsCount, highlight: true, category: 'runtime' },
    { id: 'agent-gateway', label: '🤖 Agent Gateway', icon: Workflow, category: 'runtime' },
    { id: 'mcp-gateway', label: '🔌 MCP Gateway', icon: Network, category: 'runtime' },
    { id: 'llm-gateway', label: '🧠 LLM Gateway', icon: Cpu, category: 'runtime' },

    // ARCHITECTURE, DATA & VERIFICATION (6 tabs)
    { id: 'website', label: '🌐 Solution Discovery', icon: Globe, category: 'architecture' },
    { id: 'knowledge', label: '📚 Knowledge (pgvector)', icon: Database, category: 'architecture' },
    { id: 'c4-architecture', label: '📐 C4 & System Design', icon: Layers, category: 'architecture' },
    { id: 'plane-codebase', label: '📦 6-Plane Monorepo', icon: FolderTree, category: 'architecture' },
    { id: 'test-suite', label: '🧪 Test Suite (48/48)', icon: ShieldCheck, category: 'architecture' },
    { id: 'enterprise-review', label: '⭐ Review Scorecard', icon: CheckCircle2, category: 'architecture' },
  ];

  const isTabActive = (item: NavItem) => {
    if (item.id === 'temporal' || item.id === 'workflows-approvals') {
      return activeTab === 'temporal' || activeTab === 'workflows-approvals';
    }
    return activeTab === item.id;
  };

  const runtimeTabs = navItems.filter(item => item.category === 'runtime');
  const architectureTabs = navItems.filter(item => item.category === 'architecture');

  const renderTabButton = (item: NavItem) => {
    const Icon = item.icon;
    const active = isTabActive(item);

    return (
      <button
        key={item.id}
        id={`tab-${item.id}`}
        onClick={() => setActiveTab(item.id)}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
          active
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
            : item.highlight
            ? 'text-amber-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-amber-500/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
        }`}
      >
        <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
        <span>{item.label}</span>
        {item.badge !== undefined && item.badge > 0 && (
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            active 
              ? 'bg-slate-950 text-amber-300' 
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2.5 space-y-2">
        {/* Top Header Bar: Brand, Filters & Environment Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
          {/* Brand Logo & Platform Title */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('website')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-amber-500/20 shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">light-weight-agentic-engineering</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  ENTERPRISE CORE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Full-Stack 6-Plane Architecture · Apple Silicon M2 Engine</p>
            </div>
          </div>

          {/* Right Controls: Tab Group Filter & Runtime Pill */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {/* Filter Toggle */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setNavFilter('all')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  navFilter === 'all' 
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All (12)
              </button>
              <button
                onClick={() => setNavFilter('runtime')}
                className={`px-2 py-1 rounded font-medium transition-all flex items-center space-x-1 ${
                  navFilter === 'runtime' 
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>⚡ Runtime (6)</span>
              </button>
              <button
                onClick={() => setNavFilter('architecture')}
                className={`px-2 py-1 rounded font-medium transition-all flex items-center space-x-1 ${
                  navFilter === 'architecture' 
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🏛️ System (6)</span>
              </button>
            </div>

            {/* Quick Environment Status Pill */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">Mac M2</span>
              <span className="text-slate-700">|</span>
              <span className="text-emerald-400 font-mono font-semibold">Temporal: 7233</span>
            </div>
          </div>
        </div>

        {/* Structured Multi-Tier Tabs Area: All 12 Tabs Well-Fitted into Frame */}
        <nav className="space-y-1.5" aria-label="Tabs">
          {/* Row 1: Runtime & Engines */}
          {(navFilter === 'all' || navFilter === 'runtime') && (
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 mr-1 shrink-0 hidden md:inline-flex items-center">
                Runtime
              </span>
              {runtimeTabs.map(renderTabButton)}
            </div>
          )}

          {/* Row 2: Architecture, Knowledge & Verification */}
          {(navFilter === 'all' || navFilter === 'architecture') && (
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 mr-1 shrink-0 hidden md:inline-flex items-center">
                System
              </span>
              {architectureTabs.map(renderTabButton)}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

