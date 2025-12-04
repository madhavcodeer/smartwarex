from fastapi import APIRouter
from app.api.v1.endpoints import auth, warehouse, inventory, forecasting, routes, suppliers, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(warehouse.router, prefix="/warehouses", tags=["warehouses"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(forecasting.router, prefix="/forecasting", tags=["forecasting"])
api_router.include_router(routes.router, prefix="/routes", tags=["routes"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
from app.api.v1.endpoints import vision
api_router.include_router(vision.router, prefix="/vision", tags=["vision"])
