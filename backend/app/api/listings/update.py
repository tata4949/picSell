from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


class ListingUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    description: str | None = Field(default=None, min_length=1)
    price: int | None = Field(default=None, ge=0)
    photo_url: str | None = Field(default=None, min_length=1)
    platform: str | None = Field(default=None, min_length=1)
    url: str | None = None
    status: str | None = Field(default=None, min_length=1)


@router.put("/listings/{listing_id}")
def update_listing(listing_id: str, payload: ListingUpdateRequest, current_user: UserResponse = Depends(_get_current_user)) -> dict:
    document_ref = db.collection("listings").document(listing_id)
    document = document_ref.get()
    if not document.exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    data = document.to_dict() or {}
    if data.get("uid") != current_user.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update fields provided")

    document_ref.update(update_data)
    updated_doc = document_ref.get()
    return {"id": updated_doc.id, **updated_doc.to_dict()}
