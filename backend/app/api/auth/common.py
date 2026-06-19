"""Shared authentication utilities and models.

This module contains the Pydantic models used by auth endpoints
and helper functions for password hashing, token generation,
and current-user lookup.
"""

import base64
import hashlib
import hmac
import json
import os
import secrets
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import Depends, Header, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from firebase_admin import firestore

from app.core.firebase import db

ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET", os.getenv("SECRET_KEY", "change-me"))
ACCESS_TOKEN_EXPIRES_IN = int(os.getenv("ACCESS_TOKEN_EXPIRES_IN", "3600"))  # default 1 hour
REFRESH_TOKEN_EXPIRES_IN = int(os.getenv("REFRESH_TOKEN_EXPIRES_IN", str(60 * 60 * 24 * 30)))  # default 30 days


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    display_name: str = Field(min_length=1)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    display_name: str
    plan: str
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str
    refresh_token: str


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _base64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def _hash_password(password: str, salt: Optional[bytes] = None) -> str:
    salt = salt or secrets.token_bytes(16)
    password_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{salt.hex()}${password_hash.hex()}"


def _verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_hex, password_hash_hex = stored_hash.split("$")
    except ValueError:
        return False
    salt = bytes.fromhex(salt_hex)
    computed_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000).hex()
    return hmac.compare_digest(computed_hash, password_hash_hex)


def _build_access_token(payload: Dict[str, Any]) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _base64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(
        ACCESS_TOKEN_SECRET.encode("utf-8"),
        f"{header_b64}.{payload_b64}".encode("utf-8"),
        hashlib.sha256,
    ).digest()
    signature_b64 = _base64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def _decode_access_token(token: str) -> Dict[str, Any]:
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError:
        raise ValueError("Invalid token format")

    expected_signature = hmac.new(
        ACCESS_TOKEN_SECRET.encode("utf-8"),
        f"{header_b64}.{payload_b64}".encode("utf-8"),
        hashlib.sha256,
    ).digest()
    actual_signature = _base64url_decode(signature_b64)
    if not hmac.compare_digest(expected_signature, actual_signature):
        raise ValueError("Invalid token signature")

    payload_json = _base64url_decode(payload_b64)
    payload = json.loads(payload_json)
    if not isinstance(payload, dict):
        raise ValueError("Invalid token payload")

    exp = payload.get("exp")
    if exp is None or not isinstance(exp, int):
        raise ValueError("Invalid token expiry")
    if datetime.now(timezone.utc).timestamp() > exp:
        raise ValueError("Token has expired")

    return payload


def _user_response_from_doc(document) -> UserResponse:
    data = document.to_dict() or {}
    return UserResponse(
        uid=data["uid"],
        email=data["email"],
        display_name=data.get("display_name", ""),
        plan=data.get("plan", "free"),
        created_at=data.get("created_at") or datetime.now(timezone.utc),
    )


def _find_user_by_email(email: str):
    query = db.collection("users").where("email", "==", email).limit(1).stream()
    return next(iter(query), None)


def _find_user_by_uid(uid: str):
    document = db.collection("users").document(uid).get()
    return document if document.exists else None


def _hash_refresh_token(refresh_token: str) -> str:
    return hmac.new(
        ACCESS_TOKEN_SECRET.encode("utf-8"),
        refresh_token.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def _save_refresh_token(uid: str, refresh_token: str) -> None:
    refresh_token_hash = _hash_refresh_token(refresh_token)
    refresh_expires_at = datetime.now(timezone.utc).timestamp() + REFRESH_TOKEN_EXPIRES_IN
    db.collection("users").document(uid).update({
        "refresh_token_hash": refresh_token_hash,
        "refresh_token_expires_at": refresh_expires_at,
    })


def _find_user_by_refresh_token(refresh_token: str):
    refresh_hash = _hash_refresh_token(refresh_token)
    query = db.collection("users").where("refresh_token_hash", "==", refresh_hash).limit(1).stream()
    return next(iter(query), None)


def _clear_refresh_token(uid: str) -> None:
    db.collection("users").document(uid).update({
        "refresh_token_hash": firestore.DELETE_FIELD,
        "refresh_token_expires_at": firestore.DELETE_FIELD,
    })


def _create_user(email: str, password: str, display_name: str) -> Dict[str, Any]:
    uid = str(uuid.uuid4())
    password_hash = _hash_password(password)
    created_at = datetime.now(timezone.utc)
    user_data = {
        "uid": uid,
        "email": email,
        "display_name": display_name,
        "plan": "free",
        "password_hash": password_hash,
        "created_at": created_at,
    }
    db.collection("users").document(uid).set(user_data)
    return user_data


def _create_token_for_user(uid: str) -> str:
    payload = {
        "uid": uid,
        "exp": int(datetime.now(timezone.utc).timestamp()) + ACCESS_TOKEN_EXPIRES_IN,
    }
    return _build_access_token(payload)


def _create_refresh_token() -> str:
    return secrets.token_urlsafe(32)


def _issue_token_pair(uid: str) -> Dict[str, str]:
    access_token = _create_token_for_user(uid)
    refresh_token = _create_refresh_token()
    _save_refresh_token(uid, refresh_token)
    return {"access_token": access_token, "refresh_token": refresh_token}


def _get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split("Bearer ", 1)[1].strip()
    try:
        payload = _decode_access_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    uid = payload.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain a valid user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )

    document = _find_user_by_uid(uid)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return _user_response_from_doc(document)
