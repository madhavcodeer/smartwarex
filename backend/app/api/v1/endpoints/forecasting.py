from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/predict")
def create_forecast(
    warehouse_id: str,
    item_id: str,
    model_type: str = "prophet",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create demand forecast."""
    return {
        "message": "Forecast created",
        "model": model_type,
        "predictions": []
    }


@router.get("/{warehouse_id}")
def get_forecasts(
    warehouse_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get forecasts for warehouse."""
    return {
        "forecasts": [],
        "accuracy_metrics": {
            "mape": 0,
            "rmse": 0
        }
    }
