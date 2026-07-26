from datetime import date, datetime
from decimal import Decimal
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.expenses.models import ExpenseCategory


class ExpenseCreate(BaseModel):
    description: Annotated[
        str,
        Field(min_length=1, max_length=255),
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