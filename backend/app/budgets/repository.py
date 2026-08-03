from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.budgets.models import Budget


class BudgetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_budget(self, budget: Budget) -> Budget:
        self.db.add(budget)
        self.db.commit()
        self.db.refresh(budget)

        return budget

    def get_current_budget(
            self,
            user_id: UUID,
            month: int,
            year: int,
    ) -> Budget | None:
        statement = (
            select(Budget)
            .where(
                Budget.user_id == user_id,
                Budget.month == month,
                Budget.year == year,
                )
        )

        return self.db.scalar(statement)

    def update_budget(
            self,
            budget: Budget,
    ) -> Budget:
        self.db.commit()
        self.db.refresh(budget)

        return budget