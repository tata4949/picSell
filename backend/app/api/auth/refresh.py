from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from .common import RefreshRequest, RefreshResponse, _create_token_for_user, _find_user_by_refresh_token, _save_refresh_token

router = APIRouter()


@router.post("/refresh", response_model=RefreshResponse)
def refresh(payload: RefreshRequest) -> RefreshResponse:
    """Issue a new access token and refresh token when a valid refresh token is provided."""
    document = _find_user_by_refresh_token(payload.refresh_token)
    if document is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_data = document.to_dict() or {}
    expires_at = user_data.get("refresh_token_expires_at")
    if expires_at is None or datetime.now(timezone.utc).timestamp() > expires_at:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    uid = user_data.get("uid")
    if uid is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access_token = _create_token_for_user(uid)
    refresh_token = payload.refresh_token
    _save_refresh_token(uid, refresh_token)
    return RefreshResponse(access_token=access_token, refresh_token=refresh_token)
