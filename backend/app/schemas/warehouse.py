from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class WarehouseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    total_area: Optional[Decimal] = None
    grid_width: int = Field(..., gt=0)
    grid_height: int = Field(..., gt=0)


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    total_area: Optional[Decimal] = None
    grid_width: Optional[int] = None
    grid_height: Optional[int] = None


class Warehouse(WarehouseBase):
    id: UUID
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WarehouseZoneBase(BaseModel):
    zone_name: str
    zone_type: str
    x_start: int
    y_start: int
    x_end: int
    y_end: int
    capacity: Optional[int] = None


class WarehouseZoneCreate(WarehouseZoneBase):
    warehouse_id: UUID


class WarehouseZone(WarehouseZoneBase):
    id: UUID
    warehouse_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
