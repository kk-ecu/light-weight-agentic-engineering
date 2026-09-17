export type ActiveTab = 
  | 'website'
  | 'architecture-doc'
  | 'agent-gateway'
  | 'mcp-gateway'
  | 'llm-gateway'
  | 'workflows-approvals'
  | 'temporal'
  | 'knowledge'
  | 'c4-architecture'
  | 'plane-codebase'
  | 'local-m2-runner'
  | 'port-doctor'
  | 'test-suite'
  | 'enterprise-review';

export type ThemeMode = 'dark' | 'light' | 'lightblue';

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  category: 'Customer' | 'Engineering' | 'Platform';
  description: string;
  systemPrompt: string;
  allowedTools: string[];
  riskClass: 'read_only' | 'draft_only' | 'human_approval_required' | 'autonomous';
  modelPreference: string;
  langGraphNodes: string[];
}

export interface MCPServer {
  id: string;
  name: string;
  category: 'Git' | 'Jira' | 'CI/CD' | 'CMS' | 'CRM' | 'Observability' | 'Search' | 'Security';
  endpoint: string;
  protocol: string;
  status: 'active' | 'sandboxed' | 'maintenance';
  authType: 'Secrets Broker (JIT)' | 'OAuth2 Bearer' | 'Zero-Trust Token';
  toolCount?: number;
  description: string;
  latencyMs?: number;
  tlsVersion?: string;
  transportMode?: 'sse' | 'stdio';
}

export interface ToolExecutionAudit {
  id: string;
  timestamp: string;
  toolId: string;
  toolName: string;
  serverName: string;
  actionClass: string;
  durationMs: number;
  status: 'SUCCESS' | 'POLICY_HALTED' | 'FAILED';
  params: any;
  result: any;
}

export interface MCPTool {
  id: string;
  serverId?: string;
  serverName?: string;
  name: string;
  category: 'Git' | 'Jira' | 'CI/CD' | 'CMS' | 'CRM' | 'Observability' | 'Search' | 'Security';
  description: string;
  actionClass: 'read' | 'draft' | 'update' | 'deploy' | 'rollback';
  requiresApproval: boolean;
  schemaParams: { [key: string]: string };
  endpoint: string;
  status: 'active' | 'sandboxed' | 'maintenance';
}

export interface TemporalWorkflow {
  id: string;
  workflowType: string;
  targetEntity: string;
  initiatedBy: string;
  startTime: string;
  status: 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'FAILED';
  currentStep: string;
  activities: {
    name: string;
    status: 'completed' | 'running' | 'pending' | 'failed';
    durationMs: number;
    details?: string;
  }[];
  pendingApproval?: {
    approvalId: string;
    action: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    diffSummary: string;
    approverRole: string;
    requestedAt: string;
  };
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  domain: 'architecture' | 'adrs' | 'cms' | 'runbooks' | 'tickets' | 'code' | 'training';
  contentSnippet: string;
  fullContent?: string;
  source: string;
  vectorDimensions: number;
  tags: string[];
  updatedAt: string;
  chunkCount: number;
}

export interface MonorepoFileNode {
  path: string;
  name: string;
  type: 'file' | 'dir';
  language?: string;
  description?: string;
  content?: string;
  children?: MonorepoFileNode[];
}

export interface LLMRouteConfig {
  id: string;
  name: string;
  provider: 'ollama' | 'vllm' | 'openai' | 'anthropic';
  modelId: string;
  contextWindow: number;
  localM2Optimized: boolean;
  costPer1kInput: number;
  costPer1kOutput: number;
  averageLatencyMs: number;
  taskSuitability: string[];
}

export interface C4Element {
  id: string;
  name: string;
  type: 'Person' | 'System' | 'Container' | 'Component' | 'Database' | 'Queue';
  plane?: string;
  technology?: string;
  description: string;
}

export interface C4Relationship {
  sourceId: string;
  targetId: string;
  description: string;
  protocol: string;
}

export interface C4DiagramData {
  level: 'Level 1: System Context' | 'Level 2: Container (6 Planes)' | 'Level 3: Component (Agent & MCP)' | 'Level 4: Code & Deployment (M2 Metal vs Cloud K8s)';
  title: string;
  description: string;
  elements: C4Element[];
  relationships: C4Relationship[];
}

export interface TestCaseResult {
  id: string;
  plane: 'Experience' | 'Workflow' | 'Agent Control' | 'Knowledge' | 'Tool Integration' | 'Operations & Governance' | 'Shared Core' | 'Infra Local M2';
  testFile: string;
  testType: 'Unit' | 'Integration' | 'E2E' | 'Contract' | 'Security';
  testName: string;
  targetFile: string;
  status: 'passed' | 'failed' | 'running' | 'skipped';
  durationMs: number;
  assertions: number;
  coveragePercent: number;
  logOutput: string;
}

export interface EnterpriseScorecardItem {
  id: string;
  criterion: string;
  score: number;
  weight: number;
  verdict: 'Exemplary' | 'Enterprise Ready' | 'Needs Hardening';
  assessment: string;
  keyStrengths: string[];
}
