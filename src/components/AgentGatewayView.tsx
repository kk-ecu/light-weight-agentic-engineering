import React, { useState } from 'react';
import { AGENTS_CATALOG } from '../data/mockData';
import { AgentDefinition } from '../types';
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
  RefreshCw
} from 'lucide-react';

export const AgentGatewayView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition>(AGENTS_CATALOG[2]); // Default to Coding Agent
  const [inputTask, setInputTask] = useState('Implement idempotency key Redis decorator for payment endpoint (JIRA GENT-4412)');
  const [isRunning, setIsRunning] = useState(false);
  const [currentExecutingNode, setCurrentExecutingNode] = useState<string | null>(null);
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
    intent: "Implement idempotency key Redis decorator for payment endpoint",
    policy_verdict: "allow (action_class: draft)",
    retrieved_chunks: 2,
    active_model: "ollama/qwen2.5-coder:7b",
    status: "IDLE"
  });

  const langGraphNodes = [
    { id: 'validate_intent', label: '1. Validate Intent & Policy', icon: ShieldCheck, desc: 'MCP Gateway policy hook check' },
    { id: 'retrieve_knowledge', label: '2. Retrieve Knowledge', icon: Database, desc: 'pgvector + hybrid search' },
    { id: 'llm_synthesis', label: '3. LLM Synthesis', icon: Cpu, desc: 'Local Ollama Mac M2 invocation' },
    { id: 'eval_gate', label: '4. Evaluation Gate', icon: CheckCircle2, desc: 'Groundedness & safety audit' },
    { id: 'tool_dispatch', label: '5. Tool Dispatch (Draft)', icon: Workflow, desc: 'MCP Draft PR / ticket update' }
  ];

  const handleRunExecution = () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionLogs([]);
    const logs: string[] = [];

    const addLog = (msg: string) => {
      logs.push(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`);
      setExecutionLogs([...logs]);
    };

    addLog(`Initiating LangGraph execution for agent: ${selectedAgent.name}`);
    addLog(`Task prompt: "${inputTask}"`);
    setCurrentExecutingNode('validate_intent');

    setTimeout(() => {
      addLog("Node 'validate_intent': Querying MCP Policy Hook... Passed. Action class: 'draft'.");
      setStateSnapshot((prev: any) => ({ ...prev, status: "VALIDATING_POLICY", policy_verdict: "allow (draft_only)" }));
      setCurrentExecutingNode('retrieve_knowledge');

      setTimeout(() => {
        addLog("Node 'retrieve_knowledge': 3 documents retrieved from pgvector (Cosine sim: 0.91, 0.88).");
        setStateSnapshot((prev: any) => ({ ...prev, status: "RETRIEVING_DOCS", retrieved_chunks: 3 }));
        setCurrentExecutingNode('llm_synthesis');

        setTimeout(() => {
          addLog(`Node 'llm_synthesis': Dispatching prompt to ${selectedAgent.modelPreference} on local Ollama M2.`);
          addLog("Inference completed in 84ms. 286 tokens generated at $0.00 cost.");
          setStateSnapshot((prev: any) => ({ ...prev, status: "SYNTHESIZED", active_model: selectedAgent.modelPreference }));
          setCurrentExecutingNode('eval_gate');

          setTimeout(() => {
            addLog("Node 'eval_gate': Evaluation score 0.97. No secrets leaked. Passing groundedness check.");
            setCurrentExecutingNode('tool_dispatch');

            setTimeout(() => {
              addLog("Node 'tool_dispatch': Invoking MCP tool 'git_create_draft_pr' with branch 'feat/lw-4412'.");
              addLog("Draft PR opened successfully: https://github.com/agentic/core/pull/128");
              addLog("LangGraph StateGraph reached END checkpoint.");
              setStateSnapshot((prev: any) => ({
                ...prev,
                status: "COMPLETED",
                pr_url: "https://github.com/agentic/core/pull/128",
                outcome: "Draft PR opened with 6 Pytests passing."
              }));
              setCurrentExecutingNode(null);
              setIsRunning(false);
            }, 600);
          }, 600);
        }, 750);
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
                LangGraph Cyclic Orchestrator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Central routing, session state persistence in PostgreSQL, intent policy pre-checks, and execution graphs.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>FastAPI:</span>
            <span className="text-emerald-400 font-semibold">:8000/v1/agents/execute</span>
          </div>
        </div>
      </div>

      {/* Agent Selector Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Select Active Enterprise Agent Profile:
        </h3>
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
                  <span>{agent.allowedTools.length} MCP tools</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive LangGraph Execution Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <span>LangGraph Cyclic State Machine Execution Flow</span>
          <span className="text-xs text-slate-400 font-normal">({selectedAgent.name})</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Every agent prompt transitions through this deterministic graph with state checkpoints stored in PostgreSQL.
        </p>

        {/* Node Diagram Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {langGraphNodes.map((node, index) => {
            const Icon = node.icon;
            const isCurrent = currentExecutingNode === node.id;
            return (
              <div
                key={node.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 animate-pulse'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                      {node.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{node.desc}</p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-slate-500">
                  {isCurrent ? (
                    <span className="text-amber-400 font-bold flex items-center space-x-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      <span>EXECUTING</span>
                    </span>
                  ) : (
                    <span>Checkpoint ready</span>
                  )}
                </div>
              </div>
            );
          })}
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
                <span>Executing Graph...</span>
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

      {/* Execution Telemetry & State Checkpoint Inspection */}
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
              <div key={i} className="leading-relaxed">
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
