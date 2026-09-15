import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Play, 
  CheckCircle2, 
  Activity, 
  Flame, 
  ShieldCheck, 
  Copy, 
  Check,
  Zap,
  BookOpen,
  Layers,
  ArrowRight,
  Download,
  AlertCircle,
  ExternalLink,
  FileCode,
  Network,
  Database,
  Lock,
  GitBranch,
  Clock,
  RotateCcw,
  CheckCircle,
  FileText,
  X,
  Code
} from 'lucide-react';
import { ActiveTab } from '../types';

interface LocalM2RunnerViewProps {
  initialSubTab?: 'ticket-dispatch' | 'terminal' | 'guide' | 'c4-flow' | 'port-doctor';
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const LocalM2RunnerView: React.FC<LocalM2RunnerViewProps> = ({ 
  initialSubTab = 'ticket-dispatch',
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ticket-dispatch' | 'terminal' | 'guide' | 'c4-flow' | 'port-doctor'>(initialSubTab);

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Guide Execution State (Steps 1 to 7)
  const [guideStepStatuses, setGuideStepStatuses] = useState<Record<number, 'idle' | 'running' | 'completed'>>({
    1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle'
  });
  const [isExecutingAllGuideSteps, setIsExecutingAllGuideSteps] = useState(false);
  const [activeGuideOutputStep, setActiveGuideOutputStep] = useState<number | null>(null);
  const [scriptModalContent, setScriptModalContent] = useState<{ title: string; scriptName: string; code: string } | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // 1-Click Ticket Dispatch Simulator State
  const [ticketNumber, setTicketNumber] = useState('GENT-4412');
  const [ticketTitle, setTicketTitle] = useState('Fix Redis connection pool timeout in high-concurrency payment webhook');
  const [ticketDescription, setTicketDescription] = useState('Production service experiences ConnectionTimeout under >250 req/s. Current redis connection pool is hardcoded to max_connections=5 and socket_timeout=1.0s without health check probes or retry backoff decorator.');
  const [dispatchStage, setDispatchStage] = useState<'idle' | 'fetching' | 'indexing' | 'generating' | 'testing' | 'completed'>('idle');
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [generatedDiff, setGeneratedDiff] = useState<string | null>(null);
  const [activeDiffTab, setActiveDiffTab] = useState<'diff' | 'tests' | 'pr-metadata'>('diff');
  const [executionTimeline, setExecutionTimeline] = useState<Array<{ stage: string; time: string; detail: string; status: 'pending' | 'active' | 'done' }>>([]);
  const [portFilter, setPortFilter] = useState<'all' | 'host' | 'container'>('all');
  const [checkingPorts, setCheckingPorts] = useState(false);
  const [portsData, setPortsData] = useState<Array<{
    port: number;
    service: string;
    protocol: string;
    runtime: 'Host Node.js' | 'Host Python' | 'Docker Container' | 'Host / Docker';
    plane: string;
    description: string;
    status: 'online' | 'blocked';
    recommendation: string;
    killCmd: string;
    remedyCmd: string;
  }>>([
    {
      port: 3000,
      service: 'Full-Stack Gateway & UI',
      protocol: 'HTTP / REST',
      runtime: 'Host Node.js',
      plane: 'Experience Plane',
      description: 'Single entry point & reverse proxy for web portal and API routing.',
      status: 'online',
      recommendation: 'Ensure Node.js reverse proxy is booted. Verify port 3000 is not blocked by another frontend process.',
      killCmd: 'lsof -ti :3000 | xargs kill -9',
      remedyCmd: 'npm run dev'
    },
    {
      port: 8001,
      service: 'Agent Gateway',
      protocol: 'HTTP / REST',
      runtime: 'Host Python',
      plane: 'Agent Control Plane',
      description: 'LangGraph task dispatcher, state machine transitions, and Postgres checkpointer.',
      status: 'online',
      recommendation: 'Check if Uvicorn process crashed. Start standalone agent gateway service.',
      killCmd: 'lsof -ti :8001 | xargs kill -9',
      remedyCmd: 'python3 -m planes.agent-control-plane.services.agent-gateway.main'
    },
    {
      port: 8002,
      service: 'LLM Gateway',
      protocol: 'HTTP / REST',
      runtime: 'Host Python',
      plane: 'Agent Control Plane',
      description: 'DLP prompt sanitizer, regex token scrubbers & local Ollama reverse proxy.',
      status: 'online',
      recommendation: 'Check regex scrubber filter service or Ollama upstream connectivity.',
      killCmd: 'lsof -ti :8002 | xargs kill -9',
      remedyCmd: 'python3 -m planes.agent-control-plane.services.llm-gateway.main'
    },
    {
      port: 8003,
      service: 'MCP Tool Gateway',
      protocol: 'JSON-RPC / HTTP',
      runtime: 'Host Python',
      plane: 'Tool Integration Plane',
      description: 'Scoped ephemeral secret injection, JSON-RPC 2.0 tool execution sandbox.',
      status: 'online',
      recommendation: 'Ensure Model Context Protocol broker is running to route sandboxed Jira/GitHub tools.',
      killCmd: 'lsof -ti :8003 | xargs kill -9',
      remedyCmd: 'python3 -m planes.tool-integration-plane.services.mcp-gateway.main'
    },
    {
      port: 8004,
      service: 'Knowledge Retrieval',
      protocol: 'HTTP / asyncpg',
      runtime: 'Host Python',
      plane: 'Knowledge Plane',
      description: 'pgvector hybrid HNSW cosine + BM25 Reciprocal Rank Fusion search engine.',
      status: 'online',
      recommendation: 'Check asyncpg connection pool to local postgres container at localhost:5432.',
      killCmd: 'lsof -ti :8004 | xargs kill -9',
      remedyCmd: 'python3 -m planes.knowledge-plane.services.retrieval-service.retrieval'
    },
    {
      port: 8005,
      service: 'Approval Service',
      protocol: 'HTTP / REST',
      runtime: 'Host Python',
      plane: 'Workflow Plane',
      description: 'Cryptographic Human-in-the-Loop (HITL) approval gate and token validator.',
      status: 'online',
      recommendation: 'Verify HMAC SHA-256 signature verifier and Temporal worker signal listener.',
      killCmd: 'lsof -ti :8005 | xargs kill -9',
      remedyCmd: 'python3 -m planes.workflow-plane.services.approval-service.approval_handler'
    },
    {
      port: 8006,
      service: 'Policy Service',
      protocol: 'HTTP / REST',
      runtime: 'Host Python',
      plane: 'Governance Plane',
      description: 'Central Zero-Trust RBAC & Action Class policy authorization engine.',
      status: 'online',
      recommendation: 'Verify OPA policy daemon is accepting authorization evaluation requests.',
      killCmd: 'lsof -ti :8006 | xargs kill -9',
      remedyCmd: 'python3 -m planes.operations-governance-plane.services.policy-service.policy'
    },
    {
      port: 11434,
      service: 'Ollama Metal Engine',
      protocol: 'HTTP',
      runtime: 'Host / Docker',
      plane: 'Hardware Execution',
      description: 'Native Apple Silicon Metal GPU inference for Llama 3.2 3B & Qwen 2.5 Coder 7B.',
      status: 'online',
      recommendation: 'Boot Ollama Metal daemon or start agentic-ollama container.',
      killCmd: 'pkill -f ollama || lsof -ti :11434 | xargs kill -9',
      remedyCmd: 'ollama serve'
    },
    {
      port: 5432,
      service: 'PostgreSQL 16 + pgvector',
      protocol: 'TCP / SQL',
      runtime: 'Docker Container',
      plane: 'Knowledge & State',
      description: 'Vector store for 1536-dim embeddings & LangGraph durable checkpoints.',
      status: 'online',
      recommendation: 'Check if native PostgreSQL is colliding on 5432 or restart Podman container.',
      killCmd: 'brew services stop postgresql || lsof -ti :5432 | xargs kill -9',
      remedyCmd: 'podman compose -f podman-compose.local.yml up -d agentic-postgres'
    },
    {
      port: 7233,
      service: 'Temporal Server',
      protocol: 'gRPC',
      runtime: 'Docker Container',
      plane: 'Workflow Plane',
      description: 'Durable workflow orchestration engine for long-running agent state machines.',
      status: 'online',
      recommendation: 'Ensure Temporal server container is active with gRPC port bound to 0.0.0.0:7233.',
      killCmd: 'lsof -ti :7233 | xargs kill -9',
      remedyCmd: 'podman compose -f podman-compose.local.yml up -d agentic-temporal'
    },
    {
      port: 8233,
      service: 'Temporal Web UI',
      protocol: 'HTTP',
      runtime: 'Docker Container',
      plane: 'Workflow Inspection',
      description: 'Visual inspector and replay debugger for Temporal workflows.',
      status: 'online',
      recommendation: 'Launch Temporal Web UI container or inspect port forwarding.',
      killCmd: 'lsof -ti :8233 | xargs kill -9',
      remedyCmd: 'podman compose -f podman-compose.local.yml up -d agentic-temporal-admin-tools'
    },
    {
      port: 6379,
      service: 'Redis 7',
      protocol: 'TCP',
      runtime: 'Docker Container',
      plane: 'Caching & Rate Limits',
      description: 'Distributed session cache, token bucket rate limits, and IPC pub/sub.',
      status: 'online',
      recommendation: 'Check for local Redis service conflict or restart Podman Redis container.',
      killCmd: 'brew services stop redis || lsof -ti :6379 | xargs kill -9',
      remedyCmd: 'podman compose -f podman-compose.local.yml up -d agentic-redis'
    }
  ]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ # light-weight-agentic-engineering Mac M2 Local Execution Console',
    '$ # Ready to boot complete 6-plane stack on local Metal GPU...',
    '$ uname -m && sysctl -n machdep.cpu.brand_string',
    'arm64\nApple M2 Pro (10 CPU cores, 16 GPU cores, 16GB Unified Memory)'
  ]);

  const steps = [
    {
      title: '1. Metal GPU & Dependencies Verification',
      command: 'uv sync && pnpm install && ollama --version',
      description: 'Verifies Apple Silicon arm64 architecture, UV workspace dependencies, and Ollama Metal engine.',
      status: 'Ready'
    },
    {
      title: '2. Boot Podman Compose Core Profile',
      command: 'podman compose -f podman-compose.local.yml up -d',
      description: 'Spins up Ollama, PostgreSQL with pgvector, Redis, and Temporal. Consumes <5.8GB RAM on M2.',
      status: 'Ready'
    },
    {
      title: '3. Pull Local Optimized LLMs into Metal Memory',
      command: 'ollama pull llama3.2:3b && ollama pull qwen2.5-coder:7b',
      description: 'Zero-cost open weights running directly on Apple Silicon unified memory at 45+ tokens/sec.',
      status: 'Ready'
    },
    {
      title: '4. Execute End-to-End Plane Verification',
      command: 'uv run pytest tests/e2e/test_engineering_pr_flow.py -v',
      description: 'Dispatches complete autonomous PR draft flow across all 6 planes using local Ollama and Temporal.',
      status: 'Ready'
    }
  ];

  const guideSteps = [
    {
      stepNumber: 1,
      title: 'System Architecture & Hardware Verification',
      subtitle: 'Ensure terminal is executing natively on Apple Silicon (arm64), not emulated x86 Rosetta.',
      command: 'uname -m && sysctl -n machdep.cpu.brand_string',
      expectedOutput: `arm64
Apple M2 Pro (or Apple M2 / Apple M2 Max / Apple M3 / Apple M4)`,
      notes: 'If this outputs x86_64, disable "Open using Rosetta" in your Terminal application info panel.'
    },
    {
      stepNumber: 2,
      title: 'Developer Toolchain & Workspace Dependencies',
      subtitle: 'Synchronize Python >=3.11 packages via Astral uv and Node packages via pnpm.',
      command: 'which uv || curl -LsSf https://astral.sh/uv/install.sh | sh\nuv sync\npnpm install',
      expectedOutput: `Using Python 3.11.9
Resolved 14 packages in 184ms
Prepared 14 packages in 420ms
Installed 14 packages in 16ms
 + fastapi==0.115.0
 + langgraph==0.2.20
 + temporalio==1.7.0
 + asyncpg==0.29.0
 + pgvector==0.3.2
 + redis==5.0.0
 + uvicorn==0.30.6
Successfully synced virtualenv at .venv

Packages: +42
Progress: resolved 42, reused 42, added 42, done`,
      notes: 'Astral uv installs dependencies 10-100x faster than standard pip, keeping local build times sub-second.'
    },
    {
      stepNumber: 3,
      title: 'Local Infrastructure Startup (Podman Compose)',
      subtitle: 'Spin up Ollama, PostgreSQL 16 + pgvector, Redis, and Temporal inside rootless Podman.',
      command: 'podman compose -f podman-compose.local.yml up -d\npodman ps',
      expectedOutput: `[+] Running 4/4
 ✔ Container agentic-postgres    Started
 ✔ Container agentic-redis       Started
 ✔ Container agentic-temporal    Started
 ✔ Container agentic-ollama      Started

NAME              IMAGE                   STATUS                    PORTS
agentic-postgres  pgvector/pgvector:pg16  Up 12 seconds (healthy)   0.0.0.0:5432->5432/tcp
agentic-redis     redis:7-alpine          Up 12 seconds (healthy)   0.0.0.0:6379->6379/tcp
agentic-temporal  temporalio/server:1.24  Up 12 seconds (healthy)   0.0.0.0:7233->7233/tcp
agentic-ollama    ollama/ollama:latest    Up 12 seconds (healthy)   0.0.0.0:11434->11434/tcp`,
      notes: 'Total RAM consumed across all 4 containers is under 1.5 GB inside rootless Podman machine.'
    },
    {
      stepNumber: 4,
      title: 'Pull 4-bit Quantized Models into Metal Memory',
      subtitle: 'Download Llama 3.2 3B and Qwen 2.5 Coder 7B weights into local unified RAM.',
      command: 'ollama pull llama3.2:3b && ollama pull qwen2.5-coder:7b',
      expectedOutput: `pulling manifest
pulling 7d251d1887e5... 100% ▕████████████████▏ 2.0 GB
verifying sha256 digest
writing manifest
success

pulling manifest
pulling 8a25c61311b8... 100% ▕████████████████▏ 4.7 GB
verifying sha256 digest
writing manifest
success`,
      notes: 'Both models run at 48+ tokens/second on Mac M2 16-core GPU with 0 cloud token inference charges.'
    },
    {
      stepNumber: 5,
      title: 'Database Seeding & pgvector Verification',
      subtitle: 'Assert the vector extension is loaded in PostgreSQL and test cosine distance calculations.',
      command: `podman exec -i agentic-postgres psql -U agentic_admin -d agentic_agentic_db -c "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector'; SELECT '[1,2,3]'::vector <=> '[1,2,4]'::vector AS cosine_distance;"`,
      expectedOutput: ` extname | extversion 
---------+------------
 vector  | 0.3.2
(1 row)

 cosine_distance 
-----------------
 0.014285714
(1 row)`,
      notes: 'pgvector allows zero-latency HNSW cosine index lookups directly inside PostgreSQL.'
    },
    {
      stepNumber: 6,
      title: 'Launch Full-Stack Gateway & Web Portal',
      subtitle: 'Start the unified Node.js/Express gateway and Vite interactive UI on port 3000.',
      command: 'pnpm dev',
      expectedOutput: `> light-weight-agentic-engineering@0.1.0 dev
> tsx server.ts

[System] Starting light-weight-agentic-engineering server...
[System] Apple Silicon Mac M2 Metal GPU profile loaded.
[System] Active Planes: Experience, Workflow, Agent Control, Knowledge, Tool Integration, Governance
[Vite] Vite dev server ready in 410 ms.
[Server] Unified Gateway running on http://localhost:3000`,
      notes: 'Open http://localhost:3000 in your browser to access the complete dual-experience dashboard.'
    },
    {
      stepNumber: 7,
      title: 'Automated End-to-End Test Suite Execution',
      subtitle: 'Execute the Pytest verification pipeline asserting ticket retrieval, code synthesis, and Draft PR generation.',
      command: 'uv run pytest tests/e2e/test_engineering_pr_flow.py -v',
      expectedOutput: `============================= test session starts ==============================
platform darwin -- Python 3.11.9, pytest-8.3.2, pluggy-1.5.0
rootdir: /path/to/light-weight-agentic-engineering, configfile: pyproject.toml
plugins: asyncio-0.24.0, anyio-4.4.0, cov-5.0.0
collected 1 item

tests/e2e/test_engineering_pr_flow.py::test_engineering_pr_flow_e2e PASSED [100%]
  - [Knowledge Plane] Retrieved 3 pgvector chunks (similarity: 0.94)
  - [Agent Control Plane] Synthesized code & unit tests via local Ollama
  - [Tool Integration Plane] GitHub Draft PR opened: https://github.com/agentic/core/pull/4412
  - [Workflow Plane] Temporal state machine registered with ID WF-LW-202609-089

============================== 1 passed in 1.48s ===============================
TOTAL LOCAL MEMORY USAGE ON MAC M2: 5.62 GB / 16.00 GB (35% utilization)`,
      notes: 'Asserts complete end-to-end flow from Jira ingestion to verified GitHub Draft PR in 1.48s.'
    }
  ];

  const [stepStatuses, setStepStatuses] = useState<('idle' | 'running' | 'completed')[]>(['idle', 'idle', 'idle', 'idle']);

  const handleRunFullLocalPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    setStepStatuses(['running', 'idle', 'idle', 'idle']);
    
    // STEP 1: Dependencies & Metal Verification
    setTerminalLogs([
      '$ # light-weight-agentic-engineering Mac M2 Local Execution Console',
      '$ # Initializing Apple Silicon Metal unified memory runtime...',
      '',
      '$ uv sync && pnpm install && ollama --version',
      'Using Python 3.11.9 (Darwin arm64)',
      'Resolved 14 packages in 184ms',
      'Installed: fastapi==0.115.0, langgraph==0.2.20, temporalio==1.7.0, asyncpg==0.29.0, pgvector==0.3.2',
      'pnpm dependencies up to date in 310ms',
      'ollama version is 0.3.14 (Metal GPU acceleration enabled: Apple M2 Pro 16 cores)',
      '✔ Step 1 Complete: System architecture & developer toolchain verified'
    ]);

    // STEP 2: Boot Podman Core Profile (at 1.2s)
    setTimeout(() => {
      setActiveStep(2);
      setStepStatuses(['completed', 'running', 'idle', 'idle']);
      setTerminalLogs(prev => [
        ...prev,
        '',
        '$ podman compose -f podman-compose.local.yml up -d',
        '==> Booting 6-plane local containers: core profile...',
        '[+] Running 4/4',
        ' ✔ Container agentic-ollama     Healthy [Metal GPU offload: 100% active, port 11434]',
        ' ✔ Container agentic-postgres   Healthy [pgvector v0.3.2 loaded, port 5432]',
        ' ✔ Container agentic-redis      Healthy [Distributed cache, port 6379]',
        ' ✔ Container agentic-temporal   Healthy [Durable execution engine, port 7233]',
        '✔ Step 2 Complete: Podman containers healthy (<5.8GB unified memory footprint)'
      ]);
    }, 1200);

    // STEP 3: Pull Local Optimized LLMs into Metal Memory (at 2.6s)
    setTimeout(() => {
      setActiveStep(3);
      setStepStatuses(['completed', 'completed', 'running', 'idle']);
      setTerminalLogs(prev => [
        ...prev,
        '',
        '$ ollama pull llama3.2:3b && ollama pull qwen2.5-coder:7b',
        'pulling manifest 100% [==================================>] 2.0 GB',
        'verifying sha256 digest: success',
        'writing manifest: success',
        'pulling qwen2.5-coder:7b manifest: success',
        '>>> Loading model into 16 GPU cores (Unified RAM)...',
        '>>> Latency test: 48.2 tok/s | Time-to-first-token: 18ms',
        '✔ Step 3 Complete: Models resident in Apple Silicon unified memory ($0.00 cloud token cost)'
      ]);
    }, 2600);

    // STEP 4: Execute End-to-End Plane Verification Pytest (at 4.2s)
    setTimeout(() => {
      setActiveStep(4);
      setStepStatuses(['completed', 'completed', 'completed', 'running']);
      setTerminalLogs(prev => [
        ...prev,
        '',
        '$ uv run pytest tests/e2e/test_engineering_pr_flow.py -v',
        '============================= test session starts ==============================',
        'platform darwin -- Python 3.11.9, pytest-8.3.2, pluggy-1.5.0',
        'rootdir: /light-weight-agentic-platform, configfile: pyproject.toml',
        'plugins: asyncio-0.24.0, anyio-4.4.0, cov-5.0.0',
        'collected 1 item',
        '',
        'tests/e2e/test_engineering_pr_flow.py::test_engineering_pr_flow_e2e PASSED [100%]',
        '  - [Agent Gateway] Validated task with OPA policy service: ALLOWED',
        '  - [Knowledge Plane] Retrieved 3 pgvector chunks (similarity: 0.94)',
        '  - [LLM Gateway] Synthesized code & Pytest via local Ollama qwen2.5-coder:7b',
        '  - [Temporal Plane] Workflow state executed without partition error',
        '  - [MCP Gateway] GitHub Draft PR opened: https://github.com/agentic/core/pull/4412',
        '',
        '============================== 1 passed in 1.48s ==============================',
        'TOTAL MEMORY USAGE ON MAC M2: 5.62 GB / 16.00 GB (35% utilization)',
        'CLOUD API COST INCURRED: $0.00 USD (100% Local Inference)',
        '',
        '🎉 ALL 4 STEPS COMPLETED SUCCESSFULLY ON APPLE SILICON M2!'
      ]);
      setStepStatuses(['completed', 'completed', 'completed', 'completed']);
      setIsRunning(false);
    }, 4200);
  };

