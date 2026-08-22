from uuid import UUID
from fastapi import HTTPException, status
from datetime import date
from decimal import Decimal
from dateutil.relativedelta import relativedelta

from app.expenses.models import Expense
from app.expenses.repository import ExpenseRepository
from app.expenses.schemas import (ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseSummaryResponse, CategorySpendingResponse, MonthlySpendingPoint, MonthlySpendingTrendResponse)


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

    def get_expenses(
            self,
            user_id: UUID,
    ) -> list[Expense]:

        return self.repository.get_expenses_by_user(user_id)

    def update_expense(
            self,
            expense_id: UUID,
            user_id: UUID,
            expense_data: ExpenseUpdate,
    ) -> Expense:
        expense = self.repository.get_expense(
            expense_id,
            user_id,
        )
    
        if expense is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found.",
            )
    
        updates = expense_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )
    
        for field, value in updates.items():
            setattr(
                expense,
                field,
                value,
            )
            
        return self.repository.update_expense(expense)
    
    def delete_expense(
            self,
            expense_id = UUID,
            user_id = UUID
    ) -> None:
        expense = self.repository.get_expense(
            expense_id = expense_id, 
            user_id = user_id
        )

        if expense is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found",
            )
        
        self.repository.delete_expense(expense)

    def get_expense_summary(
            self,
            user_id: UUID,
            month: int,
            year: int,
    ) -> ExpenseSummaryResponse:

        total_spent = self.repository.get_monthly_expense_total(
            user_id=user_id,
            month=month,
            year=year,
        )
    
        spending_by_category = self.repository.get_spending_by_category(
            user_id=user_id,
            month=month,
            year=year,
        )
    
        categories = []
    
        for category, amount in spending_by_category:
            percentage = (
                    (amount / total_spent) * Decimal("100")
            ).quantize(Decimal("0.01"))
    
            categories.append(
                CategorySpendingResponse(
                    category=category,
                    amount=amount,
                    percentage=percentage,
                )
            )
    
        return ExpenseSummaryResponse(
            total_spent=total_spent,
            categories=categories,
        )

    def get_monthly_spending_trend(
            self,
            user_id: UUID,
            months: int,
    ) -> MonthlySpendingTrendResponse:
        today = date.today()

        start_month = today.replace(day=1) - relativedelta(
            months=months - 1
        )
    
        rows = self.repository.get_monthly_spending_trend(
            user_id=user_id,
            start_date=start_month,
        )
    
        totals_by_month = {
            (int(year), int(month)): total
            for year, month, total in rows
        }
    
        points = []
    
        for offset in range(months):
            current_month = start_month + relativedelta(months=offset)
    
            total = totals_by_month.get(
                (current_month.year, current_month.month),
                Decimal("0.00"),
            )
    
            points.append(
                MonthlySpendingPoint(
                    month=current_month.month,
                    year=current_month.year,
                    total_spent=total,
                )
            )

        return MonthlySpendingTrendResponse(
            months=points
        )