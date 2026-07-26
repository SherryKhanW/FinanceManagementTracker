from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.expenses.models import Expense


class ExpenseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_expense(self, expense: Expense) -> Expense:
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)

        return expense

    def get_expenses_by_user(
            self,
            user_id: UUID,
    ) -> list[Expense]:

        statement = (select(Expense).where(Expense.user_id == user_id).order_by(Expense.expense_date.desc()))

        return self.db.scalars(statement).all()
