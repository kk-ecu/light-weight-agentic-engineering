#!/usr/bin/env bash
# ==============================================================================
# light-weight-agentic-engineering: 12-Port Sanity Check & Self-Healing Diagnostics
# ==============================================================================
# This script inspects all 12 critical platform ports across the 6-Plane architecture.
# If any port is offline, blocked, or in conflict, it gives exact diagnostic
# recommendations and remediation commands so your live demo is never damaged.
# ==============================================================================

set -uo pipefail

# ANSI Color Codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Global counters
PASSED_COUNT=0
FAILED_COUNT=0
TOTAL_PORTS=12

echo -e "\n${BOLD}${CYAN}================================================================================${NC}"
echo -e "${BOLD}${CYAN}   ⚡ light-weight-agentic-engineering: 12-Port Sanity & Port Doctor Suite       ${NC}"
echo -e "${BOLD}${CYAN}================================================================================${NC}"
echo -e "${BLUE}Auditing all host gateways and rootless Podman/Docker containers...${NC}\n"

# Helper function to test port availability (TCP or HTTP)
# Arguments:
#   $1: Port number
#   $2: Service Name
#   $3: Protocol / Type
#   $4: Runtime (Host Python / Host Node / Docker Container)
#   $5: Description / Plane
#   $6: Probe Type ("http" | "tcp")
#   $7: Probe Path (e.g., "/api/health" for http, or "" for tcp)
#   $8: Failure Remediation Command / Recommendation
check_port() {
  local port="$1"
  local service_name="$2"
  local protocol="$3"
  local runtime="$4"
  local description="$5"
  local probe_type="$6"
  local probe_path="$7"
  local recommendation="$8"

  local is_open=0
  local pid_info=""

  # 1. Probe the port using nc, curl, or bash tcp pseudo-device
  if [ "$probe_type" = "http" ]; then
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 1 "http://127.0.0.1:${port}${probe_path}" 2>/dev/null || echo "000")
    if [ "$http_code" != "000" ]; then
      is_open=1
    fi
  else
    # TCP port probe
    if command -v nc >/dev/null 2>&1; then
      if nc -z -w 1 127.0.0.1 "$port" 2>/dev/null; then
        is_open=1
      fi
    elif (echo > /dev/tcp/127.0.0.1/"$port") 2>/dev/null; then
      is_open=1
    fi
  fi

  # 2. If port probe failed, test if process is listening via lsof or netstat
  if [ "$is_open" -eq 0 ]; then
    if command -v lsof >/dev/null 2>&1; then
      pid_info=$(lsof -iTCP:"$port" -sTCP:LISTEN -P -n 2>/dev/null | tail -n +2 || true)
      if [ -n "$pid_info" ]; then
        is_open=1
      fi
    elif command -v netstat >/dev/null 2>&1; then
      if netstat -tuln 2>/dev/null | grep -q ":${port} "; then
        is_open=1
      fi
    elif command -v ss >/dev/null 2>&1; then
      if ss -tuln 2>/dev/null | grep -q ":${port} "; then
        is_open=1
      fi
    fi

    # 2.1 Check if the gateway virtualized / proxied this port in containerized environments
    if [ "$is_open" -eq 0 ]; then
      if curl -s "http://127.0.0.1:3000/api/system/port-sanity" 2>/dev/null | grep -q "\"port\":${port}.*\"status\":\"online\""; then
        is_open=1
      fi
    fi
  fi

  # 3. Output results and actionable guidance
  printf "%-6s | %-26s | %-16s | " "$port" "$service_name" "$runtime"

  if [ "$is_open" -eq 1 ]; then
    echo -e "${GREEN}${BOLD}✔ ONLINE / LISTENING${NC}"
    ((PASSED_COUNT++))
  else
    echo -e "${RED}${BOLD}✖ BLOCKED / OFFLINE${NC}"
    ((FAILED_COUNT++))

    echo -e "   ${YELLOW}↳ Description:${NC} $description"
    echo -e "   ${YELLOW}↳ Root Cause:${NC} Nothing is listening on port ${port} or the process crashed."

    # Look up what might be occupying or conflicting
    if command -v lsof >/dev/null 2>&1; then
      local conflict_proc
      conflict_proc=$(lsof -i :"$port" 2>/dev/null | tail -n +2 | head -n 1 || true)
      if [ -n "$conflict_proc" ]; then
        echo -e "   ${RED}↳ Port Collision Detected:${NC} $conflict_proc"
        echo -e "   ${CYAN}↳ Recommended Fix (Free Port):${NC} kill -9 \$(lsof -ti :${port})"
      fi
    fi

    echo -e "   ${CYAN}↳ Recommendation / Recovery Command:${NC}"
    echo -e "     ${BOLD}${recommendation}${NC}"
    echo ""
  fi
}

echo -e "${BOLD}PORT   | SERVICE NAME               | RUNTIME          | STATUS${NC}"
echo -e "-------+----------------------------+------------------+-----------------------"

# 1. Port 3000: Full-Stack Gateway & UI
check_port 3000 \
  "Full-Stack Gateway & UI" \
  "HTTP / REST" \
  "Host Node.js" \
  "Single entry point & reverse proxy for web portal and API routing" \
  "http" \
  "/api/health" \
  "Run: 'npm run dev' or check if another node process holds 3000 with: 'lsof -ti :3000 | xargs kill -9'"

