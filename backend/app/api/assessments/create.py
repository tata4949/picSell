from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status

from app.api.assessments.common import AssessmentCreateRequest, AssessmentResponse, _build_assessment_response
from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


@router.post("/assessments", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(payload: AssessmentCreateRequest, current_user: UserResponse = Depends(_get_current_user)) -> AssessmentResponse:
    doc_ref = db.collection("assessments").document()
    data = payload.dict()
    data.update({"uid": current_user.uid, "created_at": datetime.now(timezone.utc)})
    doc_ref.set(data)
    document = doc_ref.get()
    return _build_assessment_response(document)
