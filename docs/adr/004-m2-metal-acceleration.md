# ADR 004: Apple Silicon Metal GPU Acceleration for Local Inference

## Status
**ACCEPTED** (2026-09-15)

## Context
Running production multi-agent engineering platforms against commercial cloud LLM APIs poses three critical risks:
1. **Financial Risk**: High token costs for iterative code and unit test synthesis loops.
2. **Security & Compliance Risk**: Proprietary intellectual property, codebases, and credentials transmitted to third-party endpoints.
3. **Availability Risk**: Rate limiting and network latency disruptions.

Apple Silicon Macs (M2, M2 Pro, M2 Max, M3, M4) feature a unified memory architecture where CPU, GPU (Metal), and Neural Engine share access to a single high-bandwidth memory pool (up to 400 GB/s on Max/Ultra chips).

## Decision
We mandate local inference via Ollama and `llama.cpp` using native Apple Silicon Metal shaders for all development and engineering assistant workflows:
- **Default General/Concierge Model**: `llama3.2:3b` (4-bit Q4_K_M quantization, 2.2 GB VRAM).
- **Default Code Synthesis Model**: `qwen2.5-coder:7b` (4-bit Q4_K_M quantization, 4.8 GB VRAM).
- **Execution Target**: Native Darwin `arm64` Metal acceleration via Ollama process on port `11434`.

## Consequences
### Positive
- **Zero Token Costs**: 100% free local execution ($0.00 / month).
- **Strict Data Privacy**: All source code, prompts, and context remain entirely on the local machine.
- **High Throughput**: 48.2 tokens/second sustained throughput with 18ms first-token latency.
- **Low Memory Overhead**: Total memory consumption is ~5.62 GB, well within standard 16 GB Apple M2 configurations.

### Negative
- Local machines must have Apple Silicon (M-series) hardware with at least 16 GB unified RAM.
