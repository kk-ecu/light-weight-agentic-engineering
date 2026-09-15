.PHONY: help setup-m2 start-m2 stop test test-all lint clean

help:
	@echo "light-weight-agentic-engineering Platform (Mac M2 Commands)"
	@echo "  make setup-m2   - Install uv, pnpm, and pull Ollama M2 models"
	@echo "  make start-m2   - Boot lightweight local stack (Ollama, Postgres, Redis, Temporal)"
	@echo "  make stop       - Stop all background containers"
	@echo "  make test-all   - Run all unit and e2e tests across all planes"
	@echo "  make lint       - Run Ruff and ESLint checks"

setup-m2:
	@echo "==> Setting up Apple Silicon Mac M2 environment..."
	@which uv > /dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
	uv sync
	pnpm install
	@echo "==> Pulling lightweight models into local Ollama..."
	ollama pull llama3.2:3b
	ollama pull qwen2.5-coder:7b

start-m2:
	podman compose -f podman-compose.local.yml up -d
	@echo "==> Enterprise local services running on Mac M2 (Rootless Podman):"
	@echo "    - Ollama (Metal GPU): http://localhost:11434"
	@echo "    - PostgreSQL (pgvector): localhost:5432"
	@echo "    - Temporal Engine: localhost:7233"
	@echo "    - Web Platform: http://localhost:3000"

stop:
	podman compose -f podman-compose.local.yml down

test-all:
	uv run pytest tests/ -v --cov=planes

lint:
	uv run ruff check .
	pnpm run lint
