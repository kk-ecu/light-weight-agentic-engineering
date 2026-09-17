/**
 * light-weight-agentic-engineering Platform
 * 6-Plane Full-Stack Architecture: Solution Discovery Website + Engineering Control Plane
 * Scalable architecture running on Local Ollama (Mac M2) with LangGraph, Temporal, pgvector, and MCP.
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, ThemeMode } from './types';
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
import { ArchitectureDocumentView } from './components/ArchitectureDocumentView';
import { OVERALL_ENTERPRISE_RATING } from './data/enterpriseReviewData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('local-m2-runner');
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(1);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('agentic-theme');
    if (saved === 'dark' || saved === 'light' || saved === 'lightblue') {
      return saved;
    }
    if (saved === 'amadeus' || saved === 'matrix') {
      return 'lightblue';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agentic-theme', theme);
  }, [theme]);

  return (
    <div 
      data-theme={theme}
      className={`min-h-screen ${
        theme === 'lightblue'
          ? 'bg-[#f0f6ff] text-[#0f2347]'
          : theme === 'light' 
          ? 'bg-slate-50 text-slate-900' 
          : 'bg-slate-950 text-slate-100'
      } flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200`}
    >
      {/* Platform Navigation Header */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'website' && (
          <WebsiteView
            onExploreGateway={() => setActiveTab('agent-gateway')}
            onOpenCodebase={() => setActiveTab('plane-codebase')}
          />
        )}

        {activeTab === 'architecture-doc' && (
          <ArchitectureDocumentView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'agent-gateway' && <AgentGatewayView />}

        {activeTab === 'mcp-gateway' && <McpGatewayView />}

        {activeTab === 'llm-gateway' && <LlmGatewayView />}

        {(activeTab === 'workflows-approvals' || activeTab === 'temporal') && <WorkflowsApprovalView />}

        {activeTab === 'knowledge' && <KnowledgeServiceView />}

        {activeTab === 'c4-architecture' && (
          <C4ArchitectureView onNavigateDoc={() => setActiveTab('architecture-doc')} />
        )}

        {activeTab === 'plane-codebase' && <CodebaseExplorerView />}

        {activeTab === 'local-m2-runner' && <LocalM2RunnerView onNavigateTab={setActiveTab} />}

        {activeTab === 'port-doctor' && <LocalM2RunnerView initialSubTab="port-doctor" onNavigateTab={setActiveTab} />}

        {activeTab === 'test-suite' && <TestSuiteView />}

        {activeTab === 'enterprise-review' && <EnterpriseReviewView />}
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <button 
              onClick={() => setActiveTab('website')} 
              className="font-bold text-white hover:text-amber-400 transition-colors"
              title="Open Solution Discovery"
            >
              light-weight-agentic-engineering
            </button>
            <span>·</span>
            <button 
              onClick={() => setActiveTab('c4-architecture')} 
              className="text-slate-300 hover:text-amber-400 transition-colors"
              title="Open C4 & System Design"
            >
              Enterprise 6-Plane Architecture
            </button>
            <span>·</span>
            <button 
              onClick={() => setActiveTab('local-m2-runner')} 
              className="text-amber-400 font-mono hover:underline transition-all flex items-center space-x-1"
              title="Open Mac M2 Runner & Port Doctor"
            >
              <span>Mac M2 Apple Silicon</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setActiveTab('architecture-doc')} className="hover:text-amber-400 transition-colors font-bold text-amber-400 flex items-center space-x-1">
              <span>📄 Architecture Spec & 6 Steps</span>
            </button>
            <button onClick={() => setActiveTab('temporal')} className="hover:text-amber-400 transition-colors font-medium">
              ⏱️ Temporal Engine (:7233)
            </button>
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
              Score: {OVERALL_ENTERPRISE_RATING}/10
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
