import { AgentDefinition, MCPTool, TemporalWorkflow, KnowledgeDocument, LLMRouteConfig } from '../types';

export const AGENTS_CATALOG: AgentDefinition[] = [
  {
    id: 'agent-website',
    name: 'Website Concierge Agent',
    role: 'Customer Solution Discovery & Engagement',
    category: 'Customer',
    description: 'Guides enterprise visitors on light-weight-agentic-engineering solutions, performs interactive discovery, and drafts CRM inquiries.',
    systemPrompt: 'You are the Public AI Concierge Agent for light-weight-agentic-engineering. Provide clear, grounded advice on platform architecture, enterprise scalability, and local M2 capabilities using only verified knowledge.',
    allowedTools: ['knowledge_search', 'cms_read', 'crm_lead_create'],
    riskClass: 'read_only',
    modelPreference: 'llama3.2:3b',
    langGraphNodes: ['ParseIntent', 'PolicyCheck', 'RetrieveContext', 'SynthesizeResponse', 'FormatCTA']
  },
  {
    id: 'agent-architect',
    name: 'Architect Agent',
    role: 'System Design & Tradeoff Analysis',
    category: 'Engineering',
    description: 'Synthesizes enterprise system architectures, evaluates non-functional requirements, generates C4 diagrams and ADR drafts.',
    systemPrompt: 'You are the Enterprise Solutions Architect Agent for light-weight-agentic-engineering. Analyze architectural requirements, evaluate trade-offs between local Ollama and cloud services, and generate compliant ADRs.',
    allowedTools: ['knowledge_search', 'repo_read', 'confluence_read', 'confluence_draft'],
    riskClass: 'draft_only',
    modelPreference: 'qwen2.5-coder:7b',
    langGraphNodes: ['ParseNFRs', 'QueryArchitectureDB', 'EvaluateTradeoffs', 'DraftADR', 'EvalGroundedness']
  },
  {
    id: 'agent-coding',
    name: 'Coding Agent',
    role: 'Scaffolding & PR Drafting',
    category: 'Engineering',
    description: 'Ingests Jira tickets, analyzes codebase semantics via MCP, writes unit tests and opens draft pull requests.',
    systemPrompt: 'You are the Coding Agent for light-weight-agentic-engineering. Write clean, idiomatic code adhering to PEP 8 / TypeScript guidelines. Always produce unit tests alongside implementation. Write draft PRs only.',
    allowedTools: ['git_read', 'git_branch', 'git_draft_pr', 'jira_read'],
    riskClass: 'draft_only',
    modelPreference: 'qwen2.5-coder:7b',
    langGraphNodes: ['IngestJiraTicket', 'ExploreCodebase', 'GenerateCodePatch', 'RunUnitTests', 'CreateDraftPR']
  },
  {
    id: 'agent-qa',
    name: 'QA & Test Agent',
    role: 'Test Generation & Defect Triage',
    category: 'Engineering',
    description: 'Generates Playwright / Pytest test matrices, verifies boundary conditions, and triages test failures from CI pipelines.',
    systemPrompt: 'You are the QA Agent for light-weight-agentic-engineering. Scrutinize code changes for regressions, edge cases, and compliance gaps. Generate test suites with high semantic coverage.',
    allowedTools: ['ci_fetch_logs', 'git_read', 'jira_update', 'knowledge_search'],
    riskClass: 'read_only',
    modelPreference: 'mistral:7b',
    langGraphNodes: ['AnalyzeDiff', 'DeriveTestScenarios', 'GeneratePytestSuite', 'ReportCoverage']
  },
  {
    id: 'agent-release',
    name: 'Release & Approval Agent',
    role: 'Release Package Assembly & Human-in-the-Loop Sign-off',
    category: 'Platform',
    description: 'Consolidates build artifacts, security scan reports, and observability metrics to assemble release dossiers requiring human approval.',
    systemPrompt: 'You are the Release Gate Agent for light-weight-agentic-engineering. Verify all SOC2 and deployment gates. Package release artifacts and dispatch human approval signals via Temporal.',
    allowedTools: ['ci_fetch_status', 'scanner_fetch_vulns', 'observability_query', 'temporal_signal'],
    riskClass: 'human_approval_required',
    modelPreference: 'llama3.2:3b',
    langGraphNodes: ['AggregateEvidence', 'CheckSecurityGates', 'VerifyHealthMetrics', 'GenerateReleaseDossier', 'AwaitHumanSignoff']
  },
  {
    id: 'agent-sre',
    name: 'SRE & Incident Agent',
    role: 'Telemetry Diagnosis & Runbook Assistant',
    category: 'Platform',
    description: 'Correlates OpenTelemetry traces, Prometheus metrics, and Loki logs during alerts, suggesting remediation runbooks.',
    systemPrompt: 'You are the SRE Agent for light-weight-agentic-engineering. Diagnose infrastructure anomalies, inspect service health, and present remediation recommendations to on-call engineers.',
    allowedTools: ['observability_query', 'runbook_read', 'jira_create'],
    riskClass: 'read_only',
    modelPreference: 'mistral:7b',
    langGraphNodes: ['IngestAlertContext', 'QueryPrometheusMetrics', 'MatchRunbookKnowledge', 'FormulateHypothesis']
  }
];

