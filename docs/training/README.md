# Enterprise Multi-Agent Systems Masterclass: 1,000+ Engineers Curriculum
**A Self-Contained, 120-Minute Master Training Program across 6 Decoupled Planes, Rootless Podman, Apple Silicon M2 Metal Acceleration, and Zero-Trust MCP Tool Brokerage**

---

## 📅 Session Curriculum & Module Index

This training program is divided into **7 modular, self-contained playbooks**. As a presenter, you can open each file during its designated time window and deliver the material without referencing any external documentation:

| Module Document | Time Window | Topic | Delivery Format | Key Highlights |
| :--- | :--- | :--- | :--- | :--- |
| [**Module 1: Foundations**](MODULE_01_FOUNDATIONS_6_PLANE_ARCHITECTURE.md) | 00:00 – 00:15 (15m) | Why Traditional AI Fails & The 6-Plane Decoupled Architecture | Keynote Slides & Architecture Walkthrough | The 3 fatal enterprise antipatterns; overview of the 6 planes; isolation of concerns. |
| [**Module 2: Hardware & Podman**](MODULE_02_HARDWARE_APPLE_SILICON_M2_AND_PODMAN.md) | 00:15 – 00:35 (20m) | Apple Silicon M2 Metal Acceleration & Rootless Podman Containers | Live Terminal & Memory Audit | Apple Unified Memory vs x86 PCIe lag; rootless Podman setup; 16 GB memory budget; 48 tok/s benchmark. |
| [**Module 3: Agent Control Plane**](MODULE_03_AGENT_CONTROL_PLANE_LANGGRAPH.md) | 00:35 – 00:55 (20m) | LangGraph 0.2 Cyclical State Machines & State Checkpointing | Architecture & Python Code Walkthrough | Linear chains vs StateGraphs; 5 core nodes; `AsyncPostgresSaver` in PostgreSQL; regex DLP prompt filters. |
| [**Module 4: Tool Plane & Security**](MODULE_04_TOOL_INTEGRATION_MCP_ZERO_TRUST.md) | 00:55 – 01:15 (20m) | Model Context Protocol (MCP) & Zero-Trust Tool Brokerage | Protocol Inspection & Secret Broker Demo | JSON-RPC 2.0 specs; Action Classification (`read`, `draft`, `deploy`); Scoped Secret Broker; Draft-only rule. |
| [**Module 5: Knowledge & Workflows**](MODULE_05_KNOWLEDGE_PGVECTOR_TEMPORAL_HITL.md) | 01:15 – 01:35 (20m) | pgvector Hybrid RAG & Temporal.io Human-in-the-Loop Gates | SQL Vector Queries & Temporal UI Walkthrough | pgvector HNSW cosine <=> + BM25 RRF; multi-day durable execution; Temporal `@workflow.signal` HITL gate. |
| [**Module 6: Live End-to-End Demo**](MODULE_06_LIVE_END_TO_END_DEMO_RUNBOOK.md) | 01:35 – 01:55 (20m) | Live Jira Ticket to GitHub Draft PR Execution | Full Command-by-Command Live Demo | Live curl dispatch; local Metal GPU synthesis; sandboxed pytest run; Draft PR #128; HITL sign-off. |
| [**Module 7: Governance & Q&A**](MODULE_07_GOVERNANCE_SIZING_AND_AUDIENCE_QA.md) | 01:55 – 02:00 (05m + Q&A) | Governance, Production Sizing & Audience Q&A Handbook | Architecture Review & Interactive Q&A | OWASP Top 10 for LLMs compliance matrix; local vs cluster sizing; top 6 technical answers for engineers. |

---

## 🚀 1-Minute Presenter Quick Start
Before going on stage or starting your Zoom broadcast:

```bash
# 1. Start rootless Podman machine
podman machine start

# 2. Boot local infrastructure
podman compose -f podman-compose.local.yml up -d

# 3. Verify containers are healthy
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 4. Verify all 12 ports with automated Doctor diagnostic
chmod +x infra/scripts/check-ports-sanity.sh
./infra/scripts/check-ports-sanity.sh

# 5. Launch web portal & API Gateway
npm run dev
# Open browser to http://localhost:3000
```
