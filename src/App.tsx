/**
 * Genting Agentic Engineering Platform (POC)
 * Dual Experience: Genting Digital Website + Engineering Control Plane
 * Scalable architecture running on Local Ollama (Mac M2) with LangGraph, Temporal, pgvector, and MCP.
 */

import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Navigation } from './components/Navigation';
import { WebsiteView } from './components/WebsiteView';
import { AgentGatewayView } from './components/AgentGatewayView';
import { McpGatewayView } from './components/McpGatewayView';
import { LlmGatewayView } from './components/LlmGatewayView';
import { WorkflowsApprovalView } from './components/WorkflowsApprovalView';
import { KnowledgeServiceView } from './components/KnowledgeServiceView';
import { ArchitectureView } from './components/ArchitectureView';
import { CodebaseExplorerView } from './components/CodebaseExplorerView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('website');
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Platform Navigation Header */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'website' && (
          <WebsiteView
            onExploreGateway={() => setActiveTab('agent-gateway')}
            onOpenCodebase={() => setActiveTab('codebase')}
          />
        )}

        {activeTab === 'agent-gateway' && <AgentGatewayView />}

        {activeTab === 'mcp-gateway' && <McpGatewayView />}

        {activeTab === 'llm-gateway' && <LlmGatewayView />}

        {activeTab === 'workflows-approvals' && <WorkflowsApprovalView />}

        {activeTab === 'knowledge' && <KnowledgeServiceView />}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'codebase' && <CodebaseExplorerView />}
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Genting Agentic Engineering</span>
            <span>·</span>
            <span>Proof of Concept v0.1</span>
            <span>·</span>
            <span className="text-amber-400 font-mono">Mac M2 Apple Silicon</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setActiveTab('architecture')} className="hover:text-amber-400 transition-colors">
              Solution Architecture
            </button>
            <button onClick={() => setActiveTab('codebase')} className="hover:text-amber-400 transition-colors">
              Monorepo Files
            </button>
            <button onClick={() => setActiveTab('workflows-approvals')} className="hover:text-amber-400 transition-colors">
              Temporal Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
