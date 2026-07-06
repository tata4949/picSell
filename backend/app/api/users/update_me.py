from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.auth.common import UserResponse, _find_user_by_uid, _get_current_user
from app.core.firebase import db

router = APIRouter()


class UpdateMeRequest(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1)
    plan: Optional[str] = Field(None, min_length=1)


@router.put("/me", response_model=UserResponse)
def update_me(payload: UpdateMeRequest, current_user: UserResponse = Depends(_get_current_user)) -> UserResponse:
    update_data = {}
    if payload.display_name is not None:
        update_data["display_name"] = payload.display_name
    if payload.plan is not None:
        update_data["plan"] = payload.plan

    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update fields provided")

    db.collection("users").document(current_user.uid).update(update_data)
    document = _find_user_by_uid(current_user.uid)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(
        uid=document.to_dict().get("uid"),
        email=document.to_dict().get("email"),
        display_name=document.to_dict().get("display_name", ""),
        plan=document.to_dict().get("plan", "free"),
        created_at=document.to_dict().get("created_at"),
    )
