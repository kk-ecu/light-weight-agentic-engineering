import React, { useState } from 'react';
import { MCP_TOOLS_CATALOG } from '../data/mockData';
import { MCPTool } from '../types';
import { 
  Network, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Play, 
  Code, 
  GitPullRequest, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';

export const McpGatewayView: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<MCPTool>(MCP_TOOLS_CATALOG[1]); // git_create_draft_pr
  const [toolParams, setToolParams] = useState<string>(JSON.stringify({
    repo: "light-weight-agentic/payment-core",
    branch: "feat/lw-4412-idempotency",
    title: "feat(payment): Redis idempotency lock decorator",
    body: "Closes JIRA LW-4412. Adds atomic Redis SETNX lock with 30s TTL."
  }, null, 2));

  const [executing, setExecuting] = useState(false);
  const [toolResult, setToolResult] = useState<any>(null);

  const handleToolSelect = (tool: MCPTool) => {
    setSelectedTool(tool);
    setToolResult(null);

    // Provide tailored pre-populated sample params for each registered adapter
    if (tool.id === 'tool-git-read') {
      setToolParams(JSON.stringify({
        repo: "light-weight-agentic/payment-core",
        path: "services/agent-gateway/app/idempotency.py",
        ref: "main"
      }, null, 2));
    } else if (tool.id === 'tool-git-draft-pr') {
      setToolParams(JSON.stringify({
        repo: "light-weight-agentic/payment-core",
        branch: "feat/lw-4412-idempotency",
        title: "feat(payment): Redis idempotency lock decorator",
        body: "Closes JIRA LW-4412. Adds atomic Redis SETNX lock with 30s TTL.",
        files: ["services/agent-gateway/app/idempotency.py", "tests/test_idempotency.py"]
      }, null, 2));
    } else if (tool.id === 'tool-jira-read') {
      setToolParams(JSON.stringify({
        issueKey: "LW-4412"
      }, null, 2));
    } else if (tool.id === 'tool-ci-status') {
      setToolParams(JSON.stringify({
        workflowRunId: "run-984214-pr128"
      }, null, 2));
    } else if (tool.id === 'tool-cms-read') {
      setToolParams(JSON.stringify({
        contentType: "architecture-adr",
        slug: "adr-007-pgvector-vs-standalone"
      }, null, 2));
    } else if (tool.id === 'tool-cms-draft') {
      setToolParams(JSON.stringify({
        entryId: "entry-arch-2026-09",
        payload: {
          title: "ADR-007 Update: Apple Silicon M2 Metal GPU Benchmarks",
          status: "DRAFT_STAGING"
        }
      }, null, 2));
    } else if (tool.id === 'tool-crm-lead') {
      setToolParams(JSON.stringify({
        company: "Stripe Enterprise Labs",
        contactEmail: "arch-lead@stripe.com",
        requirementSummary: "Evaluating local Mac M2 agentic engineering stack for 250 platform developers."
      }, null, 2));
    } else if (tool.id === 'tool-observability') {
      setToolParams(JSON.stringify({
        query: "rate(http_requests_total{status=~'5..'}[5m])",
        timeRange: "last_15m"
      }, null, 2));
    } else if (tool.id === 'tool-deploy-prod') {
      setToolParams(JSON.stringify({
        service: "agentic-web-frontend",
        imageTag: "ghcr.io/light-weight-agentic/web:v1.4.0-m2",
        releaseNote: "Agentic Web 1.4.0 release to production cluster with zero-downtime rolling update"
      }, null, 2));
    } else {
      setToolParams(JSON.stringify({
        target: "internal-cluster",
        filter: "active"
      }, null, 2));
    }
  };

  const handleExecuteTool = () => {
    setExecuting(true);
    setToolResult(null);

    setTimeout(() => {
      if (selectedTool.actionClass === 'deploy') {
        // Gated by Temporal Approval Policy
        setToolResult({
          status: "POLICY_HALTED",
          message: "Action class 'deploy' requires Human-in-the-Loop approval before execution.",
          policyCheck: {
            effect: "SUSPEND_AND_SIGNAL",
            rationale: "Production cluster modification cannot be executed autonomously by agents.",
            temporalSignalDispatched: true,
            approvalId: "APPR-REL-9921",
            approverRole: "Release Manager / Platform Architect",
            targetService: "agentic-web-frontend",
            imageTag: "ghcr.io/light-weight-agentic/web:v1.4.0-m2"
          },
          auditId: `mcp-audit-${Date.now()}`
        });
      } else {
        // Dynamic realistic output per tool
        let toolOutput: any = {};
        if (selectedTool.id === 'tool-git-read') {
          toolOutput = {
            repo: "light-weight-agentic/payment-core",
            sha: "7f9b2c140928e",
            lines: 142,
            contentSnippet: "def idempotent_request(redis_client: Redis, ttl_seconds: int = 60): ...",
            commitAuthor: "platform-bot@internal"
          };
        } else if (selectedTool.id === 'tool-git-draft-pr') {
          toolOutput = {
            pr_number: 128,
            pr_url: "https://github.com/light-weight-agentic/payment-core/pull/128",
            branch: "feat/lw-4412-idempotency",
            diffStats: "+84 lines, -2 lines, 6 tests added",
            reviewers: ["senior-architect", "platform-lead"],
            state: "DRAFT (Zero-Trust Sandbox Protected)"
          };
        } else if (selectedTool.id === 'tool-jira-read') {
          toolOutput = {
            key: "LW-4412",
            summary: "Implement idempotency key Redis decorator for payment endpoint",
            status: "IN_PROGRESS",
            priority: "HIGH",
            assignee: "Coding Agent (Automated)",
            acceptanceCriteria: [
              "Atomic lock using Redis SETNX with configurable TTL",
              "6 unit tests covering concurrent conflict handling",
              "Draft PR opened against feature branch"
            ]
          };
        } else if (selectedTool.id === 'tool-ci-status') {
          toolOutput = {
            workflowRunId: "run-984214-pr128",
            status: "SUCCESS",
            conclusion: "COMPLETED",
            durationSeconds: 38,
            tests: { total: 48, passed: 48, failed: 0 },
            sha: "88a4c102bf9"
          };
        } else if (selectedTool.id === 'tool-cms-read') {
          toolOutput = {
            slug: "adr-007-pgvector-vs-standalone",
            title: "ADR-007: PostgreSQL pgvector vs Standalone Vector DB",
            verdict: "APPROVED",
            relevanceScore: 0.96
          };
        } else if (selectedTool.id === 'tool-cms-draft') {
          toolOutput = {
            status: "DRAFT_SAVED",
            entryId: "entry-arch-2026-09",
            environment: "staging-preview",
            url: "https://preview.cms.internal/entries/entry-arch-2026-09"
          };
        } else if (selectedTool.id === 'tool-crm-lead') {
          toolOutput = {
            leadId: "lead-sf-90214",
            crmSystem: "Salesforce Enterprise",
            status: "DISCOVERY_SCHEDULED",
            company: "Stripe Enterprise Labs",
            attribution: "Agentic Engineering Portal (Zero-Trust Web Concierge)"
          };
        } else if (selectedTool.id === 'tool-observability') {
          toolOutput = {
            query: "rate(http_requests_total{status=~'5..'}[5m])",
            resultType: "vector",
            metricValue: 0.000,
            status: "HEALTHY",
            cluster: "Mac M2 Local Sandbox / Production Replica"
          };
        } else {
          toolOutput = {
            data: "MCP Tool executed successfully within least-privilege sandbox adapter."
          };
        }

        setToolResult({
          status: "SUCCESS",
          toolName: selectedTool.name,
          actionClass: selectedTool.actionClass,
          durationMs: 82 + Math.floor(Math.random() * 45),
          output: toolOutput,
          auditId: `mcp-audit-${Date.now()}`
        });
      }
      setExecuting(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Network className="w-6 h-6 text-sky-400" />
              <h2 className="text-xl font-bold text-white">MCP Gateway & Tool Registry</h2>
              <span className="text-xs bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-500/40">
                Model Context Protocol v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mediates all agent tool access with capability-based isolation, policy enforcement, and audit logs.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>FastAPI:</span>
            <span className="text-sky-400 font-semibold">:8080/v1/tools/invoke</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface: Catalog & Interactive Tool Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tool Registry Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered MCP Adapters:</h3>
            <span className="text-xs text-slate-500 font-mono">{MCP_TOOLS_CATALOG.length} adapters active</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {MCP_TOOLS_CATALOG.map((tool) => {
              const isSelected = selectedTool.id === tool.id;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolSelect(tool)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">{tool.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      tool.actionClass === 'read' ? 'bg-slate-800 text-slate-300' :
                      tool.actionClass === 'draft' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                    }`}>
                      {tool.actionClass}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{tool.description}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Category: {tool.category}</span>
                    <span>{tool.requiresApproval ? '⚠️ Requires Approval' : '✓ Auto Permitted'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Tool Playground & Policy Hook Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white font-mono">{selectedTool.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTool.endpoint}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Action Class:</span>
                <span className="text-xs font-mono font-bold text-sky-400 uppercase bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  {selectedTool.actionClass}
                </span>
              </div>
            </div>

            {/* Parameter Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Tool Invocation Parameters (JSON):</label>
              <textarea
                rows={5}
                value={toolParams}
                onChange={(e) => setToolParams(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Policy Pre-check Notice */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-start space-x-2.5">
              {selectedTool.requiresApproval ? (
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="text-slate-300">
                <span className="font-semibold text-white">Policy Engine Guardrail:</span>{' '}
                {selectedTool.requiresApproval
                  ? "This tool performs modifications classified under 'deploy'. The MCP Gateway will halt execution and dispatch a Temporal signal to human approvers."
                  : "This tool operates under least-privilege 'read' or 'draft' classes. Execution is permitted without human approval."}
              </div>
            </div>

            {/* Invoke Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleExecuteTool}
                disabled={executing}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center space-x-2"
              >
                {executing ? (
                  <span>Invoking MCP Adapter...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Invoke MCP Tool</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Execution Result Box */}
          {toolResult && (
            <div className={`p-5 rounded-2xl border transition-all ${
              toolResult.status === 'POLICY_HALTED'
                ? 'bg-amber-950/20 border-amber-500/50'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 text-xs">
                <div className="flex items-center space-x-2">
                  {toolResult.status === 'POLICY_HALTED' ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-amber-400">Execution Suspended by Policy Gate</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-400">MCP Adapter Execution Completed</span>
                    </>
                  )}
                </div>
                <span className="font-mono text-slate-500 text-[10px]">{toolResult.auditId}</span>
              </div>

              <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-3.5 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(toolResult, null, 2)}
              </pre>

              {toolResult.status === 'POLICY_HALTED' && (
                <div className="mt-3 text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 flex items-center justify-between">
                  <span>Awaiting approval in Temporal Approval Inbox.</span>
                  <span className="font-bold font-mono">ID: {toolResult.policyCheck.approvalId}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
