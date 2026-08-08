from datetime import date
from uuid import UUID
from decimal import Decimal

from app.budgets.models import Budget
from app.budgets.repository import BudgetRepository
from app.expenses.repository import ExpenseRepository
from app.budgets.schemas import BudgetCreate, BudgetSummaryResponse

from fastapi import HTTPException, status

class BudgetService:
    def __init__(
            self,
            budget_repository: BudgetRepository,
            expense_repository: ExpenseRepository,
    ):
        self.budget_repository = budget_repository
        self.expense_repository = expense_repository

    def set_current_budget(
            self,
            budget_data: BudgetCreate,
            user_id: UUID,
    ) -> Budget:
        today = date.today()

        budget = self.budget_repository.get_current_budget(
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

            return self.budget_repository.create_budget(budget)

        budget.amount = budget_data.amount

        return self.budget_repository.update_budget(budget)

    def get_current_budget(
            self,
            user_id: UUID,
    ) -> BudgetSummaryResponse:
        today = date.today()

        budget = self.budget_repository.get_current_budget(
            user_id=user_id,
            month=today.month,
            year=today.year,
        )
    
        if budget is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No budget found for the current month.",
            )
    
        spent = self.expense_repository.get_monthly_expense_total(
            user_id=user_id,
            month=today.month,
            year=today.year,
        )
    
        remaining = budget.amount - spent

        percentage_used = (
                (spent / budget.amount) * Decimal("100")
        ).quantize(Decimal("0.01"))
    
        return BudgetSummaryResponse(
            amount=budget.amount,
            spent=spent,
            remaining=remaining,
            percentage_used=percentage_used,
            month=budget.month,
            year=budget.year,
        )