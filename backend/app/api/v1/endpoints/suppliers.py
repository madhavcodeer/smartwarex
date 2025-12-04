from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/")
def list_suppliers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List suppliers."""
    return {"suppliers": []}


@router.get("/{supplier_id}/performance")
def get_supplier_performance(
    supplier_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get supplier performance metrics."""
    return {
        "supplier_id": supplier_id,
        "metrics": {
            "on_time_delivery": 0,
            "quality_score": 0,
            "reliability_score": 0
        }
    }
