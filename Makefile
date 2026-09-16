.PHONY: help setup-m2 start-m2 start-gateways start-all stop test test-all lint clean sanity-ports

help:
	@echo "light-weight-agentic-engineering Platform (Mac M2 Commands)"
	@echo "  make setup-m2       - Install uv, pnpm, and pull Ollama M2 models"
	@echo "  make start-m2       - Boot lightweight local stack (Ollama, Postgres, Redis, Temporal)"
	@echo "  make start-gateways - Launch 6 Python Microservice Gateways (Ports 8001-8006)"
	@echo "  make start-all      - Turnkey 12-port launch (Containers + 6 Gateways + Port 3000 UI)"
	@echo "  make sanity-ports   - Audit all 12 ports & verify live microservices before demo"
	@echo "  make stop           - Stop all background containers and services"
	@echo "  make test-all       - Run all unit and e2e tests across all planes"
	@echo "  make lint           - Run Ruff and ESLint checks"

sanity-ports:
	@chmod +x ./infra/scripts/check-ports-sanity.sh
	@./infra/scripts/check-ports-sanity.sh

setup-m2:
	@echo "==> Setting up Apple Silicon Mac M2 environment..."
	@which uv > /dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
	uv sync
	pnpm install
	@echo "==> Pulling lightweight models into local Ollama..."
	ollama pull llama3.2:3b
	ollama pull qwen2.5-coder:7b

start-m2:
	@if command -v podman > /dev/null && podman machine info > /dev/null 2>&1; then \
		echo "==> Booting local stack with Rootless Podman..."; \
		podman compose -f podman-compose.local.yml up -d; \
	elif command -v docker > /dev/null && docker info > /dev/null 2>&1; then \
		echo "==> Booting local stack with Docker Desktop..."; \
		docker compose -f docker-compose.local.yml up -d; \
	elif command -v podman > /dev/null; then \
		echo "==> Booting local stack with Podman..."; \
		podman compose -f podman-compose.local.yml up -d; \
	else \
		echo "==> Booting local stack with Docker..."; \
		docker compose -f docker-compose.local.yml up -d; \
	fi
	@echo "==> Enterprise local services running on Mac M2:"
	@echo "    - Ollama (Metal GPU): http://localhost:11434"
	@echo "    - PostgreSQL (pgvector): localhost:5432"
	@echo "    - Temporal Engine: localhost:7233"
	@echo "    - Web Platform: http://localhost:3000"

start-gateways:
	@echo "==> Spawning 6 Python Microservice Gateways (Ports 8001-8006)..."
	python3 infra/scripts/run_gateways.py

start-all:
	@chmod +x ./infra/scripts/start-all-services.sh
	@./infra/scripts/start-all-services.sh

stop:
	@if command -v podman > /dev/null && podman machine info > /dev/null 2>&1; then \
		podman compose -f podman-compose.local.yml down; \
	elif command -v docker > /dev/null && docker info > /dev/null 2>&1; then \
		docker compose -f docker-compose.local.yml down; \
	elif command -v podman > /dev/null; then \
		podman compose -f podman-compose.local.yml down; \
	else \
		docker compose -f docker-compose.local.yml down; \
	fi

test-all:
	uv run pytest tests/ -v --cov=planes

lint:
	uv run ruff check .
	pnpm run lint
