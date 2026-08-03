from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from supabase_auth.types import User

from app.auth.dependencies import get_current_user
from app.budgets.schemas import BudgetCreate, BudgetResponse
from app.budgets.service import BudgetService
from app.dependencies.budgets import get_budget_service


router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"],
)


@router.put(
    "/current",
    response_model=BudgetResponse,
    status_code=status.HTTP_200_OK,
)
def set_current_budget(
        budget: BudgetCreate,
        current_user: Annotated[User, Depends(get_current_user)],
        service: Annotated[BudgetService, Depends(get_budget_service)],
) -> BudgetResponse:
    return service.set_current_budget(
        budget_data=budget,
        user_id=UUID(current_user.id),
    )