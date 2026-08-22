from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.budgets.repository import BudgetRepository
from app.db.session import get_db
from app.expenses.repository import ExpenseRepository
from app.insights.service import InsightService
from app.ai.client import GroqAIClient

def get_insight_service(
        db: Annotated[
            Session,
            Depends(get_db),
        ],
) -> InsightService:
    budget_repository = BudgetRepository(db)
    expense_repository = ExpenseRepository(db)
    ai_client = GroqAIClient()

    return InsightService(
        budget_repository=budget_repository,
        expense_repository=expense_repository,
        ai_client=ai_client,
    )