from fastapi import APIRouter, Depends, HTTPException, status

from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


@router.delete("/listings/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(listing_id: str, current_user: UserResponse = Depends(_get_current_user)) -> None:
    document_ref = db.collection("listings").document(listing_id)
    document = document_ref.get()
    if not document.exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    data = document.to_dict() or {}
    if data.get("uid") != current_user.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    document_ref.delete()
