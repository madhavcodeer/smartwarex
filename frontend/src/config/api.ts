/**
 * API Configuration
 * Centralized API URL management for development and production
 */

// Get API URL from environment variable or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
    // Auth
    login: `${API_BASE_URL}/api/v1/auth/login`,
    register: `${API_BASE_URL}/api/v1/auth/register`,

    // Vision/Scanner
    visionScan: `${API_BASE_URL}/api/v1/vision/scan`,

    // Inventory
    inventory: `${API_BASE_URL}/api/v1/inventory`,

    // Warehouses
    warehouses: `${API_BASE_URL}/api/v1/warehouses`,

    // Routes
    routes: `${API_BASE_URL}/api/v1/routes`,

    // Forecasting
    forecasting: `${API_BASE_URL}/api/v1/forecasting`,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};

// Log current API configuration (only in development)
if (import.meta.env.DEV) {
    console.log('🔧 API Configuration:', {
        baseUrl: API_BASE_URL,
        environment: import.meta.env.MODE,
    });
}
