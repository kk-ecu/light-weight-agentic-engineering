# Enterprise Solution Architecture: 6-Plane Decoupled Multi-Agent Platform

## 1. Executive Architecture Summary

`light-weight-agentic-engineering` is an enterprise architecture pattern engineered for local execution on **Apple Silicon (M2)** hardware with zero external token leakage, zero API subscription costs, and verifiable human-in-the-loop governance.

The platform decouples agentic capabilities across six isolated architectural planes:

```mermaid
flowchart TD
    subgraph P1["Plane 1: Experience Plane (:3000)"]
        WebPortal["Enterprise Web Portal\nReact 18 / Tailwind CSS / Motion"]
        GatewayServer["Express Gateway Proxy\nConsolidates & Authenticates Calls"]
    end

    subgraph P2["Plane 2: Agent Control Plane (:8001, :8002)"]
        LangGraphCore["LangGraph 0.2 Engine (:8001)\nCyclical StateGraph with Checkpointing"]
        LLMGateway["LLM Gateway (:8002)\nDLP Regex Filter & Local Metal Proxy"]
        OllamaMetal["Ollama Metal Engine (:11434)\nllama3.2:3b & qwen2.5-coder:7b"]
    end

    subgraph P3["Plane 3: Tool Integration Plane (:8003)"]
        MCPGateway["MCP Tool Gateway (:8003)\nAction Class Security Broker"]
        GitWorker["GitHub Isolated Sandbox\nBranch Isolation & Draft PR Submission"]
    end

    subgraph P4["Plane 4: Workflow Plane (:7233, :8233)"]
        TemporalEngine["Temporal Server (:7233)\nDurable Workflow State Machine"]
        ApprovalService["Approval Service (:8005)\nHITL Cryptographic Sign-Off Gate"]
    end

    subgraph P5["Plane 5: Knowledge Plane (:8004, :5432)"]
        RAGService["Retrieval Service (:8004)\nHNSW Vector Search + BM25 RRF"]
        PostgresVector[("PostgreSQL 16 + pgvector (:5432)\n1536-dim Embeddings & State")]
    end

    subgraph P6["Plane 6: Governance Plane (:8006, :6379)"]
        PolicyService["Policy Service (:8006)\nZero-Trust Action Checker"]
        CostTracker["Cost Control Engine\nLocal M2 vs Cloud Token Tracker"]
        RedisState[("Redis 7 Cache (:6379)\nDistributed State & Limits")]
    end

    WebPortal --> GatewayServer
    GatewayServer --> LangGraphCore
    GatewayServer --> TemporalEngine
    LangGraphCore --> PolicyService
    LangGraphCore --> RAGService
    RAGService --> PostgresVector
    LangGraphCore --> LLMGateway
    LLMGateway --> OllamaMetal
    LangGraphCore --> MCPGateway
    MCPGateway --> GitWorker
    TemporalEngine --> ApprovalService
    PolicyService --> RedisState
```

---

## 2. Decoupled Plane Responsibilities

| Plane | Port / Interface | Technology | Architectural Invariant |
| :--- | :--- | :--- | :--- |
| **1. Experience** | `3000` (HTTP) | React 18, Vite, Express | User interaction only; cannot invoke tools or execute raw code directly. |
| **2. Agent Control** | `8001`, `8002` (FastAPI) | LangGraph 0.2, Ollama Metal | Cyclical graph traversal with deterministic node checkpoints in Postgres. |
| **3. Tool Integration** | `8003` (JSON-RPC) | Model Context Protocol | Zero-trust token injection; tools execute in isolated subprocess sandboxes. |
| **4. Workflow** | `7233`, `8005` (gRPC/HTTP)| Temporal.io, Python SDK | Multi-day durability, automatic retries, and strict HITL release gates. |
| **5. Knowledge** | `8004`, `5432` (SQL/asyncpg)| pgvector, PostgreSQL 16 | Grounded RAG with 1536-dim HNSW vector similarity + BM25 full-text rank fusion. |
| **6. Governance** | `8006`, `6379` (FastAPI) | OPA Rules, Redis 7 | Enforces RBAC permissions before any tool action is scheduled. |

---

## 3. End-to-End Orchestration Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Engineer as Enterprise Engineer
    participant Web as Web Gateway (:3000)
    participant Agent as Agent Gateway (:8001)
    participant Policy as Policy Engine (:8006)
    participant RAG as Knowledge Engine (:8004)
    participant LLM as Local LLM Metal (:11434)
    participant MCP as MCP Tool Broker (:8003)
    participant Temporal as Temporal Orchestrator (:7233)

    Engineer->>Web: Dispatch ticket LW-4412 ("Add Redis Cache")
    Web->>Agent: POST /api/v1/tasks/dispatch
    Agent->>Policy: Validate ActionClass ('draft')
    Policy-->>Agent: Action Approved (Zero-Trust Clear)
    Agent->>RAG: Hybrid Search (HNSW <=> + BM25)
    RAG-->>Agent: Grounded Context (ADR-004, ADR-009)
    Agent->>LLM: Synthesize Code & Tests (DLP Sanitized)
    LLM-->>Agent: Code Generated @ 48.2 tok/s ($0.00 cost)
    Agent->>MCP: Execute git_create_draft_pr
    MCP-->>Agent: Draft PR #128 opened on GitHub
    Agent->>Temporal: Register EngineeringPRWorkflow
    Temporal-->>Web: Workflow paused at HITL Approval Gate
    Web-->>Engineer: Task Completed: Draft PR ready for review
```
