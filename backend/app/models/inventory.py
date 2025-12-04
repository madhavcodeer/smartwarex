from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100), index=True)
    subcategory = Column(String(100))
    unit_price = Column(Numeric(10, 2))
    weight = Column(Numeric(10, 3))
    dimensions_length = Column(Numeric(10, 2))
    dimensions_width = Column(Numeric(10, 2))
    dimensions_height = Column(Numeric(10, 2))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Item {self.sku}: {self.name}>"


class Inventory(Base):
    __tablename__ = "inventory"
    __table_args__ = (
        UniqueConstraint('warehouse_id', 'item_id', 'location_x', 'location_y', name='uq_inventory_location'),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="CASCADE"), index=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), index=True)
    location_x = Column(Integer, nullable=False)
    location_y = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    reserved_quantity = Column(Integer, default=0)
    reorder_point = Column(Integer)
    safety_stock = Column(Integer)
    max_stock = Column(Integer)
    last_counted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Inventory warehouse={self.warehouse_id} item={self.item_id} qty={self.quantity}>"


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"), index=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id"), index=True)
    transaction_type = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    location_x = Column(Integer)
    location_y = Column(Integer)
    reference_number = Column(String(100))
    notes = Column(Text)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    def __repr__(self):
        return f"<InventoryTransaction {self.transaction_type} qty={self.quantity}>"
