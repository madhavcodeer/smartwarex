import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WarehouseLayout from './pages/WarehouseLayout';
import Inventory from './pages/Inventory';
import Forecasting from './pages/Forecasting';
import RouteOptimization from './pages/Routes';
import Suppliers from './pages/Suppliers';
import Analytics from './pages/Analytics';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            borderRadius: '0.75rem',
                            border: '1px solid #334155',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/warehouse" element={<WarehouseLayout />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/forecasting" element={<Forecasting />} />
                    <Route path="/routes" element={<RouteOptimization />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
