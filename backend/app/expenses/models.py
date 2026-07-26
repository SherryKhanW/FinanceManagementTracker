from datetime import date, datetime, UTC
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, Enum as SqlEnum, Numeric, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import TimestampMixin

from app.db.session import Base

class ExpenseCategory(str, Enum):
    FOOD = "Food"
    TRANSPORT = "Transport"
    SHOPPING = "Shopping"
    ENTERTAINMENT = "Entertainment"
    HEALTH = "Health"
    BILLS = "Bills"
    OTHER = "Other"

class Expense(TimestampMixin, Base):
    __tablename__ = "expenses"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    category: Mapped[ExpenseCategory] = mapped_column(
        SqlEnum(ExpenseCategory),
        nullable=False,
    )

    expense_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )
