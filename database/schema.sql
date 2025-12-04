-- SmartWareX Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'analyst', 'user')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    total_area DECIMAL(10, 2), -- in square meters
    grid_width INTEGER NOT NULL,
    grid_height INTEGER NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Warehouse Zones
CREATE TABLE warehouse_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
    zone_name VARCHAR(100) NOT NULL,
    zone_type VARCHAR(50) CHECK (zone_type IN ('receiving', 'storage', 'picking', 'packing', 'shipping', 'returns')),
    x_start INTEGER NOT NULL,
    y_start INTEGER NOT NULL,
    x_end INTEGER NOT NULL,
    y_end INTEGER NOT NULL,
    capacity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Items/Products
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    unit_price DECIMAL(10, 2),
    weight DECIMAL(10, 3), -- in kg
    dimensions_length DECIMAL(10, 2), -- in cm
    dimensions_width DECIMAL(10, 2),
    dimensions_height DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    location_x INTEGER NOT NULL,
    location_y INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    reorder_point INTEGER,
    safety_stock INTEGER,
    max_stock INTEGER,
    last_counted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, item_id, location_x, location_y)
);

-- Inventory Transactions
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    item_id UUID REFERENCES items(id),
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('inbound', 'outbound', 'adjustment', 'transfer', 'return')),
    quantity INTEGER NOT NULL,
    location_x INTEGER,
    location_y INTEGER,
    reference_number VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Demand History
CREATE TABLE demand_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    item_id UUID REFERENCES items(id),
    date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    revenue DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, item_id, date)
);

-- Demand Forecasts
CREATE TABLE demand_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    item_id UUID REFERENCES items(id),
    forecast_date DATE NOT NULL,
    predicted_quantity INTEGER NOT NULL,
    confidence_lower INTEGER,
    confidence_upper INTEGER,
    model_type VARCHAR(50) CHECK (model_type IN ('prophet', 'arima', 'lstm', 'ensemble')),
    accuracy_score DECIMAL(5, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, item_id, forecast_date, model_type)
);

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    warehouse_id UUID REFERENCES warehouses(id),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(12, 2),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    quality_score DECIMAL(3, 2) CHECK (quality_score >= 0 AND quality_score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Supplier Performance Metrics
CREATE TABLE supplier_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id),
    evaluation_date DATE NOT NULL,
    on_time_delivery_rate DECIMAL(5, 2), -- percentage
    quality_score DECIMAL(3, 2),
    lead_time_avg INTEGER, -- in days
    defect_rate DECIMAL(5, 2), -- percentage
    reliability_score DECIMAL(3, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(supplier_id, evaluation_date)
);

-- Routes
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    route_name VARCHAR(255),
    route_type VARCHAR(50) CHECK (route_type IN ('picking', 'putaway', 'replenishment', 'cycle_count')),
    start_x INTEGER NOT NULL,
    start_y INTEGER NOT NULL,
    end_x INTEGER NOT NULL,
    end_y INTEGER NOT NULL,
    waypoints JSONB, -- Array of {x, y} coordinates
    total_distance DECIMAL(10, 2),
    estimated_time INTEGER, -- in seconds
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Item Movement Logs
CREATE TABLE item_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    item_id UUID REFERENCES items(id),
    from_x INTEGER,
    from_y INTEGER,
    to_x INTEGER,
    to_y INTEGER,
    quantity INTEGER NOT NULL,
    movement_type VARCHAR(50),
    worker_id UUID REFERENCES users(id),
    duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Layout Optimization Results
CREATE TABLE layout_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    optimization_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    algorithm VARCHAR(50) CHECK (algorithm IN ('kmeans', 'dbscan', 'genetic', 'simulated_annealing')),
    before_avg_picking_time DECIMAL(10, 2),
    after_avg_picking_time DECIMAL(10, 2),
    improvement_percentage DECIMAL(5, 2),
    recommendations JSONB,
    applied BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessments
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    assessment_date DATE NOT NULL,
    risk_type VARCHAR(100) CHECK (risk_type IN ('stockout', 'delay', 'quality', 'supplier', 'demand_spike', 'disruption')),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    probability DECIMAL(5, 2), -- percentage
    impact_score DECIMAL(3, 2),
    affected_items JSONB,
    mitigation_strategy TEXT,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Carbon Footprint Tracking
CREATE TABLE carbon_footprint (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    tracking_date DATE NOT NULL,
    energy_consumption DECIMAL(10, 2), -- kWh
    fuel_consumption DECIMAL(10, 2), -- liters
    total_emissions DECIMAL(10, 2), -- kg CO2
    emissions_per_unit DECIMAL(10, 4), -- kg CO2 per unit shipped
    reduction_target DECIMAL(10, 2),
    actual_reduction DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, tracking_date)
);

