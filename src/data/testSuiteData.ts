import { TestCaseResult } from '../types';

export const TEST_SUITE_SEED: TestCaseResult[] = [
  // 1. Experience Plane Tests
  {
    id: 'test-exp-01',
    plane: 'Experience',
    testFile: 'planes/experience-plane/tests/e2e/test_concierge_solution_flow.spec.ts',
    testType: 'E2E',
    testName: 'test_user_solution_discovery_end_to_end_journey',
    targetFile: 'planes/experience-plane/apps/public-web/src/pages/solutions.tsx',
    status: 'passed',
    durationMs: 142,
    assertions: 8,
    coveragePercent: 96.2,
    logOutput: '✓ Rendered concierge chat interface\n✓ Dispatched query to Agent Gateway\n✓ Grounded citations rendered with ADR badge\n✓ Lead CTA form submitted with draft action class'
  },
  {
    id: 'test-exp-02',
    plane: 'Experience',
    testFile: 'planes/experience-plane/tests/unit/test_design_system_tokens.spec.ts',
    testType: 'Unit',
    testName: 'test_design_system_contrast_and_accessibility',
    targetFile: 'planes/experience-plane/packages/design-system/src/tokens.ts',
    status: 'passed',
    durationMs: 38,
    assertions: 14,
    coveragePercent: 100.0,
    logOutput: '✓ Color contrast meets WCAG AA 4.5:1 ratio\n✓ Focus rings correctly configured for screen-readers\n✓ Button padding adheres to 2x horizontal rule'
  },

  // 2. Workflow Plane Tests
  {
    id: 'test-wf-01',
    plane: 'Workflow',
    testFile: 'planes/workflow-plane/tests/workflow/test_temporal_pr_workflow.py',
    testType: 'Integration',
    testName: 'test_engineering_pr_workflow_execution_and_retry',
    targetFile: 'planes/workflow-plane/services/workflow-runtime/workflows.py',
    status: 'passed',
    durationMs: 284,
    assertions: 12,
    coveragePercent: 94.8,
    logOutput: '✓ Started EngineeringPRWorkflow execution\n✓ Invoked Activity: fetch_jira_criteria\n✓ Invoked Activity: generate_code_draft\n✓ Temporal heartbeats maintained within 5s timeout\n✓ Workflow state successfully completed'
  },
  {
    id: 'test-wf-02',
    plane: 'Workflow',
    testFile: 'planes/workflow-plane/tests/unit/test_approval_service_gate.py',
    testType: 'Unit',
    testName: 'test_human_in_the_loop_approval_signal_and_rejection',
    targetFile: 'planes/workflow-plane/services/approval-service/approval_handler.py',
    status: 'passed',
    durationMs: 76,
    assertions: 9,
    coveragePercent: 98.1,
    logOutput: '✓ Approval request payload created with risk score HIGH\n✓ Suspended state machine awaiting Temporal signal\n✓ Handled ApprovalSignal: APPROVED with signature verification\n✓ Handled RejectionSignal: returns error dossier to engineer'
  },

  // 3. Agent Control Plane Tests
  {
    id: 'test-agent-01',
    plane: 'Agent Control',
    testFile: 'planes/agent-control-plane/tests/eval/test_langgraph_cyclic_flow.py',
    testType: 'Unit',
    testName: 'test_agent_gateway_langgraph_cycles_and_checkpointing',
    targetFile: 'planes/agent-control-plane/services/agent-gateway/main.py',
    status: 'passed',
    durationMs: 195,
    assertions: 16,
    coveragePercent: 95.7,
    logOutput: '✓ StateGraph compiled successfully with PostgresSaver\n✓ Transition: validate_intent -> retrieve_knowledge\n✓ Transition: retrieve_knowledge -> llm_synthesis\n✓ Loop-back on eval score < 0.85 triggered successfully (max_iterations=3)\n✓ Thread checkpoint saved to pgvector db'
  },
  {
    id: 'test-agent-02',
    plane: 'Agent Control',
    testFile: 'planes/agent-control-plane/tests/contract/test_llm_gateway_m2_routing.py',
    testType: 'Contract',
    testName: 'test_llm_gateway_local_ollama_fallback_and_redaction',
    targetFile: 'planes/agent-control-plane/services/llm-gateway/main.py',
    status: 'passed',
    durationMs: 110,
    assertions: 11,
    coveragePercent: 97.4,
    logOutput: '✓ Local Ollama host.docker.internal:11434 verified reachable\n✓ Model llama3.2:3b selected for advisory inquiry\n✓ Model qwen2.5-coder:7b selected for code generation\n✓ Prompt redaction successfully removed AWS keys and passwords'
  },
  {
    id: 'test-agent-03',
    plane: 'Agent Control',
    testFile: 'planes/agent-control-plane/tests/eval/test_groundedness_guardrail.py',
    testType: 'Unit',
    testName: 'test_eval_service_groundedness_score_threshold',
    targetFile: 'planes/agent-control-plane/services/eval-service/evaluator.py',
    status: 'passed',
    durationMs: 82,
    assertions: 7,
    coveragePercent: 93.9,
    logOutput: '✓ Computed cosine citation overlap with ADR-004\n✓ Groundedness score 0.94 exceeds threshold 0.85\n✓ Rejection triggered for ungrounded hallucinated parameter'
  },

  // 4. Knowledge Plane Tests
  {
    id: 'test-know-01',
    plane: 'Knowledge',
    testFile: 'planes/knowledge-plane/tests/retrieval/test_pgvector_hybrid_search.py',
    testType: 'Integration',
    testName: 'test_hybrid_retrieval_cosine_plus_bm25_ranking',
    targetFile: 'planes/knowledge-plane/services/retrieval-service/retrieval.py',
    status: 'passed',
    durationMs: 164,
    assertions: 10,
    coveragePercent: 96.8,
    logOutput: '✓ 1536-dimension embeddings loaded into HNSW index\n✓ Hybrid search reciprocal rank fusion (RRF) validated\n✓ Platform M2 architecture documents retrieved in top 3 results\n✓ Cosine similarity distance calculation verified'
  },
  {
    id: 'test-know-02',
    plane: 'Knowledge',
    testFile: 'planes/knowledge-plane/tests/ingestion/test_chunking_and_provenance.py',
    testType: 'Unit',
    testName: 'test_markdown_semantic_chunker_and_citation_provenance',
    targetFile: 'planes/knowledge-plane/services/indexing-service/chunker.py',
    status: 'passed',
    durationMs: 65,
    assertions: 8,
    coveragePercent: 98.0,
    logOutput: '✓ Semantic chunking preserves header hierarchies\n✓ Citations include doc_id, section, and line offsets\n✓ Non-disclosure sensitivity classification applied'
  },

  // 5. Tool Integration Plane Tests
  {
    id: 'test-tool-01',
    plane: 'Tool Integration',
    testFile: 'planes/tool-integration-plane/tests/policy/test_mcp_action_class_sandbox.py',
    testType: 'Security',
    testName: 'test_mcp_broker_action_class_enforcement_and_jit_secrets',
    targetFile: 'planes/tool-integration-plane/services/mcp-gateway/main.py',
    status: 'passed',
    durationMs: 140,
    assertions: 13,
    coveragePercent: 97.2,
    logOutput: '✓ Blocked unauthorized "deploy" action from public user\n✓ Allowed "read" and "draft" actions for engineering role\n✓ Secrets Broker injected JIT GitHub token directly to adapter\n✓ Response body sanitized of internal IP addresses'
  },
  {
    id: 'test-tool-02',
    plane: 'Tool Integration',
    testFile: 'planes/tool-integration-plane/tests/adapter/test_github_adapter_draft_pr.py',
    testType: 'Integration',
    testName: 'test_github_adapter_opens_draft_pr_with_test_evidence',
    targetFile: 'planes/tool-integration-plane/adapters/github-adapter/adapter.py',
    status: 'passed',
    durationMs: 188,
    assertions: 9,
    coveragePercent: 95.1,
    logOutput: '✓ Git branch "feat/lw-4412-m2-caching" created\n✓ Automated commit signed with Agent GPG key\n✓ GitHub Draft PR opened with test report and diff summary'
  },

  // 6. Operations & Governance Plane Tests
  {
    id: 'test-gov-01',
    plane: 'Operations & Governance',
    testFile: 'planes/operations-governance-plane/tests/security/test_policy_service_opa.py',
    testType: 'Security',
    testName: 'test_central_policy_engine_rego_rules_evaluation',
    targetFile: 'planes/operations-governance-plane/services/policy-service/policy.py',
    status: 'passed',
    durationMs: 92,
    assertions: 15,
    coveragePercent: 99.1,
    logOutput: '✓ Evaluated policy: production_release_requires_human_architect\n✓ Evaluated policy: token_budget_rate_limit_per_tenant\n✓ Evaluated policy: prevent_direct_commit_to_main_branch\n✓ Immutable audit event emitted to audit-service'
  },
  {
    id: 'test-gov-02',
    plane: 'Operations & Governance',
    testFile: 'planes/operations-governance-plane/tests/compliance/test_cost_control_and_dlp.py',
    testType: 'Unit',
    testName: 'test_finops_token_tracker_and_dlp_scrubbing',
    targetFile: 'planes/operations-governance-plane/services/cost-control-service/cost.py',
    status: 'passed',
    durationMs: 54,
    assertions: 8,
    coveragePercent: 98.4,
    logOutput: '✓ Recorded 4,820 prompt tokens for user session\n✓ Cost computed ($0.00 on local Ollama, $0.0072 on cloud fallback)\n✓ DLP regex stripped Singapore NRIC / credit card numbers'
  },

  // 7. Shared Core & Local M2 Infrastructure Tests
  {
    id: 'test-infra-01',
    plane: 'Infra Local M2',
    testFile: 'infra/scripts/smoke-test.sh',
    testType: 'Integration',
    testName: 'test_apple_silicon_m2_metal_acceleration_and_docker_health',
    targetFile: 'docker-compose.local.yml',
    status: 'passed',
    durationMs: 310,
    assertions: 12,
    coveragePercent: 96.0,
    logOutput: '✓ Apple Silicon M2 Metal acceleration active (OLLAMA_NUM_PARALLEL=4)\n✓ Postgres+pgvector healthy on port 5432\n✓ Redis ping received PONG on port 6379\n✓ Temporal server healthy on port 7233\n✓ Total local memory footprint: 5.8 GB / 16.0 GB'
  }
];
