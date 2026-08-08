from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.budgets.repository import BudgetRepository
from app.budgets.service import BudgetService
from app.db.session import get_db
from app.expenses.repository import ExpenseRepository
from app.dependencies.expenses import get_expense_repository

def get_budget_repository(
        db: Annotated[Session, Depends(get_db)],
) -> BudgetRepository:
    return BudgetRepository(db)


def get_budget_service(
        budget_repository: Annotated[
            BudgetRepository,
            Depends(get_budget_repository),
        ],
        expense_repository: Annotated[
            ExpenseRepository,
            Depends(get_expense_repository),
        ],
) -> BudgetService:
    return BudgetService(
        budget_repository=budget_repository,
        expense_repository=expense_repository,
    )