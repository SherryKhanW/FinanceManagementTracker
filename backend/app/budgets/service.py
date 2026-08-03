from datetime import date
from uuid import UUID

from app.budgets.models import Budget
from app.budgets.repository import BudgetRepository
from app.budgets.schemas import BudgetCreate


class BudgetService:
    def __init__(self, repository: BudgetRepository):
        self.repository = repository

    def set_current_budget(
            self,
            budget_data: BudgetCreate,
            user_id: UUID,
    ) -> Budget:
        today = date.today()

        budget = self.repository.get_current_budget(
            user_id=user_id,
            month=today.month,
            year=today.year,
        )

        if budget is None:
            budget = Budget(
                user_id=user_id,
                amount=budget_data.amount,
                month=today.month,
                year=today.year,
            )

            return self.repository.create_budget(budget)

        budget.amount = budget_data.amount

        return self.repository.update_budget(budget)