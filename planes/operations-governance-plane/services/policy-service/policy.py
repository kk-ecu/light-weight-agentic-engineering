from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Enterprise Central Policy Service")

class PolicyEvaluationRequest(BaseModel):
    agent_id: str
    action_class: str # "read" | "draft" | "deploy"
    environment: str = "production"

@app.post("/api/v1/policies/evaluate")
async def evaluate_policy(req: PolicyEvaluationRequest):
    # Rule 1: Public agents can only execute 'read'
    if req.agent_id == "website-concierge-agent" and req.action_class != "read":
        return {"allowed": False, "reason": "Public concierge agent is strictly read-only"}

    # Rule 2: Coding agent cannot directly deploy to production
    if req.agent_id == "coding-agent" and req.action_class == "deploy":
        return {"allowed": False, "reason": "Coding agent cannot execute direct production deployment"}

    return {"allowed": True, "reason": "Action class conforms to role policy"}
