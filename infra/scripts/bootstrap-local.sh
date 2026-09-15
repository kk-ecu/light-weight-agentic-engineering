#!/usr/bin/env bash
set -euo pipefail

echo "========================================================="
echo " Enterprise Agentic Engineering Platform - Mac M2 Setup"
echo "========================================================="

# 1. Verify Apple Silicon Architecture
ARCH=$(uname -m)
if [ "$ARCH" != "arm64" ]; then
  echo "⚠️ Warning: Detected $ARCH. This stack is optimized for Apple Silicon (arm64)."
fi

# 2. Verify UV Package Manager
if ! command -v uv &> /dev/null; then
  echo "==> Installing Astral UV package manager..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# 3. Synchronize Python & Node Workspaces
echo "==> Installing workspace dependencies via UV & PNPM..."
uv sync
pnpm install

# 4. Boot Local Apple Silicon Metal Stack
echo "==> Starting local infrastructure (Ollama, Postgres+pgvector, Redis, Temporal) via Rootless Podman..."
podman compose -f podman-compose.local.yml up -d

# 5. Pull High-Efficiency Local LLMs
echo "==> Pulling optimized local models into Ollama..."
ollama pull llama3.2:3b
ollama pull qwen2.5-coder:7b

echo "========================================================="
echo "✅ Setup Complete! Stack is ready on Apple Silicon M2."
echo "   Run 'make test-all' to execute verification tests."
echo "========================================================="
