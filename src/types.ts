export type ActiveTab = 
  | 'website'
  | 'agent-gateway'
  | 'mcp-gateway'
  | 'llm-gateway'
  | 'workflows-approvals'
  | 'knowledge'
  | 'architecture'
  | 'codebase';

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

export interface MCPTool {
  id: string;
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
  domain: 'architecture' | 'adrs' | 'cms' | 'runbooks' | 'tickets' | 'code';
  contentSnippet: string;
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
