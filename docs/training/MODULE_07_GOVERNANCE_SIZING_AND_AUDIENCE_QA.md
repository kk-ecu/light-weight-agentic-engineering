# Module 7: Governance, Production Sizing & Audience Q&A Handbook
**Session Timeline**: 01:55 – 02:00 (5 Minutes + Extended Q&A)  
**Delivery Format**: Architecture Governance Review & Interactive Q&A  
**Target Audience**: 1,000+ Enterprise Staff/Principal Engineers, Directors, Enterprise Architects  

---

## 1. Executive Summary & Objective

In this final wrap-up module, you solidify the architectural takeaways, demonstrate compliance with enterprise security standards (OWASP Top 10 for LLMs), provide clear hardware sizing guidelines, and answer the toughest questions from the 1,000 engineers.

---

## 2. OWASP Top 10 for LLMs: Enterprise Compliance Matrix

Present this compliance mapping to demonstrate why this architecture satisfies corporate security and compliance officers:

| OWASP LLM Vulnerability | Attack Vector | Architectural Mitigation in 6-Plane Decoupled Model |
| :--- | :--- | :--- |
| **LLM01: Prompt Injection** | Malicious instructions in Jira tickets or PR comments. | **Plane 2 LLM Gateway**: Regex DLP filters sanitize inputs; **Plane 6 Policy Service** blocks unauthorized action classes. |
| **LLM02: Sensitive Info Disclosure** | Accidental leakage of AWS keys, database passwords. | **Plane 3 Scoped Secret Broker**: Ephemeral tokens are injected directly into subprocesses and never enter LLM prompt context. |
| **LLM06: Excessive Agency** | Agent hallucinating branch deletion or production pushes. | **Plane 3 MCP Action Classification**: Autonomous agents are hard-restricted to `read` and `draft` actions; `deploy` is blocked. |
| **LLM08: Vector Store Poisoning** | Malicious injection into vector database embeddings. | **Plane 5 pgvector**: Parameterized SQL queries with strict role-based access control (RBAC) on PostgreSQL tables. |
| **LLM10: Model Theft & Egress** | Proprietary codebases transmitted to third-party endpoints. | **Plane 2 Local Metal GPU**: 100% of inference runs locally on Apple Silicon Metal shaders; zero network packets leave the machine. |

---

## 3. Production Sizing & Infrastructure Architecture

Provide clear sizing guidelines for team leads scaling this platform across their engineering organizations:

### Tier 1: Local Developer Machine (Personal Mac M2/M3/M4)
- **Target**: Individual developer running local iterative coding loops.
- **Hardware**: Apple Silicon Mac (M2, M2 Pro, M2 Max, M3, M4) with 16 GB+ Unified RAM.
- **Runtime**: Native Ollama Metal Engine + Rootless Podman Machine (4 CPU, 6 GB RAM).
- **Cost**: **$0.00 / month** (Zero cloud infrastructure cost).

### Tier 2: Shared Departmental Cluster (Private Kubernetes / VPC)
- **Target**: Centralized platform cluster supporting 250 concurrent developers.
- **Compute**: 2x GPU Worker Nodes (Nvidia L4 24GB or A10G 24GB) running **vLLM** with Ray Serve.
- **Container Platform**: Red Hat OpenShift or AWS EKS with rootless Podman/CRI-O runtime.
- **Database**: Amazon Aurora PostgreSQL (pgvector enabled) + Amazon ElastiCache Redis.
- **Orchestration**: Self-hosted Temporal Cluster on Kubernetes with PostgreSQL persistence.

---

## 4. Audience Q&A Handbook (The Top 6 Questions from 1,000 Engineers)

Here are the authoritative, battle-tested answers to the questions your audience will ask:

