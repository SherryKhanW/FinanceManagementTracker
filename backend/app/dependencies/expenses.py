from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.expenses.repository import ExpenseRepository
from app.expenses.service import ExpenseService


def get_expense_repository(
        db: Annotated[Session, Depends(get_db)],
) -> ExpenseRepository:
    return ExpenseRepository(db)


def get_expense_service(
        repository: Annotated[
            ExpenseRepository,
            Depends(get_expense_repository),
        ],
) -> ExpenseService:
    return ExpenseService(repository)