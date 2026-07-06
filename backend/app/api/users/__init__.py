from fastapi import APIRouter

from .get_me import router as get_me_router
from .update_me import router as update_me_router

router = APIRouter()
router.include_router(get_me_router, prefix="", tags=["users"])
router.include_router(update_me_router, prefix="", tags=["users"])
