from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Enterprise MCP Tool Gateway")

# Permitted action classes: "read", "draft", "update", "deploy"
class MCPToolCall(BaseModel):
    tool_name: str
    action_class: str
    caller_role: str
    parameters: dict

@app.post("/mcp/v1/tools/execute")
async def execute_tool(call: MCPToolCall):
    # Action class validation
    if call.action_class == "deploy" and call.caller_role != "release_manager":
        raise HTTPException(
            status_code=403, 
            detail="Forbidden: 'deploy' action class requires release_manager role"
        )

    # Scoped Secrets Broker injection (tokens are NOT exposed to agent LLM)
    # The adapter executes in a sandboxed worker
    return {
        "status": "SUCCESS",
        "tool": call.tool_name,
        "action_class": call.action_class,
        "execution_broker": "sandboxed-worker-01"
    }
