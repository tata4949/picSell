from fastapi import APIRouter, HTTPException, status

from .common import AuthResponse, SignUpRequest, UserResponse, _create_user, _find_user_by_email, _issue_token_pair

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest) -> AuthResponse:
    """Register a new user and return access and refresh tokens with user info."""
    if _find_user_by_email(payload.email) is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered")

    user_data = _create_user(payload.email, payload.password, payload.display_name)
    tokens = _issue_token_pair(user_data["uid"])
    user = UserResponse(
        uid=user_data["uid"],
        email=user_data["email"],
        display_name=user_data["display_name"],
        plan=user_data["plan"],
        created_at=user_data["created_at"],
    )
    return AuthResponse(access_token=tokens["access_token"], refresh_token=tokens["refresh_token"], user=user)
