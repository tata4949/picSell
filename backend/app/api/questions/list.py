from fastapi import APIRouter, Depends, HTTPException, status

from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


@router.get("/assessments/{assessment_id}/questions")
def list_questions(assessment_id: str, current_user: UserResponse = Depends(_get_current_user)) -> list[dict]:
    assessment_ref = db.collection("assessments").document(assessment_id)
    if not assessment_ref.get().exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    query = assessment_ref.collection("questions").where("uid", "==", current_user.uid).stream()
    return [doc.to_dict() for doc in query]