export const MCP_TOOLS_CATALOG: MCPTool[] = [
  {
    id: 'tool-git-read',
    name: 'git_read_repository',
    category: 'Git',
    description: 'Reads repository tree, commit history, and file contents across GitHub/GitLab repositories.',
    actionClass: 'read',
    requiresApproval: false,
    schemaParams: { repo: 'string', path: 'string', ref: 'string' },
    endpoint: 'mcp://git-adapter.internal/v1/read',
    status: 'active'
  },
  {
    id: 'tool-git-draft-pr',
    name: 'git_create_draft_pr',
    category: 'Git',
    description: 'Creates a working feature branch, commits proposed code changes, and opens a Draft Pull Request.',
    actionClass: 'draft',
    requiresApproval: false,
    schemaParams: { repo: 'string', branch: 'string', title: 'string', body: 'string', files: 'array' },
    endpoint: 'mcp://git-adapter.internal/v1/draft-pr',
    status: 'active'
  },
  {
    id: 'tool-jira-read',
    name: 'jira_get_issue',
    category: 'Jira',
    description: 'Fetches issue summary, acceptance criteria, priority, and comments from enterprise Jira/Linear.',
    actionClass: 'read',
    requiresApproval: false,
    schemaParams: { issueKey: 'string' },
    endpoint: 'mcp://jira-adapter.internal/v1/issue',
    status: 'active'
  },
  {
    id: 'tool-ci-status',
    name: 'ci_get_pipeline_status',
    category: 'CI/CD',
    description: 'Queries GitHub Actions / ArgoCD workflow run status, test outcomes, and artifact SHA hashes.',
    actionClass: 'read',
    requiresApproval: false,
    schemaParams: { workflowRunId: 'string' },
    endpoint: 'mcp://ci-adapter.internal/v1/status',
    status: 'active'
  },
  {
    id: 'tool-cms-read',
    name: 'cms_get_content',
    category: 'CMS',
    description: 'Retrieves published and draft content entries from Strapi / Contentful headless CMS.',
    actionClass: 'read',
    requiresApproval: false,
    schemaParams: { contentType: 'string', slug: 'string' },
    endpoint: 'mcp://cms-adapter.internal/v1/content',
    status: 'active'
  },
  {
    id: 'tool-cms-draft',
    name: 'cms_update_draft',
    category: 'CMS',
    description: 'Updates a staging/draft content entry in the CMS without publishing to live production.',
    actionClass: 'draft',
    requiresApproval: false,
    schemaParams: { entryId: 'string', payload: 'object' },
    endpoint: 'mcp://cms-adapter.internal/v1/draft',
    status: 'active'
  },
  {
    id: 'tool-crm-lead',
    name: 'crm_create_lead',
    category: 'CRM',
    description: 'Creates a prospective enterprise lead in Salesforce/HubSpot with source attribution and needs summary.',
    actionClass: 'draft',
    requiresApproval: false,
    schemaParams: { company: 'string', contactEmail: 'string', requirementSummary: 'string' },
    endpoint: 'mcp://crm-adapter.internal/v1/lead',
    status: 'active'
  },
  {
    id: 'tool-observability',
    name: 'observability_query_telemetry',
    category: 'Observability',
    description: 'Executes PromQL queries, searches Loki logs, and fetches Tempo distributed traces.',
    actionClass: 'read',
    requiresApproval: false,
    schemaParams: { query: 'string', timeRange: 'string' },
    endpoint: 'mcp://obs-adapter.internal/v1/query',
    status: 'active'
  },
  {
    id: 'tool-deploy-prod',
    name: 'k8s_deploy_production_release',
    category: 'CI/CD',
    description: 'Promotes container image tags and synchronizes ArgoCD production manifests.',
    actionClass: 'deploy',
    requiresApproval: true,
    schemaParams: { service: 'string', imageTag: 'string', releaseNote: 'string' },
    endpoint: 'mcp://k8s-adapter.internal/v1/deploy',
    status: 'sandboxed'
  }
];

