from fastapi import APIRouter, Depends

from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


@router.get("/listings")
def list_listings(current_user: UserResponse = Depends(_get_current_user)) -> list[dict]:
    query = db.collection("listings").where("uid", "==", current_user.uid).stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in query]
