from fastapi import APIRouter, Depends, HTTPException, status

from app.api.assessments.common import _get_assessment_by_id, _assert_owner
from app.api.auth.common import UserResponse, _get_current_user
from app.core.firebase import db

router = APIRouter()


@router.delete("/assessments/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assessment(assessment_id: str, current_user: UserResponse = Depends(_get_current_user)) -> None:
    document = _get_assessment_by_id(assessment_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    try:
        _assert_owner(document, current_user)
    except PermissionError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.collection("assessments").document(assessment_id).delete()
