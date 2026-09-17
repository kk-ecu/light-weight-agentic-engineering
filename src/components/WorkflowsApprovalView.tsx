import React, { useState } from 'react';
import { TEMPORAL_WORKFLOWS_SEED } from '../data/mockData';
import { TemporalWorkflow } from '../types';
import { TemporalDagViewer } from './TemporalDagViewer';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Play, 
  Check, 
  X, 
  FileText, 
  Workflow, 
  Activity,
  Layers,
  ArrowRight,
  Code,
  RotateCcw,
  Terminal,
  Server,
  Radio,
  Sparkles
} from 'lucide-react';

const SAMPLE_TEMPORAL_CODE = `# planes/workflow-plane/workflows/pr_review_workflow.py
from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    from activities.jira_activities import fetch_ticket_metadata, update_ticket_status
    from activities.agent_activities import invoke_agent_planner, execute_code_generation
    from activities.sandbox_activities import run_podman_sandbox_tests
    from activities.git_activities import push_branch, create_pull_request

@workflow.defn
class EngineeringPRWorkflow:
    """
    Durable state machine for autonomous Jira ticket implementation.
    Guarantees state persistence across worker restarts and Mac M2 sleeps.
    """
    def __init__(self) -> None:
        self.approval_decision: str | None = None
        self.is_approved: bool = False

    @workflow.signal
    def human_approval_signal(self, approved: bool) -> None:
        """Signal method invoked when human manager approves in UI."""
        self.is_approved = approved
        self.approval_decision = "APPROVED" if approved else "REJECTED"

    @workflow.run
    async def run(self, ticket_id: str, developer_id: str) -> dict:
        retry_policy = RetryPolicy(
            initial_interval=timedelta(seconds=1),
            backoff_coefficient=2.0,
            maximum_interval=timedelta(seconds=30),
            maximum_attempts=5,
        )

        # 1. Fetch Jira Ticket
        ticket = await workflow.execute_activity(
            fetch_ticket_metadata, ticket_id,
            start_to_close_timeout=timedelta(seconds=10),
            retry_policy=retry_policy,
        )

        # 2. Local Ollama LLM Inference on Mac M2 Metal GPU
        plan = await workflow.execute_activity(
            invoke_agent_planner, ticket,
            start_to_close_timeout=timedelta(seconds=60),
        )

        # 3. Podman Sandbox Test Execution
        test_results = await workflow.execute_activity(
            run_podman_sandbox_tests, plan["diff"],
            start_to_close_timeout=timedelta(seconds=120),
        )

        # 4. Human-in-the-Loop Temporal Approval Gate
        await workflow.wait_condition(lambda: self.approval_decision is not None)

        if not self.is_approved:
            return {"status": "REJECTED", "ticket_id": ticket_id}

        # 5. Push PR to Git
        pr = await workflow.execute_activity(
            create_pull_request, plan["branch_name"],
            start_to_close_timeout=timedelta(seconds=15),
        )

        return {"status": "COMPLETED", "pr_url": pr["url"]}`;

