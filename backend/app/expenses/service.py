from uuid import UUID
from fastapi import HTTPException, status
from datetime import date
from decimal import Decimal
from dateutil.relativedelta import relativedelta

from app.expenses.models import Expense
from app.expenses.repository import ExpenseRepository
from app.expenses.schemas import (ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseSummaryResponse, CategorySpendingResponse, MonthlySpendingPoint, MonthlySpendingTrendResponse)
from app.core.redis import cache


class ExpenseService:
    def __init__(self, repository: ExpenseRepository):
        self.repository = repository


    def _invalidate_expense_summary(
            self,
            user_id: UUID,
            month: int,
            year: int,
    ) -> None:
        cache_key = f"expense_summary:{user_id}:{year}:{month}"
        cache.delete(cache_key)
    
    def create_expense(
            self,
            expense_data: ExpenseCreate,
            user_id: UUID,
    ) -> Expense:
        expense = Expense(
            **expense_data.model_dump(),
            user_id=user_id,
        )

        created_expense = self.repository.create_expense(expense)

        self._invalidate_expense_summary(
            user_id=user_id,
            month=created_expense.expense_date.month,
            year=created_expense.expense_date.year,
        )
        
        return created_expense

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
    
        old_month = expense.expense_date.month
        old_year = expense.expense_date.year
    
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
    
        updated_expense = self.repository.update_expense(expense)
    
        self._invalidate_expense_summary(
            user_id=user_id,
            month=old_month,
            year=old_year,
        )
    
        self._invalidate_expense_summary(
            user_id=user_id,
            month=updated_expense.expense_date.month,
            year=updated_expense.expense_date.year,
        )
    
        return updated_expense

    def delete_expense(
            self,
            expense_id: UUID,
            user_id: UUID,
    ) -> None:
        expense = self.repository.get_expense(
            expense_id=expense_id,
            user_id=user_id,
        )

        if expense is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense not found",
            )
    
        month = expense.expense_date.month
        year = expense.expense_date.year
    
        self.repository.delete_expense(expense)
    
        self._invalidate_expense_summary(
            user_id=user_id,
            month=month,
            year=year,
        )

    def get_expense_summary(
            self,
            user_id: UUID,
            month: int,
            year: int,
    ) -> ExpenseSummaryResponse:
        
        cache_key = f"expense_summary:{user_id}:{year}:{month}"
        
        cached_summary = cache.get(cache_key)
        
        if cached_summary:
            return ExpenseSummaryResponse.model_validate_json(cached_summary)
        
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
    
        response =  ExpenseSummaryResponse(
            total_spent=total_spent,
            categories=categories,
        )
        
        cache.setex(
            cache_key,
            60,
            response.model_dump_json()
        )
        
        return response

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