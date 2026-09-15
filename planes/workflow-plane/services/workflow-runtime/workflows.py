from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy

@workflow.defn
class EngineeringPRWorkflow:
    """Durable state machine for autonomous Jira ticket implementation."""
    
    @workflow.run
    async def run(self, ticket_id: str, developer_id: str) -> dict:
        retry_policy = RetryPolicy(
            initial_interval=timedelta(seconds=2),
            backoff_coefficient=2.0,
            maximum_interval=timedelta(seconds=30),
            maximum_attempts=5
        )

        # Step 1: Query Jira context via MCP
        ticket_context = await workflow.execute_activity(
            "fetch_jira_criteria",
            ticket_id,
            start_to_close_timeout=timedelta(minutes=2),
            retry_policy=retry_policy
        )

        # Step 2: Invoke Coding Agent in Agent Control Plane
        code_draft = await workflow.execute_activity(
            "generate_code_draft",
            args=[ticket_context, "qwen2.5-coder:7b"],
            start_to_close_timeout=timedelta(minutes=5)
        )

        # Step 3: Run Evaluation Gate
        eval_result = await workflow.execute_activity(
            "evaluate_code_quality",
            code_draft,
            start_to_close_timeout=timedelta(minutes=3)
        )

        # Step 4: Open Draft PR via MCP Gateway
        pr_result = await workflow.execute_activity(
            "open_github_draft_pr",
            args=[ticket_id, code_draft, eval_result],
            start_to_close_timeout=timedelta(minutes=2)
        )

        return {
            "status": "COMPLETED",
            "pr_url": pr_result["html_url"],
            "eval_score": eval_result["score"]
        }
