from uuid import UUID

from app.expenses.models import Expense
from app.expenses.repository import ExpenseRepository
from app.expenses.schemas import ExpenseCreate


class ExpenseService:
    def __init__(self, repository: ExpenseRepository):
        self.repository = repository

    def create_expense(
            self,
            expense_data: ExpenseCreate,
            user_id: UUID,
    ) -> Expense:
        expense = Expense(
            **expense_data.model_dump(),
            user_id=user_id,
        )

        return self.repository.create_expense(expense)

    def get_expense(
            self,
            user_id: UUID,
    ) -> list[Expense]:

        return self.repository.get_expenses_by_user(user_id)
