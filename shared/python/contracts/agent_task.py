from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class ActionClass(str, Enum):
    READ = "read"
    DRAFT = "draft"
    UPDATE = "update"
    DEPLOY = "deploy"

class CitationProvenance(BaseModel):
    doc_id: str
    section: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    source_url: Optional[str] = None

class AgentTaskEnvelope(BaseModel):
    task_id: str
    agent_id: str
    action_class: ActionClass
    prompt: str
    session_id: str
    groundedness_score: Optional[float] = None
    citations: List[CitationProvenance] = []
