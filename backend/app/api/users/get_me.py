from fastapi import APIRouter, Depends

from app.api.auth.common import UserResponse, _get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(_get_current_user)) -> UserResponse:
    return current_user
