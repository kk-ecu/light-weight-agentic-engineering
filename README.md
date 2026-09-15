# light-weight-agentic-engineering

Enterprise multi-agent engineering platform organized across **6 decoupled architectural planes**, featuring a Python + FastAPI + LangGraph + Temporal microservices foundation alongside an interactive control plane web interface.

---

## 📁 Repository & Backend File Structure

The monorepo contains the following physical backend microservices, contracts, tests, and configuration files:

```
├── docker-compose.local.yml          # Local Mac M2 / Linux stack (Ollama, PostgreSQL+pgvector, Redis, Temporal)
├── Makefile                          # Unified developer CLI (make setup-m2, make start-m2, make test-all)
├── pyproject.toml                    # uv / pip workspace definition for Python >=3.11
├── server.ts                         # Node.js/Express API Gateway & Vite dev server (Port 3000)
│
├── planes/                           # 6 Decoupled Architectural Planes
│   ├── agent-control-plane/          # Autonomous Agent Gateway & LLM Gateway
│   │   └── services/
│   │       ├── agent-gateway/        # FastAPI agent task dispatcher & LangGraph graph runner
│   │       │   └── main.py           # POST /api/v1/tasks/dispatch with Policy Engine pre-check
│   │       └── llm-gateway/          # FastAPI Ollama proxy with DLP regex data scrubbing
│   │           └── main.py           # POST /v1/chat/completions (Metal GPU offload)
│   │
│   ├── tool-integration-plane/       # Model Context Protocol (MCP) Gateway
│   │   ├── services/
│   │   │   └── mcp-gateway/          # FastAPI MCP tool brokerage with sandboxed worker isolation
│   │   │       └── main.py           # POST /mcp/v1/tools/execute
│   │   └── adapters/
│   │       └── github-adapter/       # Git branch, commit, and draft PR generation
│   │           └── adapter.py        # GitHub MCP adapter implementation
│   │
│   ├── workflow-plane/               # Durable Orchestration & State Machines
│   │   └── services/
│   │       ├── workflow-runtime/     # Temporal.io workflow state machine
│   │       │   └── workflows.py      # EngineeringPRWorkflow with retry policies & activities
│   │       └── approval-service/     # FastAPI human-in-the-loop release gate sign-off
│   │           └── approval_handler.py # Cryptographic digital approval signal dispatch
│   │
│   ├── knowledge-plane/              # Semantic Grounding & pgvector Hybrid Search
│   │   └── services/
│   │       └── retrieval-service/    # HNSW cosine distance + BM25 Reciprocal Rank Fusion
│   │           └── retrieval.py      # HybridRetrievalEngine (PostgreSQL asyncpg)
│   │
│   ├── operations-governance-plane/  # Zero-Trust Policies, DLP, & Cost Control
│   │   └── services/
│   │       ├── policy-service/       # Central policy enforcement (FastAPI)
│   │       │   └── policy.py         # POST /api/v1/policies/evaluate
│   │       └── cost-control-service/ # Token budget accounting & M2 savings calculator
│   │           └── cost.py           # CostControlService
│   │
│   └── experience-plane/             # Public Discovery Website & Engineering Portal
│       └── apps/
│           └── public-web/           # Grounded AI Concierge interface
│               └── src/pages/solutions.tsx
│
├── shared/                           # Shared Cross-Service Libraries
│   └── python/
│       └── contracts/                # Pydantic data schemas
│           └── agent_task.py         # AgentTaskEnvelope, ActionClass, CitationProvenance
│
├── infra/                            # Infrastructure & Bootstrap
│   └── scripts/
│       └── bootstrap-local.sh        # Mac M2 Apple Silicon local dependency bootstrapper
│
└── tests/                            # Verification & CI/CD
    └── e2e/
        └── test_engineering_pr_flow.py # Pytest async E2E test from Jira to GitHub Draft PR
```

---

## 🚀 Running the Python Backend Services

### Prerequisites
- Python 3.11+ (or [uv](https://astral.sh/uv))
- Docker & Docker Compose (or Ollama on macOS Apple Silicon)

### 1. Install Dependencies with `uv`
```bash
uv sync
```

### 2. Boot Local Infrastructure (Mac M2 / Linux)
```bash
make start-m2
# or: docker compose --profile core up -d
```
This starts:
- **Ollama** on port `11434` (with Apple Silicon Metal GPU acceleration)
- **PostgreSQL 16 + pgvector** on port `5432`
- **Temporal Server** on port `7233` (Web UI on `8233`)
- **Redis** on port `6379`

### 3. Run FastAPI Backend Services with Uvicorn
```bash
# Agent Gateway (Port 8001)
uv run uvicorn planes.agent-control-plane.services.agent-gateway.main:app --port 8001 --reload

# LLM Gateway (Port 8002)
uv run uvicorn planes.agent-control-plane.services.llm-gateway.main:app --port 8002 --reload

# MCP Tool Gateway (Port 8003)
uv run uvicorn planes.tool-integration-plane.services.mcp-gateway.main:app --port 8003 --reload

# Policy Service (Port 8006)
uv run uvicorn planes.operations-governance-plane.services.policy-service.policy:app --port 8006 --reload
```

### 4. Run Pytest Test Suite
```bash
uv run pytest tests/ -v
```

---

## 🌐 Full-Stack Web & Simulation Interface

In addition to the physical Python services, this repository includes a unified Node.js / Express backend (`server.ts`) and React interface on port `3000` providing:
- Live `/api/health`, `/api/agent/dispatch`, `/api/mcp/execute`, and `/api/knowledge/search` endpoints
- Interactive Codebase Explorer displaying all monorepo files with syntax highlighting
- Apple Silicon Mac M2 execution runner with terminal simulation
- C4 Architecture visualizer (System Context, Container, Component, Deployment)
- Temporal workflow inspector with human-in-the-loop approval gates
