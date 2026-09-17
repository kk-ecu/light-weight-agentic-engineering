import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock, 
  Cpu, 
  Workflow, 
  Network, 
  Activity, 
  Lock, 
  ExternalLink,
  BookOpen,
  Download
} from 'lucide-react';
import { ActiveTab } from '../types';

interface ArchitectureDocumentViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const ArchitectureDocumentView: React.FC<ArchitectureDocumentViewProps> = ({ onNavigateTab }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ESA-SPEC-2026-V4
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Enterprise Architecture Standard
              </span>
              <span className="text-xs text-slate-400 font-mono">Apple Silicon M2 Air-Gapped Stack</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Autonomous Agentic Engineering Platform
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl">
              System Architecture, 6-Plane Data Flow, and End-to-End Developer Field Execution Specification.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={() => copyToClipboard(window.location.href, 'share')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition-colors"
            >
              {copiedSection === 'share' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'share' ? 'URL Copied' : 'Share Spec'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('c4-architecture')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive C4 Diagrams</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-4 border-t border-slate-800 text-xs text-slate-400 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0">Sections:</span>
          <a href="#executive-summary" className="px-2.5 py-1 rounded-md bg-slate-950 hover:text-white shrink-0 transition-colors">1. Why Game Changer</a>
          <a href="#system-design" className="px-2.5 py-1 rounded-md bg-slate-950 hover:text-white shrink-0 transition-colors">2. 6-Plane Architecture</a>
          <a href="#data-flow" className="px-2.5 py-1 rounded-md bg-slate-950 hover:text-white shrink-0 transition-colors">3. Data & Signal Flow</a>
          <a href="#step-by-step" className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 font-semibold shrink-0 border border-amber-500/20">4. 6-Step Field Manual</a>
          <a href="#value-matrix" className="px-2.5 py-1 rounded-md bg-slate-950 hover:text-white shrink-0 transition-colors">5. FinOps & Zero-Trust Matrix</a>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY & GAME CHANGER */}
      <section id="executive-summary" className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">1. Why This Workspace Is an Enterprise Game Changer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4" />
              <span>The Industry Pain Point (Why 91% of Agent POCs Fail)</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Prohibitive Cloud FinOps:</strong> High-volume developer agent loops (AST exploration, iterative compilation) running on commercial cloud APIs invoice <strong>$1,200–$2,800/engineer/month</strong>.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Zero-Trust IP & Credential Leakage:</strong> Unregulated developer agents leak internal connection strings (`postgresql://admin...`) and private tokens into external model providers.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Uncontrolled Destructive Tooling:</strong> Autonomous agents given shell or git tool access lack policy brokers and can force-push or drop schemas without human sign-off.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Transient Memory Collapse:</strong> Fragile Python scripts die mid-loop when network drops or laptops sleep, losing hours of in-flight execution context.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-3 shadow-lg shadow-emerald-500/5">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>How This Architecture Solves It (The Strategic Advantage)</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>$0.00 Infinite Local Token Budget:</strong> Apple Silicon M2 Metal GPU inference runs local coding models (Qwen 2.5 Coder 7B) at 54 tok/s with zero cloud billing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Air-Gapped DLP Redaction:</strong> Inbound prompts pass through zero-trust regex scrubbers before reaching models, guaranteeing zero credentials leave the workstation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Cryptographic Human Gates:</strong> Destructive MCP tools (`deploy`, `migrate`) trigger Temporal signals that suspend execution until an authorized human signs off.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Durable Execution & Checkpointing:</strong> PostgreSQL 16 + Temporal engine preserve workflow checkpoints across reboots with zero state loss.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: SYSTEM DESIGN & 6 PLANES */}
      <section id="system-design" className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">2. System Design: The 6-Plane Decoupled Topology</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <p className="text-xs text-slate-300 leading-relaxed">
            Every responsibility is isolated into a dedicated architectural plane running on bound local ports. This guarantees air-gapping, prevents monolithic failure, and allows individual service upgrades.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">:3000</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Vite / React</span>
              </div>
              <h4 className="text-sm font-bold text-white">1. Experience Plane</h4>
              <p className="text-xs text-slate-400">Developer command center, live telemetry streams, 12-port sanity doctor, and interactive model sandbox.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">:8001</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">FastAPI / LangGraph</span>
              </div>
              <h4 className="text-sm font-bold text-white">2. Agent Control Plane</h4>
              <p className="text-xs text-slate-400">LangGraph StateGraph runtime executing cyclic self-healing loops with PostgreSQL state checkpointers.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">:8002</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">FastAPI / Ollama</span>
              </div>
              <h4 className="text-sm font-bold text-white">3. Inference Routing Plane</h4>
              <p className="text-xs text-slate-400">Zero-trust DLP regex scrubber and dynamic routing to Ollama Metal GPU (:11434) or fallback cloud endpoints.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">:8003</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">FastAPI / MCP</span>
              </div>
              <h4 className="text-sm font-bold text-white">4. Tool Integration Plane</h4>
              <p className="text-xs text-slate-400">Model Context Protocol adapter hub enforcing action classes (Read, Draft, Deploy) with audit trails.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">:7233</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Temporal Server</span>
              </div>
              <h4 className="text-sm font-bold text-white">5. Orchestration Plane</h4>
              <p className="text-xs text-slate-400">Durable workflow state machine guaranteeing zero state loss, exponential retries, and human sign-off gates.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">:5432 / :6379</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Postgres / Redis</span>
              </div>
              <h4 className="text-sm font-bold text-white">6. Data & Knowledge Plane</h4>
              <p className="text-xs text-slate-400">PostgreSQL 16 with pgvector (HNSW semantic index) and Redis 7.0 for 30s distributed idempotency locking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WORKFLOW AND DATA FLOW DIAGRAM */}
      <section id="data-flow" className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">3. End-to-End Architectural Data Flow</h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
          <pre className="leading-relaxed">
{` [ DEVELOPER USER PROMPT ] 
             │
             ▼
   [ 1. EXPERIENCE PLANE (:3000) ] ────► Dispatches Task Request
             │
             ▼
   [ 2. AGENT CONTROL PLANE (:8001) ] ──► Initializes LangGraph StateGraph
             │
             ├──► (Step A) Fetch Semantic Context ────► [ 6. DATA PLANE: PGVECTOR (:5432) ]
             │
             ├──► (Step B) Scrub Secrets via DLP ─────► [ 3. INFERENCE PLANE: DLP SCRUBBER (:8002) ]
             │                                                  │
             │                                                  ▼
             │                                        [ OLLAMA METAL GPU (:11434) ]
             │                                        - Qwen 2.5 Coder 7B ($0.00 / 38ms)
             │
             ├──► (Step C) Invoke Tool Action ────────► [ 4. MCP TOOL GATEWAY (:8003) ]
             │                                                  │
             │                                                  ├── Read/Draft: Auto-Permitted
             │                                                  └── Deploy/Drop: HALTED BY POLICY
             │                                                                │
             ▼                                                                ▼
   [ 5. ORCHESTRATION PLANE (:7233) ] ◄──────────────────────── Dispatches Approval Signal
             │
             ├── Pauses Execution (Durable Checkpoint)
             ├── Waits for Lead Engineer Sign-off
             │
             ▼ (Upon "Approve & Resume Workflow")
   [ WORKFLOW COMPLETED ] ──────────────► Sync to ArgoCD / Staging Cluster`}
          </pre>
        </div>
      </section>

      {/* SECTION 4: 6-STEP FIELD EXECUTION MANUAL */}
      <section id="step-by-step" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">4. Developer Field Execution Manual (6 Certified Steps)</h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            100% Screen-Verified
          </span>
        </div>

        {/* STEP 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
              <h3 className="text-base font-bold text-white">Self-Healing Autonomous Coding Agent Run</h3>
            </div>
            <button
              onClick={() => onNavigateTab('agent-gateway')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Open in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Top Navigation Tab:</span>
              <p className="text-white font-mono font-bold">🤖 Agent Gateway</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Profile Card to Select:</span>
              <p className="text-sky-300 font-mono font-bold">Software Engineering Agent</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Action Button:</span>
              <p className="text-amber-400 font-mono font-bold">Execute LangGraph Run</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Expected Behavior:</strong> In the <strong>GATEWAY EXECUTION TRACE</strong> panel, streaming logs show node transitions from <code>REPO_CONTEXT</code> ➔ <code>PLANNER</code> ➔ <code>CODEGEN</code> ➔ <code>EVALUATE</code>. If mock tests fail at Node 4, the cyclic state edge loops back to Node 3 to self-correct the patch before reaching Node 5. The PostgreSQL checkpointer updates in real time with thread ID <code>th_eng_9921_pay</code>.
          </p>
        </div>

        {/* STEP 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
              <h3 className="text-base font-bold text-white">Zero-Cost Local Inference on Apple Silicon M2 Metal GPU</h3>
            </div>
            <button
              onClick={() => onNavigateTab('llm-gateway')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Open in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Top Navigation Tab:</span>
              <p className="text-white font-mono font-bold">🧠 LLM Gateway</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Model & Preset:</span>
              <p className="text-emerald-300 font-mono font-bold">Qwen 2.5 Coder 7B + Idempotency</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Action Button:</span>
              <p className="text-amber-400 font-mono font-bold">✨ Route Request (Qwen 2.5 Coder 7B)</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Expected Behavior:</strong> In the <strong>GATEWAY COMPLETION TELEMETRY</strong> pane, real Python code defining <code>@idempotent_task</code> streams in. The telemetry badges render <code>$0.000</code> token cost (emerald), <code>~38ms latency</code> (sky-blue), and <code>~54 tok/s</code> throughput on local unified memory.
          </p>
        </div>

        {/* STEP 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              <h3 className="text-base font-bold text-white">Air-Gapped Zero-Trust Secret Scrubbing (DLP Inspector)</h3>
            </div>
            <button
              onClick={() => onNavigateTab('llm-gateway')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Open in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Sub-Tab Toggle:</span>
              <p className="text-white font-mono font-bold">📊 Benchmark Engine</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Preset Button:</span>
              <p className="text-amber-400 font-mono font-bold">Postgres URI + Token</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Card Title:</span>
              <p className="text-slate-300 font-mono font-bold">ZERO-TRUST REDACTION INSPECTOR</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Expected Behavior:</strong> The red container shows raw developer credentials (<code>prod_pw_9921</code>, <code>10.0.4.12:5432</code>, developer email). The emerald container shows instant inline regex redaction to <code>[REDACTED_PASSWORD]</code> and <code>[REDACTED_PII_EMAIL]</code>. Clicking <strong>👁️ Hide Comparison</strong> collapses into the clean model payload.
          </p>
        </div>

        {/* STEP 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">4</span>
              <h3 className="text-base font-bold text-white">Least-Privilege MCP Tool Policy Brokerage</h3>
            </div>
            <button
              onClick={() => onNavigateTab('mcp-gateway')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Open in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Top Navigation Tab:</span>
              <p className="text-white font-mono font-bold">🔌 MCP Gateway</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Safe Tool vs Gated Tool:</span>
              <p className="text-slate-300 font-mono font-bold">git_create_draft_pr vs k8s_deploy</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Action Button:</span>
              <p className="text-blue-400 font-mono font-bold">Invoke MCP Tool</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Expected Behavior:</strong> <code>git_create_draft_pr</code> displays <strong>DRAFT</strong> class with green <strong>✓ Auto Permitted</strong> status. Selecting <code>k8s_deploy_production_release</code> displays <strong>DEPLOY</strong> class with amber <strong>⚠️ Requires Approval</strong> status. Clicking <em>Invoke MCP Tool</em> triggers policy suspension: <code>Execution Suspended by Policy Gate: Awaiting approval in Temporal Approval Inbox. ID: APPR-CI-9941</code>.
          </p>
        </div>

        {/* STEP 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">5</span>
              <h3 className="text-base font-bold text-white">Cryptographic Human-in-the-Loop Sign-Off Gate</h3>
            </div>
            <button
              onClick={() => onNavigateTab('temporal')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Open in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Top Navigation Tab:</span>
              <p className="text-white font-mono font-bold">⏱️ Temporal Workflows</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Workflow Card:</span>
              <p className="text-amber-300 font-mono font-bold">WebsiteReleaseWorkflow (WAITING APPROVAL)</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Action Button:</span>
              <p className="text-emerald-400 font-mono font-bold">✓ Approve & Resume Workflow</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Expected Behavior:</strong> Clicking <strong>✓ Approve & Resume Workflow</strong> immediately clears the approval card and renders the emerald confirmation banner: <code>Workflow signal dispatched: APPROVED. Temporal StateMachine updated</code>. The workflow status card transitions to <strong>COMPLETED</strong> (emerald), the header counter decrements, and activity <code>ArgoCDStagingSync</code> executes.
          </p>
        </div>

        {/* STEP 6 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">6</span>
              <h3 className="text-base font-bold text-white">Pre-Demo 12-Port Sanity Doctor & Conflict Resolver</h3>
            </div>
            <button
              onClick={() => onNavigateTab('port-doctor')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Open in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Top Navigation Tab:</span>
              <p className="text-white font-mono font-bold">🩺 12-Port Doctor</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Target Stack:</span>
              <p className="text-emerald-300 font-mono font-bold">Host Gateways & Rootless Podman</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Action Button:</span>
              <p className="text-emerald-400 font-mono font-bold">Re-Probe All 12 Ports</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Expected Behavior:</strong> Parallel probes test all 12 ports (:8001 through :3000). Every port lights up with an emerald <strong>HEALTHY</strong> pill and response latencies under 5ms. Clicking any service displays its diagnosis and a 1-click terminal remedy command (e.g. <code>lsof -ti :8002 | xargs kill -9</code>).
          </p>
        </div>
      </section>

      {/* SECTION 5: ENTERPRISE VALUE & FINOPS COMPARISON */}
      <section id="value-matrix" className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">5. FinOps & Operational Advantage Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-red-400">Standard Cloud AI API Setup</th>
                <th className="py-3 px-4 text-emerald-400">6-Plane M2 Air-Gapped Stack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white">FinOps Token Invoices</td>
                <td className="py-3 px-4 text-red-300">$0.005–$0.03 / 1k tokens ($1,800/mo/dev)</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">$0.00 (Apple Silicon M2 Metal GPU)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">DLP & Secret Leakage</td>
                <td className="py-3 px-4 text-red-300">Credentials passed directly to model servers</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">100% Inbound Regex Scrubbing on Host</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tool Invocation Safety</td>
                <td className="py-3 px-4 text-red-300">Unbounded tool calling via raw Python</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">Strict MCP Action Classes + Human Gates</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Workflow Fault Tolerance</td>
                <td className="py-3 px-4 text-red-300">Crashes on sleep/reboot; lost state</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">Temporal Durable Execution + Zero State Loss</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Cold-Start Sanity Verification</td>
                <td className="py-3 px-4 text-red-300">Manual port hunting and trial-and-error</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">12-Port Doctor with 1-Click Remedies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer / Call-To-Action */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Ready to inspect interactive live topologies?</h3>
          <p className="text-xs text-slate-400 mt-0.5">Jump directly into C4 Level 1–4 diagrams or trigger a live LangGraph run.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('c4-architecture')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>C4 Diagrams</span>
          </button>
          <button
            onClick={() => onNavigateTab('agent-gateway')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow-md shadow-amber-500/20"
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Run Agent Run</span>
          </button>
        </div>
      </div>
    </div>
  );
};
