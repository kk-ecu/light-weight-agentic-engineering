from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from temporalio.client import Client

app = FastAPI(title="Enterprise Approval Service")

class ApprovalDecision(BaseModel):
    workflow_id: str
    decision: str # "APPROVED" | "REJECTED"
    approver_id: str
    signature: str
    audit_notes: str

@app.post("/api/v1/approvals/sign-off")
async def submit_sign_off(body: ApprovalDecision):
    client = await Client.connect("localhost:7233")
    handle = client.get_workflow_handle(body.workflow_id)

    # Deliver Temporal Signal to unpause the paused workflow
    await handle.signal(
        "human_approval_signal",
        {
            "decision": body.decision,
            "approver": body.approver_id,
            "signature": body.signature,
            "notes": body.audit_notes
        }
    )

    return {
        "status": "SIGNAL_DELIVERED",
        "workflow_id": body.workflow_id,
        "action": body.decision
    }
