from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from typing import List, Optional
from datetime import datetime

router = APIRouter()


@router.get("/dashboard")
def get_dashboard_analytics(
    warehouse_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard analytics."""
    return {
        "warehouse_id": warehouse_id,
        "metrics": {
            "total_inventory": 0,
            "picking_efficiency": 0,
            "forecast_accuracy": 0,
            "carbon_footprint": 0
        },
        "alerts": [],
        "recent_activity": []
    }


@router.get("/scanned-products")
def get_scanned_products(
    classification: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get scanned products with hard/soft classification.
    Filter by classification: 'hard', 'soft', or None for all.
    """
    # Mock data - In production, this would query the database
    mock_items = [
        {
            "id": "1",
            "name": "Laptop Computer",
            "classification": "Hard",
            "hardness_score": 0.85,
            "confidence": 0.92,
            "fragility_class": "High",
            "recommended_zone": "Zone A (Hardlines/Secure - Fragile)",
            "scanned_at": "2025-12-04T10:30:00",
            "quantity": 5
        },
        {
            "id": "2",
            "name": "Cotton T-Shirt",
            "classification": "Soft",
            "hardness_score": 0.15,
            "confidence": 0.88,
            "fragility_class": "Low",
            "recommended_zone": "Zone B (Apparel/Softlines - Standard)",
            "scanned_at": "2025-12-04T10:25:00",
            "quantity": 50
        },
        {
            "id": "3",
            "name": "Glass Bottle",
            "classification": "Hard",
            "hardness_score": 0.92,
            "confidence": 0.95,
            "fragility_class": "High",
            "recommended_zone": "Zone A (Hardlines/Secure - Fragile)",
            "scanned_at": "2025-12-04T10:20:00",
            "quantity": 20
        },
        {
            "id": "4",
            "name": "Pillow",
            "classification": "Soft",
            "hardness_score": 0.12,
            "confidence": 0.91,
            "fragility_class": "Low",
            "recommended_zone": "Zone B (Apparel/Softlines - Standard)",
            "scanned_at": "2025-12-04T10:15:00",
            "quantity": 30
        },
        {
            "id": "5",
            "name": "Ceramic Plate",
            "classification": "Hard",
            "hardness_score": 0.88,
            "confidence": 0.89,
            "fragility_class": "High",
            "recommended_zone": "Zone A (Hardlines/Secure - Fragile)",
            "scanned_at": "2025-12-04T10:10:00",
            "quantity": 15
        },
        {
            "id": "6",
            "name": "Wool Blanket",
            "classification": "Soft",
            "hardness_score": 0.18,
            "confidence": 0.87,
            "fragility_class": "Low",
            "recommended_zone": "Zone B (Apparel/Softlines - Standard)",
            "scanned_at": "2025-12-04T10:05:00",
            "quantity": 25
        },
        {
            "id": "7",
            "name": "Smartphone",
            "classification": "Hard",
            "hardness_score": 0.82,
            "confidence": 0.94,
            "fragility_class": "High",
            "recommended_zone": "Zone A (Hardlines/Secure - Fragile)",
            "scanned_at": "2025-12-04T10:00:00",
            "quantity": 10
        },
        {
            "id": "8",
            "name": "Denim Jeans",
            "classification": "Soft",
            "hardness_score": 0.22,
            "confidence": 0.86,
            "fragility_class": "Low",
            "recommended_zone": "Zone B (Apparel/Softlines - Standard)",
            "scanned_at": "2025-12-04T09:55:00",
            "quantity": 40
        }
    ]
    
    # Filter by classification if provided
    if classification:
        classification_filter = classification.capitalize()
        filtered_items = [item for item in mock_items if item["classification"] == classification_filter]
    else:
        filtered_items = mock_items
    
    # Calculate statistics
    total_items = len(mock_items)
    hard_items = [item for item in mock_items if item["classification"] == "Hard"]
    soft_items = [item for item in mock_items if item["classification"] == "Soft"]
    
    total_quantity = sum(item["quantity"] for item in mock_items)
    hard_quantity = sum(item["quantity"] for item in hard_items)
    soft_quantity = sum(item["quantity"] for item in soft_items)
    
    avg_confidence = sum(item["confidence"] for item in mock_items) / total_items if total_items > 0 else 0
    high_fragility_count = len([item for item in mock_items if item["fragility_class"] == "High"])
    
    return {
        "items": filtered_items,
        "statistics": {
            "total_items": total_items,
            "hard_items": len(hard_items),
            "soft_items": len(soft_items),
            "total_quantity": total_quantity,
            "hard_quantity": hard_quantity,
            "soft_quantity": soft_quantity,
            "avg_confidence": round(avg_confidence, 3),
            "high_fragility_count": high_fragility_count,
            "hard_percentage": round((len(hard_items) / total_items * 100), 1) if total_items > 0 else 0,
            "soft_percentage": round((len(soft_items) / total_items * 100), 1) if total_items > 0 else 0
        }
    }


@router.get("/carbon-footprint")
def get_carbon_footprint(
    warehouse_id: str,
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get carbon footprint data."""
    return {
        "total_emissions": 0,
        "emissions_trend": [],
        "reduction_suggestions": []
    }


@router.get("/risk-assessment")
def get_risk_assessment(
    warehouse_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get risk assessment."""
    return {
        "risks": [],
        "risk_score": 0,
        "mitigation_strategies": []
    }

