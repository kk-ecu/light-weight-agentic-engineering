import React, { useState } from 'react';
import { TemporalWorkflow } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Database, 
  Cpu, 
  ShieldCheck, 
  GitPullRequest, 
  Radio, 
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  Terminal,
  HelpCircle
} from 'lucide-react';

interface TemporalDagViewerProps {
  workflow: TemporalWorkflow;
  onSignalDispatched: (signalName: string, payload: any) => void;
  onQueryExecuted?: (queryName: string) => any;
}

export const TemporalDagViewer: React.FC<TemporalDagViewerProps> = ({
  workflow,
  onSignalDispatched
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('approval_gate');
  const [activeSignal, setActiveSignal] = useState<'approve' | 'reject' | 'pause' | 'retry'>('approve');
  const [activeQuery, setActiveQuery] = useState<'state' | 'history' | 'memory' | 'pending'>('state');
  const [queryOutput, setQueryOutput] = useState<any>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [signalLogs, setSignalLogs] = useState<Array<{ timestamp: string; type: string; payload: string; status: string }>>([
    {
      timestamp: '10:04:12',
      type: 'WorkflowExecutionStarted',
      payload: `WorkflowType=${workflow.workflowType}, RunId=run-8219`,
      status: 'ACK_200'
    }
  ]);

  // Directed Acyclic Graph (DAG) node definitions representing Temporal activities
  const dagNodes = [
    {
      id: 'jira_fetch',
      label: 'Fetch Jira Metadata',
      plane: 'Knowledge / Ticket',
      activity: 'fetch_ticket_metadata',
      icon: Database,
      status: workflow.status === 'RUNNING' && workflow.activities.length === 1 ? 'running' : 'completed',
      duration: '280ms',
      input: { ticketId: 'LW-4412', filter: 'acceptance_criteria' },
      output: { summary: 'Redis idempotency decorator', priority: 'HIGH', status: 'IN_PROGRESS' }
    },
    {
      id: 'agent_planner',
      label: 'Ollama M2 Code Gen',
      plane: 'Agent Control Plane',
      activity: 'invoke_agent_planner',
      icon: Cpu,
      status: workflow.status === 'RUNNING' && workflow.activities.length === 2 ? 'running' : 
              workflow.status === 'RUNNING' && workflow.activities.length === 1 ? 'pending' : 'completed',
      duration: '1,420ms',
      input: { model: 'qwen2.5-coder:7b-instruct', context: 'Apple Silicon Metal GPU' },
      output: { diffLines: 84, branch: 'feat/lw-4412-idempotency', testCount: 6 }
    },
    {
      id: 'podman_tests',
      label: 'Podman Sandbox Test',
      plane: 'Operations & Sandbox',
      activity: 'run_podman_sandbox_tests',
      icon: ShieldCheck,
      status: workflow.status === 'RUNNING' && workflow.activities.length <= 2 ? 'pending' : 'completed',
      duration: '890ms',
      input: { container: 'sandbox-python311:slim', testCommand: 'pytest tests/test_idempotency.py' },
      output: { testsPassed: 6, exitCode: 0, memoryPeakMb: 142 }
    },
    {
      id: 'approval_gate',
      label: 'Temporal Approval Gate',
      plane: 'Workflow Engine',
      activity: 'wait_condition(Signal)',
      icon: Radio,
      status: workflow.status === 'WAITING_APPROVAL' ? 'waiting' : 
              workflow.status === 'COMPLETED' ? 'completed' : 
              workflow.status === 'FAILED' ? 'failed' : 'pending',
      duration: workflow.status === 'COMPLETED' ? '4.2s (Human)' : 'In Progress',
      input: { signalChannel: 'human_approval_signal', approverRole: 'Platform Architect' },
      output: workflow.status === 'COMPLETED' ? { verdict: 'APPROVED', approver: 'kundan.mishra' } : 
              workflow.status === 'FAILED' ? { verdict: 'REJECTED', reason: 'Security Policy' } : { state: 'WAITING_FOR_SIGNAL' }
    },
    {
      id: 'git_pr',
      label: 'Create Git Pull Request',
      plane: 'Tool Integration (MCP)',
      activity: 'create_pull_request',
      icon: GitPullRequest,
      status: workflow.status === 'COMPLETED' ? 'completed' : 'pending',
      duration: workflow.status === 'COMPLETED' ? '340ms' : '0ms',
      input: { repo: 'payment-core', targetBranch: 'main' },
      output: workflow.status === 'COMPLETED' ? { prNumber: 128, url: 'https://github.com/internal/pr/128' } : { state: 'UNTRIGGERED' }
    }
  ];

  const selectedNode = dagNodes.find(n => n.id === selectedNodeId) || dagNodes[3];

  const handleSendSignal = () => {
    setIsDispatching(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      let signalName = 'human_approval_signal';
      let payloadObj: any = { approved: true };

      if (activeSignal === 'approve') {
        signalName = 'human_approval_signal';
        payloadObj = { approved: true, approver: 'kundan.mishra5@gmail.com', role: 'Platform Architect' };
      } else if (activeSignal === 'reject') {
        signalName = 'human_approval_signal';
        payloadObj = { approved: false, reason: 'Policy verification required' };
      } else if (activeSignal === 'pause') {
        signalName = 'pause_workflow_signal';
        payloadObj = { pauseDurationSec: 3600, reason: 'Manual audit inspection' };
      } else if (activeSignal === 'retry') {
        signalName = 'retry_activity_signal';
        payloadObj = { targetActivity: 'run_podman_sandbox_tests', resetBackoff: true };
      }

      onSignalDispatched(signalName, payloadObj);

      setSignalLogs(prev => [
        {
          timestamp: now,
          type: `Signal::${signalName}`,
          payload: JSON.stringify(payloadObj),
          status: 'DELIVERED_GRPC'
        },
        ...prev
      ]);
      setIsDispatching(false);
    }, 400);
  };

  const handleExecuteQuery = () => {
    let result: any = {};
    if (activeQuery === 'state') {
      result = {
        query: 'getWorkflowState',
        workflowId: workflow.id,
        runId: 'run-8219-482a',
        executionState: workflow.status,
        currentStep: workflow.currentStep,
        isBlockedOnSignal: workflow.status === 'WAITING_APPROVAL',
        retryAttempts: 0
      };
    } else if (activeQuery === 'history') {
      result = {
        query: 'getExecutionHistory',
        eventCount: workflow.activities.length * 3 + 2,
        firstEvent: 'WorkflowExecutionStarted',
        latestEvent: workflow.status === 'WAITING_APPROVAL' ? 'ActivityTaskScheduled (Gate)' : 'WorkflowExecutionCompleted',
        durableCheckpoints: 4
      };
    } else if (activeQuery === 'memory') {
      result = {
        query: 'getMemoryFootprint',
        statePayloadBytes: 2480,
        workerThread: 'mac_m2_worker_pool_0',
        metalGpuActive: false,
        rssMb: 68.4
      };
    } else {
      result = {
        query: 'getPendingDecisions',
        pendingSignal: workflow.pendingApproval ? {
          approvalId: workflow.pendingApproval.approvalId,
          action: workflow.pendingApproval.action,
          risk: workflow.pendingApproval.riskLevel
        } : null
      };
    }
    setQueryOutput(result);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Visual DAG Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Interactive Temporal State DAG (Durable Activity Flow)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click any node in the execution graph to inspect activity inputs, payloads, and replay states.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Completed</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Waiting Signal</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              <span>Pending</span>
            </span>
          </div>
        </div>

        {/* DAG Flow Diagram */}
        <div className="relative overflow-x-auto py-4 px-2">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {dagNodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const IconComp = node.icon;

              const getStatusStyle = () => {
                if (node.status === 'completed') {
                  return 'border-emerald-500/60 bg-emerald-950/20 text-emerald-400 shadow-emerald-500/10';
                }
                if (node.status === 'waiting') {
                  return 'border-amber-500 bg-amber-950/30 text-amber-300 ring-2 ring-amber-500/40 animate-pulse';
                }
                if (node.status === 'running') {
                  return 'border-sky-500 bg-sky-950/30 text-sky-300 ring-2 ring-sky-500/40 animate-pulse';
                }
                if (node.status === 'failed') {
                  return 'border-red-500 bg-red-950/30 text-red-300';
                }
                return 'border-slate-800 bg-slate-950/80 text-slate-500';
              };

              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`flex-1 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${getStatusStyle()} ${
                      isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold bg-slate-900 border border-slate-800">
                        {node.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white truncate">{node.label}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{node.plane}</p>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Step {index + 1}</span>
                      <span className="text-white font-bold">{node.duration}</span>
                    </div>
                  </div>

                  {index < dagNodes.length - 1 && (
                    <div className="flex items-center justify-center text-slate-600 px-1">
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Activity Inspection Drawer */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-amber-400 font-bold">@workflow.activity:</span>
              <span className="font-mono text-xs font-bold text-white">{selectedNode.activity}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Plane: {selectedNode.plane}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Activity Duration: {selectedNode.duration}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">Activity Input Arguments:</span>
              <pre className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg font-mono text-[11px] text-sky-300 overflow-x-auto">
                {JSON.stringify(selectedNode.input, null, 2)}
              </pre>
            </div>
            <div>
              <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">Activity Output State / Return:</span>
              <pre className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg font-mono text-[11px] text-emerald-300 overflow-x-auto">
                {JSON.stringify(selectedNode.output, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Temporal Signal & Query Dispatcher Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Signal Dispatcher */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Radio className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Temporal Signal Dispatcher (External Triggers)
            </h4>
          </div>

          <p className="text-xs text-slate-400">
            Dispatches gRPC signals directly to the running Temporal Workflow state machine without restarting the process.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveSignal('approve')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeSignal === 'approve'
                  ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>human_approval(true)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Signals approval gate to resume deployment.</p>
            </button>

            <button
              onClick={() => setActiveSignal('reject')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeSignal === 'reject'
                  ? 'bg-red-950/40 border-red-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span>human_approval(false)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Halts release and transitions to FAILED state.</p>
            </button>

            <button
              onClick={() => setActiveSignal('pause')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeSignal === 'pause'
                  ? 'bg-amber-950/40 border-amber-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>pause_workflow()</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Freezes activity timer indefinitely.</p>
            </button>

            <button
              onClick={() => setActiveSignal('retry')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeSignal === 'retry'
                  ? 'bg-sky-950/40 border-sky-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>retry_activity()</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Forces backoff retry on transient failure.</p>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-slate-400">Target ID: {workflow.id}</span>
            <button
              onClick={handleSendSignal}
              disabled={isDispatching}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDispatching ? 'Transmitting gRPC Signal...' : 'Dispatch Signal'}</span>
            </button>
          </div>
        </div>

        {/* Query Dispatcher & Signal Logs */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Temporal Query Inspector & Signal Stream
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={activeQuery}
              onChange={(e: any) => setActiveQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-500 flex-1"
            >
              <option value="state">@workflow.query: getWorkflowState</option>
              <option value="history">@workflow.query: getExecutionHistory</option>
              <option value="memory">@workflow.query: getMemoryFootprint</option>
              <option value="pending">@workflow.query: getPendingDecisions</option>
            </select>
            <button
              onClick={handleExecuteQuery}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1 transition-colors"
            >
              <span>Execute</span>
            </button>
          </div>

          {/* Query Output View */}
          {queryOutput && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 max-h-36 overflow-y-auto">
              <pre>{JSON.stringify(queryOutput, null, 2)}</pre>
            </div>
          )}

          {/* Real-time Signal Event History */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Signal & Event Audit Stream:</span>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-y-1.5 max-h-36 overflow-y-auto text-[10px] font-mono">
              {signalLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300 border-b border-slate-800/40 pb-1 last:border-0 last:pb-0">
                  <span className="text-slate-500">{log.timestamp}</span>
                  <span className="text-amber-300 truncate max-w-[180px]">{log.type}</span>
                  <span className="text-emerald-400">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
