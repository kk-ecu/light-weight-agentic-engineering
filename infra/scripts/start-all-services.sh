#!/usr/bin/env bash
# ==============================================================================
# light-weight-agentic-engineering: 12-Port Complete Workspace Bootstrapper
# ==============================================================================
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "================================================================================"
echo " 🚀 Bootstrapping All 12 Ports for light-weight-agentic-engineering"
echo " Target Hardware: Apple Silicon M2 (16GB RAM Unified Memory)"
echo "================================================================================"

# 1. Start Infrastructure Containers (Ports 5432, 6379, 7233, 8233, 11434)
echo "==> [Phase 1/3] Starting Storage & Engine Containers..."
if command -v podman-compose &> /dev/null; then
    podman-compose -f infra/docker-compose.yml up -d
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose -f infra/docker-compose.yml up -d
else
    echo "⚠️ Warning: Container runtime not detected. Ensure PostgreSQL, Redis, and Temporal are available."
fi

# 2. Start 6 Python Microservice Gateways (Ports 8001-8006)
echo "==> [Phase 2/3] Spawning 6 Autonomous Python Gateways (Ports 8001-8006)..."
if command -v python3 &> /dev/null; then
    python3 infra/scripts/run_gateways.py &
    GATEWAY_PID=$!
    echo "✔ Python Gateways running with PID $GATEWAY_PID"
fi

# Trap to kill background processes on exit
trap 'echo "Stopping gateways..."; kill $GATEWAY_PID 2>/dev/null || true' EXIT

# 3. Start Experience Plane & Unified Router (Port 3000)
echo "==> [Phase 3/3] Starting Experience Plane & Reverse Proxy on Port 3000..."
pnpm dev
