import React, { useState, useEffect } from 'react';
import { MCP_TOOLS_CATALOG, MCP_SERVERS_CATALOG } from '../data/mockData';
import { MCPTool, MCPServer, ToolExecutionAudit } from '../types';
import { McpExportModal } from './McpExportModal';
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
  Layers,
  Server,
  Filter,
  SlidersHorizontal,
  KeyRound,
  ExternalLink,
  Download,
  RotateCcw,
  Sparkles,
  Radio,
  FileJson,
  Lock,
  Eye,
  EyeOff,
  History,
  FileText
} from 'lucide-react';

const INITIAL_AUDIT_LOGS: ToolExecutionAudit[] = [
  {
    id: 'mcp-audit-101',
    timestamp: '10:02:14',
    toolId: 'tool-git-draft-pr',
    toolName: 'git_create_draft_pr',
    serverName: 'Git VCS MCP Server',
    actionClass: 'draft',
    durationMs: 94,
    status: 'SUCCESS',
    params: {
      repo: "light-weight-agentic/payment-core",
      branch: "feat/lw-4412-idempotency",
      title: "feat(payment): Redis idempotency lock decorator"
    },
    result: { pr_number: 128, state: "DRAFT (Zero-Trust Sandbox Protected)" }
  },
  {
    id: 'mcp-audit-100',
    timestamp: '09:58:30',
    toolId: 'tool-jira-read',
    toolName: 'jira_get_issue',
    serverName: 'Jira & Agile Lifecycle Server',
    actionClass: 'read',
    durationMs: 42,
    status: 'SUCCESS',
    params: { issueKey: "LW-4412" },
    result: { key: "LW-4412", status: "IN_PROGRESS", priority: "HIGH" }
  }
];

