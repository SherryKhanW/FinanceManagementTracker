from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from supabase_auth.types import User

from app.dependencies.insights import get_insight_service
from app.insights.schemas import FinancialSnapshotResponse, AIInsightResponse
from app.insights.service import InsightService


router = APIRouter(
    prefix="/insights",
    tags=["insights"],
)


@router.get(
    "/current",
    response_model=FinancialSnapshotResponse,
)
def get_current_insights(
        current_user: Annotated[
            User,
            Depends(get_current_user),
        ],
        service: Annotated[
            InsightService,
            Depends(get_insight_service),
        ],
) -> FinancialSnapshotResponse:
    return service.get_current_snapshot(
        user_id=UUID(current_user.id),
    )

@router.get(
    "/current/ai",
    response_model=AIInsightResponse,
)
def get_current_ai_insights(
        current_user: Annotated[
            User,
            Depends(get_current_user),
        ],
        service: Annotated[
            InsightService,
            Depends(get_insight_service),
        ],
) -> AIInsightResponse:
    return service.get_ai_insights(
        user_id=UUID(current_user.id),
    )