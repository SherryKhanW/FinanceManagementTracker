from uuid import UUID
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy import extract, func, select

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

        statement = (
            select(Expense)
            .where(Expense.user_id == user_id)
            .order_by(Expense.expense_date.desc())
        )

        return self.db.scalars(statement).all()

    def get_expense(
            self,
            expense_id: UUID,
            user_id: UUID,
    ) -> Expense | None:
        statement = (
            select(Expense)
            .where(
                Expense.id == expense_id,
                Expense.user_id == user_id,
                )
        )
        return self.db.scalar(statement)

    def update_expense(
            self,
            expense: Expense,
    ) -> Expense:
        self.db.commit()
        self.db.refresh(expense)
    
        return expense
    
    def delete_expense(
            self,
            expense: Expense,
    ) -> None:
        self.db.delete(expense)
        self.db.commit()

    def get_monthly_expense_total(
            self,
            user_id: UUID,
            month: int,
            year: int,
    ) -> Decimal:
        statement = (
            select(func.sum(Expense.amount))
            .where(
                Expense.user_id == user_id,
                extract("month", Expense.expense_date) == month,
                extract("year", Expense.expense_date) == year,
                )
        )

        total = self.db.scalar(statement)
    
        return total or Decimal("0.00")

    def get_spending_by_category(
            self,
            user_id: UUID,
            month: int,
            year: int,
    ):
        statement = (
            select(
                Expense.category,
                func.sum(Expense.amount),
            )
            .where(
                Expense.user_id == user_id,
                extract("month", Expense.expense_date) == month,
                extract("year", Expense.expense_date) == year,
                )
            .group_by(Expense.category)
        )
    
        return self.db.execute(statement).all()

    def get_monthly_spending_trend(
            self,
            user_id: UUID,
            start_date,
    ):
        statement = (
            select(
                extract("year", Expense.expense_date).label("year"),
                extract("month", Expense.expense_date).label("month"),
                func.sum(Expense.amount).label("total_spent"),
            )
            .where(
                Expense.user_id == user_id,
                Expense.expense_date >= start_date,
                )
            .group_by(
                extract("year", Expense.expense_date),
                extract("month", Expense.expense_date),
            )
            .order_by(
                extract("year", Expense.expense_date),
                extract("month", Expense.expense_date),
            )
        )

        return self.db.execute(statement).all()