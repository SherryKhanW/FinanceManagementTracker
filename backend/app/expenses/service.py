from uuid import UUID
from fastapi import HTTPException, status

from app.expenses.models import Expense
from app.expenses.repository import ExpenseRepository
from app.expenses.schemas import (ExpenseCreate, ExpenseUpdate, ExpenseResponse)


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