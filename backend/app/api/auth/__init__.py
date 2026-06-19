"""Authentication package router.

This module exposes the auth subpackage as a single FastAPI router.
The package includes signup, login, and current-user endpoints.
"""

from fastapi import APIRouter

from .login import router as login_router
from .me import router as me_router
from .refresh import router as refresh_router
from .signup import router as signup_router

router = APIRouter()
router.include_router(signup_router, prefix="", tags=["auth"])
router.include_router(login_router, prefix="", tags=["auth"])
router.include_router(refresh_router, prefix="", tags=["auth"])
router.include_router(me_router, prefix="", tags=["auth"])
