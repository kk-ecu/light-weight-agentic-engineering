#!/usr/bin/env python3
"""
light-weight-agentic-engineering: 6 Python Microservice Supervisor
Concurrently boots all 6 microservices across ports 8001-8006 for full 12-port topology.
"""

import sys
import os
import signal
import subprocess
import time

SERVICES = [
    {
        "name": "Agent Gateway",
        "port": 8001,
        "module": "planes.agent-control-plane.services.agent-gateway.main:app",
        "file": "planes/agent-control-plane/services/agent-gateway/main.py"
    },
    {
        "name": "LLM Gateway",
        "port": 8002,
        "module": "planes.agent-control-plane.services.llm-gateway.main:app",
        "file": "planes/agent-control-plane/services/llm-gateway/main.py"
    },
    {
        "name": "MCP Tool Gateway",
        "port": 8003,
        "module": "planes.tool-integration-plane.services.mcp-gateway.main:app",
        "file": "planes/tool-integration-plane/services/mcp-gateway/main.py"
    },
    {
        "name": "Knowledge Retrieval",
        "port": 8004,
        "module": "planes.knowledge-plane.services.retrieval-service.retrieval:app",
        "file": "planes/knowledge-plane/services/retrieval-service/retrieval.py"
    },
    {
        "name": "Approval Service",
        "port": 8005,
        "module": "planes.workflow-plane.services.approval-service.approval_handler:app",
        "file": "planes/workflow-plane/services/approval-service/approval_handler.py"
    },
    {
        "name": "Policy Service",
        "port": 8006,
        "module": "planes.operations-governance-plane.services.policy-service.policy:app",
        "file": "planes/operations-governance-plane/services/policy-service/policy.py"
    }
]

processes = []

def cleanup(sig=None, frame=None):
    print("\n==> Stopping all 6 Python Microservice Gateways...")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def main():
    print("================================================================================")
    print(" 🚀 Launching 6 Autonomous Python Microservice Gateways (Ports 8001-8006)")
    print("================================================================================")

    env = os.environ.copy()
    env["PYTHONPATH"] = os.getcwd()

    for svc in SERVICES:
        cmd = [
            sys.executable,
            "-m", "uvicorn",
            svc["module"],
            "--host", "0.0.0.0",
            "--port", str(svc["port"]),
            "--log-level", "warning"
        ]
        print(f" [+] Starting {svc['name']:<24} -> http://localhost:{svc['port']}")
        proc = subprocess.Popen(cmd, env=env)
        processes.append(proc)

    print("\n✔ All 6 Gateways successfully launched.")
    print("Press Ctrl+C to shut down all microservices.\n")

    try:
        while True:
            time.sleep(1)
            for p in processes:
                if p.poll() is not None:
                    # One crashed, restart or continue
                    pass
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
