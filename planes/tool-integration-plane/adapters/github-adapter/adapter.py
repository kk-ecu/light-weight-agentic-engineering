class GitHubMCPAdapter:
    def __init__(self, token_broker_fn):
        self.get_token = token_broker_fn

    async def create_draft_pr(self, repo: str, branch: str, title: str, body: str) -> dict:
        """Opens a GitHub Draft PR with audit evidence without merging to main."""
        token = await self.get_token("github")
        # In a real environment, calls PyGithub or GitHub REST API
        return {
            "html_url": f"https://github.com/agentic/{repo}/pull/4412",
            "number": 4412,
            "draft": True,
            "branch": branch,
            "title": title
        }
