from typing import Any
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.expenses.router import router as expense_router
from app.budgets.router import router as budgets_router
from app.auth.dependencies import get_current_user
from app.insights.router import router as insights_router
from app.core.config import settings

app = FastAPI(
    title="Finance Management Tracker API",
    version="0.1.0",
)

app.include_router(expense_router)
app.include_router(budgets_router)
app.include_router(insights_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.get("/health")

def health_check() -> dict[str, str]:
    return {"status": "healthy"}



@app.get("/auth/me")

def get_authenticated_user(
        current_user: Any = Depends(get_current_user),
) -> dict[str, str | None]:
   return {
        "id": str(current_user.id),
        "email": current_user.email,
    }
