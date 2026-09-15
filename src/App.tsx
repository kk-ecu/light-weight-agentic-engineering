/**
 * light-weight-agentic-engineering Platform
 * 6-Plane Full-Stack Architecture: Solution Discovery Website + Engineering Control Plane
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
import { C4ArchitectureView } from './components/C4ArchitectureView';
import { CodebaseExplorerView } from './components/CodebaseExplorerView';
import { LocalM2RunnerView } from './components/LocalM2RunnerView';
import { TestSuiteView } from './components/TestSuiteView';
import { EnterpriseReviewView } from './components/EnterpriseReviewView';

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
            onOpenCodebase={() => setActiveTab('plane-codebase')}
          />
        )}

        {activeTab === 'agent-gateway' && <AgentGatewayView />}

        {activeTab === 'mcp-gateway' && <McpGatewayView />}

        {activeTab === 'llm-gateway' && <LlmGatewayView />}

        {activeTab === 'workflows-approvals' && <WorkflowsApprovalView />}

        {activeTab === 'knowledge' && <KnowledgeServiceView />}

        {activeTab === 'c4-architecture' && <C4ArchitectureView />}

        {activeTab === 'plane-codebase' && <CodebaseExplorerView />}

        {activeTab === 'local-m2-runner' && <LocalM2RunnerView />}

        {activeTab === 'test-suite' && <TestSuiteView />}

        {activeTab === 'enterprise-review' && <EnterpriseReviewView />}
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">light-weight-agentic-engineering</span>
            <span>·</span>
            <span>Enterprise 6-Plane Architecture</span>
            <span>·</span>
            <span className="text-amber-400 font-mono">Mac M2 Apple Silicon</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setActiveTab('c4-architecture')} className="hover:text-amber-400 transition-colors">
              C4 System Design
            </button>
            <button onClick={() => setActiveTab('plane-codebase')} className="hover:text-amber-400 transition-colors">
              6-Plane Monorepo
            </button>
            <button onClick={() => setActiveTab('test-suite')} className="hover:text-amber-400 transition-colors">
              Verification Matrix
            </button>
            <button onClick={() => setActiveTab('enterprise-review')} className="hover:text-amber-400 transition-colors font-bold text-amber-300">
              Score: 9.7/10
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