export const TEMPORAL_WORKFLOWS_SEED: TemporalWorkflow[] = [
  {
    id: 'WF-LW-202609-089',
    workflowType: 'EngineeringPRDraftFlow',
    targetEntity: 'TICKET-LW-4412 (Payment Gateway Idempotency)',
    initiatedBy: 'Developer: K. Mishra',
    startTime: '10 minutes ago',
    status: 'COMPLETED',
    currentStep: 'Draft PR Open in light-weight-agentic/payment-core',
    activities: [
      { name: 'FetchJiraTicket', status: 'completed', durationMs: 240, details: 'Fetched LW-4412 specifications' },
      { name: 'QueryRepoContext', status: 'completed', durationMs: 510, details: 'Identified 3 target files in payment-core' },
      { name: 'SynthesizeIdempotencyLogic', status: 'completed', durationMs: 1420, details: 'Drafted Redis lock decorator with TTL' },
      { name: 'GeneratePytests', status: 'completed', durationMs: 890, details: 'Generated 6 unit tests (all passed)' },
      { name: 'CreateDraftPR', status: 'completed', durationMs: 380, details: 'PR #128 opened on branch feat/lw-4412-idempotency' }
    ]
  },
  {
    id: 'WF-LW-202609-090',
    workflowType: 'WebsiteReleaseWorkflow',
    targetEntity: 'Agentic Web Platform v1.4.0 (Mac M2 Local Stack + Staging)',
    initiatedBy: 'Release Manager: S. Al-Mansoor',
    startTime: '3 minutes ago',
    status: 'WAITING_APPROVAL',
    currentStep: 'Human-in-the-Loop Sign-off Gate (Security & SRE Check Complete)',
    activities: [
      { name: 'VerifyBuildArtifacts', status: 'completed', durationMs: 420, details: 'Container SHA: ghcr.io/light-weight-agentic/web:v1.4.0-m2' },
      { name: 'RunSecurityScans', status: 'completed', durationMs: 1240, details: 'Trivy: 0 Critical, 0 High vulnerabilities' },
      { name: 'CheckCanaryHealth', status: 'completed', durationMs: 820, details: 'Staging p99 latency: 68ms, Error rate: 0.00%' },
      { name: 'TemporalApprovalGate', status: 'running', durationMs: 180000, details: 'Awaiting digital signature from Release Architect' }
    ],
    pendingApproval: {
      approvalId: 'APPR-REL-9921',
      action: 'Promote light-weight-agentic-platform website & agent-gateway to Staging Cluster',
      riskLevel: 'HIGH',
      diffSummary: 'Deploys Local Ollama proxy endpoint, LangGraph v0.2 integration, and updated schema.',
      approverRole: 'Release Manager / Platform Architect',
      requestedAt: '2026-09-15 01:50:00 UTC'
    }
  },
  {
    id: 'WF-LW-202609-091',
    workflowType: 'SecurityPolicyAuditWorkflow',
    targetEntity: 'MCP Tool Sandbox & Token Budget Compliance',
    initiatedBy: 'System Cron (Hourly)',
    startTime: 'Just now',
    status: 'RUNNING',
    currentStep: 'Auditing Ollama local latency vs Cloud Gateway fallback limits',
    activities: [
      { name: 'AuditMcpInvocations', status: 'completed', durationMs: 310, details: '1,420 tool calls reviewed: 0 unauthorized' },
      { name: 'VerifySecretRedaction', status: 'running', durationMs: 150, details: 'Scanning prompt buffers for leaked API tokens' }
    ]
  }
];

