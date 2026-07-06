from fastapi import APIRouter, HTTPException, status

from .common import AuthResponse, LoginRequest, UserResponse, _find_user_by_email, _issue_token_pair, _verify_password, _user_response_from_doc

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest) -> AuthResponse:
    """Authenticate the user and return access and refresh tokens with user info."""
    document = _find_user_by_email(payload.email)
    if document is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user_data = document.to_dict() or {}
    password_hash = user_data.get("password_hash")
    if password_hash is None or not _verify_password(payload.password, password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    tokens = _issue_token_pair(user_data["uid"])
    user = _user_response_from_doc(document)
    return AuthResponse(access_token=tokens["access_token"], refresh_token=tokens["refresh_token"], user=user)
