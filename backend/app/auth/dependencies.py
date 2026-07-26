from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase_auth.types import User

from app.core.supabase import supabase

# Authentication workflow; Supabase verifies the JWT
bearer_scheme = HTTPBearer()

async def get_current_user(
        credentials: Annotated[
            HTTPAuthorizationCredentials,
            Depends(bearer_scheme),
        ],
) -> User:
    token = credentials.credentials

    try:
        response = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if response.user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user could not be found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return response.user