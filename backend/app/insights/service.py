from calendar import monthrange
from datetime import datetime
from decimal import Decimal
from uuid import UUID

from app.budgets.repository import BudgetRepository
from app.expenses.repository import ExpenseRepository
from app.insights.schemas import (
    FinancialSnapshotResponse,
    InsightCategory,
)
from app.ai.client import GroqAIClient
from app.insights.schemas import AIInsightResponse

class InsightService:
    def __init__(
            self,
            budget_repository: BudgetRepository,
            expense_repository: ExpenseRepository,
            ai_client: GroqAIClient,
    ):
        self.budget_repository = budget_repository
        self.expense_repository = expense_repository
        self.ai_client = ai_client

    def get_current_snapshot(
            self,
            user_id: UUID,
    ) -> FinancialSnapshotResponse:
        now = datetime.now()

        month = now.month
        year = now.year

        budget = self.budget_repository.get_current_budget(
            user_id=user_id,
            month=month,
            year=year,
        )

        budget_amount = budget.amount if budget else Decimal("0.00")

        spent = self.expense_repository.get_monthly_expense_total(
            user_id=user_id,
            month=month,
            year=year,
        )

        category_rows = self.expense_repository.get_spending_by_category(
            user_id=user_id,
            month=month,
            year=year,
        )

        remaining = budget_amount - spent

        percentage_used = (
            (spent / budget_amount * Decimal("100"))
            if budget_amount > 0
            else Decimal("0.00")
        )

        days_elapsed = now.day

        days_in_month = monthrange(
            year,
            month,
        )[1]

        days_remaining = days_in_month - days_elapsed

        average_daily_spend = (
            spent / Decimal(days_elapsed)
            if days_elapsed > 0
            else Decimal("0.00")
        )

        projected_month_end_spend = (
                average_daily_spend * Decimal(days_in_month)
        )

        projected_budget_difference = (
                budget_amount - projected_month_end_spend
        )

        categories = []

        for category, amount in category_rows:
            percentage = (
                (amount / spent * Decimal("100"))
                if spent > 0
                else Decimal("0.00")
            )

            categories.append(
                InsightCategory(
                    category=category,
                    amount=amount,
                    percentage=percentage.quantize(
                        Decimal("0.01")
                    ),
                )
            )

        return FinancialSnapshotResponse(
            budget=budget_amount,
            spent=spent,
            remaining=remaining,
            percentage_used=percentage_used.quantize(
                Decimal("0.01")
            ),
            days_elapsed=days_elapsed,
            days_remaining=days_remaining,
            average_daily_spend=average_daily_spend.quantize(
                Decimal("0.01")
            ),
            projected_month_end_spend=projected_month_end_spend.quantize(
                Decimal("0.01")
            ),
            projected_budget_difference=projected_budget_difference.quantize(
                Decimal("0.01")
            ),
            categories=categories,
        )

    def get_ai_insights(
            self,
            user_id: UUID,
    ) -> AIInsightResponse:
        snapshot = self.get_current_snapshot(
            user_id=user_id,
        )
    
        return self.ai_client.generate_financial_insights(
            snapshot=snapshot,
    )