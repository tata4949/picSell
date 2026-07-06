from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


class ListingCreateRequest(BaseModel):
    assessment_id: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    price: int = Field(..., ge=0)
    photo_url: str = Field(..., min_length=1)
    platform: str = Field(default="mercari", min_length=1)
    url: str | None = None
    status: str = Field(default="draft", min_length=1)


@router.post("/listings", status_code=status.HTTP_201_CREATED)
def create_listing(payload: ListingCreateRequest, current_user: UserResponse = Depends(_get_current_user)) -> dict:
    document = db.collection("listings").document()
    now = datetime.now(timezone.utc)
    data = {
        "uid": current_user.uid,
        "assessment_id": payload.assessment_id,
        "title": payload.title,
        "description": payload.description,
        "price": payload.price,
        "photo_url": payload.photo_url,
        "platform": payload.platform,
        "url": payload.url,
        "status": payload.status,
        "created_at": now,
    }
    document.set(data)
    return {
        "id": document.id,
        "assessment_id": payload.assessment_id,
        "platform": payload.platform,
        "url": payload.url,
        "status": payload.status,
        "created_at": now,
    }
