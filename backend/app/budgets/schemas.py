from datetime import datetime
from decimal import Decimal
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetCreate(BaseModel):
    amount: Annotated[
        Decimal,
        Field(
            gt=0,
            decimal_places=2,
        ),
    ]


class BudgetResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    user_id: UUID
    amount: Decimal
    month: int
    year: int
    created_at: datetime