import React, { useState } from 'react';
import { LLM_ROUTES } from '../data/mockData';
import { LLMRouteConfig } from '../types';
import { 
  Zap, 
  DollarSign, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface BenchmarkModel {
  id: string;
  name: string;
  type: 'local_m2' | 'cloud_api';
  provider: string;
  ttftMs: number;
  tokensPerSec: number;
  costPerMillionIn: number;
  costPerMillionOut: number;
  contextWindowK: number;
  memoryRamGb: number;
  license: string;
}

const BENCHMARK_MODELS: BenchmarkModel[] = [
  {
    id: 'qwen2.5-coder-7b',
    name: 'Qwen 2.5 Coder 7B (Q4_K_M)',
    type: 'local_m2',
    provider: 'Ollama (Metal GPU)',
    ttftMs: 38,
    tokensPerSec: 54,
    costPerMillionIn: 0.00,
    costPerMillionOut: 0.00,
    contextWindowK: 32,
    memoryRamGb: 4.8,
    license: 'Apache 2.0'
  },
  {
    id: 'llama3.2-3b',
    name: 'Llama 3.2 3B (Q4_K_M)',
    type: 'local_m2',
    provider: 'Ollama (Metal GPU)',
    ttftMs: 24,
    tokensPerSec: 82,
    costPerMillionIn: 0.00,
    costPerMillionOut: 0.00,
    contextWindowK: 128,
    memoryRamGb: 2.2,
    license: 'Llama 3.2 Community'
  },
  {
    id: 'deepseek-r1-7b',
    name: 'DeepSeek R1 Distill Qwen 7B',
    type: 'local_m2',
    provider: 'Ollama (Metal GPU)',
    ttftMs: 65,
    tokensPerSec: 42,
    costPerMillionIn: 0.00,
    costPerMillionOut: 0.00,
    contextWindowK: 64,
    memoryRamGb: 5.1,
    license: 'MIT'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    type: 'cloud_api',
    provider: 'Google AI Cloud',
    ttftMs: 140,
    tokensPerSec: 110,
    costPerMillionIn: 0.075,
    costPerMillionOut: 0.30,
    contextWindowK: 1000,
    memoryRamGb: 0.0,
    license: 'Commercial Cloud API'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro (Reasoning)',
    type: 'cloud_api',
    provider: 'Google AI Cloud',
    ttftMs: 280,
    tokensPerSec: 65,
    costPerMillionIn: 1.25,
    costPerMillionOut: 5.00,
    contextWindowK: 2000,
    memoryRamGb: 0.0,
    license: 'Commercial Cloud API'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    type: 'cloud_api',
    provider: 'Anthropic Cloud',
    ttftMs: 310,
    tokensPerSec: 58,
    costPerMillionIn: 3.00,
    costPerMillionOut: 15.00,
    contextWindowK: 200,
    memoryRamGb: 0.0,
    license: 'Commercial Cloud API'
  }
];

export const LlmBenchmarkView: React.FC = () => {
  const [dailyTokensK, setDailyTokensK] = useState<number>(500); // 500k tokens per day
  const [selectedComplexityPrompt, setSelectedComplexityPrompt] = useState<string>(
    'Refactor Postgres connection pool to use asyncpg with circuit breaker and dynamic retry backoff under high burst traffic.'
  );
  const [manualRouteOverride, setManualRouteOverride] = useState<string>('auto');
  const [showRedactionDiff, setShowRedactionDiff] = useState<boolean>(true);

  // Compute monthly savings of local M2 vs Claude 3.5 Sonnet
  const monthlyTokensMillion = (dailyTokensK * 30) / 1000;
  const cloudMonthlyCost = (monthlyTokensMillion * 3.00) + (monthlyTokensMillion * 0.4 * 15.00); // assuming 40% output ratio
  const localM2MonthlyCost = 0.00;
  const netMonthlySavings = cloudMonthlyCost - localM2MonthlyCost;

  // Complexity heuristic analysis
  const analyzePromptComplexity = (text: string) => {
    const len = text.length;
    const hasCode = /def |class |async |await |SELECT |FROM |import |function|refactor|pool/i.test(text);
    const hasReasoning = /tradeoff|architect|why |compare|deep|analyze|evaluate/i.test(text);

    let score = 25;
    if (len > 120) score += 25;
    if (hasCode) score += 30;
    if (hasReasoning) score += 20;

    let suggestedModel = 'llama3.2-3b';
    let pathLabel = 'Fast Path (Sub-50ms)';
    let rationale = 'Low syntactic complexity suitable for lightweight local 3B model.';

    if (score >= 70 && hasCode) {
      suggestedModel = 'qwen2.5-coder-7b';
      pathLabel = 'Code Specialist Path';
      rationale = 'High syntax and algorithm density. Routed to specialized local Qwen 2.5 Coder 7B on Metal GPU.';
    } else if (score >= 70 && hasReasoning) {
      suggestedModel = 'deepseek-r1-7b';
      pathLabel = 'Deep Reasoning Path';
      rationale = 'Requires multi-step chain-of-thought analysis. Routed to DeepSeek R1 distillation.';
    } else if (score > 85) {
      suggestedModel = 'gemini-2.5-pro';
      pathLabel = 'Enterprise Cloud Reasoning Path';
      rationale = 'Ultra-complex multi-modal system architecture task requiring massive context window.';
    }

    return { score, suggestedModel, pathLabel, rationale };
  };

  const complexityAnalysis = analyzePromptComplexity(selectedComplexityPrompt);
  const activeRoutingDecision = manualRouteOverride === 'auto' ? complexityAnalysis.suggestedModel : manualRouteOverride;

  const rawSampleWithSecrets = `${selectedComplexityPrompt}

Context:
Internal Database: postgresql://admin:prod_pw_9921@10.0.4.12:5432/payments
Auth Token: ghp_98f24b912a48cd821a99021482
Developer Contact: kundan.mishra5@gmail.com`;

  const sanitizedSample = `${selectedComplexityPrompt}

Context:
Internal Database: postgresql://admin:[REDACTED_PASSWORD]@10.0.X.X:5432/payments
Auth Token: [REDACTED_ZERO_TRUST_JIT_PAT]
Developer Contact: [REDACTED_PII_EMAIL]`;

  return (
    <div className="space-y-8">
      {/* Benchmark Calculator Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Multi-LLM Cost & Latency Benchmark Engine</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live comparisons between local Apple Silicon M2 Metal execution and commercial cloud providers.
            </p>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-4 py-2.5 flex items-center space-x-3">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase font-mono text-emerald-300 block">Est. Monthly Savings on M2:</span>
              <span className="text-base font-mono font-bold text-white">
                ${netMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
              </span>
            </div>
          </div>
        </div>

        {/* Daily Token Slider */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Daily Agent Token Consumption:</span>
            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {dailyTokensK.toLocaleString()}k tokens / day ({monthlyTokensMillion.toFixed(1)}M / month)
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={5000}
            step={50}
            value={dailyTokensK}
            onChange={(e) => setDailyTokensK(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>50k (Solo Dev)</span>
            <span>500k (Team of 5)</span>
            <span>2M (Continuous Agent CI)</span>
            <span>5M (Enterprise Scaling)</span>
          </div>
        </div>

        {/* Model Benchmark Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">Model Name</th>
                <th className="pb-3 font-semibold">Runtime / Engine</th>
                <th className="pb-3 font-semibold text-right">TTFT (Latency)</th>
                <th className="pb-3 font-semibold text-right">Throughput</th>
                <th className="pb-3 font-semibold text-right">Cost / 1M In</th>
                <th className="pb-3 font-semibold text-right">Cost / 1M Out</th>
                <th className="pb-3 font-semibold text-right">Context</th>
                <th className="pb-3 font-semibold text-right">Est. Monthly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {BENCHMARK_MODELS.map((model) => {
                const modelMonthly = model.type === 'local_m2'
                  ? 0.00
                  : (monthlyTokensMillion * model.costPerMillionIn) + (monthlyTokensMillion * 0.4 * model.costPerMillionOut);

                return (
                  <tr key={model.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 font-bold text-white flex items-center space-x-2">
                      <span>{model.name}</span>
                      {model.type === 'local_m2' && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          M2 Metal
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-300">{model.provider}</td>
                    <td className="py-3 text-right text-amber-300 font-bold">~{model.ttftMs}ms</td>
                    <td className="py-3 text-right text-slate-300">{model.tokensPerSec} t/s</td>
                    <td className="py-3 text-right text-slate-300">${model.costPerMillionIn.toFixed(2)}</td>
                    <td className="py-3 text-right text-slate-300">${model.costPerMillionOut.toFixed(2)}</td>
                    <td className="py-3 text-right text-slate-400">{model.contextWindowK}k</td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      ${modelMonthly.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prompt Playground with Heuristic Complexity Scorer & Route Override */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Prompt & Complexity Analyzer */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Complexity-Based Heuristic Router
              </h4>
            </div>
            <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">
              Score: {complexityAnalysis.score}/100
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">Quick Prompt Template:</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedComplexityPrompt('Write a lightweight healthcheck FastAPI endpoint returning JSON.')}
                className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 transition-colors"
              >
                Simple Healthcheck (Fast)
              </button>
              <button
                onClick={() => setSelectedComplexityPrompt('Refactor Postgres connection pool to use asyncpg with circuit breaker and dynamic retry backoff under high burst traffic.')}
                className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 transition-colors"
              >
                Code Refactor (Coder)
              </button>
              <button
                onClick={() => setSelectedComplexityPrompt('Conduct step-by-step reasoning on whether pgvector HNSW index or Qdrant satisfies SOC2 auditability for 50M records.')}
                className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 transition-colors"
              >
                Deep Architecture Tradeoff (R1)
              </button>
            </div>
            <textarea
              rows={3}
              value={selectedComplexityPrompt}
              onChange={(e) => setSelectedComplexityPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          {/* Router Recommendation Card */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Router Recommendation:</span>
              <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {complexityAnalysis.pathLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">{complexityAnalysis.rationale}</p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Suggested Target:</span>
              <span className="text-emerald-400 font-bold">{complexityAnalysis.suggestedModel}</span>
            </div>
          </div>

          {/* Manual Route Override */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Manual Route Override:</span>
            <select
              value={manualRouteOverride}
              onChange={(e) => setManualRouteOverride(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
            >
              <option value="auto">Auto (Complexity Heuristic)</option>
              <option value="llama3.2-3b">Force: Llama 3.2 3B (Fast Path)</option>
              <option value="qwen2.5-coder-7b">Force: Qwen 2.5 Coder 7B (Metal)</option>
              <option value="deepseek-r1-7b">Force: DeepSeek R1 (Reasoning)</option>
              <option value="gemini-2.5-pro">Force: Gemini 2.5 Pro (Cloud)</option>
            </select>
          </div>
        </div>

        {/* Right: Zero-Trust Redaction Inspector */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Zero-Trust Redaction & Secret Scrubbing Inspector
              </h4>
            </div>
            <button
              onClick={() => setShowRedactionDiff(!showRedactionDiff)}
              className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-1"
            >
              {showRedactionDiff ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showRedactionDiff ? 'Hide Comparison' : 'Show Comparison'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Inbound prompts are scrubbed by the LLM Gateway before entering context windows or hitting local/cloud models.
          </p>

          <div className="space-y-3">
            <div>
              <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
                Raw Input Prompt (With Ephemeral Secrets):
              </span>
              <pre className="p-3 bg-slate-950 border border-red-500/20 rounded-xl font-mono text-[10px] text-red-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {rawSampleWithSecrets}
              </pre>
            </div>

            <div>
              <span className="block text-[10px] font-mono text-emerald-400 uppercase font-bold mb-1">
                Scrubbed Payload Dispatched to Model ({activeRoutingDecision}):
              </span>
              <pre className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl font-mono text-[10px] text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {sanitizedSample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