export const KNOWLEDGE_BASE_SEED: KnowledgeDocument[] = [
  {
    id: 'kb-arch-001',
    title: 'light-weight-agentic-engineering Solution Architecture Document',
    domain: 'architecture',
    source: 'docs/architecture/solution-architecture.md',
    contentSnippet: 'Establishes a proof-of-concept architecture for an agentic software development foundation with dual experience interfaces, centered around Agent Gateway, MCP Gateway, and LLM Gateway.',
    vectorDimensions: 1536,
    tags: ['Architecture', 'Gateways', 'POC', 'AgenticEngineering'],
    updatedAt: '2026-09-15',
    chunkCount: 24
  },
  {
    id: 'kb-adr-004',
    title: 'ADR-004: Adopting LangGraph for Stateful Cyclic Agent Orchestration',
    domain: 'adrs',
    source: 'docs/adr/004-langgraph-orchestration.md',
    contentSnippet: 'Decided to adopt LangGraph over single-turn chains due to need for human-in-the-loop interruption, cyclical state feedback during code evaluation, and checkpoint persistence in PostgreSQL.',
    vectorDimensions: 1536,
    tags: ['ADR', 'LangGraph', 'StateGraph', 'Python'],
    updatedAt: '2026-09-12',
    chunkCount: 8
  },
  {
    id: 'kb-adr-009',
    title: 'ADR-009: Decoupling Tool Access via Model Context Protocol (MCP) Gateway',
    domain: 'adrs',
    source: 'docs/adr/009-mcp-gateway-isolation.md',
    contentSnippet: 'Agents must never directly invoke internal databases or raw SDKs. The MCP Gateway enforces capability-based access control, payload redaction, and policy pre-checks for all external integrations.',
    vectorDimensions: 1536,
    tags: ['ADR', 'MCP', 'Security', 'Policy'],
    updatedAt: '2026-09-14',
    chunkCount: 12
  },
  {
    id: 'kb-cms-001',
    title: 'Enterprise Digital Modernization Solution Blueprints',
    domain: 'cms',
    source: 'apps/web/content/solutions/enterprise-ai.md',
    contentSnippet: 'Next-generation smart enterprise concierge architecture: integrated booking engine, localized language translation via local Ollama models on Apple Silicon edge, and real-time operations automation.',
    vectorDimensions: 1536,
    tags: ['Enterprise', 'EdgeAI', 'Ollama', 'Architecture'],
    updatedAt: '2026-09-10',
    chunkCount: 16
  },
  {
    id: 'kb-runbook-002',
    title: 'Runbook: Local Mac M2 High-Performance Inference Optimization',
    domain: 'runbooks',
    source: 'docs/runbooks/mac-m2-ollama-setup.md',
    contentSnippet: 'Optimizing Ollama on Apple Silicon M2: Leverage Metal GPU acceleration, set OLLAMA_NUM_PARALLEL=4, select 4-bit quantized models (Q4_K_M) for 16GB memory budgets.',
    vectorDimensions: 1536,
    tags: ['MacM2', 'AppleSilicon', 'Ollama', 'Performance'],
    updatedAt: '2026-09-15',
    chunkCount: 6
  }
];

export const LLM_ROUTES: LLMRouteConfig[] = [
  {
    id: 'route-ollama-llama32',
    name: 'Ollama: Llama 3.2 (3B)',
    provider: 'ollama',
    modelId: 'llama3.2:3b',
    contextWindow: 128000,
    localM2Optimized: true,
    costPer1kInput: 0.000,
    costPer1kOutput: 0.000,
    averageLatencyMs: 38,
    taskSuitability: ['Fast intent classification', 'Summarization', 'Safety guardrail pre-check']
  },
  {
    id: 'route-ollama-qwen-coder',
    name: 'Ollama: Qwen 2.5 Coder (7B)',
    provider: 'ollama',
    modelId: 'qwen2.5-coder:7b',
    contextWindow: 32768,
    localM2Optimized: true,
    costPer1kInput: 0.000,
    costPer1kOutput: 0.000,
    averageLatencyMs: 85,
    taskSuitability: ['Code generation', 'Unit test generation', 'AST refactoring', 'Bug fixing']
  },
  {
    id: 'route-ollama-mistral',
    name: 'Ollama: Mistral 7B Instruct',
    provider: 'ollama',
    modelId: 'mistral:7b',
    contextWindow: 32768,
    localM2Optimized: true,
    costPer1kInput: 0.000,
    costPer1kOutput: 0.000,
    averageLatencyMs: 72,
    taskSuitability: ['General reasoning', 'Drafting PR descriptions', 'Policy evaluations']
  },
  {
    id: 'route-ollama-deepseek-r1',
    name: 'Ollama: DeepSeek R1 (8B)',
    provider: 'ollama',
    modelId: 'deepseek-r1:8b',
    contextWindow: 65536,
    localM2Optimized: true,
    costPer1kInput: 0.000,
    costPer1kOutput: 0.000,
    averageLatencyMs: 110,
    taskSuitability: ['Deep architectural tradeoff reasoning', 'Root-cause analysis', 'Mathematical evaluation']
  },
  {
    id: 'route-cloud-fallback',
    name: 'Enterprise Cloud Fallback (GPT-4o / Claude 3.5)',
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    contextWindow: 128000,
    localM2Optimized: false,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.00060,
    averageLatencyMs: 420,
    taskSuitability: ['High-throughput fallback when local Mac M2 is offline or overloaded']
  }
];
