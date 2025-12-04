from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.warehouse import Warehouse, WarehouseZone
from app.models.user import User
from app.schemas.warehouse import (
    WarehouseCreate,
    WarehouseUpdate,
    Warehouse as WarehouseSchema,
    WarehouseZoneCreate,
    WarehouseZone as WarehouseZoneSchema
)

router = APIRouter()


@router.post("/", response_model=WarehouseSchema, status_code=status.HTTP_201_CREATED)
def create_warehouse(
    warehouse_in: WarehouseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new warehouse."""
    # Check if warehouse code already exists
    existing = db.query(Warehouse).filter(Warehouse.code == warehouse_in.code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Warehouse code already exists"
        )
    
    warehouse = Warehouse(
        **warehouse_in.dict(),
        created_by=current_user.id
    )
    
    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)
    
    return warehouse


@router.get("/", response_model=List[WarehouseSchema])
def list_warehouses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all warehouses."""
    warehouses = db.query(Warehouse).offset(skip).limit(limit).all()
    return warehouses


@router.get("/{warehouse_id}", response_model=WarehouseSchema)
def get_warehouse(
    warehouse_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get warehouse by ID."""
    warehouse = db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found"
        )
    return warehouse


@router.put("/{warehouse_id}", response_model=WarehouseSchema)
def update_warehouse(
    warehouse_id: UUID,
    warehouse_in: WarehouseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update warehouse."""
    warehouse = db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found"
        )
    
    update_data = warehouse_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(warehouse, field, value)
    
    db.commit()
    db.refresh(warehouse)
    
    return warehouse


@router.delete("/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_warehouse(
    warehouse_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete warehouse."""
    warehouse = db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found"
        )
    
    db.delete(warehouse)
    db.commit()
    
    return None


@router.post("/{warehouse_id}/zones", response_model=WarehouseZoneSchema, status_code=status.HTTP_201_CREATED)
def create_warehouse_zone(
    warehouse_id: UUID,
    zone_in: WarehouseZoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a warehouse zone."""
    warehouse = db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found"
        )
    
    zone = WarehouseZone(**zone_in.dict())
    db.add(zone)
    db.commit()
    db.refresh(zone)
    
    return zone


@router.get("/{warehouse_id}/zones", response_model=List[WarehouseZoneSchema])
def list_warehouse_zones(
    warehouse_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all zones for a warehouse."""
    zones = db.query(WarehouseZone).filter(WarehouseZone.warehouse_id == warehouse_id).all()
    return zones
