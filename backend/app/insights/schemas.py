from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from typing import Literal

class InsightCategory(BaseModel):
    category: str
    amount: Decimal
    percentage: Decimal


class FinancialSnapshotResponse(BaseModel):
    budget: Decimal
    spent: Decimal
    remaining: Decimal
    percentage_used: Decimal

    days_elapsed: int
    days_remaining: int

    average_daily_spend: Decimal
    projected_month_end_spend: Decimal
    projected_budget_difference: Decimal

    categories: list[InsightCategory]


class AIInsightResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    
    status: Literal[
        "under_budget",
        "on_track",
        "over_budget",
    ]
    summary: str
    recommendations: list[str]