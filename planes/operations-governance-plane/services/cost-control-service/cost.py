class CostControlService:
    def __init__(self):
        self.tenant_usage = {}

    def record_usage(self, tenant_id: str, model_id: str, prompt_tokens: int, completion_tokens: int) -> dict:
        # Local Ollama on Apple Silicon M2 incurs $0.00 cloud compute cost
        is_local = "ollama" in model_id.lower() or "llama" in model_id.lower()
        cost = 0.0 if is_local else (prompt_tokens * 0.0000015 + completion_tokens * 0.000002)

        return {
            "tenant_id": tenant_id,
            "model_id": model_id,
            "is_local_metal": is_local,
            "tokens_consumed": prompt_tokens + completion_tokens,
            "cost_usd": cost,
            "savings_vs_cloud": (prompt_tokens + completion_tokens) * 0.000002 if is_local else 0.0
        }