# 2. Port 8001: Agent Gateway
check_port 8001 \
  "Agent Gateway" \
  "HTTP / REST" \
  "Host Python" \
  "LangGraph state machine task dispatcher & postgres checkpointer" \
  "http" \
  "/docs" \
  "Run: 'python3 -m planes.agent-control-plane.services.agent-gateway.main' or launch via 'make start-m2'"

# 3. Port 8002: LLM Gateway
check_port 8002 \
  "LLM Gateway" \
  "HTTP / REST" \
  "Host Python" \
  "DLP prompt sanitizer, regex token scrubbers & local Ollama reverse proxy" \
  "http" \
  "/docs" \
  "Run: 'python3 -m planes.agent-control-plane.services.llm-gateway.main'"

# 4. Port 8003: MCP Tool Gateway
check_port 8003 \
  "MCP Tool Gateway" \
  "JSON-RPC / HTTP" \
  "Host Python" \
  "Scoped ephemeral secret injection, JSON-RPC 2.0 tool execution sandbox" \
  "http" \
  "/docs" \
  "Run: 'python3 -m planes.tool-integration-plane.services.mcp-gateway.main'"

# 5. Port 8004: Knowledge Retrieval
check_port 8004 \
  "Knowledge Retrieval" \
  "HTTP / asyncpg" \
  "Host Python" \
  "pgvector hybrid HNSW cosine + BM25 Reciprocal Rank Fusion search engine" \
  "http" \
  "/docs" \
  "Run: 'python3 -m planes.knowledge-plane.services.retrieval-service.retrieval'"

# 6. Port 8005: Approval Service
check_port 8005 \
  "Approval Service" \
  "HTTP / REST" \
  "Host Python" \
  "Cryptographic Human-in-the-Loop (HITL) approval gate and token validator" \
  "http" \
  "/docs" \
  "Run: 'python3 -m planes.workflow-plane.services.approval-service.approval_handler'"

# 7. Port 8006: Policy Service
check_port 8006 \
  "Policy Service" \
  "HTTP / REST" \
  "Host Python" \
  "Central Zero-Trust RBAC & Action Class policy authorization engine" \
  "http" \
  "/docs" \
  "Run: 'python3 -m planes.operations-governance-plane.services.policy-service.policy'"

# 8. Port 11434: Ollama Metal Engine
check_port 11434 \
  "Ollama Metal Engine" \
  "HTTP" \
  "Host / Docker" \
  "Native Apple Silicon Metal GPU inference (Llama 3.2 3B / Qwen 2.5 Coder)" \
  "http" \
  "/api/tags" \
  "Run: 'ollama serve' or start container: 'podman start agentic-ollama'"

# 9. Port 5432: PostgreSQL 16 + pgvector
check_port 5432 \
  "PostgreSQL 16 + pgvector" \
  "TCP / SQL" \
  "Docker Container" \
  "Vector store for 1536-dim embeddings & LangGraph durable checkpoints" \
  "tcp" \
  "" \
  "Run: 'podman compose -f podman-compose.local.yml up -d agentic-postgres' or check if native postgres is colliding: 'brew services stop postgresql'"

# 10. Port 7233: Temporal Server
check_port 7233 \
  "Temporal Server" \
  "gRPC" \
  "Docker Container" \
  "Durable workflow orchestration engine for long-running agent state machines" \
  "tcp" \
  "" \
  "Run: 'podman compose -f podman-compose.local.yml up -d agentic-temporal'"

# 11. Port 8233: Temporal Web UI
check_port 8233 \
  "Temporal Web UI" \
  "HTTP" \
  "Docker Container" \
  "Live visual inspector and replay debugger for Temporal workflows" \
  "http" \
  "" \
  "Run: 'podman compose -f podman-compose.local.yml up -d agentic-temporal-admin-tools'"

# 12. Port 6379: Redis 7
check_port 6379 \
  "Redis 7" \
  "TCP" \
  "Docker Container" \
  "Distributed session cache, token bucket rate limits, and IPC pub/sub" \
  "tcp" \
  "" \
  "Run: 'podman compose -f podman-compose.local.yml up -d agentic-redis' or 'brew services stop redis'"

echo -e "--------------------------------------------------------------------------------"

# Summary & Live Demo Shield
if [ "$FAILED_COUNT" -eq 0 ]; then
  echo -e "\n${BOLD}${GREEN}🎉 PERFECT HEALTH: All ${TOTAL_PORTS} ports are open, listening, and healthy!${NC}"
  echo -e "${GREEN}Your enterprise demo environment is 100% ready with zero port conflicts.${NC}\n"
  exit 0
else
  echo -e "\n${BOLD}${YELLOW}⚠️  SANITY WARNING: ${FAILED_COUNT} of ${TOTAL_PORTS} ports require attention before live demo!${NC}"
  echo -e "${YELLOW}Review the remediation recommendations above to prevent demo interruptions.${NC}"
  echo -e "\n${CYAN}${BOLD}Quick 1-Step Fix For Container Ports (5432, 7233, 8233, 6379, 11434):${NC}"
  echo -e "  podman compose -f podman-compose.local.yml up -d"
  echo -e "\n${CYAN}${BOLD}Quick 1-Step Fix For Host Gateway (Port 3000):${NC}"
  echo -e "  npm run dev"
  echo -e "\n${CYAN}${BOLD}To kill any stuck process hogging a port:${NC}"
  echo -e "  lsof -ti :<PORT> | xargs kill -9\n"
  exit 1
fi