### Q1: "Why did we mandate rootless Podman instead of Docker Desktop?"
**Answer**:
In enterprise organizations with over 1,000 developers, standardizing on Docker Desktop introduces two severe roadblocks:
1. **Security Vulnerability**: Docker Desktop relies on a background root daemon (`dockerd`). If a container escapes or has a vulnerability, it inherits root privileges on the host. Podman is **daemonless and rootless by default**; container processes run under unprivileged user namespaces.
2. **Licensing**: Docker Desktop requires costly commercial enterprise licenses for companies with >250 employees. Podman is 100% open-source (Apache 2.0) and supported natively on macOS via Apple's Hypervisor framework.

### Q2: "What if an engineer on our team is on an Intel Mac or Windows laptop?"
**Answer**:
The entire platform is 100% container-native and standards-based:
- On an Intel Mac or Windows (WSL2), run `podman compose -f podman-compose.local.yml up -d`.
- For LLM inference, Podman boots the standard x86 `ollama` container. While token generation will be slower than Apple Silicon Metal shaders (~10-15 tok/s on CPU), every single API, database, and Temporal workflow behaves identically with zero code changes.

### Q3: "How do we prevent the LLM from hallucinating security vulnerabilities into the code?"
**Answer**:
We use a 3-layer automated verification gate:
1. **Grounded RAG**: The agent is injected with your company's security ADRs before generating code.
2. **Sandboxed Pytest**: In `evaluate_tests`, the code is tested against positive and negative test cases before any git commit is created.
3. **Mandatory Human-in-the-Loop Gate**: The agent can only create a **Draft PR**. It is mathematically impossible for the agent to merge code into production without a human engineer reviewing the diff and cryptographically signing off in Temporal.

### Q4: "Can this integrate with corporate GitLab, Bitbucket, or Azure DevOps instead of GitHub?"
**Answer**:
Yes, effortlessly. Because we use the **Model Context Protocol (MCP)**, the agent has no idea what git vendor is hosting the code. You simply swap the tool adapter in `planes/tool-integration-plane/tools/git_adapter.py` to use python-gitlab or the Bitbucket REST API. The LangGraph StateGraph and Temporal workflows remain 100% unchanged.

### Q5: "Why do we need Redis if PostgreSQL is already storing checkpoints?"
**Answer**:
They serve two distinct performance requirements:
- **PostgreSQL 16**: Durable persistence for long-term vector embeddings (pgvector) and LangGraph node state checkpoints.
- **Redis 7**: High-speed, microsecond in-memory session caching, distributed locks for concurrent agent workers, and sliding-window rate limiters to prevent runaway query loops.

### Q6: "How does this platform support SOC2 Type II and ISO 27001 audit compliance?"
**Answer**:
Every interaction is cryptographically recorded:
1. **Temporal Event History**: Temporal generates an immutable, tamper-proof event ledger recording every activity, input payload, output result, retry timestamp, and human approval signature.
2. **Zero Cloud Egress**: Audit logs prove that proprietary source code never traversed public third-party LLM APIs.

---

## 5. Facilitator Closing Script & Spoken Wrap-Up

> *"To wrap up today's masterclass:
> We set out to prove that enterprise agentic engineering does not require unbounded security risks, fragile scripts, or million-dollar cloud API invoices.
> 
> By decoupling our architecture into the 6 Planes:
> 1. Our Experience Plane provides clean human control.
> 2. Our Agent Control Plane uses LangGraph cyclical state machines with PostgreSQL checkpoints.
> 3. Our Tool Integration Plane uses Model Context Protocol with zero-trust action classes.
> 4. Our Workflow Plane uses Temporal for multi-day human-in-the-loop durability.
> 5. Our Knowledge Plane uses pgvector hybrid search for grounded architectural decisions.
> 6. And our Governance Plane enforces enterprise compliance while our local Apple Silicon Metal GPUs deliver 48 tokens a second for zero dollars.
> 
> You have everything you need in the monorepo. Clone it, run `podman compose -f podman-compose.local.yml up -d`, and start building production-ready agents today. Thank you!"*
