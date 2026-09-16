import React, { useState } from 'react';
import { LLM_ROUTES } from '../data/mockData';
import { LLMRouteConfig } from '../types';
import { LlmBenchmarkView } from './LlmBenchmarkView';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  RefreshCw, 
  Terminal, 
  CheckCircle2, 
  Sliders, 
  Layers,
  Sparkles,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';

export const LlmGatewayView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'sandbox' | 'benchmarks'>('sandbox');
  const [selectedRoute, setSelectedRoute] = useState<LLMRouteConfig>(LLM_ROUTES[0]); // llama3.2:3b
  const [prompt, setPrompt] = useState('Draft an architectural tradeoff analysis between running pgvector on PostgreSQL vs standalone Qdrant for 50M enterprise vector records.');
  const [systemPrompt, setSystemPrompt] = useState('You are the Enterprise Solutions Architect for light-weight-agentic-engineering. Ground analysis on operational simplicity, ACID durability, and M2 developer parity.');
  const [temperature, setTemperature] = useState(0.2);
  const [redactionEnabled, setRedactionEnabled] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [completionOutput, setCompletionOutput] = useState<null | {
    text: string;
    model: string;
    tokensIn: number;
    tokensOut: number;
    latencyMs: number;
    costUsd: number;
    redactedItems: string[];
  }>({
    text: `### Architectural Tradeoff Analysis: pgvector vs Qdrant

1. **Operational Simplicity & Parity (Mac M2 Local Stack)**:
   - **pgvector**: High parity with relational schemas. Developers can run \`pgvector/pgvector:pg16\` in local Docker with zero extra cluster footprint. Single ACID backup across entity tables and vector embeddings.
   - **Qdrant**: Requires separate container daemon and backup lifecycle, introducing cognitive overhead for local M2 developers.

2. **Performance at 50M Records**:
   - For 50M record scale, HNSW indexing on pgvector requires ~16GB dedicated RAM buffer pool. If memory constrained on developer machines, HNSW with halfvec (fp16) provides 2x memory reduction with 98% recall.

**Recommendation for POC**: Standardize on **PostgreSQL + pgvector** for the POC and Staging, as decided in ADR-007.`,
    model: "ollama/llama3.2:3b",
    tokensIn: 84,
    tokensOut: 242,
    latencyMs: 44,
    costUsd: 0.000,
    redactedItems: ["auth-token-scrubbed", "internal-ip-masked"]
  });

  const handleSelectRoute = (route: LLMRouteConfig) => {
    setSelectedRoute(route);

    // Update suggested prompt based on model capabilities
    if (route.modelId.includes('coder')) {
      setPrompt('Write a Python test suite using pytest for the Redis idempotency lock decorator, asserting race condition prevention across 5 concurrent coroutines.');
      setSystemPrompt('You are the Principal Staff Software Engineer for light-weight-agentic-engineering. Produce production-grade, PEP-8 compliant code with zero mock stubs.');
    } else if (route.modelId.includes('deepseek-r1')) {
      setPrompt('Provide a deep chain-of-thought analysis on why the 6 Autonomous Planes are architecturally superior to a monolith for local Mac M2 offline execution.');
      setSystemPrompt('You are the Chief AI Systems Architect. Think step-by-step through operational boundaries, fault domains, and zero-trust decoupling.');
    } else if (route.modelId.includes('llama3.2')) {
      setPrompt('Draft an architectural tradeoff analysis between running pgvector on PostgreSQL vs standalone Qdrant for 50M enterprise vector records.');
      setSystemPrompt('You are the Enterprise Solutions Architect for light-weight-agentic-engineering. Ground analysis on operational simplicity, ACID durability, and M2 developer parity.');
    } else if (route.modelId.includes('mistral')) {
      setPrompt('Generate a comprehensive PR description for PR #128 (Redis idempotency decorator) including testing checklist and SOC2 security verification.');
      setSystemPrompt('You are the Engineering Governance Officer. Ensure strict compliance documentation and clear semantic commit messages.');
    } else {
      setPrompt('Evaluate enterprise LLM routing fallback policies when local Apple Silicon Ollama instance reaches 90% GPU saturation.');
      setSystemPrompt('You are the Cloud Reliability Architect managing hybrid cloud fallbacks.');
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let responseText = "";
      if (selectedRoute.modelId.includes("coder")) {
        responseText = `\`\`\`python
# tests/test_idempotency.py
import pytest
import asyncio
from unittest.mock import AsyncMock
from services.agent_gateway.app.idempotency import idempotent_request

@pytest.mark.asyncio
async def test_idempotent_request_blocks_concurrent_execution():
    """Asserts that duplicate concurrent requests with identical idempotency keys raise ValueError."""
    mock_redis = AsyncMock()
    # First call acquires lock (True), second call fails (False)
    mock_redis.set.side_effect = [True, False]

    executed_count = 0

    @idempotent_request(redis_client=mock_redis, ttl_seconds=30)
    async def process_payment(idempotency_key: str, amount: float):
        nonlocal executed_count
        executed_count += 1
        await asyncio.sleep(0.01)
        return {"status": "SUCCESS", "amount": amount}

    # First invocation succeeds
    res1 = await process_payment(idempotency_key="idemp-key-9921", amount=149.99)
    assert res1["status"] == "SUCCESS"
    assert executed_count == 1

    # Concurrent second invocation with same key is rejected by atomic SETNX
    with pytest.raises(ValueError, match="Duplicate request in-flight"):
        await process_payment(idempotency_key="idemp-key-9921", amount=149.99)

    assert executed_count == 1
    assert mock_redis.set.call_count == 2
\`\`\``;
      } else if (selectedRoute.modelId.includes("deepseek-r1")) {
        responseText = `<think>
1. Analyzing user prompt: 6 Autonomous Planes vs Monolith on Apple Silicon M2.
2. Plane separation allows each service to scale or restart independently:
   - Experience Plane (Vite/React) consumes 0 inference memory.
   - LLM Gateway manages Ollama process lifetimes without crashing Agent Gateway (LangGraph).
   - Knowledge Plane (pgvector) runs in Docker with fixed 512MB RAM cap.
3. Fault domain isolation: A transient bug in an MCP tool adapter does not bring down the primary workflow engine.
4. Parity: Developers run the exact same container manifest on M2 that runs in Kubernetes.
</think>

### Architectural Justification: 6 Autonomous Decoupled Planes

1. **Hardware Memory Segmentation (Mac M2 16GB / 24GB Unified RAM)**:
   - By running independent lightweight gateways (FastAPI on ports 8000, 8080, 8002), unified memory is strictly segmented. 
   - When Ollama loads Qwen 2.5 Coder (7B Q4_K_M ~4.4GB), the remaining 11GB is safely reserved for PostgreSQL (pgvector) and OS buffers.

2. **Zero-Trust Security Boundaries**:
   - The Agent Gateway (port 8000) does not hold cloud credentials.
   - The MCP Gateway (port 8080) enforces capability checking and requires Human-in-the-Loop approval for 'deploy' operations.

3. **Autonomous Restartability**:
   - If a Python script in the Agent Gateway hits an out-of-memory or timeout condition, LangGraph checkpointer recovers state from PostgreSQL without restarting the LLM or Tool gateways.`;
      } else if (selectedRoute.modelId.includes("mistral")) {
        responseText = `## Pull Request #128: Implement Redis Idempotency Key Lock Decorator

### Summary of Changes:
- Added \`idempotent_request\` decorator leveraging atomic Redis \`SETNX\` with configurable 30s TTL.
- Enforced zero-leak secret scrubbing on all inbound idempotency payload headers.
- Added 6 unit tests in \`tests/test_idempotency.py\` with 100% boundary test coverage.

### Compliance & Security Verification:
- **SOC2 Type II**: Meets replay attack prevention requirements (CC6.1).
- **Zero-Trust MCP Gate**: Passed all automated policy checks with verdict ALLOW.
- **Test Matrix**: 6/6 tests passing on Apple Silicon M2 local test runner.`;
      } else {
        responseText = `### Architectural Tradeoff Analysis: pgvector vs Qdrant

1. **Operational Simplicity & Parity (Mac M2 Local Stack)**:
   - **pgvector**: High parity with relational schemas. Developers can run \`pgvector/pgvector:pg16\` in local Docker with zero extra cluster footprint. Single ACID backup across entity tables and vector embeddings.
   - **Qdrant**: Requires separate container daemon and backup lifecycle, introducing cognitive overhead for local M2 developers.

2. **Performance at 50M Records**:
   - For 50M record scale, HNSW indexing on pgvector requires ~16GB dedicated RAM buffer pool. If memory constrained on developer machines, HNSW with halfvec (fp16) provides 2x memory reduction with 98% recall.

**Recommendation for POC**: Standardize on **PostgreSQL + pgvector** for the POC and Staging, as decided in ADR-007.`;
      }

      setCompletionOutput({
        text: responseText,
        model: selectedRoute.modelId,
        tokensIn: Math.round(prompt.length / 4),
        tokensOut: Math.round(responseText.length / 4),
        latencyMs: selectedRoute.averageLatencyMs + Math.floor(Math.random() * 15),
        costUsd: selectedRoute.costPer1kInput * (prompt.length / 4000),
        redactedItems: redactionEnabled ? ["client_secret_redacted", "internal_host_sanitized"] : []
      });
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">LLM Gateway & Local Ollama Router</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                Mac M2 Apple Silicon Accelerated
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-model abstraction layer, prompt versioning, PII/secret scrubbing, and local vs cloud cost governance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span>Ollama Daemon:</span>
              <span className="text-emerald-400 font-semibold">http://localhost:11434 (Active)</span>
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('sandbox')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                  viewMode === 'sandbox'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sandbox & Router</span>
              </button>
              <button
                onClick={() => setViewMode('benchmarks')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                  viewMode === 'benchmarks'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Benchmark Engine</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'benchmarks' ? (
        <LlmBenchmarkView />
      ) : (
        <>
          {/* Model Catalog Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Available Model Routes (Local Mac M2 + Cloud Fallback):
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LLM_ROUTES.map((route) => {
            const isSelected = selectedRoute.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => handleSelectRoute(route)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-white">{route.name}</span>
                  {route.localM2Optimized ? (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                      <Zap className="w-2.5 h-2.5" />
                      <span>$0.00 / Local</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                      Cloud API
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mb-2">ID: {route.modelId}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {route.taskSuitability.map((suit, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      {suit}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Context: {(route.contextWindow / 1024).toFixed(0)}k</span>
                  <span className="text-amber-400">~{route.averageLatencyMs}ms latency</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Prompt & Redaction Laboratory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prompt Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Model Prompt Studio</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">System Prompt (Governance)</label>
                <textarea
                  rows={2}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User Prompt</label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Controls: Temperature & Redaction Guard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Temperature</span>
                    <span className="font-mono text-white">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Secret Redaction</span>
                    <span className="text-[10px] text-slate-400">Scrub API keys & PII</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={redactionEnabled}
                    onChange={(e) => setRedactionEnabled(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing locally...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Route Request ({selectedRoute.name})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* FinOps Economics Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Apple Silicon M2 FinOps Impact</span>
                <span className="text-slate-400 text-[11px]">100% free offline execution for internal development loops.</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-emerald-400 font-bold block text-sm">$0.00 USD</span>
              <span className="text-slate-500 text-[10px]">vs ~$42/mo cloud tokens</span>
            </div>
          </div>
        </div>

        {/* Output & Telemetry View */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white uppercase tracking-wider">Gateway Response & Telemetry</span>
                </div>
                {completionOutput && (
                  <div className="flex items-center space-x-2 font-mono text-[11px]">
                    <span className="text-emerald-400">{completionOutput.latencyMs}ms</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-amber-400">{completionOutput.tokensOut} tokens</span>
                  </div>
                )}
              </div>

              {completionOutput ? (
                <div className="space-y-3">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                    {completionOutput.text}
                  </div>

                  {completionOutput.redactedItems.length > 0 && (
                    <div className="flex items-center space-x-2 text-[11px] bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Security redactions applied:</span>
                      {completionOutput.redactedItems.map((item, idx) => (
                        <span key={idx} className="font-mono bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Run a prompt to see LLM Gateway routing and telemetry.
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex justify-between">
              <span>Selected Provider: {selectedRoute.provider.toUpperCase()}</span>
              <span>Context Budget: {(selectedRoute.contextWindow / 1024).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
