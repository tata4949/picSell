from fastapi import APIRouter

from .auth import router as auth_router
from .assessments import router as assessments_router
from .questions import router as questions_router
from .listings import router as listings_router
from .users import router as users_router

router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(assessments_router, prefix="", tags=["assessments"])
router.include_router(questions_router, prefix="", tags=["questions"])
router.include_router(listings_router, prefix="", tags=["listings"])
