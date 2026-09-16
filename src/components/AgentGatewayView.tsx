import React, { useState } from 'react';
import { AGENTS_CATALOG, MCP_TOOLS_CATALOG } from '../data/mockData';
import { AgentDefinition, MCPTool } from '../types';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Terminal, 
  Clock, 
  FileCode,
  ArrowRight,
  RefreshCw,
  RotateCcw,
  Wrench,
  HelpCircle,
  Code2,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const AgentGatewayView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition>(AGENTS_CATALOG[2]); // Default to Coding Agent
  const [inputTask, setInputTask] = useState('Implement idempotency key Redis decorator for payment endpoint (JIRA GENT-4412)');
  const [isRunning, setIsRunning] = useState(false);
  const [currentExecutingNode, setCurrentExecutingNode] = useState<string | null>(null);
  const [currentExecutingDomainIndex, setCurrentExecutingDomainIndex] = useState<number | null>(null);
  const [selectedDomainNodeIndex, setSelectedDomainNodeIndex] = useState<number | null>(0);
  const [simulateSelfHealingLoop, setSimulateSelfHealingLoop] = useState(true);
  const [cycleAttempt, setCycleAttempt] = useState(1);
  const [activeGraphView, setActiveGraphView] = useState<'canonical' | 'domain-specific'>('canonical');
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    "Agent Gateway initialized at port 8000.",
    "LangGraph StateGraph compiled with PostgreSQL checkpointer.",
    "Ready for agent execution."
  ]);

  const [stateSnapshot, setStateSnapshot] = useState<any>({
    session_id: "sess-lw-98214",
    user_id: "usr-eng-kmishra",
    user_role: "Senior Staff Engineer",
    task_type: "CodeScaffold",
    agent_id: AGENTS_CATALOG[2].id,
    intent: "Implement idempotency key Redis decorator for payment endpoint",
    policy_verdict: "allow (action_class: draft)",
    retrieved_chunks: 2,
    active_model: AGENTS_CATALOG[2].modelPreference,
    cycle_count: 0,
    status: "IDLE"
  });

  // Resolve matching MCP tool metadata for the selected agent
  const resolveToolDetails = (toolKey: string): { name: string; category: string; actionClass: string; endpoint: string; desc: string; requiresApproval: boolean } => {
    const matched = MCP_TOOLS_CATALOG.find(t => 
      t.id.includes(toolKey) || t.name.toLowerCase().includes(toolKey.toLowerCase().replace('_', ''))
    );
    if (matched) {
      return {
        name: matched.name,
        category: matched.category,
        actionClass: matched.actionClass,
        endpoint: matched.endpoint,
        desc: matched.description,
        requiresApproval: matched.requiresApproval
      };
    }
    // Generic fallback for tools listed in agent profile
    const isDeploy = toolKey.includes('deploy') || toolKey.includes('signal');
    const isDraft = toolKey.includes('draft') || toolKey.includes('create') || toolKey.includes('branch');
    return {
      name: toolKey,
      category: toolKey.split('_')[0].toUpperCase(),
      actionClass: isDeploy ? 'deploy' : isDraft ? 'draft' : 'read',
      endpoint: `mcp://${toolKey.replace('_', '-')}.internal/v1`,
      desc: `Scoped MCP tool interface for ${toolKey.replace(/_/g, ' ')}.`,
      requiresApproval: isDeploy
    };
  };

  const canonicalLangGraphNodes = [
    { 
      id: 'validate_intent', 
      label: '1. Validate Intent & Policy', 
      icon: ShieldCheck, 
      desc: 'Zero-Trust pre-flight check. Confirms role RBAC & action class before consuming compute.' 
    },
    { 
      id: 'retrieve_knowledge', 
      label: '2. Retrieve Knowledge (RAG)', 
      icon: Database, 
      desc: 'Fetches relevant vector embeddings and architecture ADRs from PostgreSQL pgvector.' 
    },
    { 
      id: 'llm_synthesis', 
      label: '3. LLM Synthesis', 
      icon: Cpu, 
      desc: 'Dispatches grounded prompt to Apple Silicon M2 Metal GPU (or routed model).' 
    },
    { 
      id: 'eval_gate', 
      label: '4. Evaluation & Test Gate', 
      icon: CheckCircle2, 
      desc: 'Executes automated unit tests, linter, & groundedness check. Loops back if failed!' 
    },
    { 
      id: 'tool_dispatch', 
      label: '5. Scoped Tool Dispatch', 
      icon: Workflow, 
      desc: 'Zero-Trust execution via MCP Gateway. Drafts PRs or commits without production access.' 
    }
  ];

  const handleRunExecution = () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionLogs([]);
    setCycleAttempt(1);
    const logs: string[] = [];

    const addLog = (msg: string) => {
      logs.push(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`);
      setExecutionLogs([...logs]);
    };

    addLog(`Initiating LangGraph execution for: ${selectedAgent.name}`);
    addLog(`Target task prompt: "${inputTask}"`);
    setCurrentExecutingNode('validate_intent');
    setCurrentExecutingDomainIndex(0);

    // Stage 1: Validate Intent / Step 1
    setTimeout(() => {
      addLog(`Node 1 (${canonicalLangGraphNodes[0].id} / ${selectedAgent.langGraphNodes[0]}): Querying MCP Policy Hook... Policy verdict: 'ALLOW (${selectedAgent.riskClass})'.`);
      setStateSnapshot((prev: any) => ({ ...prev, status: "VALIDATING_POLICY", policy_verdict: `allow (${selectedAgent.riskClass})` }));
      setCurrentExecutingNode('retrieve_knowledge');
      setCurrentExecutingDomainIndex(1);

      // Stage 2: Retrieve Knowledge / Step 2
      setTimeout(() => {
        addLog(`Node 2 (${canonicalLangGraphNodes[1].id} / ${selectedAgent.langGraphNodes[1]}): 3 relevant ADR chunks retrieved from pgvector (Similarity: 0.92, 0.89).`);
        setStateSnapshot((prev: any) => ({ ...prev, status: "RETRIEVING_DOCS", retrieved_chunks: 3 }));
        setCurrentExecutingNode('llm_synthesis');
        setCurrentExecutingDomainIndex(2);

        // Stage 3: LLM Synthesis / Step 3 (Attempt 1)
        setTimeout(() => {
          addLog(`Node 3 (${canonicalLangGraphNodes[2].id} / ${selectedAgent.langGraphNodes[2]} - Cycle #1): Executing on ${selectedAgent.modelPreference} via Apple Silicon Metal GPU.`);
          addLog("Inference generated 284 tokens in 82ms ($0.00 cost).");
          setStateSnapshot((prev: any) => ({ ...prev, status: "SYNTHESIZING", active_model: selectedAgent.modelPreference, cycle_count: 1 }));
          setCurrentExecutingNode('eval_gate');
          setCurrentExecutingDomainIndex(3);

          // Stage 4: Eval Gate / Step 4
          setTimeout(() => {
            if (simulateSelfHealingLoop) {
              // Simulate a test defect detected by EvalGate that triggers the cyclic loop!
              addLog(`Node 4 (${canonicalLangGraphNodes[3].id} / ${selectedAgent.langGraphNodes[3]} - Cycle #1): Test runner executed 6 tests: 5 Passed, 1 Failed (Redis connection timeout assertion).`);
              addLog("↺ [CYCLIC EDGE TRIGGERED]: Code defect detected in Node 4. LangGraph re-routes traceback back to Node 3 for automated self-correction!");
              setCycleAttempt(2);
              setCurrentExecutingNode('llm_synthesis');
              setCurrentExecutingDomainIndex(2);

              // Stage 3 Re-run (Attempt 2 with self-correction)
              setTimeout(() => {
                addLog(`Node 3 (${canonicalLangGraphNodes[2].id} / ${selectedAgent.langGraphNodes[2]} - Cycle #2 / Self-Healing): Ingested pytest failure traceback. Added connection retry backoff decorator.`);
                addLog("Re-synthesis completed in 79ms. Model patched Redis socket timeout handling.");
                setStateSnapshot((prev: any) => ({ ...prev, status: "SELF_HEALED", cycle_count: 2 }));
                setCurrentExecutingNode('eval_gate');
                setCurrentExecutingDomainIndex(3);

                // Stage 4 Re-evaluation
                setTimeout(() => {
                  addLog(`Node 4 (${canonicalLangGraphNodes[3].id} / ${selectedAgent.langGraphNodes[3]} - Cycle #2): Re-ran pytest suite: 6 of 6 tests PASSED (100% coverage). Groundedness score 0.98. Passing gate.`);
                  setCurrentExecutingNode('tool_dispatch');
                  setCurrentExecutingDomainIndex(4);

                  // Stage 5: Tool Dispatch
                  setTimeout(() => {
                    const primaryTool = selectedAgent.allowedTools[selectedAgent.allowedTools.length - 1];
                    addLog(`Node 5 (${canonicalLangGraphNodes[4].id} / ${selectedAgent.langGraphNodes[4]}): Invoking authorized MCP tool '${primaryTool}' via Zero-Trust MCP Gateway.`);
                    addLog("Draft Pull Request created: https://github.com/enterprise/core/pull/128");
                    addLog("LangGraph StateGraph reached END checkpoint. State saved to PostgreSQL.");
                    setStateSnapshot((prev: any) => ({
                      ...prev,
                      status: "COMPLETED",
                      pr_url: "https://github.com/enterprise/core/pull/128",
                      outcome: "Self-corrected patch with 6/6 tests passing."
                    }));
                    setCurrentExecutingNode(null);
                    setCurrentExecutingDomainIndex(null);
                    setIsRunning(false);
                  }, 650);
                }, 600);
              }, 750);
            } else {
              // Direct pass without simulated failure
              addLog(`Node 4 (${canonicalLangGraphNodes[3].id} / ${selectedAgent.langGraphNodes[3]}): All checks passed. Groundedness score: 0.99. No secrets leaked.`);
              setCurrentExecutingNode('tool_dispatch');
              setCurrentExecutingDomainIndex(4);

              setTimeout(() => {
                addLog(`Node 5 (${canonicalLangGraphNodes[4].id} / ${selectedAgent.langGraphNodes[4]}): Invoking MCP tool '${selectedAgent.allowedTools[0]}'.`);
                addLog("LangGraph StateGraph reached END checkpoint.");
                setStateSnapshot((prev: any) => ({ ...prev, status: "COMPLETED" }));
                setCurrentExecutingNode(null);
                setCurrentExecutingDomainIndex(null);
                setIsRunning(false);
              }, 650);
            }
          }, 600);
        }, 700);
      }, 600);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Workflow className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Agent Gateway Control Plane</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                LangGraph Cyclic Orchestrator (:8000)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manages the 6 specialized enterprise agents, enforces zero-trust MCP tool boundaries, and orchestrates cyclic self-healing graphs.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>FastAPI:</span>
            <span className="text-emerald-400 font-semibold">:8000/v1/agents/execute</span>
          </div>
        </div>
      </div>

      {/* 1. Agent Selector Grid (6 Specialized Agents) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Enterprise Agent Profiles (6 Dedicated Specialists):
          </h3>
          <span className="text-[11px] text-slate-500">
            Click any profile to inspect its scoped tools & system prompt
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AGENTS_CATALOG.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{agent.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    agent.riskClass === 'read_only' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                    agent.riskClass === 'draft_only' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {agent.riskClass}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{agent.description}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Model: {agent.modelPreference}</span>
                  <span className="text-amber-400/90 font-semibold">{agent.allowedTools.length} Scoped Tools</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Profile & Scoped MCP Tools Inspector for Selected Agent */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Profile Deep-Dive
              </span>
              <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
              <span className="text-xs text-slate-400">({selectedAgent.role})</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedAgent.description}</p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400 font-mono">Target Model:</span>
            <span className="text-xs font-mono bg-slate-950 text-amber-400 border border-slate-800 px-2.5 py-1 rounded">
              {selectedAgent.modelPreference}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
          {/* System Prompt & Guardrails */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                System Prompt & Persona Boundaries
              </h4>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
              {selectedAgent.systemPrompt}
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Trust Policy: Risk class is <strong>{selectedAgent.riskClass}</strong>. Direct shell or live production deploy is blocked.</span>
            </div>
          </div>

          {/* Scoped MCP Tools Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Authorized MCP Tools ({selectedAgent.allowedTools.length})
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Strict Least-Privilege</span>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {selectedAgent.allowedTools.map((toolKey) => {
                const details = resolveToolDetails(toolKey);
                return (
                  <div 
                    key={toolKey}
                    className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold text-emerald-400">{details.name}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                          {details.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{details.desc}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        details.actionClass === 'read' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                        details.actionClass === 'draft' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {details.actionClass.toUpperCase()}
                      </span>
                      {details.requiresApproval && (
                        <div className="text-[9px] text-amber-400 mt-1 font-mono">Requires HITL</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. The 5-Stage LangGraph Cyclic Architecture & Architectural Reason */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Why Every Agent Uses the 5-Stage Cyclic State Machine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Standard chains (DAGs) fail irreversibly when a bug occurs. Our 5-stage LangGraph machine uses a <strong>cyclic self-healing edge</strong>: if Node 4 (EvalGate) detects a failing test, it loops back to Node 3 to repair itself.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveGraphView('canonical')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeGraphView === 'canonical' 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Canonical 5-Stage Loop
            </button>
            <button
              onClick={() => setActiveGraphView('domain-specific')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeGraphView === 'domain-specific' 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Agent Domain Nodes ({selectedAgent.langGraphNodes.length})
            </button>
          </div>
        </div>

        {/* Node Diagram Visualizer */}
        <div className="mt-6">
          {activeGraphView === 'canonical' ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative">
                {canonicalLangGraphNodes.map((node, index) => {
                  const Icon = node.icon;
                  const isCurrent = currentExecutingNode === node.id;
                  const isSynthesis = node.id === 'llm_synthesis';
                  const isEval = node.id === 'eval_gate';

                  return (
                    <div
                      key={node.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[150px] relative ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 animate-pulse'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-start space-x-2 mb-2">
                          <div className="mt-0.5 shrink-0">
                            <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-slate-400'}`} />
                          </div>
                          <span className={`text-xs font-bold leading-snug ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                            {node.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{node.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                        {isCurrent ? (
                          <span className="text-amber-400 font-bold flex items-center space-x-1">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin shrink-0" />
                            <span>EXECUTING</span>
                          </span>
                        ) : (
                          <span>State Node #{index + 1}</span>
                        )}
                        {isEval && (
                          <span className="text-amber-400/90 font-bold flex items-center space-x-1">
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Loops back if bug</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cyclic Edge Callout with High-Contrast Colors */}
              <div className="mt-4 bg-slate-950 border-2 border-amber-500/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg shadow-black/40">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/40">
                    <RotateCcw className="w-4 h-4 animate-spin-reverse" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-300 text-xs tracking-wide block">
                      Cyclic Self-Healing Edge (Node 4 ➔ Node 3):
                    </span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      If automated tests fail in Node 4, LangGraph intercepts the test traceback and cyclically re-invokes Node 3 with the fix instructions before Node 5 is ever reached.
                    </p>
                  </div>
                </div>
                <label className="flex items-center space-x-2.5 cursor-pointer shrink-0 bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={simulateSelfHealingLoop}
                    onChange={(e) => setSimulateSelfHealingLoop(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-white">Simulate Test Defect & Loop</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {selectedAgent.langGraphNodes.map((nodeName, idx) => {
                  const isCurrent = currentExecutingDomainIndex === idx;
                  const isSelected = selectedDomainNodeIndex === idx;

                  return (
                    <div 
                      key={nodeName}
                      onClick={() => setSelectedDomainNodeIndex(idx)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[140px] relative ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20 animate-pulse'
                          : isSelected
                          ? 'bg-slate-900 border-amber-500/80 ring-1 ring-amber-500/40'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-amber-300' : 'text-amber-400'}`}>
                            Step {idx + 1} of {selectedAgent.langGraphNodes.length}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded animate-pulse">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">{nodeName}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {idx === 0 && "Inbound task parsing, schema validation, and tenant scoping."}
                          {idx === 1 && "Context query against pgvector with cosine similarity distance."}
                          {idx === 2 && `LLM synthesis using ${selectedAgent.modelPreference} on Apple Metal GPU.`}
                          {idx === 3 && "Automated test harness, schema linting, & cyclically enforced gates."}
                          {idx === 4 && "Zero-trust tool dispatch via MCP Gateway on port 8080."}
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-2 mt-2 flex items-center justify-between">
                        <span>Checkpointed</span>
                        <span className="text-emerald-400 font-bold">StateGraph</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Domain Node Inspector Detail Card */}
              {selectedDomainNodeIndex !== null && selectedAgent.langGraphNodes[selectedDomainNodeIndex] && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 font-mono text-xs">
                      #{selectedDomainNodeIndex + 1}
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[10px] uppercase block">Selected Domain State Node:</span>
                      <h4 className="font-bold text-white text-sm">
                        {selectedAgent.langGraphNodes[selectedDomainNodeIndex]}
                        <span className="text-slate-400 text-xs font-normal ml-2 font-mono">
                          (Handled by {selectedAgent.name})
                        </span>
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-300">
                    <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      Channel: <strong className="text-amber-400">MemorySaver / pg_checkpoints</strong>
                    </span>
                    <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      Isolation: <strong className="text-emerald-400">Zero-Trust Sandbox</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Task Trigger Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800">
          <input
            type="text"
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            disabled={isRunning}
            placeholder="Enter instruction for agent..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleRunExecution}
            disabled={isRunning || !inputTask}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 shrink-0"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing LangGraph (Cycle #{cycleAttempt})...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute LangGraph Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Execution Telemetry & State Checkpoint Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Execution Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gateway Execution Trace</h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">OpenTelemetry Traced</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-1.5">
            {executionLogs.map((log, i) => (
              <div key={i} className={`leading-relaxed ${log.includes('CYCLIC') ? 'text-amber-400 font-bold bg-amber-500/10 p-1 rounded' : ''}`}>
                <span className="text-amber-500/80">›</span> {log}
              </div>
            ))}
          </div>
        </div>

        {/* PostgreSQL State Checkpoint JSON Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">LangGraph Checkpoint (Postgres)</h4>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Durable State</span>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-300 h-64 overflow-y-auto leading-relaxed">
            {JSON.stringify(stateSnapshot, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
