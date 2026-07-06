from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


class QuestionCreateRequest(BaseModel):
    question: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)


@router.post("/assessments/{assessment_id}/questions", status_code=status.HTTP_201_CREATED)
def create_question(assessment_id: str, payload: QuestionCreateRequest, current_user: UserResponse = Depends(_get_current_user)) -> dict:
    assessment_ref = db.collection("assessments").document(assessment_id)
    if not assessment_ref.get().exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    document_ref = assessment_ref.collection("questions").document()
    now = datetime.now(timezone.utc)
    data = payload.dict()
    data.update({
        "uid": current_user.uid,
        "id": document_ref.id,
        "created_at": now,
        "updated_at": now,
    })
    document_ref.set(data)
    return {"id": document_ref.id, **data}
