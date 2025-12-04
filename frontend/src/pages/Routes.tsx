import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TruckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const Routes: React.FC = () => {
    const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    // Warehouse center (example coordinates - Delhi, India)
    const warehouseCenter = { lat: 28.6139, lng: 77.2090 };

    // Sample delivery locations
    const deliveryLocations = [
        { id: 1, name: 'Location A', lat: 28.6289, lng: 77.2065 },
        { id: 2, name: 'Location B', lat: 28.5355, lng: 77.3910 },
        { id: 3, name: 'Location C', lat: 28.7041, lng: 77.1025 },
    ];

    const mapContainerStyle = {
        width: '100%',
        height: '500px',
        borderRadius: '12px',
    };

    const mapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{ "color": "#1e293b" }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#cbd5e1" }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#0f172a" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": "#334155" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#0ea5e9" }]
            }
        ]
    };

    const calculateRoute = (destinationIndex: number) => {
        if (!window.google) return;

        const directionsService = new google.maps.DirectionsService();
        const destination = deliveryLocations[destinationIndex];

        directionsService.route(
            {
                origin: warehouseCenter,
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);
                    setSelectedRoute(destinationIndex);
                }
            }
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Route Optimization</h1>
                    <p className="text-slate-400">Plan and optimize delivery and picking routes using AI.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <div className="lg:col-span-2 card p-0 overflow-hidden">
                        <div className="p-4 border-b border-slate-700/50">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <MapPinIcon className="h-5 w-5 text-blue-500" />
                                Interactive Route Map
                            </h3>
                        </div>
                        <div className="p-4">
                            <LoadScript googleMapsApiKey="AIzaSyBGR1dAvm3Swc3l7izJBSJRInZtSdI3H24">
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={warehouseCenter}
                                    zoom={11}
                                    options={mapOptions}
                                >
                                    {/* Warehouse Marker */}
                                    <Marker
                                        position={warehouseCenter}
                                        icon={{
                                            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzM3MzVmZiIvPjxwYXRoIGQ9Ik0xNiA4TDggMTJWMjBMMTYgMjRMMjQgMjBWMTJMMTYgOFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
                                            scaledSize: new google.maps.Size(40, 40),
                                        }}
                                        title="Warehouse"
                                    />

                                    {/* Delivery Location Markers */}
                                    {deliveryLocations.map((location, index) => (
                                        <Marker
                                            key={location.id}
                                            position={{ lat: location.lat, lng: location.lng }}
                                            onClick={() => calculateRoute(index)}
                                            icon={{
                                                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPicgKyAoaW5kZXggKyAxKSArICc8L3RleHQ+PC9zdmc+',
                                                scaledSize: new google.maps.Size(32, 32),
                                            }}
                                            title={location.name}
                                        />
                                    ))}

                                    {/* Route Directions */}
                                    {directions && (
                                        <DirectionsRenderer
                                            directions={directions}
                                            options={{
                                                polylineOptions: {
                                                    strokeColor: '#3b82f6',
                                                    strokeWeight: 4,
                                                },
                                                suppressMarkers: true,
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">Route Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Vehicle Type</label>
                                    <select className="input-field">
                                        <option>Forklift (Standard)</option>
                                        <option>Pallet Jack</option>
                                        <option>Autonomous Robot</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Optimization Goal</label>
                                    <select className="input-field">
                                        <option>Minimize Distance</option>
                                        <option>Minimize Time</option>
                                        <option>Balance Workload</option>
                                    </select>
                                </div>
                                <button className="btn-primary w-full flex items-center justify-center gap-2">
                                    <TruckIcon className="h-5 w-5" />
                                    Generate Routes
                                </button>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">Delivery Locations</h3>
                            <div className="space-y-3">
                                {deliveryLocations.map((location, index) => (
                                    <button
                                        key={location.id}
                                        onClick={() => calculateRoute(index)}
                                        className={`w-full p-3 rounded-lg border transition-all text-left ${selectedRoute === index
                                            ? 'bg-blue-500/20 border-blue-500 text-white'
                                            : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{location.name}</p>
                                                <p className="text-xs text-slate-400">Click to show route</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">Active Routes</h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex justify-between items-center">
                                        <div>
                                            <p className="text-white text-sm font-medium">Route #{100 + i}</p>
                                            <p className="text-slate-400 text-xs">Forklift A • 12 stops</p>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">In Progress</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Routes;
