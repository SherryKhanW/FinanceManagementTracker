from datetime import date, datetime
from decimal import Decimal
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from app.expenses.models import ExpenseCategory


class ExpenseCreate(BaseModel):
    description: Annotated[
        str,
        StringConstraints(strip_whitespace=True, min_length=1, max_length=255),
    ]

    amount: Annotated[
        Decimal,
        Field(gt=0, decimal_places=2),
    ]

    category: ExpenseCategory

    expense_date: date


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    user_id: UUID
    description: str
    amount: Decimal
    category: ExpenseCategory
    expense_date: date
    created_at: datetime

class ExpenseUpdate(BaseModel):
    description: Annotated[
        str,
        StringConstraints(strip_whitespace=True, min_length=1, max_length=255),
    ] | None = None

    amount: Decimal | None = Field(
        default=None,
        gt=0,
        decimal_places=2,
    )
    category: ExpenseCategory | None = None
    expense_date: date | None = None

class CategorySpendingResponse(BaseModel):
    category: ExpenseCategory
    amount: Decimal
    percentage: Decimal


class ExpenseSummaryResponse(BaseModel):
    total_spent: Decimal
    categories: list[CategorySpendingResponse]


class MonthlySpendingPoint(BaseModel):
    month: int
    year: int
    total_spent: Decimal


class MonthlySpendingTrendResponse(BaseModel):
    months: list[MonthlySpendingPoint]
