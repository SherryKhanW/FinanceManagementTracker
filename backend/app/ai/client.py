import json

from groq import Groq

from app.insights.schemas import (
    AIInsightResponse,
    FinancialSnapshotResponse,
)


class GroqAIClient:
    def __init__(self):
        self.client = Groq()

    def generate_financial_insights(
            self,
            snapshot: FinancialSnapshotResponse,
    ) -> AIInsightResponse:

        response = self.client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You generate concise personal-finance insights. "
                        "Use only the financial facts provided by the user. "
                        "Do not invent transactions, amounts, or financial facts. "
                        "Do not perform new financial calculations. "
                        "Give practical, non-judgmental recommendations."
                    ),
                },
                {
                    "role": "user",
                    "content": snapshot.model_dump_json(),
                },
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "financial_insights",
                    "strict": True,
                    "schema": AIInsightResponse.model_json_schema(),
                },
            },
        )

        content = response.choices[0].message.content

        return AIInsightResponse.model_validate(
            json.loads(content)
        )