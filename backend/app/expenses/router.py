from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from supabase_auth.types import User

from app.auth.dependencies import get_current_user
from app.dependencies.expenses import get_expense_service
from app.expenses.models import Expense
from app.expenses.schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate
from app.expenses.service import ExpenseService


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


@router.post(
    "",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
        expense: ExpenseCreate,
        current_user: Annotated[User, Depends(get_current_user)],
        service: Annotated[ExpenseService, Depends(get_expense_service)],
) -> Expense:
    return service.create_expense(
        expense_data=expense,
        user_id=UUID(current_user.id),
    )

@router.get(
    "",
    response_model=list[ExpenseResponse],
)

def get_expenses(
        current_user: Annotated[User, Depends(get_current_user)],
        service: Annotated[
            ExpenseService,
            Depends(get_expense_service),
        ],
):
    return service.get_expenses(
        user_id=UUID(current_user.id),
    )


@router.patch(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def update_expense(
        expense_id: UUID,
        expense: ExpenseUpdate,
        current_user: Annotated[
            User,
            Depends(get_current_user),
        ],
        service: Annotated[
            ExpenseService,
            Depends(get_expense_service),
        ],
):
    return service.update_expense(
        expense_id=expense_id,
        user_id=UUID(current_user.id),
        expense_data=expense,
    )