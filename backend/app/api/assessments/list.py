from fastapi import APIRouter, Depends

from app.api.assessments.common import AssessmentResponse, _build_assessment_response
from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


@router.get("/assessments", response_model=list[AssessmentResponse])
def list_assessments(current_user: UserResponse = Depends(_get_current_user)) -> list[AssessmentResponse]:
    query = db.collection("assessments").where("uid", "==", current_user.uid).stream()
    return [_build_assessment_response(doc) for doc in query]