-- Sustainability Initiatives
CREATE TABLE sustainability_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    initiative_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    target_reduction DECIMAL(10, 2), -- percentage
    actual_reduction DECIMAL(10, 2),
    status VARCHAR(50) CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alerts and Notifications
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    alert_type VARCHAR(100) CHECK (alert_type IN ('stockout', 'overstock', 'delay', 'quality_issue', 'risk_detected', 'forecast_anomaly')),
    severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_item ON inventory(item_id);
CREATE INDEX idx_inventory_location ON inventory(location_x, location_y);
CREATE INDEX idx_transactions_warehouse ON inventory_transactions(warehouse_id);
CREATE INDEX idx_transactions_item ON inventory_transactions(item_id);
CREATE INDEX idx_transactions_date ON inventory_transactions(created_at);
CREATE INDEX idx_demand_history_date ON demand_history(date);
CREATE INDEX idx_demand_forecasts_date ON demand_forecasts(forecast_date);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_warehouse ON purchase_orders(warehouse_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_movements_warehouse ON item_movements(warehouse_id);
CREATE INDEX idx_movements_item ON item_movements(item_id);
CREATE INDEX idx_movements_date ON item_movements(created_at);
CREATE INDEX idx_alerts_warehouse ON alerts(warehouse_id);
CREATE INDEX idx_alerts_unread ON alerts(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_carbon_date ON carbon_footprint(tracking_date);

-- Create Views for Common Queries

-- Inventory Summary View
CREATE VIEW v_inventory_summary AS
SELECT 
    w.id as warehouse_id,
    w.name as warehouse_name,
    i.id as item_id,
    i.sku,
    i.name as item_name,
    i.category,
    SUM(inv.quantity) as total_quantity,
    SUM(inv.reserved_quantity) as total_reserved,
    SUM(inv.available_quantity) as total_available,
    AVG(inv.reorder_point) as avg_reorder_point,
    AVG(inv.safety_stock) as avg_safety_stock
FROM warehouses w
JOIN inventory inv ON w.id = inv.warehouse_id
JOIN items i ON inv.item_id = i.id
GROUP BY w.id, w.name, i.id, i.sku, i.name, i.category;

-- Supplier Performance View
CREATE VIEW v_supplier_performance_summary AS
SELECT 
    s.id as supplier_id,
    s.name as supplier_name,
    s.code as supplier_code,
    AVG(sp.on_time_delivery_rate) as avg_on_time_delivery,
    AVG(sp.quality_score) as avg_quality_score,
    AVG(sp.lead_time_avg) as avg_lead_time,
    AVG(sp.defect_rate) as avg_defect_rate,
    AVG(sp.reliability_score) as avg_reliability_score,
    COUNT(DISTINCT po.id) as total_orders,
    SUM(po.total_amount) as total_value
FROM suppliers s
LEFT JOIN supplier_performance sp ON s.id = sp.supplier_id
LEFT JOIN purchase_orders po ON s.id = po.supplier_id
GROUP BY s.id, s.name, s.code;

-- Active Alerts View
CREATE VIEW v_active_alerts AS
SELECT 
    a.id,
    a.warehouse_id,
    w.name as warehouse_name,
    a.alert_type,
    a.severity,
    a.title,
    a.message,
    a.created_at,
    u.username as assigned_to_user
FROM alerts a
JOIN warehouses w ON a.warehouse_id = w.id
LEFT JOIN users u ON a.assigned_to = u.id
WHERE a.is_resolved = FALSE
ORDER BY 
    CASE a.severity
        WHEN 'critical' THEN 1
        WHEN 'error' THEN 2
        WHEN 'warning' THEN 3
        WHEN 'info' THEN 4
    END,
    a.created_at DESC;

-- Functions and Triggers

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate inventory turnover
CREATE OR REPLACE FUNCTION calculate_inventory_turnover(
    p_warehouse_id UUID,
    p_item_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS DECIMAL AS $$
DECLARE
    v_total_outbound INTEGER;
    v_avg_inventory DECIMAL;
    v_turnover DECIMAL;
BEGIN
    -- Calculate total outbound quantity
    SELECT COALESCE(SUM(ABS(quantity)), 0)
    INTO v_total_outbound
    FROM inventory_transactions
    WHERE warehouse_id = p_warehouse_id
        AND item_id = p_item_id
        AND transaction_type = 'outbound'
        AND created_at >= CURRENT_DATE - p_days;
    
    -- Calculate average inventory
    SELECT COALESCE(AVG(quantity), 0)
    INTO v_avg_inventory
    FROM inventory
    WHERE warehouse_id = p_warehouse_id
        AND item_id = p_item_id;
    
    -- Calculate turnover
    IF v_avg_inventory > 0 THEN
        v_turnover := v_total_outbound / v_avg_inventory;
    ELSE
        v_turnover := 0;
    END IF;
    
    RETURN v_turnover;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO smartwarex_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO smartwarex_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO smartwarex_user;