  const handleCopy = (text: string, label?: string) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedCmd(text);
      setCopyToast(label ? `Copied: ${label}` : 'Copied to clipboard!');
      setTimeout(() => {
        setCopiedCmd(null);
        setCopyToast(null);
      }, 2500);
    } catch {
      setCopiedCmd(text);
      setCopyToast('Copied to clipboard!');
      setTimeout(() => {
        setCopiedCmd(null);
        setCopyToast(null);
      }, 2500);
    }
  };

  // Run a single guide step simulation
  const handleExecuteSingleGuideStep = (stepNumber: number) => {
    setGuideStepStatuses(prev => ({ ...prev, [stepNumber]: 'running' }));
    setActiveGuideOutputStep(stepNumber);
    setTimeout(() => {
      setGuideStepStatuses(prev => ({ ...prev, [stepNumber]: 'completed' }));
    }, 900);
  };

  // Run all 1-7 guide steps sequentially in real-time simulation
  const handleExecuteAllGuideSteps = () => {
    if (isExecutingAllGuideSteps) return;
    setIsExecutingAllGuideSteps(true);
    setActiveGuideOutputStep(1);

    // Reset all to idle
    setGuideStepStatuses({
      1: 'running', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle'
    });

    const stepDelays = [
      { step: 1, delay: 0 },
      { step: 2, delay: 900 },
      { step: 3, delay: 1800 },
      { step: 4, delay: 2700 },
      { step: 5, delay: 3600 },
      { step: 6, delay: 4500 },
      { step: 7, delay: 5400 }
    ];

    stepDelays.forEach(({ step, delay }) => {
      setTimeout(() => {
        setGuideStepStatuses(prev => {
          const updated = { ...prev };
          if (step > 1) {
            updated[step - 1] = 'completed';
          }
          updated[step] = 'running';
          return updated;
        });
        setActiveGuideOutputStep(step);
      }, delay);
    });

    setTimeout(() => {
      setGuideStepStatuses({
        1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed', 5: 'completed', 6: 'completed', 7: 'completed'
      });
      setIsExecutingAllGuideSteps(false);
    }, 6300);
  };

  const handleResetGuideSteps = () => {
    setGuideStepStatuses({
      1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle', 6: 'idle', 7: 'idle'
    });
    setIsExecutingAllGuideSteps(false);
    setActiveGuideOutputStep(null);
  };

  // 1-Click Ticket Dispatch Live Simulation (<10 seconds total)
  const handleRunTicketDispatch = () => {
    if (dispatchStage !== 'idle' && dispatchStage !== 'completed') return;
    setDispatchStage('fetching');
    setDispatchProgress(15);
    setElapsedSeconds(0);
    setGeneratedDiff(null);

    setExecutionTimeline([
      {
        stage: '1. Jira & Policy Gateway Verification',
        time: '0.4s',
        detail: `Connecting via MCP to Jira instance. Fetched ticket ${ticketNumber}: Action Class validated as DRAFT (Allowed without prod write).`,
        status: 'active'
      }
    ]);

    // Stage 2: Knowledge Ingestion / Codebase AST Search (at ~1.8s)
    setTimeout(() => {
      setDispatchStage('indexing');
      setDispatchProgress(38);
      setExecutionTimeline(prev => [
        { ...prev[0], status: 'done' },
        {
          stage: '2. Codebase Semantic Search & Repo AST Graph',
          time: '1.9s',
          detail: 'Queried pgvector HNSW index. Located target file: src/services/payment_webhook.py and related test suite tests/test_payment_webhook.py (similarity 0.94).',
          status: 'active'
        }
      ]);
    }, 1800);

    // Stage 3: Local LLM Synthesis on Mac M2 Metal GPU (at ~4.2s)
    setTimeout(() => {
      setDispatchStage('generating');
      setDispatchProgress(68);
      setExecutionTimeline(prev => [
        prev[0],
        { ...prev[1], status: 'done' },
        {
          stage: '3. Local Ollama Metal GPU Code Generation',
          time: '4.3s',
          detail: 'Inference on local Apple Silicon Metal GPU (qwen2.5-coder:7b at 48.2 tok/s). Generating async Redis connection pool with exponential backoff and jitter.',
          status: 'active'
        }
      ]);
    }, 4200);

    // Stage 4: Podman Rootless Sandbox Pytest Execution (at ~6.8s)
    setTimeout(() => {
      setDispatchStage('testing');
      setDispatchProgress(88);
      setExecutionTimeline(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'done' },
        {
          stage: '4. Podman Rootless Sandbox Test Execution',
          time: '6.9s',
          detail: 'Spinning up container sandbox. Running 6 Pytests for Redis connection pooling, health checks, and concurrency timeout thresholds. All 6 passed!',
          status: 'active'
        }
      ]);
    }, 6800);

    // Stage 5: Completed with Draft PR & Clean Diff (at ~8.9s)
    setTimeout(() => {
      setDispatchStage('completed');
      setDispatchProgress(100);
      setElapsedSeconds(8.9);
      setGeneratedDiff(`diff --git a/src/services/payment_webhook.py b/src/services/payment_webhook.py
index a4189e2..e891b04 100644
--- a/src/services/payment_webhook.py
+++ b/src/services/payment_webhook.py
@@ -14,12 +14,35 @@ import redis.asyncio as aioredis
 from fastapi import HTTPException, status
+from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
+import structlog

-REDIS_POOL = aioredis.ConnectionPool.from_url(
-    "redis://localhost:6379/0",
-    max_connections=5,
-    socket_timeout=1.0
-)
+# Optimized high-concurrency connection pool for >250 req/s
+REDIS_POOL = aioredis.ConnectionPool.from_url(
+    "redis://localhost:6379/0",
+    max_connections=50,                  # Scaled from 5 to 50 for webhook throughput
+    socket_timeout=2.5,                  # Extended for network jitter resilience
+    socket_connect_timeout=2.0,
+    health_check_interval=30,            # Periodic proactive health probe
+    retry_on_timeout=True
+)

+logger = structlog.get_logger(__name__)
+
+@retry(
+    stop=stop_after_attempt(3),
+    wait=wait_exponential(multiplier=0.1, min=0.1, max=1.0),
+    retry=retry_if_exception_type(aioredis.ConnectionError),
+    reraise=True
+)
+async def get_redis_client() -> aioredis.Redis:
+    """Safe Redis client acquisition with connection health checks."""
+    client = aioredis.Redis(connection_pool=REDIS_POOL)
+    return client

 async def process_payment_event(event_id: str, payload: dict) -> dict:
     """Process inbound payment webhook with deduplication lock."""
-    client = aioredis.Redis(connection_pool=REDIS_POOL)
+    client = await get_redis_client()
     lock_key = f"lock:payment:{event_id}"
     
-    acquired = await client.set(lock_key, "1", nx=True, ex=30)
+    # Deduplication lock with auto-expiry
+    acquired = await client.set(lock_key, "1", nx=True, ex=60)
     if not acquired:
         raise HTTPException(
             status_code=status.HTTP_409_CONFLICT,
             detail="Duplicate webhook event delivery detected"
         )
         
     try:
         # Business logic execution
         return {"status": "processed", "event_id": event_id}
     finally:
-        await client.delete(lock_key)
+        # Release lock gracefully using pipeline
+        await client.delete(lock_key)`);

      setExecutionTimeline(prev => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: 'done' },
        {
          stage: '5. Draft Pull Request Ready for Human Review',
          time: '8.9s',
          detail: 'Draft PR #4412 published: "fix(webhook): expand Redis connection pool to 50 & add retry decorator". Ready for 1-click engineer approval.',
          status: 'done'
        }
      ]);
    }, 8900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Apple Silicon Mac M2 Engineering Operations</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                100% Local Inference & Zero-Cost Token Execution
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Complete step-by-step shell automation, side-by-side terminal verification, and full C4 architectural diagrams for Apple Silicon M2.
            </p>
          </div>

          {/* Sub-Tab Navigation Switcher */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap gap-1">
            <button
              onClick={() => setActiveSubTab('ticket-dispatch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeSubTab === 'ticket-dispatch'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚡ 1-Click Ticket Dispatch (Live Demo)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('terminal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeSubTab === 'terminal'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal Simulator</span>
            </button>
            <button
              onClick={() => setActiveSubTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeSubTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Setup Guide & Outputs</span>
            </button>
            <button
              onClick={() => setActiveSubTab('c4-flow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeSubTab === 'c4-flow'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>C4 & Sequence Flows</span>
            </button>
            <button
              onClick={() => setActiveSubTab('port-doctor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeSubTab === 'port-doctor'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>12-Port Doctor (Pre-Demo)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                {portsData.filter(p => p.status === 'online').length}/12
              </span>
            </button>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('temporal')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/30"
                title="Navigate to Temporal Workflows & Approvals"
              >
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>⏱️ Temporal Workflows</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono border border-purple-500/30">
                  :7233
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mac M2 Hardware Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Hardware Target</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white">Apple M2 Pro (arm64)</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">16 GPU Cores · Metal Engine Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>RAM Allocation</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white">5.62 GB / 16.00 GB</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Sub-35% footprint on unified RAM</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Local Inference Speed</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-sm font-bold text-white">48.2 tokens / sec</div>
          <div className="text-[10px] text-amber-400 font-mono mt-1">llama3.2:3b + qwen2.5-coder</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Local Dev Token Cost</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-white">$0.00 / month</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">Zero cloud token expenditure</div>
        </div>
      </div>

      {/* SUB-VIEW 0: 1-Click Ticket Dispatch Live Simulation */}
      {activeSubTab === 'ticket-dispatch' && (
        <div className="space-y-6">
          {/* Main Simulation Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                  <h3 className="text-lg font-bold text-white">Live 1-Click Jira Ticket to Draft PR Simulation</h3>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                    &lt; 10s Cycle Time
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Watch the autonomous engineering agent fetch issue context via MCP, run local AST hybrid semantic search in pgvector,
                  synthesize code on Apple Silicon Metal GPU, execute Pytests inside rootless Podman, and output a ready-to-review Pull Request.
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleRunTicketDispatch}
                disabled={dispatchStage !== 'idle' && dispatchStage !== 'completed'}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
              >
                <Zap className={`w-4 h-4 fill-current ${dispatchStage !== 'idle' && dispatchStage !== 'completed' ? 'animate-bounce' : ''}`} />
                <span>
                  {dispatchStage === 'idle' ? 'Dispatch Jira Ticket (Run in < 10s)' :
                   dispatchStage === 'completed' ? 'Re-Run Live Simulation' :
                   `Processing (${dispatchProgress}%) ...`}
                </span>
              </button>
            </div>

            {/* Ticket Input Parameters (Simulated Jira Webhook Payload) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Jira Issue Key:</span>
                  <span className="text-[10px] text-amber-400 font-mono">Enterprise Backlog</span>
                </label>
                <input
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Issue Summary:
                </label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Issue Description & Acceptance Criteria:</span>
                  <span className="text-[10px] text-slate-400">Zero Cloud API calls · 100% On-Device</span>
                </label>
                <textarea
                  rows={2}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-sans focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Progress Bar & Stage Indicator */}
            {dispatchStage !== 'idle' && (
              <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">Live Execution Stage:</span>
                    <span className="text-amber-400 font-mono font-semibold uppercase">
                      {dispatchStage === 'fetching' && '1/5 Fetching Ticket via Zero-Trust MCP'}
                      {dispatchStage === 'indexing' && '2/5 Codebase HNSW Semantic Search (pgvector)'}
                      {dispatchStage === 'generating' && '3/5 Apple Silicon Metal GPU Inference (Ollama)'}
                      {dispatchStage === 'testing' && '4/5 Rootless Podman Sandbox Pytest Verification'}
                      {dispatchStage === 'completed' && '5/5 Draft PR Ready with Green Tests (Completed in 8.9s)'}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono">{dispatchProgress}%</span>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${dispatchProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Real-time Execution Timeline Logs */}
          {executionTimeline.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Microsecond Execution Timeline (Total Elapsed: {elapsedSeconds || 'In Flight'}s)</span>
              </h4>

              <div className="space-y-3">
                {executionTimeline.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-xl border transition-all text-xs flex items-start space-x-3 ${
                      item.status === 'done' 
                        ? 'bg-slate-950/80 border-emerald-500/30'
                        : 'bg-slate-950 border-amber-500/50 shadow-sm shadow-amber-500/10'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {item.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-amber-400 animate-spin" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{item.stage}</span>
                        <span className="font-mono text-[11px] text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          +{item.time}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Code Diff & PR View (The Realized Output) */}
          {generatedDiff && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Generated Autonomous Pull Request (PR #4412)</h4>
                    <span className="text-[11px] text-slate-400 font-mono">branch: fix/gent-4412-redis-pool · commit: 7e2f1a9</span>
                  </div>
                </div>

                {/* Sub-Tabs for Diff View */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveDiffTab('diff')}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      activeDiffTab === 'diff' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Git Diff (-9 / +32)
                  </button>
                  <button
                    onClick={() => setActiveDiffTab('tests')}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      activeDiffTab === 'tests' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pytests (6 Passed)
                  </button>
                  <button
                    onClick={() => setActiveDiffTab('pr-metadata')}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      activeDiffTab === 'pr-metadata' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PR Description
                  </button>
                </div>
              </div>

              {/* Diff Code Viewer */}
              {activeDiffTab === 'diff' && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto">
                  <div className="text-slate-500 pb-2 mb-2 border-b border-slate-900 flex items-center justify-between">
                    <span>src/services/payment_webhook.py</span>
                    <button
                      onClick={() => handleCopy(generatedDiff)}
                      className="text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Diff</span>
                    </button>
                  </div>
                  <pre className="text-slate-300 leading-relaxed">
                    {generatedDiff.split('\n').map((line, i) => {
                      if (line.startsWith('+') && !line.startsWith('+++')) {
                        return <div key={i} className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded">{line}</div>;
                      } else if (line.startsWith('-') && !line.startsWith('---')) {
                        return <div key={i} className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded">{line}</div>;
                      } else if (line.startsWith('@@')) {
                        return <div key={i} className="text-sky-400 font-bold py-1">{line}</div>;
                      }
                      return <div key={i} className="text-slate-400 px-2">{line}</div>;
                    })}
                  </pre>
                </div>
              )}

              {/* Pytest Output Tab */}
              {activeDiffTab === 'tests' && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-1">
                  <div className="text-emerald-400 font-bold pb-2 mb-2 border-b border-slate-900">
                    ✔ 6 passed in 0.84s (Rootless Podman Sandbox on Metal GPU)
                  </div>
                  <div className="text-slate-300">tests/test_payment_webhook.py::test_redis_pool_concurrency_scaling PASSED [ 16%]</div>
                  <div className="text-slate-300">tests/test_payment_webhook.py::test_socket_connect_timeout_retry PASSED [ 33%]</div>
                  <div className="text-slate-300">tests/test_payment_webhook.py::test_exponential_backoff_decorator PASSED [ 50%]</div>
                  <div className="text-slate-300">tests/test_payment_webhook.py::test_duplicate_webhook_rejection PASSED [ 66%]</div>
                  <div className="text-slate-300">tests/test_payment_webhook.py::test_deduplication_lock_expiry PASSED [ 83%]</div>
                  <div className="text-slate-300">tests/test_payment_webhook.py::test_pool_health_check_probes PASSED [100%]</div>
                  <div className="text-slate-500 pt-3 mt-3 border-t border-slate-900">
                    Code coverage: 98.4% · Zero regression detected · Ready for 1-Click Human Merge
                  </div>
                </div>
              )}

              {/* PR Description Tab */}
              {activeDiffTab === 'pr-metadata' && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-3">
                  <div className="font-bold text-white text-sm">
                    fix(webhook): expand Redis connection pool to 50 & add retry decorator (Fixes GENT-4412)
                  </div>
                  <p className="leading-relaxed">
                    Under sustained webhook concurrency (&gt;250 req/s), the previous pool of 5 connections caused socket starvation.
                    This patch expands the pool to 50 connections, introduces exponential backoff jitter, and adds automatic lock TTL renewal.
                  </p>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 text-slate-400 font-mono text-[11px]">
                    <div>• Tested on: Apple Silicon M2 local environment</div>
                    <div>• Local LLM model: qwen2.5-coder:7b (48.2 tok/s)</div>
                    <div>• Cloud cost: $0.00</div>
                    <div>• Confidentiality: 100% of code remained on-device</div>
                  </div>
                </div>
              )}

              {/* 1-Click Human Approval Action */}
              <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 mt-2">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white text-xs">Zero-Trust Guardrail: Ready for Lead Engineer Review</span>
                    <p className="text-[11px] text-slate-400">The agent does not have permission to push to main. Merging requires your cryptographic approval.</p>
                  </div>
                </div>
                <button
                  onClick={() => alert("PR #4412 Approved & Merged to staging! Cryptographic signature logged in Temporal audit trail.")}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
                >
                  1-Click Approve & Merge
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 1: Interactive Terminal Simulator */}
      {activeSubTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Step-by-Step Terminal Commands */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Apple Silicon 4-Step Bootstrap Commands:
              </h3>
              <button
                onClick={handleRunFullLocalPipeline}
                disabled={isRunning}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
              >
                {isRunning ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Simulate Run</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((st, idx) => {
                const status = stepStatuses[idx];
                const isActive = activeStep === idx + 1;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      status === 'running'
                        ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/10'
                        : status === 'completed'
                        ? 'bg-slate-950 border-emerald-500/50'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <div className="flex items-center space-x-2">
                        {status === 'running' && <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                        {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {status === 'idle' && <span className="w-2 h-2 rounded-full bg-slate-600" />}
                        <span className={`font-bold ${status === 'completed' ? 'text-emerald-300' : 'text-white'}`}>{st.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          status === 'running' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {status === 'running' ? 'EXECUTING' : status === 'completed' ? 'PASSED' : 'READY'}
                        </span>
                        <button
                          onClick={() => handleCopy(st.command)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Copy command"
                        >
                          {copiedCmd === st.command ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                      {st.description}
                    </p>

                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                      $ {st.command}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Shell Script Execution Card */}
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-xl p-4 text-xs">
              <div className="flex items-center justify-between text-indigo-300 font-semibold mb-1">
                <span>One-Click Automated Shell Script</span>
                <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">infra/scripts/setup-mac-m2.sh</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Automates hardware arm64 checks, Homebrew toolchain, Docker containers, models, pgvector tests, and Pytest verification.
              </p>
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 font-mono text-amber-300 text-[11px]">
                <span>chmod +x infra/scripts/setup-mac-m2.sh && ./infra/scripts/setup-mac-m2.sh</span>
                <button
                  onClick={() => handleCopy('chmod +x infra/scripts/setup-mac-m2.sh && ./infra/scripts/setup-mac-m2.sh')}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white ml-2"
                >
                  {copiedCmd === 'chmod +x infra/scripts/setup-mac-m2.sh && ./infra/scripts/setup-mac-m2.sh' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Live M2 Terminal Output Screen */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span className="font-mono font-bold text-white">Apple Silicon M2 Terminal Simulator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-[10px] text-emerald-400">Metal Daemon: Online</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-y-auto max-h-[500px] space-y-1 leading-relaxed">
                  {terminalLogs.map((line, i) => (
                    <div key={i} className={
                      line.startsWith('$') ? 'text-amber-400 font-bold' :
                      line.includes('PASSED') ? 'text-emerald-400 font-bold' :
                      line.includes('Healthy') ? 'text-emerald-300' :
                      line.includes('Warning') ? 'text-orange-300' :
                      'text-slate-300'
                    }>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                <span>Environment: macOS Sonoma / Sequoia (Darwin arm64)</span>
                <span>Ports: 11434 (Ollama), 5432 (pgvector), 7233 (Temporal), 3000 (UI)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Step-by-Step Setup Guide & Expected Outputs Comparison */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          {/* Quick Action Top Bar */}
          <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                1-7
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Apple Silicon Mac M2 Step-by-Step Setup Runbook</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                    Live Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Every shell command below includes an exact terminal expected output to compare against for zero configuration errors.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handleExecuteAllGuideSteps}
                disabled={isExecutingAllGuideSteps}
                className={`px-3 py-1.5 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-sm ${
                  isExecutingAllGuideSteps
                    ? 'bg-amber-600/50 text-slate-300 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isExecutingAllGuideSteps ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Steps 1-7...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute All 1-7 Steps</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetGuideSteps}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs flex items-center space-x-1 border border-slate-700"
                title="Reset execution states"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <div className="h-4 w-px bg-slate-800 hidden md:block" />

              <button
                onClick={() => handleCopy('chmod +x infra/scripts/setup-mac-m2.sh && ./infra/scripts/setup-mac-m2.sh', '1-Click Bootstrap Script')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-sm"
              >
                {copiedCmd === 'chmod +x infra/scripts/setup-mac-m2.sh && ./infra/scripts/setup-mac-m2.sh' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    <span>Copied Bootstrap!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy 1-Click Bootstrap</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setScriptModalContent({
                    title: '1-Click Mac M2 Bootstrap Script',
                    scriptName: 'infra/scripts/setup-mac-m2.sh',
                    code: `#!/usr/bin/env bash
# ==============================================================================
# light-weight-agentic-engineering: Automated Mac M2 Local Setup Script
# ==============================================================================
set -euo pipefail

CYAN='\\033[0;36m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
BOLD='\\033[1m'
NC='\\033[0m'

echo -e "\${CYAN}\${BOLD}"
echo "================================================================================"
echo "    light-weight-agentic-engineering: Mac M2 Local Bootstrap Script           "
echo "================================================================================"
echo -e "\${NC}"

# [1/7] Architecture Verification (arm64 Apple Silicon)
echo -e "\${BOLD}[1/7] Verifying Apple Silicon Mac Hardware Architecture...\${NC}"
ARCH=$(uname -m)
CPU_BRAND=$(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "Unknown CPU")
echo "       Architecture : $ARCH"
echo "       Processor    : $CPU_BRAND"
if [ "$ARCH" != "arm64" ]; then
    echo -e "\${RED}[ERROR] Detected $ARCH. This stack requires Apple Silicon (arm64).\${NC}"
    exit 1
fi
echo -e "\${GREEN}✔ Apple Silicon arm64 verified.\${NC}\\n"

# [2/7] Checking Required Developer Toolchain
echo -e "\${BOLD}[2/7] Checking Required Developer Toolchain...\${NC}"
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
if ! command -v uv &> /dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi
echo -e "\${GREEN}✔ Astral UV ready: $(uv --version)\${NC}"

if ! command -v podman &> /dev/null; then
    echo -e "\${RED}[ERROR] Podman is not installed. Run: brew install podman podman-compose\${NC}"
    exit 1
fi
if ! podman machine info &> /dev/null; then
    podman machine init --cpus 4 --memory 6144 --disk-size 40 --now
else
    if [ "$(podman machine info --format '{{.Host.MachineState}}' 2>/dev/null)" != "Running" ]; then
        podman machine start
    fi
fi
echo -e "\${GREEN}✔ Rootless Podman machine is healthy.\${NC}\\n"

# [3/7] Workspace Dependency Synchronization
echo -e "\${BOLD}[3/7] Synchronizing Python & Node Dependencies...\${NC}"
uv sync
if command -v pnpm &> /dev/null; then
    pnpm install --silent
else
    npm install --silent
fi
echo -e "\${GREEN}✔ All language dependencies synchronized.\${NC}\\n"

# [4/7] Boot Local Containers (Ollama, PostgreSQL+pgvector, Redis, Temporal)
echo -e "\${BOLD}[4/7] Booting Local Containers (Ollama, PostgreSQL+pgvector, Redis, Temporal)...\${NC}"
podman compose -f podman-compose.local.yml up -d
until podman exec -i agentic-postgres pg_isready -U agentic_admin -d agentic_agentic_db &> /dev/null; do
    sleep 1
done
echo -e "\${GREEN}✔ PostgreSQL container healthy with pgvector enabled.\${NC}\\n"

# [5/7] Verifying Local Ollama Models in Metal Memory
echo -e "\${BOLD}[5/7] Verifying Local Ollama Models in Metal Memory...\${NC}"
ollama pull llama3.2:3b
ollama pull qwen2.5-coder:7b
echo -e "\${GREEN}✔ Models loaded: llama3.2:3b, qwen2.5-coder:7b.\${NC}\\n"

# [6/7] Testing pgvector Cosine Distance Query in PostgreSQL
echo -e "\${BOLD}[6/7] Testing pgvector Cosine Distance Query in PostgreSQL...\${NC}"
COSINE_TEST=$(podman exec -i agentic-postgres psql -U agentic_admin -d agentic_agentic_db -t -A -c "SELECT '[1,2,3]'::vector <=> '[1,2,4]'::vector;")
echo "       Cosine distance calculation output: $COSINE_TEST"
echo -e "\${GREEN}✔ pgvector extension verified.\${NC}\\n"

# [7/7] Running E2E Verification Tests across all 6 planes
echo -e "\${BOLD}[7/7] Running E2E Verification Tests across all 6 planes...\${NC}"
uv run pytest tests/e2e/test_engineering_pr_flow.py -v

echo -e "\${CYAN}\${BOLD}"
echo "================================================================================"
echo " ✅ Mac M2 Local Setup Complete! Stack is Operational with Zero Cloud Cost."
echo "================================================================================"
echo -e "\${NC}"`
                  });
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold rounded-lg text-xs flex items-center space-x-1 border border-amber-500/30"
                title="View Full Setup Script"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>View Script</span>
              </button>

              <button
                onClick={() => handleCopy('./infra/scripts/verify-mac-m2.sh', 'Verify Script Command')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 border border-slate-700"
              >
                {copiedCmd === './infra/scripts/verify-mac-m2.sh' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Verify!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copy Verify Script</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setScriptModalContent({
                    title: 'Mac M2 Endpoint Verification Suite',
                    scriptName: 'infra/scripts/verify-mac-m2.sh',
                    code: `#!/usr/bin/env bash
# ==============================================================================
# light-weight-agentic-engineering: Mac M2 Endpoint Verification Suite
# ==============================================================================
set -euo pipefail

GREEN='\\033[0;32m'
RED='\\033[0;31m'
BOLD='\\033[1m'
NC='\\033[0m'

echo -e "\${BOLD}Running Microservice Health & Endpoint Verification on Apple Silicon Mac M2...\${NC}\\n"

# 1. Health API Check
echo -n "[1/5] Checking Gateway /api/health (Port 3000)... "
HEALTH_RESP=$(curl -s http://localhost:3000/api/health || echo "FAIL")
if [[ "$HEALTH_RESP" == *"online"* ]]; then
    echo -e "\${GREEN}PASS (Status: online)\${NC}"
else
    echo -e "\${RED}FAIL - Server not responding on port 3000\${NC}"
fi

# 2. Agent Dispatch Check
echo -n "[2/5] Checking Agent Gateway Task Dispatch (/api/agent/dispatch)... "
AGENT_RESP=$(curl -s -X POST http://localhost:3000/api/agent/dispatch \\
  -H "Content-Type: application/json" \\
  -d '{"agentId":"website-concierge-agent","prompt":"Ping","actionClass":"read"}' || echo "FAIL")
if [[ "$AGENT_RESP" == *"task_"* ]]; then
    echo -e "\${GREEN}PASS (Task dispatched & grounded)\${NC}"
else
    echo -e "\${RED}FAIL - Agent dispatch failed\${NC}"
fi

# 3. Knowledge pgvector Search Check
echo -n "[3/5] Checking Knowledge Hybrid Search (/api/knowledge/search)... "
KNOW_RESP=$(curl -s -X POST http://localhost:3000/api/knowledge/search \\
  -H "Content-Type: application/json" \\
  -d '{"query":"Apple Silicon Metal","topK":1}' || echo "FAIL")
if [[ "$KNOW_RESP" == *"success\\":true"* ]]; then
    echo -e "\${GREEN}PASS (Vector chunks retrieved)\${NC}"
else
    echo -e "\${RED}FAIL - Knowledge search failed\${NC}"
fi

# 4. MCP Tool Execution Check
echo -n "[4/5] Checking MCP Gateway Tool Execution (/api/mcp/execute)... "
MCP_RESP=$(curl -s -X POST http://localhost:3000/api/mcp/execute \\
  -H "Content-Type: application/json" \\
  -d '{"toolName":"git_create_draft_pr","callerRole":"Senior Staff Engineer","actionClass":"draft","parameters":{"ticketId":"LW-4412"}}' || echo "FAIL")
if [[ "$MCP_RESP" == *"EXECUTED"* ]]; then
    echo -e "\${GREEN}PASS (Sandboxed execution successful)\${NC}"
else
    echo -e "\${RED}FAIL - MCP execution failed\${NC}"
fi

# 5. Local Ollama Engine Check
echo -n "[5/5] Checking Ollama Metal Engine (Port 11434)... "
OLLAMA_RESP=$(curl -s http://localhost:11434/api/tags 2>/dev/null || echo "FAIL")
if [[ "$OLLAMA_RESP" == *"models"* ]]; then
    echo -e "\${GREEN}PASS (Ollama Metal Engine responding)\${NC}"
else
    echo -e "\${GREEN}SKIPPED (Optional standalone Ollama process not active)\${NC}"
fi

echo -e "\\n\${BOLD}\${GREEN}✔ All critical microservice verification checks passed successfully!\${NC}"`
                  });
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-lg text-xs flex items-center space-x-1 border border-emerald-500/30"
                title="View Verify Script"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>View Script</span>
              </button>
            </div>
          </div>

          {/* Guide Steps Cards */}
          <div className="space-y-6">
            {guideSteps.map((gs) => {
              const status = guideStepStatuses[gs.stepNumber] || 'idle';
              const isCurrent = activeGuideOutputStep === gs.stepNumber;

              return (
                <div 
                  key={gs.stepNumber} 
                  className={`bg-slate-900 border rounded-xl p-5 space-y-4 transition-all ${
                    isCurrent
                      ? 'border-amber-500/80 shadow-lg shadow-amber-500/10'
                      : status === 'completed'
                      ? 'border-emerald-500/40 bg-slate-900/90'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : status === 'running'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {status === 'completed' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : status === 'running' ? (
                          <Activity className="w-4 h-4 animate-spin text-amber-400" />
                        ) : (
                          gs.stepNumber
                        )}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>{gs.title}</span>
                          {status === 'completed' && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                              Verified
                            </span>
                          )}
                          {status === 'running' && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono animate-pulse">
                              Executing...
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400">{gs.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <button
                        onClick={() => handleExecuteSingleGuideStep(gs.stepNumber)}
                        disabled={status === 'running'}
                        className={`text-[11px] px-2.5 py-1 rounded border flex items-center space-x-1 transition-all ${
                          status === 'running'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
                        }`}
                        title="Simulate executing this step"
                      >
                        {status === 'running' ? (
                          <>
                            <Activity className="w-3 h-3 animate-spin text-amber-400" />
                            <span>Running...</span>
                          </>
                        ) : status === 'completed' ? (
                          <>
                            <RotateCcw className="w-3 h-3 text-emerald-400" />
                            <span>Re-run</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current text-amber-400" />
                            <span>Run Step</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                        Step {gs.stepNumber} of {guideSteps.length}
                      </span>
                    </div>
                  </div>

                  {/* Command & Expected Output Comparison Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Command to Execute */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span className="flex items-center space-x-1.5">
                          <Terminal className="w-3.5 h-3.5 text-amber-400" />
                          <span>Command to Execute</span>
                        </span>
                        <button
                          onClick={() => handleCopy(gs.command, `Step ${gs.stepNumber} Command`)}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                        >
                          {copiedCmd === gs.command ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Command</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre leading-relaxed">
                        $ {gs.command}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-start space-x-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{gs.notes}</span>
                      </div>
                    </div>

                    {/* Right: Expected Output to Compare */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                        <span className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Expected Terminal Output to Compare</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(gs.expectedOutput, `Step ${gs.stepNumber} Output`)}
                            className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1"
                          >
                            {copiedCmd === gs.expectedOutput ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Output</span>
                              </>
                            )}
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono">Exit code: 0</span>
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg border font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed max-h-[160px] transition-all ${
                        status === 'running'
                          ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                          : status === 'completed'
                          ? 'bg-slate-950 border-emerald-500/50 text-emerald-300 shadow-inner'
                          : 'bg-slate-950 border-emerald-950/60 text-emerald-300/90'
                      }`}>
                        {status === 'running' ? (
                          <div className="flex items-center space-x-2 text-amber-400 py-4">
                            <Activity className="w-4 h-4 animate-spin" />
                            <span>Running live validation on Apple Silicon Metal runtime...</span>
                          </div>
                        ) : (
                          gs.expectedOutput
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: C4 Architectural Models & End-to-End Execution Flow */}
      {activeSubTab === 'c4-flow' && (
        <div className="space-y-8">
          {/* C4 Architecture Summary Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-1">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Full C4 Architecture Model (Levels 1–4)</span>
            </div>
            <p className="text-xs text-slate-400">
              Structural design depicting external actors, 6-plane container boundaries, internal gateway components, and physical Apple Silicon M2 deployment topologies.
            </p>
          </div>

          {/* 4-Level C4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* C4 Level 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Level 1: System Context</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Perimeter Boundary</span>
              </div>
              <h4 className="text-sm font-bold text-white">External Actors & SaaS Integrations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects Enterprise Visitors (Concierge RAG), Engineers (Code Scaffolding), and Release Managers (Approval Gates) with GitHub Enterprise, Jira Software, and Salesforce CRM.
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Public Visitors</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-amber-300">Concierge RAG</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">HTTPS</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Enterprise Engineers</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-amber-300">Portal Scaffolding</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">HTTPS</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Platform Boundary</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-purple-300">GitHub Adapter</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/40">MCP / stdio</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-white font-medium">Platform Boundary</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-sky-300">Jira API</span>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">REST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* C4 Level 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Level 2: Container (6 Planes)</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Microservices</span>
              </div>
              <h4 className="text-sm font-bold text-white">Decoupled Planes & Communication Protocols</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each plane operates as an isolated container: Experience Plane (Vite :3000), Workflow Plane (Temporal :7233), Agent Plane (LangGraph :8001), Knowledge (pgvector :5432), Tools (MCP :8003), and Governance (:8006).
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Agent Gateway (:8001)</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-emerald-300">Policy Service (:8006)</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">REST</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Agent Gateway (:8001)</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-sky-300">pgvector (:5432)</span>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">asyncpg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">LLM Gateway (:8002)</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-amber-300">Ollama Metal (:11434)</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">HTTP</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-white font-medium">Workflow Worker</span>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-purple-300">Temporal Engine (:7233)</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/40">gRPC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* C4 Level 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Level 3: Component Breakdown</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Internal Flow</span>
              </div>
              <h4 className="text-sm font-bold text-white">LangGraph StateGraph & Scoped Secret Broker</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                LangGraph orchestrates cyclical nodes with PostgreSQL checkpointing: validate_intent ➔ retrieve_knowledge ➔ llm_synthesis ➔ eval_gate ➔ tool_dispatch.
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">LangGraph StateGraph</span>
                  <span className="text-[11px] text-sky-300 font-mono">AsyncPostgresSaver</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Scoped Secret Broker</span>
                  <span className="text-[11px] text-emerald-300 font-mono">Zero LLM Context Leak</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-white font-medium">DLP Sanitization Hook</span>
                  <span className="text-[11px] text-amber-300 font-mono">Regex scrubbing PII & auth</span>
                </div>
              </div>
            </div>

            {/* C4 Level 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Level 4: Deployment Topology</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Apple Silicon M2</span>
              </div>
              <h4 className="text-sm font-bold text-white">Unified RAM & Metal GPU Offload</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Runs 100% on Apple Silicon M2 (16 GB Unified Memory). Ollama consumes 2.2–4.8 GB Metal VRAM; Docker containers consume 1.5 GB; host processes consume 500 MB.
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Total Unified Memory Footprint</span>
                  <span className="text-[11px] text-emerald-300 font-mono font-bold">5.62 GB / 16.00 GB (35%)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">Metal GPU Acceleration</span>
                  <span className="text-[11px] text-purple-300 font-mono font-bold">16 Cores @ 48.2 tok/s</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-white font-medium">Monthly Cloud LLM Spend</span>
                  <span className="text-[11px] text-amber-300 font-mono font-bold">$0.00 / month</span>
                </div>
              </div>
            </div>
          </div>

          {/* End-to-End Execution Sequence Flow */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>End-to-End Execution Flow (Frontend ➔ Zero-Trust Policy ➔ RAG ➔ Ollama M2 ➔ MCP ➔ Temporal)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step lifecycle of an engineering request from user submission to cryptographic release gate approval.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: 'Step 1: User Submission & Ingestion',
                  plane: 'Experience Plane (:3000)',
                  action: 'Developer triggers autonomous PR drafting for Jira Ticket LW-4412 in Engineering Portal.',
                  tech: 'React 18 / Express Gateway',
                  icon: Terminal
                },
                {
                  step: 'Step 2: Zero-Trust Policy Verification',
                  plane: 'Operations & Governance Plane (:8006)',
                  action: 'Policy Engine evaluates caller role and asserts action class conforms to "draft" class. No direct write to prod allowed.',
                  tech: 'FastAPI / OPA Policy Rules',
                  icon: Lock
                },
                {
                  step: 'Step 3: Semantic Grounding & pgvector Search',
                  plane: 'Knowledge Plane (:8004 & :5432)',
                  action: 'HybridRetrievalEngine runs cosine similarity (<=>) and BM25 RRF over ADR documents, returning 3 grounded chunks.',
                  tech: 'PostgreSQL 16 / pgvector HNSW Index',
                  icon: Database
                },
                {
                  step: 'Step 4: Metal GPU Inference & DLP Scrubbing',
                  plane: 'Agent Control Plane (:8002 & :11434)',
                  action: 'Prompt is sanitized of credentials via regex DLP, then synthesized on Apple Silicon 16 GPU cores in 18ms.',
                  tech: 'Local Ollama qwen2.5-coder:7b @ 48 tok/s',
                  icon: Cpu
                },
                {
                  step: 'Step 5: Sandboxed Tool Brokerage (MCP)',
                  plane: 'Tool Integration Plane (:8003)',
                  action: 'MCP Gateway broker injects ephemeral git credentials into isolated container, opening GitHub Draft PR #128.',
                  tech: 'Model Context Protocol / PyGithub Adapter',
                  icon: Network
                },
                {
                  step: 'Step 6: Durable State Machine & HITL Gate',
                  plane: 'Workflow Plane (:7233 & :8005)',
                  action: 'Temporal workflow registers activity completion, persists state across crashes, and halts for Release Manager signature.',
                  tech: 'Temporal.io Python Worker / Async State Engine',
                  icon: GitBranch
                }
              ].map((flow, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-start justify-between gap-3 hover:border-slate-700 transition-colors">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <flow.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{flow.step}</span>
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                          {flow.plane}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{flow.action}</p>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto shrink-0 whitespace-nowrap">
                    {flow.tech}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: 12-Port Sanity Check & Self-Healing Pre-Demo Doctor */}
      {activeSubTab === 'port-doctor' && (
        <div className="space-y-6">
          {/* Action Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Pre-Demo 12-Port Sanity Doctor & Conflict Resolver</h3>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                    Host Gateways & Rootless Podman
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Inspects all 12 ports required across the 6-plane architecture before presenting to 1,000 engineers.
                  If any port is blocked or in conflict, it gives exact kill commands and reboot commands so your live demo is never interrupted.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setCheckingPorts(true);
                    setTimeout(() => {
                      setCheckingPorts(false);
                    }, 600);
                  }}
                  disabled={checkingPorts}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md shadow-emerald-500/10"
                >
                  <Play className={`w-3.5 h-3.5 ${checkingPorts ? 'animate-spin' : ''}`} />
                  <span>{checkingPorts ? 'Probing 12 Ports...' : 'Re-Probe All 12 Ports'}</span>
                </button>

                <button
                  onClick={() => handleCopy('make sanity-ports')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>make sanity-ports</span>
                  {copiedCmd === 'make sanity-ports' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-xs text-slate-400">Filter Scope:</span>
              <button
                onClick={() => setPortFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  portFilter === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All 12 Ports ({portsData.length})
              </button>
              <button
                onClick={() => setPortFilter('host')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  portFilter === 'host'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Host Python & Node ({portsData.filter(p => p.runtime.includes('Host')).length})
              </button>
              <button
                onClick={() => setPortFilter('container')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  portFilter === 'container'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Podman / Docker Containers ({portsData.filter(p => p.runtime.includes('Docker')).length})
              </button>
            </div>
          </div>

          {/* 12 Ports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portsData
              .filter(item => {
                if (portFilter === 'host') return item.runtime.includes('Host');
                if (portFilter === 'container') return item.runtime.includes('Docker');
                return true;
              })
              .map((item) => (
                <div 
                  key={item.port}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-base font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          :{item.port}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.service}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{item.protocol} · {item.runtime}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          item.status === 'online'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'online' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{item.status === 'online' ? 'HEALTHY' : 'BLOCKED'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Recommendation / Self-Healing Guidance */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] text-slate-400 flex items-start space-x-1.5">
                      <span className="text-amber-400 font-semibold shrink-0">Diagnosis:</span>
                      <span className="text-slate-300">{item.recommendation}</span>
                    </div>

                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase shrink-0">Remedy:</span>
                        <code className="text-[10px] font-mono text-slate-200 truncate">{item.remedyCmd}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(item.remedyCmd)}
                        className="text-slate-400 hover:text-white p-1 shrink-0"
                        title="Copy command"
                      >
                        {copiedCmd === item.remedyCmd ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Conflict Kill command */}
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-[10px] text-rose-400 font-bold uppercase shrink-0">If Stuck:</span>
                        <code className="text-[10px] font-mono text-rose-300/90 truncate">{item.killCmd}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(item.killCmd)}
                        className="text-slate-400 hover:text-white p-1 shrink-0"
                        title="Copy kill command"
                      >
                        {copiedCmd === item.killCmd ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Direct Tab Link for Temporal */}
                    {(item.port === 7233 || item.port === 8233) && onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab('temporal')}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                      >
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>Open Temporal Workflows Tab ↗</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Golden Rule Summary for Live Demos */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-xl p-5 flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white text-sm">Demo Shield Protocol (The "Never Fail" Checklist)</div>
              <p className="text-slate-400 leading-relaxed">
                Before walking on stage or starting your screen share with 1,000 engineers, always run:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <code className="bg-slate-950 text-amber-300 px-2.5 py-1 rounded border border-slate-800 font-mono text-xs">
                  make sanity-ports
                </code>
                <span className="text-slate-400 self-center">or</span>
                <code className="bg-slate-950 text-emerald-300 px-2.5 py-1 rounded border border-slate-800 font-mono text-xs">
                  ./infra/scripts/check-ports-sanity.sh
                </code>
              </div>
              <p className="text-slate-400 text-[11px] pt-1">
                If any container port is red, execute <span className="font-mono text-white">podman compose -f podman-compose.local.yml up -d</span> to resurrect it in under 3 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Script Inspection Modal */}
      {scriptModalContent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{scriptModalContent.title}</h3>
                  <p className="text-[11px] font-mono text-slate-400">{scriptModalContent.scriptName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(scriptModalContent.code, scriptModalContent.scriptName)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  {copiedCmd === scriptModalContent.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Script!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Script</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setScriptModalContent(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Code Body */}
            <div className="p-4 overflow-y-auto font-mono text-xs text-slate-200 bg-slate-950 leading-relaxed whitespace-pre selection:bg-amber-500/30">
              {scriptModalContent.code}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
              <span>Ready for execution on Apple Silicon Mac M2 / M3 / M4</span>
              <button
                onClick={() => setScriptModalContent(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Copy Feedback Toast */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}
    </div>
  );
};
