from fastapi import FastAPI
import httpx
import os
import re

app = FastAPI(title="Enterprise LLM Gateway (Mac M2 Optimized)")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# DLP Regex Patterns for Sensitive Data Scrubbing
DLP_PATTERNS = [
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", # Email
    r"(?i)bearer\s+[a-z0-9_\-\.]+",                  # API Keys
    r"[STFG]\d{7}[A-Z]"                                # Singapore NRIC
]

def scrub_sensitive_data(text: str) -> str:
    cleaned = text
    for pat in DLP_PATTERNS:
        cleaned = re.sub(pat, "[REDACTED]", cleaned)
    return cleaned

@app.post("/v1/chat/completions")
async def route_completion(payload: dict):
    model = payload.get("model", "llama3.2:3b")
    messages = payload.get("messages", [])

    # Scrub prompt inputs before dispatch
    for msg in messages:
        msg["content"] = scrub_sensitive_data(msg["content"])

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={"model": model, "messages": messages, "stream": False}
        )
        return resp.json()
