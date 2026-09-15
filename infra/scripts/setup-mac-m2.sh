#!/usr/bin/env bash
# ==============================================================================
# light-weight-agentic-engineering: Automated Mac M2 Local Setup Script
# ==============================================================================
# Automates prerequisite checks, Docker profile startup, model pulling,
# database migrations, and end-to-end verification tests on Apple Silicon.
# ==============================================================================

set -euo pipefail

# ANSI Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "================================================================================"
echo "    light-weight-agentic-engineering: Mac M2 Local Bootstrap Script           "
echo "================================================================================"
echo -e "${NC}"

# 1. Architecture Verification
echo -e "${BOLD}[1/7] Verifying Apple Silicon Mac Hardware Architecture...${NC}"
ARCH=$(uname -m)
CPU_BRAND=$(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "Unknown CPU")

echo "       Architecture : $ARCH"
echo "       Processor    : $CPU_BRAND"

if [ "$ARCH" != "arm64" ]; then
    echo -e "${RED}[ERROR] Detected $ARCH. This stack requires Apple Silicon (arm64).${NC}"
    echo "       Ensure Terminal is not running under Rosetta emulation."
    exit 1
fi
echo -e "${GREEN}✔ Apple Silicon arm64 verified.${NC}\n"

# 2. Package Managers & Dependency Tools Check
echo -e "${BOLD}[2/7] Checking Required Developer Toolchain...${NC}"

if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}==> Homebrew not detected. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo -e "${GREEN}✔ Homebrew installed: $(brew --version | head -n 1)${NC}"
fi

if ! command -v uv &> /dev/null; then
    echo -e "${YELLOW}==> Installing Astral UV package manager...${NC}"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi
echo -e "${GREEN}✔ Astral UV ready: $(uv --version)${NC}"

if ! command -v podman &> /dev/null; then
    echo -e "${RED}[ERROR] Podman is not installed.${NC}"
    echo "       Please install Podman for macOS: 'brew install podman podman-compose'"
    exit 1
else
    echo -e "${GREEN}✔ Podman engine ready: $(podman --version)${NC}"
fi

# Ensure Podman machine is running
if ! podman machine info &> /dev/null; then
    echo -e "${YELLOW}==> Initializing Rootless Podman Machine (4 CPU, 6GB RAM)...${NC}"
    podman machine init --cpus 4 --memory 6144 --disk-size 40 --now
else
    if [ "$(podman machine info --format '{{.Host.MachineState}}' 2>/dev/null)" != "Running" ]; then
        echo -e "${YELLOW}==> Starting Podman Machine...${NC}"
        podman machine start
    fi
fi
echo -e "${GREEN}✔ Rootless Podman machine is healthy.${NC}\n"

# 3. Workspace Dependency Synchronization
echo -e "${BOLD}[3/7] Synchronizing Python & Node Dependencies...${NC}"
echo "       Running 'uv sync' for Python >=3.11 workspaces..."
uv sync

if command -v pnpm &> /dev/null; then
    echo "       Running 'pnpm install' for Experience Plane..."
    pnpm install --silent
else
    echo "       Running 'npm install'..."
    npm install --silent
fi
echo -e "${GREEN}✔ All language dependencies synchronized.${NC}\n"

# 4. Boot Local Infrastructure Containers (Podman Compose)
echo -e "${BOLD}[4/7] Booting Local Containers (Ollama, PostgreSQL+pgvector, Redis, Temporal)...${NC}"
podman compose -f podman-compose.local.yml up -d

echo "       Waiting for PostgreSQL pgvector to become ready on port 5432..."
until podman exec -i agentic-postgres pg_isready -U agentic_admin -d agentic_agentic_db &> /dev/null; do
    sleep 1
done
echo -e "${GREEN}✔ PostgreSQL container healthy with pgvector enabled (Rootless Podman).${NC}\n"

# 5. Model Acquisition & Metal GPU Verification
echo -e "${BOLD}[5/7] Verifying Local Ollama Models in Metal Memory...${NC}"
if command -v ollama &> /dev/null; then
    echo "       Pulling lightweight models into Ollama..."
    ollama pull llama3.2:3b
    ollama pull qwen2.5-coder:7b
    echo -e "${GREEN}✔ Models loaded: llama3.2:3b, qwen2.5-coder:7b.${NC}"
else
    echo "       Ollama running inside container. Pulling via podman exec..."
    podman exec -i agentic-ollama ollama pull llama3.2:3b
    podman exec -i agentic-ollama ollama pull qwen2.5-coder:7b
    echo -e "${GREEN}✔ Container models ready.${NC}"
fi
echo ""

# 6. Database Seeding & Extension Verification
echo -e "${BOLD}[6/7] Testing pgvector Cosine Distance Query in PostgreSQL...${NC}"
COSINE_TEST=$(podman exec -i agentic-postgres psql -U agentic_admin -d agentic_agentic_db -t -A -c "SELECT '[1,2,3]'::vector <=> '[1,2,4]'::vector;")
echo "       Cosine distance calculation output: $COSINE_TEST"
echo -e "${GREEN}✔ pgvector extension verified.${NC}\n"

# 7. End-to-End Verification Test
echo -e "${BOLD}[7/7] Running E2E Verification Tests across all 6 planes...${NC}"
uv run pytest tests/e2e/test_engineering_pr_flow.py -v

echo -e "${CYAN}${BOLD}"
echo "================================================================================"
echo " ✅ Mac M2 Local Setup Complete! Stack is Operational with Zero Cloud Cost."
echo "================================================================================"
echo -e "${NC}"
echo -e "Next steps to run the interactive full-stack experience:"
echo -e "  ${YELLOW}pnpm dev${NC}       -> Open Web Portal on http://localhost:3000"
echo -e "  ${YELLOW}make test-all${NC}  -> Run full unit and integration test matrices"
echo -e "  ${YELLOW}podman ps${NC}      -> Check container statuses"
echo ""
