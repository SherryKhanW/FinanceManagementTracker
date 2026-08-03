from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.budgets.repository import BudgetRepository
from app.budgets.service import BudgetService
from app.db.session import get_db


def get_budget_repository(
        db: Annotated[Session, Depends(get_db)],
) -> BudgetRepository:
    return BudgetRepository(db)


def get_budget_service(
        repository: Annotated[
            BudgetRepository,
            Depends(get_budget_repository),
        ],
) -> BudgetService:
    return BudgetService(repository)