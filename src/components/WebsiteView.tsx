import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  Building2, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  RefreshCw,
  ExternalLink,
  Bot
} from 'lucide-react';
import { KNOWLEDGE_BASE_SEED } from '../data/mockData';

interface WebsiteViewProps {
  onExploreGateway: () => void;
  onOpenCodebase: () => void;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({ onExploreGateway, onOpenCodebase }) => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentResponse, setAgentResponse] = useState<null | {
    text: string;
    model: string;
    citations: string[];
    confidence: number;
    recommendedSolutions: string[];
  }>({
    text: "Welcome to Genting Agentic Engineering. Our platform allows Genting properties and global enterprises to harness local, open-source AI models (running on Mac M2 hardware or on-premise clusters) with enterprise-grade governance through our Agent Gateway, MCP Gateway, and Temporal durable workflows.",
    model: "ollama/llama3.2:3b (Local Metal M2)",
    citations: ["docs/architecture/solution-architecture.md", "apps/web/content/solutions/hospitality-ai.md"],
    confidence: 0.96,
    recommendedSolutions: [
      "Edge-Ready Hospitality Concierge",
      "High-Concurrency Booking Architecture",
      "Sovereign On-Premise Data Isolation"
    ]
  });

  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadOrg, setLeadOrg] = useState('');

  const sampleQuestions = [
    "How does the Genting Agent Gateway enforce policy checks before tool execution?",
    "Can we run local Ollama on Mac M2 for hospitality booking recommendations without cloud leaks?",
    "What is the Temporal human-in-the-loop approval mechanism for production deployments?"
  ];

  const handleAskAgent = (promptText: string) => {
    setQuery(promptText);
    setIsGenerating(true);

    setTimeout(() => {
      let reply = "";
      let cites: string[] = [];
      let solutions: string[] = [];

      if (promptText.toLowerCase().includes("m2") || promptText.toLowerCase().includes("ollama")) {
        reply = "The Genting architecture deploys 4-bit quantized open-source models (Llama 3.2 3B and Qwen 2.5 Coder 7B) using Apple Silicon Metal GPU acceleration on Mac M2. This enables sub-50ms inference latency at $0.00 cloud operational cost while keeping guest reservation telemetry strictly within local memory boundaries.";
        cites = ["docs/runbooks/mac-m2-ollama-setup.md", "docs/architecture/solution-architecture.md#sec-16"];
        solutions = ["Local Sovereign Inference", "Edge Concierge Runtime"];
      } else if (promptText.toLowerCase().includes("policy") || promptText.toLowerCase().includes("gateway")) {
        reply = "All agent interactions pass through the Agent Gateway, which consults the Policy Engine before tool dispatch. Actions are classified as Read, Draft, Update, or Deploy. Read and Draft operations are permitted under least privilege, while Deploy and Write operations mandate human sign-off via Temporal durable signals.";
        cites = ["docs/adr/009-mcp-gateway-isolation.md", "docs/architecture/solution-architecture.md#sec-9"];
        solutions = ["MCP Tool Mediation", "LangGraph Policy Engine"];
      } else {
        reply = "For enterprise resilience, Genting utilizes Temporal durable workflows to guarantee that multi-step engineering tasks (such as Jira ticket ingestion, code synthesis, Pytest validation, and PR creation) survive network partitions and server restarts without loss of execution state.";
        cites = ["docs/adr/004-langgraph-orchestration.md", "services/workflow-runtime/app/worker.py"];
        solutions = ["Temporal Approval Gates", "LangGraph Cyclic Feedback"];
      }

      setAgentResponse({
        text: reply,
        model: "ollama/llama3.2:3b (Local Metal M2)",
        citations: cites,
        confidence: 0.98,
        recommendedSolutions: solutions
      });
      setIsGenerating(false);
    }, 850);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setLeadFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Banner with Genting Hospitality & Tech Palette */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 pt-10 pb-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Production Use Case #1 · Genting Digital Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Agentic AI Engineering <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  Sovereign, Governed & Scalable
                </span>
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                A modern proof-of-concept running local open-source models (Ollama on Apple Silicon M2) with enterprise-grade scalability. Governed by the Agent Gateway, MCP Gateway, and Temporal durable approval loops.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  id="btn-explore-gateways"
                  onClick={onExploreGateway}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Launch Agent Control Plane</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="btn-explore-codebase"
                  onClick={onOpenCodebase}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-sm border border-slate-700 transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Inspect Monorepo Tree</span>
                </button>
              </div>
            </div>

            {/* Quick Architecture Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-96">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-2">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Local Mac M2 Stack</h4>
                <p className="text-xs text-slate-400 mt-1">Runs 100% locally with Ollama (Metal GPU) & zero cloud API costs.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Gateway Trio</h4>
                <p className="text-xs text-slate-400 mt-1">Agent Gateway + MCP Gateway + LLM Gateway prevent unvetted actions.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Temporal Workflows</h4>
                <p className="text-xs text-slate-400 mt-1">Durable retry loops & human-in-the-loop approval sign-offs.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Genting Production</h4>
                <p className="text-xs text-slate-400 mt-1">Powering Resorts World booking, CRM leads, and software delivery.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Section: Interactive Solution Discovery Concierge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Genting AI Solution Discovery Concierge</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Grounded in the Genting Solution Architecture Document · Queries Local Ollama & pgvector Knowledge Base
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Model: <code className="text-amber-300 font-mono">llama3.2:3b</code></span>
              <span>· Gateway: <span className="text-emerald-400 font-medium">Protected (Read-Only)</span></span>
            </div>
          </div>

          {/* Prompt Presets */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Recommended Enterprise Discovery Inquiries:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAgent(q)}
                  className="text-xs text-left bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Input Bar */}
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <input
                id="input-discovery-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query && handleAskAgent(query)}
                placeholder="Ask about Genting cloud architecture, local Ollama M2 inference, MCP tools, or approval workflows..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              id="btn-ask-agent"
              onClick={() => query && handleAskAgent(query)}
              disabled={isGenerating || !query}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Inquire</span>
                </>
              )}
            </button>
          </div>

          {/* Agent Response Card */}
          {agentResponse && (
            <div className="mt-6 bg-slate-950/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/60 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-amber-400">Agent Gateway Synthesis</span>
                  <span>·</span>
                  <span className="text-slate-400 font-mono">{agentResponse.model}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Confidence:</span>
                  <span className="text-emerald-400 font-semibold font-mono">{(agentResponse.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {agentResponse.text}
              </p>

              {/* Citations & Evidence Grounding */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Verified Citations:</span>
                {agentResponse.citations.map((cite, i) => (
                  <span key={i} className="text-xs font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                    {cite}
                  </span>
                ))}
              </div>

              {/* Next Steps CTA */}
              <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Recommended Enterprise Solutions:</span>{' '}
                  {agentResponse.recommendedSolutions.join(' · ')}
                </div>
                <a
                  href="#consultation-form"
                  className="text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3 py-1.5 rounded-md font-semibold border border-amber-500/40 whitespace-nowrap transition-colors"
                >
                  Request Architecture Consultation →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Lead Capture Form for Genting Architecture Solutions (MCP CRM Integration) */}
        <div id="consultation-form" className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white">Schedule an Enterprise Solution Consultation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect with Genting Solution Architects to deploy this local Mac M2 stack or scale to production Kubernetes.
            </p>

            {leadFormSubmitted ? (
              <div className="mt-6 bg-emerald-950/40 border border-emerald-800 p-4 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">Lead Successfully Ingested via MCP Gateway</h4>
                <p className="text-xs text-emerald-300 mt-1">
                  Salesforce CRM record created under action class <code className="font-mono text-white">draft</code>. Our team will contact {leadEmail}.
                </p>
                <button
                  onClick={() => setLeadFormSubmitted(false)}
                  className="mt-3 text-xs text-slate-400 hover:text-white underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
                    <input
                      id="input-lead-email"
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="kundan.mishra@genting.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Property</label>
                    <input
                      id="input-lead-org"
                      type="text"
                      required
                      value={leadOrg}
                      onChange={(e) => setLeadOrg(e.target.value)}
                      placeholder="Genting Resorts World / Enterprise"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Use Case Scope</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500">
                    <option>Deploy Local Ollama M2 POC on Apple Silicon</option>
                    <option>Implement Agent Gateway & LangGraph Microservices</option>
                    <option>Integrate Temporal Durable Approval Workflows</option>
                    <option>Build Custom MCP Tool Adapters (Git, Jira, CMS)</option>
                  </select>
                </div>
                <button
                  id="btn-submit-lead"
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Submit Request (Dispatches to MCP CRM Gateway)
                </button>
              </form>
            )}
          </div>

          {/* Quick Stats / Compliance Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Enterprise Compliance</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Data Leakage:</strong> Local Ollama keeps telemetry on your Mac M2.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Human Approval Gates:</strong> Production write & deploy actions require digital sign-off.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Open Source First:</strong> LangGraph, FastAPI, Temporal, pgvector, Redis.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800">
              <div className="text-[11px] text-slate-500 font-mono">
                System Status: All 3 Gateways Healthy<br />
                Architecture Version: 0.1 POC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
