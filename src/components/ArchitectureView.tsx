import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Terminal, 
  ChevronRight,
  RotateCcw,
  Cpu
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeSequence, setActiveSequence] = useState<'11.1' | '11.2' | '11.3'>('11.1');
  const [sequenceStep, setSequenceStep] = useState<number>(0);

  const sequenceFlows = {
    '11.1': {
      title: '11.1 Website AI Solution Discovery Flow',
      description: 'Customer inquiries on the public site are validated by the Policy Engine, enriched with verified knowledge via MCP, synthesized by Local Ollama, and converted into CRM leads.',
      steps: [
        { from: 'Website User', to: 'Web UI', action: 'User asks for best-fit enterprise agentic solution (e.g. Edge Concierge)', type: 'User Interaction' },
        { from: 'Web UI', to: 'App Service', action: 'Submit query request with session context', type: 'HTTP Post' },
        { from: 'App Service', to: 'Agent Gateway', action: 'Create AgentTask for Website Concierge Agent', type: 'FastAPI Dispatch' },
        { from: 'Agent Gateway', to: 'Policy Engine', action: 'Validate allowed action class for public user', type: 'Policy Pre-check' },
        { from: 'Policy Engine', to: 'Agent Gateway', action: 'Allow read-only advisory flow (least privilege)', type: 'Allow' },
        { from: 'Agent Gateway', to: 'MCP Gateway', action: 'Request solution taxonomy and case-study context', type: 'MCP Tool Call' },
        { from: 'Search / Knowledge', to: 'MCP Gateway', action: 'Return relevant architecture & CMS chunks', type: 'Normalized Chunks' },
        { from: 'MCP Gateway', to: 'Agent Gateway', action: 'Return sanitized tool response without leaked secrets', type: 'MCP Response' },
        { from: 'Agent Gateway', to: 'LLM Gateway', action: 'Synthesize recommendation using Local Ollama (llama3.2:3b)', type: 'Local Inference' },
        { from: 'LLM Gateway', to: 'Agent Gateway', action: 'Ranked recommendation, confidence score & CTA suggestions', type: 'LLM Output' },
        { from: 'Agent Gateway', to: 'Web UI', action: 'Render grounded response with citations & consultation button', type: 'UI Presentation' },
        { from: 'Web UI', to: 'MCP Gateway (CRM)', action: 'User clicks CTA -> Create lead in CRM under draft class', type: 'Lead Handoff' }
      ]
    },
    '11.2': {
      title: '11.2 Engineering PR Draft Flow',
      description: 'Engineers request automated implementation for Jira tickets. The Coding Agent queries the repo via MCP, generates code with Qwen 2.5 Coder, validates unit tests, and creates a Draft PR.',
      steps: [
        { from: 'Developer', to: 'Engineering Portal', action: 'Request implementation draft for ticket (e.g. JIRA LW-4412)', type: 'User Request' },
        { from: 'Engineering Portal', to: 'Workflow Service (Temporal)', action: 'Create EngineeringPRWorkflow durable execution', type: 'Temporal Start' },
        { from: 'Workflow Service', to: 'Agent Gateway', action: 'Start Coding Agent LangGraph execution', type: 'LangGraph Start' },
        { from: 'Agent Gateway', to: 'Policy Engine', action: 'Check permissions and task mode for developer role', type: 'Policy Hook' },
        { from: 'Policy Engine', to: 'Agent Gateway', action: 'Permit action class: draft (forbidden from merging to main)', type: 'Allow Draft' },
        { from: 'Agent Gateway', to: 'MCP Gateway', action: 'Retrieve Jira ticket and Git codebase context', type: 'MCP Tool Call' },
        { from: 'MCP Gateway', to: 'Jira & Git Providers', action: 'Fetch acceptance criteria and relevant source files', type: 'Enterprise Adapters' },
        { from: 'Agent Gateway', to: 'LLM Gateway', action: 'Generate implementation draft & Pytests via qwen2.5-coder:7b', type: 'Code Synthesis' },
        { from: 'Agent Gateway', to: 'Evaluation Service', action: 'Run static analysis, Pytest matrix, and groundedness audit', type: 'Eval Gate' },
        { from: 'Agent Gateway', to: 'MCP Gateway', action: 'Create feature branch and open Draft PR on GitHub', type: 'Draft PR Open' },
        { from: 'Workflow Service', to: 'Engineering Portal', action: 'Display Draft PR URL and test evidence to engineer', type: 'Workflow Complete' }
      ]
    },
    '11.3': {
      title: '11.3 Release Approval Flow (Human-in-the-Loop)',
      description: 'Release Manager initiates release readiness. The Release Agent aggregates build artifacts and scan reports, detects production promotion, and suspends execution for human sign-off.',
      steps: [
        { from: 'Release Manager', to: 'Engineering Portal', action: 'Request release readiness summary for Web Platform v1.4.0', type: 'Initiate Release' },
        { from: 'Engineering Portal', to: 'Workflow Service (Temporal)', action: 'Start WebsiteReleaseWorkflow state machine', type: 'Durable Workflow' },
        { from: 'Workflow Service', to: 'Agent Gateway', action: 'Assemble release evidence package via Release Agent', type: 'Agent Invocation' },
        { from: 'Agent Gateway', to: 'MCP Gateway', action: 'Fetch CI pipeline status and container image digest', type: 'CI/CD Status' },
        { from: 'MCP Gateway', to: 'Observability & Scanners', action: 'Query Prometheus p99 latency & Trivy security vulnerabilities', type: 'Health Check' },
        { from: 'Agent Gateway', to: 'Policy Engine', action: 'Check release action requirements for target environment', type: 'Policy Gate' },
        { from: 'Policy Engine', to: 'Agent Gateway', action: 'Action Class: deploy -> MANDATORY HUMAN APPROVAL REQUIRED', type: 'Approval Required' },
        { from: 'Agent Gateway', to: 'Workflow Service', action: 'Draft release dossier and register Temporal approval signal', type: 'Suspend & Signal' },
        { from: 'Workflow Service', to: 'Human Approver (Architect)', action: 'Present approval dossier with diffs in Approval Inbox', type: 'Human-in-the-Loop' },
        { from: 'Human Approver', to: 'Workflow Service', action: 'Architect signs off with digital signature and audit note', type: 'Approval Signal' },
        { from: 'Workflow Service', to: 'MCP Gateway', action: 'Trigger ArgoCD production synchronization', type: 'Promote Release' }
      ]
    }
  };

  const currentFlow = sequenceFlows[activeSequence];

  const handleNextStep = () => {
    if (sequenceStep < currentFlow.steps.length - 1) {
      setSequenceStep(sequenceStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (sequenceStep > 0) {
      setSequenceStep(sequenceStep - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Solution Architecture & Sequence Flows</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                light-weight-agentic-engineering Architecture Document v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Interactive visualization of the 6 architectural layers and end-to-end execution sequence flows.
            </p>
          </div>
        </div>
      </div>

      {/* Layered System Architecture Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          The 6 Core Architectural Layers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">1. Experience Layer</span>
              <span className="text-[10px] text-amber-400 font-mono">Next.js + TypeScript</span>
            </div>
            <p className="text-xs text-slate-400">Public Discovery Website, Engineering Portal, Chat UI, CMS UI.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">2. App & Workflow Layer</span>
              <span className="text-[10px] text-emerald-400 font-mono">Temporal + FastAPI</span>
            </div>
            <p className="text-xs text-slate-400">Durable state machines, Human-in-the-Loop approvals, async tasks.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 ring-1 ring-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-amber-300">3. AI Control Layer (Trio)</span>
              <span className="text-[10px] text-amber-400 font-mono">LangGraph + MCP + LLM</span>
            </div>
            <p className="text-xs text-slate-400">Agent Gateway, MCP Gateway, LLM Gateway (Ollama M2), Policy Engine.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">4. Knowledge & Artifacts</span>
              <span className="text-[10px] text-sky-400 font-mono">Postgres + pgvector</span>
            </div>
            <p className="text-xs text-slate-400">Architecture ADRs, CMS entries, repos, vector embeddings, runbooks.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">5. Enterprise Tooling</span>
              <span className="text-[10px] text-purple-400 font-mono">MCP Tool Adapters</span>
            </div>
            <p className="text-xs text-slate-400">Git Providers, Jira/Linear, CI/CD, CRM (Salesforce), Trivy scanners.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">6. Platform & Operations</span>
              <span className="text-[10px] text-emerald-400 font-mono">Podman + K8s + M2</span>
            </div>
            <p className="text-xs text-slate-400">Mac M2 local runtime, Podman containers, OpenTelemetry, Redis.</p>
          </div>
        </div>
      </div>

      {/* Interactive Sequence Flow Player */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block mb-1">
              Interactive Execution Sequence Player
            </span>
            <h3 className="text-base font-bold text-white">{currentFlow.title}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{currentFlow.description}</p>
          </div>

          {/* Sequence Selector Buttons */}
          <div className="flex space-x-2">
            {(['11.1', '11.2', '11.3'] as const).map((seq) => (
              <button
                key={seq}
                onClick={() => {
                  setActiveSequence(seq);
                  setSequenceStep(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeSequence === seq
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Flow {seq}
              </button>
            ))}
          </div>
        </div>

        {/* Step-by-Step Interactive Timeline */}
        <div className="space-y-3 mb-6">
          {currentFlow.steps.map((step, idx) => {
            const isCurrent = sequenceStep === idx;
            const isPast = sequenceStep > idx;
            return (
              <div
                key={idx}
                onClick={() => setSequenceStep(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                    : isPast
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-70'
                    : 'bg-slate-950 border-slate-800 opacity-40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5 text-xs">
                  <div className="flex flex-wrap items-center gap-2 font-mono">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isCurrent ? 'bg-amber-500 text-slate-950' : isPast ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white">{step.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-amber-300">{step.to}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 self-start sm:self-auto shrink-0">
                    {step.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 sm:ml-7 leading-relaxed">{step.action}</p>
              </div>
            );
          })}
        </div>

        {/* Step Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setSequenceStep(0)}
            className="text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Flow</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-mono text-[11px]">
              Step {sequenceStep + 1} of {currentFlow.steps.length}
            </span>
            <button
              onClick={handlePrevStep}
              disabled={sequenceStep === 0}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-lg font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={sequenceStep === currentFlow.steps.length - 1}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold rounded-lg"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
