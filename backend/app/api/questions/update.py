from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


class QuestionUpdateRequest(BaseModel):
    answer: str = Field(..., min_length=1)


@router.put("/assessments/{assessment_id}/questions/{question_id}", response_model=dict)
def update_question(assessment_id: str, question_id: str, payload: QuestionUpdateRequest, current_user: UserResponse = Depends(_get_current_user)) -> dict:
    document_ref = db.collection("assessments").document(assessment_id).collection("questions").document(question_id)
    document = document_ref.get()
    if not document.exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    if document.to_dict().get("uid") != current_user.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    document_ref.update({"answer": payload.answer, "updated_at": datetime.now(timezone.utc)})
    updated_doc = document_ref.get()
    return updated_doc.to_dict()
