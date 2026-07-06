from fastapi import APIRouter, Depends, HTTPException, status

from .common import (
    AuthResponse,
    LoginRequest,
    RefreshRequest,
    UserResponse,
    SignUpRequest,
    _create_user,
    _find_user_by_email,
    _find_user_by_refresh_token,
    _get_current_user,
    _issue_token_pair,
    _user_response_from_doc,
    _verify_password,
)

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest) -> AuthResponse:
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


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest) -> AuthResponse:
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


@router.post("/refresh", response_model=AuthResponse)
def refresh(payload: RefreshRequest) -> AuthResponse:
    document = _find_user_by_refresh_token(payload.refresh_token)
    if document is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_data = document.to_dict() or {}
    uid = user_data.get("uid")
    if uid is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    tokens = _issue_token_pair(uid)
    user = _user_response_from_doc(document)
    return AuthResponse(access_token=tokens["access_token"], refresh_token=tokens["refresh_token"], user=user)


@router.get("/me", response_model=UserResponse)
def me(current_user: UserResponse = Depends(_get_current_user)) -> UserResponse:
    return current_user
