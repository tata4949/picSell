from fastapi import APIRouter

from .create import router as create_router
from .delete import router as delete_router
from .get import router as get_router
from .list import router as list_router

router = APIRouter()
router.include_router(create_router, prefix="", tags=["assessments"])
router.include_router(list_router, prefix="", tags=["assessments"])
router.include_router(get_router, prefix="", tags=["assessments"])
router.include_router(delete_router, prefix="", tags=["assessments"])
