from fastapi import APIRouter, Depends

from .common import UserResponse, _get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def me(current_user: UserResponse = Depends(_get_current_user)) -> UserResponse:
    """Return the currently authenticated user's profile."""
    return current_user
