from fastapi import APIRouter, Depends, HTTPException, status

from app.api.assessments.common import _build_assessment_response, _get_assessment_by_id, _assert_owner
from app.api.auth.common import UserResponse, _get_current_user

router = APIRouter()


@router.get("/assessments/{assessment_id}", response_model=_build_assessment_response.__annotations__["return"])
def get_assessment(assessment_id: str, current_user: UserResponse = Depends(_get_current_user)):
    document = _get_assessment_by_id(assessment_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    try:
        _assert_owner(document, current_user)
    except PermissionError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return _build_assessment_response(document)