export const McpGatewayView: React.FC = () => {
  const [servers, setServers] = useState<MCPServer[]>(MCP_SERVERS_CATALOG);
  const [selectedServerId, setSelectedServerId] = useState<string | 'all'>('all');
  const [selectedTool, setSelectedTool] = useState<MCPTool>(MCP_TOOLS_CATALOG[1]); // git_create_draft_pr
  const [toolParams, setToolParams] = useState<string>(JSON.stringify({
    repo: "light-weight-agentic/payment-core",
    branch: "feat/lw-4412-idempotency",
    title: "feat(payment): Redis idempotency lock decorator",
    body: "Closes JIRA LW-4412. Adds atomic Redis SETNX lock with 30s TTL."
  }, null, 2));

  // Editor mode: Visual Form Generator vs Raw JSON
  const [editorMode, setEditorMode] = useState<'form' | 'json'>('form');
  const [executing, setExecuting] = useState(false);
  const [toolResult, setToolResult] = useState<any>(null);
  const [pingingServerId, setPingingServerId] = useState<string | null>(null);

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Audit history log
  const [auditLogs, setAuditLogs] = useState<ToolExecutionAudit[]>(INITIAL_AUDIT_LOGS);

  // Zero-Trust JIT Token simulation
  const [jitTtlSeconds, setJitTtlSeconds] = useState(285);
  const [jitRevoked, setJitRevoked] = useState(false);
  const [showRedactedPreview, setShowRedactedPreview] = useState(false);

  // TTL countdown timer
  useEffect(() => {
    if (jitRevoked) return;
    const interval = setInterval(() => {
      setJitTtlSeconds(prev => {
        if (prev <= 1) return 300;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [jitRevoked]);

  // Filter tools based on selected MCP Server tile
  const filteredTools = selectedServerId === 'all' 
    ? MCP_TOOLS_CATALOG 
    : MCP_TOOLS_CATALOG.filter(t => t.serverId === selectedServerId || t.category.toLowerCase() === selectedServerId.toLowerCase());

  const handleServerTileClick = (serverId: string) => {
    if (selectedServerId === serverId) {
      setSelectedServerId('all');
    } else {
      setSelectedServerId(serverId);
      // Auto-select first tool in this server
      const firstTool = MCP_TOOLS_CATALOG.find(t => t.serverId === serverId);
      if (firstTool) {
        handleToolSelect(firstTool);
      }
    }
  };

  const handlePingServer = (serverId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPingingServerId(serverId);
    setTimeout(() => {
      const newLatency = 12 + Math.floor(Math.random() * 22);
      setServers(prev => prev.map(s => s.id === serverId ? { ...s, latencyMs: newLatency, status: 'active' } : s));
      setPingingServerId(null);
    }, 400);
  };

  const handleToggleTransport = (serverId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setServers(prev => prev.map(s => s.id === serverId ? {
      ...s,
      transportMode: s.transportMode === 'sse' ? 'stdio' : 'sse'
    } : s));
  };

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

  // Safe parsing helper for form builder
  const getParsedParams = (): Record<string, any> => {
    try {
      return JSON.parse(toolParams);
    } catch {
      return {};
    }
  };

  const handleFormFieldChange = (key: string, value: any) => {
    const current = getParsedParams();
    current[key] = value;
    setToolParams(JSON.stringify(current, null, 2));
  };

  const handleExecuteTool = () => {
    if (jitRevoked) {
      alert("Execution blocked: Zero-Trust JIT token has been revoked. Generate a new token first.");
      return;
    }

    setExecuting(true);
    setToolResult(null);

    setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString();
      const auditId = `mcp-audit-${Date.now().toString().slice(-4)}`;

      if (selectedTool.actionClass === 'deploy') {
        // Gated by Temporal Approval Policy
        const haltedResult = {
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
          auditId
        };
        setToolResult(haltedResult);

        // Add to audit logs
        setAuditLogs(prev => [
          {
            id: auditId,
            timestamp: nowStr,
            toolId: selectedTool.id,
            toolName: selectedTool.name,
            serverName: selectedTool.serverName || selectedTool.category,
            actionClass: selectedTool.actionClass,
            durationMs: 38,
            status: 'POLICY_HALTED',
            params: getParsedParams(),
            result: haltedResult
          },
          ...prev
        ]);
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

        const duration = 65 + Math.floor(Math.random() * 45);
        const successResult = {
          status: "SUCCESS",
          toolName: selectedTool.name,
          actionClass: selectedTool.actionClass,
          durationMs: duration,
          output: toolOutput,
          auditId
        };
        setToolResult(successResult);

        // Add to audit logs
        setAuditLogs(prev => [
          {
            id: auditId,
            timestamp: nowStr,
            toolId: selectedTool.id,
            toolName: selectedTool.name,
            serverName: selectedTool.serverName || selectedTool.category,
            actionClass: selectedTool.actionClass,
            durationMs: duration,
            status: 'SUCCESS',
            params: getParsedParams(),
            result: successResult
          },
          ...prev
        ]);
      }
      setExecuting(false);
    }, 550);
  };

  const handleReplayAudit = (item: ToolExecutionAudit) => {
    const matchedTool = MCP_TOOLS_CATALOG.find(t => t.id === item.toolId);
    if (matchedTool) {
      setSelectedTool(matchedTool);
    }
    setToolParams(JSON.stringify(item.params, null, 2));
    setToolResult(null);
  };

  const formatMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parsedCurrentParams = getParsedParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Export Configuration Modal */}
      <McpExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        servers={servers}
        tools={MCP_TOOLS_CATALOG}
      />

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <Network className="w-6 h-6 text-sky-400" />
              <h2 className="text-xl font-bold text-white">MCP Gateway & Tool Integration Plane</h2>
              <span className="text-xs bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-500/40">
                Model Context Protocol v1.0
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>FastAPI Port :8080 Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mediates agent tool access through 6 isolated servers with dynamic transport selection, schema form generation, and audit replays.
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg border border-sky-500/30 flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export MCP Config</span>
            </button>
            <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">RPC:</span>
              <span className="text-sky-400 font-semibold">:8080/v1/tools/invoke</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zero-Trust JIT Token & Secrets Broker Ephemeral Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">Ephemeral Zero-Trust Token (JIT Broker):</span>
              {jitRevoked ? (
                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono font-bold">
                  REVOKED
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ACTIVE (TTL: {formatMinutes(jitTtlSeconds)})</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-xl">
              Scope: repo:read, git:draft_pr, jira:read · Token: tok_jit_sec_992a_***REDACTED***
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowRedactedPreview(!showRedactedPreview)}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 font-mono text-[11px] flex items-center space-x-1 transition-colors"
          >
            {showRedactedPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showRedactedPreview ? 'Hide Redaction' : 'Redaction Inspector'}</span>
          </button>
          {jitRevoked ? (
            <button
              onClick={() => {
                setJitRevoked(false);
                setJitTtlSeconds(300);
              }}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors"
            >
              Generate JIT Token
            </button>
          ) : (
            <button
              onClick={() => setJitRevoked(true)}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded text-xs font-semibold transition-colors"
            >
              Force Revoke
            </button>
          )}
        </div>
      </div>

      {showRedactedPreview && (
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
            <span>Inbound Secrets Broker Redaction Simulation:</span>
            <span className="text-emerald-400 font-bold">Zero-Leak Guarantee</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-red-400 block mb-1 font-bold">Raw Auth Context (Internal Container):</span>
              <code>Authorization: Bearer ghp_99214_internal_key_mac_m2_metal</code>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-emerald-500/30">
              <span className="text-emerald-400 block mb-1 font-bold">Scrubbed Egress to Telemetry / LLM:</span>
              <code>Authorization: Bearer [REDACTED_JIT_ZERO_TRUST_TOKEN]</code>
            </div>
          </div>
        </div>
      )}

      {/* Grouping of Configured MCP Servers Tiles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Configured MCP Servers ({servers.length} Running Adapters)
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">Filter View:</span>
            <button
              onClick={() => setSelectedServerId('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedServerId === 'all'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Show All ({MCP_TOOLS_CATALOG.length} Tools)
            </button>
          </div>
        </div>

        {/* MCP Server Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {servers.map((server) => {
            const isSelected = selectedServerId === server.id;
            const toolsForServer = MCP_TOOLS_CATALOG.filter(t => t.serverId === server.id);
            const serverToolCount = toolsForServer.length;
            const isPinging = pingingServerId === server.id;

            return (
              <div
                key={server.id}
                onClick={() => handleServerTileClick(server.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500 ring-2 ring-sky-500/40 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {server.category}
                    </span>
                    <button
                      onClick={(e) => handlePingServer(server.id, e)}
                      title="Ping Server"
                      className="flex items-center space-x-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isPinging ? 'animate-ping' : ''}`}></span>
                      <span>{isPinging ? 'pinging...' : `~${server.latencyMs || 20}ms`}</span>
                    </button>
                  </div>

                  <h4 className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                    {server.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {server.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Available:</span>
                    <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {serverToolCount} {serverToolCount === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>

                  {/* Transport protocol toggle */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span className="text-slate-400">Transport:</span>
                    <button
                      onClick={(e) => handleToggleTransport(server.id, e)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 transition-colors uppercase"
                      title="Click to toggle SSE / stdio"
                    >
                      {server.transportMode || 'sse'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Interface: Catalog & Interactive Tool Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tool Registry Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {selectedServerId === 'all' 
                  ? 'All Registered Tools:' 
                  : `Tools for ${servers.find(s => s.id === selectedServerId)?.name}:`}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} listed
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredTools.map((tool) => {
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
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white flex items-center space-x-1.5">
                      <Code className="w-3.5 h-3.5 text-sky-400" />
                      <span>{tool.name}</span>
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                      tool.actionClass === 'read' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      tool.actionClass === 'draft' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                      tool.actionClass === 'deploy' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {tool.actionClass}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{tool.description}</p>
                  
                  {/* Server grouping indicator pill */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Server className="w-2.5 h-2.5 text-sky-400" />
                      <span className="text-slate-300 font-medium">{tool.serverName || tool.category}</span>
                    </span>
                    <span className={tool.requiresApproval ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                      {tool.requiresApproval ? '⚠️ Requires Approval' : '✓ Auto Permitted'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Execution Sandbox with Visual Form Generator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 mb-4 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white font-mono">{selectedTool.name}</h4>
                  {selectedTool.serverName && (
                    <span className="text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded flex items-center space-x-1">
                      <Server className="w-2.5 h-2.5" />
                      <span>{selectedTool.serverName}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTool.endpoint}</p>
              </div>

              {/* Form vs JSON toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setEditorMode('form')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    editorMode === 'form'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Visual Form
                </button>
                <button
                  onClick={() => setEditorMode('json')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    editorMode === 'json'
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw JSON
                </button>
              </div>
            </div>

            {/* Input Parameter Editor */}
            {editorMode === 'form' ? (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="block text-[11px] font-mono text-slate-400 uppercase font-bold">
                  Generated Schema Inputs ({Object.keys(selectedTool.schemaParams).length} fields):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selectedTool.schemaParams).map(([paramKey, paramType]) => {
                    const val = parsedCurrentParams[paramKey] ?? '';
                    const isLongText = paramKey.toLowerCase().includes('body') || 
                                       paramKey.toLowerCase().includes('summary') || 
                                       paramKey.toLowerCase().includes('note');

                    if (isLongText) {
                      return (
                        <div key={paramKey} className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-mono font-bold text-slate-300">
                            {paramKey} <span className="text-slate-500 font-normal">({paramType})</span>
                          </label>
                          <textarea
                            rows={2}
                            value={typeof val === 'object' ? JSON.stringify(val) : val}
                            onChange={(e) => handleFormFieldChange(paramKey, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={paramKey} className="space-y-1">
                        <label className="text-[11px] font-mono font-bold text-slate-300">
                          {paramKey} <span className="text-slate-500 font-normal">({paramType})</span>
                        </label>
                        <input
                          type="text"
                          value={typeof val === 'object' ? JSON.stringify(val) : val}
                          onChange={(e) => handleFormFieldChange(paramKey, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Tool Invocation Parameters (JSON):</label>
                <textarea
                  rows={6}
                  value={toolParams}
                  onChange={(e) => setToolParams(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

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
                disabled={executing || jitRevoked}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center space-x-2 shadow-md shadow-sky-500/20"
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

          {/* Tool Call Replay & Audit Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tool Execution Replay & Audit Log ({auditLogs.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Persistent Ledger</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white">{log.toolName}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-2">
                      <span>{log.timestamp}</span>
                      <span>·</span>
                      <span>{log.durationMs}ms</span>
                      <span>·</span>
                      <span className="text-slate-500">{log.serverName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReplayAudit(log)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded font-mono text-[11px] flex items-center space-x-1 border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Replay</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
