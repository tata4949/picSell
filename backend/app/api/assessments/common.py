from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field

from app.api.auth.common import UserResponse
from app.core.firebase import db


class AssessmentCreateRequest(BaseModel):
    product_name: str = Field(..., min_length=1)
    brand: Optional[str] = None
    condition: Optional[str] = None
    photo_url: Optional[str] = None
    estimated_price_min: Optional[int] = None
    estimated_price_max: Optional[int] = None
    suggestion: Optional[str] = None
    suggestion_reason: Optional[str] = None


class AssessmentResponse(BaseModel):
    id: str
    uid: str
    product_name: str
    brand: Optional[str] = None
    condition: Optional[str] = None
    photo_url: Optional[str] = None
    estimated_price_min: Optional[int] = None
    estimated_price_max: Optional[int] = None
    suggestion: Optional[str] = None
    suggestion_reason: Optional[str] = None
    created_at: datetime


def _build_assessment_response(document) -> AssessmentResponse:
    data = document.to_dict() or {}
    return AssessmentResponse(
        id=document.id,
        uid=data.get("uid"),
        product_name=data.get("product_name", ""),
        brand=data.get("brand"),
        condition=data.get("condition"),
        photo_url=data.get("photo_url"),
        estimated_price_min=data.get("estimated_price_min"),
        estimated_price_max=data.get("estimated_price_max"),
        suggestion=data.get("suggestion"),
        suggestion_reason=data.get("suggestion_reason"),
        created_at=data.get("created_at") or datetime.now(timezone.utc),
    )


def _get_assessment_by_id(assessment_id: str):
    document = db.collection("assessments").document(assessment_id).get()
    return document if document.exists else None


def _assert_owner(document, user: UserResponse) -> None:
    data = document.to_dict() or {}
    if data.get("uid") != user.uid:
        raise PermissionError("Not authorized")
