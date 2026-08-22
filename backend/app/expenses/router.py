from typing import Annotated
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, Response, status, Query
from supabase_auth.types import User
from sqlalchemy.orm import Session


from app.auth.dependencies import get_current_user
from app.dependencies.expenses import get_expense_service
from app.expenses import repository
from app.expenses.models import Expense
from app.expenses.schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate, ExpenseSummaryResponse, MonthlySpendingTrendResponse
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

@router.delete(
    "/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_expense(
        expense_id: UUID,
        current_user: Annotated[User, Depends(get_current_user)],
        service: Annotated[ExpenseService, Depends(get_expense_service)],
):
    service.delete_expense(
        expense_id=expense_id,
        user_id=UUID(current_user.id),
    )


@router.get(
    "/summary",
    response_model=ExpenseSummaryResponse,
)
def get_expense_summary(
        current_user: Annotated[
            User,
            Depends(get_current_user),
        ],
        service: Annotated[
            ExpenseService,
            Depends(get_expense_service),
        ],
        month: int | None = None,
        year: int | None = None,
) -> ExpenseSummaryResponse:
    now = datetime.now()
    
    selected_month = month or now.month
    selected_year = year or now.year
    
    return service.get_expense_summary(
        user_id=UUID(current_user.id),
        month = selected_month,
        year = selected_year,
    )

@router.get(
    "/monthly-trend",
    response_model=MonthlySpendingTrendResponse,
)
def get_monthly_spending_trend(
        current_user: Annotated[
            User,
            Depends(get_current_user),
        ],
        service: Annotated[
            ExpenseService,
            Depends(get_expense_service),
        ],
        months: Annotated[
            int,
            Query(ge=1, le=24),
        ] = 6,
) -> MonthlySpendingTrendResponse:
    return service.get_monthly_spending_trend(
        user_id=UUID(current_user.id),
        months=months,
    )