export const WorkflowsApprovalView: React.FC = () => {
  const [workflows, setWorkflows] = useState<TemporalWorkflow[]>(TEMPORAL_WORKFLOWS_SEED);
  const [selectedWorkflow, setSelectedWorkflow] = useState<TemporalWorkflow>(TEMPORAL_WORKFLOWS_SEED[1]); // The one awaiting approval
  const [approvalDecisionMade, setApprovalDecisionMade] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'dag' | 'code'>('queue');
  const [detailViewMode, setDetailViewMode] = useState<'timeline' | 'dag'>('timeline');

  const handleSignalDispatched = (signalName: string, payload: any) => {
    if (signalName === 'human_approval_signal') {
      if (payload.approved) {
        handleApprove(selectedWorkflow.id);
      } else {
        handleReject(selectedWorkflow.id);
      }
    } else if (signalName === 'pause_workflow_signal') {
      const updatedStep = 'Execution Paused via Signal (Temporal Checkpointer Active)';
      setWorkflows(prev => prev.map(wf => wf.id === selectedWorkflow.id ? { ...wf, currentStep: updatedStep } : wf));
      setSelectedWorkflow(prev => ({ ...prev, currentStep: updatedStep }));
    } else if (signalName === 'retry_activity_signal') {
      const updatedStep = 'Activity Retry Triggered via Signal (Resetting Exponential Backoff)';
      setWorkflows(prev => prev.map(wf => wf.id === selectedWorkflow.id ? { ...wf, currentStep: updatedStep } : wf));
      setSelectedWorkflow(prev => ({ ...prev, currentStep: updatedStep }));
    }
  };

  const handleApprove = (wfId: string) => {
    let updatedWf: TemporalWorkflow | null = null;
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === wfId) {
        updatedWf = {
          ...wf,
          status: 'COMPLETED',
          currentStep: 'Approved by Release Manager · Staging Deployment Triggered via ArgoCD',
          activities: [
            ...wf.activities.map(a => a.name === 'TemporalApprovalGate' ? { ...a, status: 'completed' as const, details: 'Human sign-off provided' } : a),
            { name: 'ArgoCDStagingSync', status: 'completed' as const, durationMs: 450, details: 'Pod deployed: agentic-web-m2-staging' }
          ],
          pendingApproval: undefined
        };
        return updatedWf;
      }
      return wf;
    }));

    if (updatedWf) {
      setSelectedWorkflow(updatedWf);
    }
    setApprovalDecisionMade('APPROVED');
  };

  const handleReject = (wfId: string) => {
    let updatedWf: TemporalWorkflow | null = null;
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === wfId) {
        updatedWf = {
          ...wf,
          status: 'FAILED',
          currentStep: 'Rejected by Human Approver (Release Cancelled)',
          activities: wf.activities.map(a => a.name === 'TemporalApprovalGate' ? { ...a, status: 'failed' as const, details: 'Sign-off denied by approver' } : a),
          pendingApproval: undefined
        };
        return updatedWf;
      }
      return wf;
    }));

    if (updatedWf) {
      setSelectedWorkflow(updatedWf);
    }
    setApprovalDecisionMade('REJECTED');
  };

  const handleTriggerNewWorkflow = () => {
    const newId = `wf_eng_auto_${Math.floor(Math.random() * 9000 + 1000)}`;
    const newWf: TemporalWorkflow = {
      id: newId,
      workflowType: 'EngineeringPRWorkflow',
      targetEntity: `PAY-449${workflows.length + 1}: Circuit Breaker Policy Automation`,
      initiatedBy: 'agent_task_orchestrator',
      startTime: new Date().toLocaleTimeString(),
      status: 'RUNNING',
      currentStep: 'Ollama Metal GPU Inference & AST Token Generation',
      activities: [
        { name: 'FetchJiraMetadata', status: 'completed', durationMs: 280, details: 'Validated DLP classification: Safe internal code' },
        { name: 'OllamaCodeGenInference', status: 'running', durationMs: 1420, details: 'Executing on Apple Silicon Metal GPU (qwen2.5-coder:7b)' }
      ]
    };

    setWorkflows([newWf, ...workflows]);
    setSelectedWorkflow(newWf);
    setApprovalDecisionMade(null);
  };

  const handleResetWorkflows = () => {
    setWorkflows(TEMPORAL_WORKFLOWS_SEED);
    setSelectedWorkflow(TEMPORAL_WORKFLOWS_SEED[1]);
    setApprovalDecisionMade(null);
  };

  const pendingCount = workflows.filter(w => w.status === 'WAITING_APPROVAL').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white">Temporal Workflows & Human Approvals</h2>
              {pendingCount > 0 && (
                <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/40 animate-pulse flex items-center space-x-1">
                  <span>●</span>
                  <span>{pendingCount} Sign-off Required</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Durable execution runtime guaranteeing zero state loss, activity retry policies, and Human-in-the-Loop gates.
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <button
              onClick={handleTriggerNewWorkflow}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Trigger New Workflow</span>
            </button>
            <button
              onClick={handleResetWorkflows}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center space-x-1.5 transition-all border border-slate-700"
              title="Reset sample workflows"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Telemetry & Sub-Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-[11px] font-mono flex-wrap gap-y-1">
            <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">gRPC Server:</span>
              <span className="text-emerald-400 font-semibold">localhost:7233</span>
            </div>
            <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 flex items-center space-x-1.5">
              <span className="text-slate-400">Web UI:</span>
              <span className="text-sky-400 font-semibold">localhost:8233</span>
            </div>
            <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 flex items-center space-x-1.5">
              <span className="text-slate-400">SDK:</span>
              <span className="text-amber-300 font-semibold">temporalio==1.7.0</span>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'queue'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Queue ({workflows.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('dag')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'dag'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Visual DAG & Signals</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Python Def</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'dag' ? (
        <TemporalDagViewer
          workflow={selectedWorkflow}
          onSignalDispatched={handleSignalDispatched}
        />
      ) : activeTab === 'code' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold text-white">planes/workflow-plane/workflows/pr_review_workflow.py</span>
            </div>
            <span className="text-[11px] text-slate-400">Temporalio Python SDK with @workflow.defn</span>
          </div>
          <div className="p-5 font-mono text-xs text-slate-200 bg-slate-950 overflow-x-auto whitespace-pre leading-relaxed">
            {SAMPLE_TEMPORAL_CODE}
          </div>
        </div>
      ) : (
      /* Main Layout: Workflow List & Detail/Approval View */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Workflows Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Temporal Workflows:</h3>
            <span className="text-xs text-slate-500 font-mono">{workflows.length} workflows</span>
          </div>

          <div className="space-y-2.5">
            {workflows.map((wf) => {
              const isSelected = selectedWorkflow.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => {
                    setSelectedWorkflow(wf);
                    setApprovalDecisionMade(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">{wf.workflowType}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      wf.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      wf.status === 'WAITING_APPROVAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                      wf.status === 'FAILED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}>
                      {wf.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{wf.targetEntity}</p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{wf.currentStep}</p>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>ID: {wf.id}</span>
                    <span>{wf.startTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Workflow Activity Timeline & Human-in-the-loop Approval Sign-off */}
        <div className="lg:col-span-7 space-y-5">
          {/* Approval Action Card (If pending) */}
          {selectedWorkflow.pendingApproval && (
            <div className="bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Human Approval Gate (Temporal Signal)</h4>
                    <p className="text-xs text-amber-300 font-mono">Sign-off ID: {selectedWorkflow.pendingApproval.approvalId}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded">
                  RISK: {selectedWorkflow.pendingApproval.riskLevel}
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2 mb-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Action Description:</span>
                  <span className="text-slate-200 font-medium">{selectedWorkflow.pendingApproval.action}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Scope & Diffs:</span>
                  <span className="text-slate-300">{selectedWorkflow.pendingApproval.diffSummary}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Authorized Approver: <strong className="text-white">{selectedWorkflow.pendingApproval.approverRole}</strong></span>
                  <span>Requested: {selectedWorkflow.pendingApproval.requestedAt}</span>
                </div>
              </div>

              {/* Approval Decision Controls */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  id="btn-reject-workflow"
                  onClick={() => handleReject(selectedWorkflow.id)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 font-semibold rounded-lg text-xs border border-red-500/30 transition-colors flex items-center space-x-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject Action</span>
                </button>
                <button
                  id="btn-approve-workflow"
                  onClick={() => handleApprove(selectedWorkflow.id)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Approve & Resume Workflow</span>
                </button>
              </div>
            </div>
          )}

          {approvalDecisionMade && (
            <div className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
              approvalDecisionMade === 'APPROVED' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800' : 'bg-red-950/40 text-red-300 border border-red-800'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Workflow signal dispatched: <strong>{approvalDecisionMade}</strong>. Temporal StateMachine updated.
              </span>
            </div>
          )}

          {/* Workflow Activities Execution Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Temporal Activity Execution History</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedWorkflow.targetEntity}</p>
              </div>
              <span className="font-mono text-xs text-slate-500">{selectedWorkflow.activities.length} activities</span>
            </div>

            <div className="space-y-3">
              {selectedWorkflow.activities.map((act, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="mt-0.5">
                    {act.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : act.status === 'running' ? (
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-white break-words">{act.name}</span>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">{act.durationMs}ms</span>
                    </div>
                    {act.details && <p className="text-slate-400 text-[11px] mt-1">{act.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
