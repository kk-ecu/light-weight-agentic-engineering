# 🍏 Apple Silicon Mac M2 Live Production Setup Guide & Execution Manual
## `light-weight-agentic-engineering` Platform

This master guide details the exact process for configuring and running the **6-Plane Agentic Engineering Platform** locally on an **Apple Silicon Mac M2** (including M2 Pro, M2 Max, M3, and M4) with zero cloud token bills during development.

---

## 1. High-Level Architectural Analogy: The 5-Star Kitchen

To understand the 6-Plane system, consider how an enterprise commercial kitchen operates:

* **The Customer & Menu (Experience Plane :3000)**: The dining room where patrons place orders and review dishes (the Web Portal).
* **The Head Chef (Agent Control Plane :8000)**: Orchestrates the line cooks and breaks customer requests into culinary steps (LangGraph cyclic state machine).
* **The Pantry Vault (Knowledge Plane :5432)**: The secure storage containing proprietary recipes, company ADRs, and historical codebases (PostgreSQL + pgvector).
* **The Recipe Consultant (LLM Gateway :8002)**: Suggests ingredient substitutions and redacts secrets before prompts go to the models.
* **The Utensil Specialist (Tool Integration Plane :8080)**: Operates dangerous kitchen knives and open flame tools (Git, Jira, Docker, Kubernetes) within strict safety boundaries (Zero-Trust MCP).
* **The Indelible Order Pad (Workflow Plane :7233)**: Tracks active table orders so that a power failure or interrupted prep never loses an order (Temporal durable state machine).

---

## 2. Hardware & Runtime Prerequisites

* **Hardware**: Apple Mac with Apple Silicon M2, M2 Pro, M2 Max (M3/M4 also supported).
* **Unified RAM**: 16 GB unified memory recommended (peak memory usage is ~10.2 GB across all services).
* **Disk Space**: 15 GB free for Docker volumes and Ollama model weights.
* **Software**:
  * macOS Sonoma (14.x) or Sequoia (15.x)
  * Docker Desktop for Mac (Apple Silicon build, VirtioFS enabled)
  * Native Ollama for macOS (`brew install ollama`)
  * Python 3.11+ with Astral `uv` (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
  * Node.js v20+ with npm or pnpm

---

## 3. Configuration Files Required on Disk

```
light-weight-agentic-engineering/
 ├── .env.local                                                  <-- [1] Sets VITE_EXECUTION_MODE=live
 ├── compose.yaml                                                <-- [2] Boots Postgres, Redis, Temporal
 ├── vite.config.ts                                              <-- [3] Reverse proxies to eliminate CORS
 ├── planes/agent-control-plane/services/agent-gateway/.env      <-- [4] Configures LangGraph (:8000)
 ├── planes/tool-integration-plane/services/mcp-gateway/.env     <-- [5] Configures Zero-Trust MCP (:8080)
 └── planes/agent-control-plane/services/llm-gateway/.env        <-- [6] Configures the LLM Router (:8002)
```

### File 1: `.env.local`
```env
VITE_EXECUTION_MODE=live
VITE_AGENT_GATEWAY_URL=http://localhost:8000
VITE_MCP_GATEWAY_URL=http://localhost:8080
VITE_LLM_GATEWAY_URL=http://localhost:8002
VITE_OLLAMA_URL=http://localhost:11434
VITE_TEMPORAL_UI_URL=http://localhost:8233
VITE_PGVECTOR_URL=http://localhost:5432
```

### File 2: `vite.config.ts`
Includes reverse proxies for `/api/agent`, `/api/mcp`, `/api/llm`, and `/api/ollama` so that the React frontend communicates seamlessly with local backend services without cross-origin issues.

---

## 4. The 5-Step Boot Recipe

### Step 1: Start Ollama & Download Models
```bash
export OLLAMA_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
ollama serve &

ollama pull qwen2.5-coder:7b
ollama pull llama3.2:3b
```

### Step 2: Start Databases and Workflow Engine
```bash
docker compose -f compose.yaml up -d
```

### Step 3: Seed Vector Knowledge Base
```bash
uv sync
uv run python scripts/seed-knowledge-pgvector.py
```

### Step 4: Launch the 3 Python Gateways
Open 3 terminal windows:
* **Tab 1 (LLM Router :8002)**: `cd planes/agent-control-plane/services/llm-gateway && uv run uvicorn app.main:app --port 8002 --reload`
* **Tab 2 (MCP Gateway :8080)**: `cd planes/tool-integration-plane/services/mcp-gateway && uv run uvicorn app.main:app --port 8080 --reload`
* **Tab 3 (Agent Gateway :8000)**: `cd planes/agent-control-plane/services/agent-gateway && uv run uvicorn app.main:app --port 8000 --reload`

#### Configured MCP Servers & Tool Endpoints (:8080)
The MCP Gateway integrates 6 decoupled server adapters mediating 9 total tools:
1. **Git VCS MCP Server**: 2 tools (`git_read_repository`, `git_create_draft_pr`) - Secrets Broker JIT.
2. **Jira & Agile Lifecycle Server**: 1 tool (`jira_get_issue`) - OAuth2 Bearer.
3. **ArgoCD & CI/CD Pipeline Server**: 2 tools (`ci_get_pipeline_status`, `k8s_deploy_production_release`) - Zero-Trust Token (HITL approval required for deploy).
4. **Headless Content & ADR CMS Server**: 2 tools (`cms_get_content`, `cms_update_draft`) - Secrets Broker JIT.
5. **Enterprise CRM Concierge Server**: 1 tool (`crm_create_lead`) - OAuth2 Bearer.
6. **OpenTelemetry & Metrics Server**: 1 tool (`observability_query_telemetry`) - Zero-Trust Token.

### Step 5: Start the Web UI
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 5. Live Proofs for Verification

1. **Apple Metal GPU Spike**: Open macOS Activity Monitor (`Cmd + 4` for GPU history) while clicking "Dispatch Task" to watch local Metal shaders activate.
2. **Temporal Web UI**: Open `http://localhost:8233` to view live event histories and approval signals.
3. **Real Git Pull Request**: Inspect your target repository for real branch creation and automated draft PRs.
4. **Airplane Mode Verification**: Disconnect from Wi-Fi and execute a prompt; the local M2 execution pipeline runs fully offline.
