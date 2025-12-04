import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    ChartPieIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    GlobeAmericasIcon,
    FunnelIcon,
    CubeIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Types
interface ScannedItem {
    id: string;
    name: string;
    classification: 'Hard' | 'Soft';
    hardness_score: number;
    confidence: number;
    fragility_class: 'Low' | 'Medium' | 'High';
    recommended_zone: string;
    scanned_at: string;
    quantity: number;
}

const Analytics: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'hard' | 'soft'>('all');
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

    // Mock data - In production, this would come from an API
    useEffect(() => {
        const mockItems: ScannedItem[] = [
            {
                id: '1',
                name: 'Laptop Computer',
                classification: 'Hard',
                hardness_score: 0.85,
                confidence: 0.92,
                fragility_class: 'High',
                recommended_zone: 'Zone A (Hardlines/Secure - Fragile)',
                scanned_at: '2025-12-04T10:30:00',
                quantity: 5
            },
            {
                id: '2',
                name: 'Cotton T-Shirt',
                classification: 'Soft',
                hardness_score: 0.15,
                confidence: 0.88,
                fragility_class: 'Low',
                recommended_zone: 'Zone B (Apparel/Softlines - Standard)',
                scanned_at: '2025-12-04T10:25:00',
                quantity: 50
            },
            {
                id: '3',
                name: 'Glass Bottle',
                classification: 'Hard',
                hardness_score: 0.92,
                confidence: 0.95,
                fragility_class: 'High',
                recommended_zone: 'Zone A (Hardlines/Secure - Fragile)',
                scanned_at: '2025-12-04T10:20:00',
                quantity: 20
            },
            {
                id: '4',
                name: 'Pillow',
                classification: 'Soft',
                hardness_score: 0.12,
                confidence: 0.91,
                fragility_class: 'Low',
                recommended_zone: 'Zone B (Apparel/Softlines - Standard)',
                scanned_at: '2025-12-04T10:15:00',
                quantity: 30
            },
            {
                id: '5',
                name: 'Ceramic Plate',
                classification: 'Hard',
                hardness_score: 0.88,
                confidence: 0.89,
                fragility_class: 'High',
                recommended_zone: 'Zone A (Hardlines/Secure - Fragile)',
                scanned_at: '2025-12-04T10:10:00',
                quantity: 15
            },
            {
                id: '6',
                name: 'Wool Blanket',
                classification: 'Soft',
                hardness_score: 0.18,
                confidence: 0.87,
                fragility_class: 'Low',
                recommended_zone: 'Zone B (Apparel/Softlines - Standard)',
                scanned_at: '2025-12-04T10:05:00',
                quantity: 25
            },
            {
                id: '7',
                name: 'Smartphone',
                classification: 'Hard',
                hardness_score: 0.82,
                confidence: 0.94,
                fragility_class: 'High',
                recommended_zone: 'Zone A (Hardlines/Secure - Fragile)',
                scanned_at: '2025-12-04T10:00:00',
                quantity: 10
            },
            {
                id: '8',
                name: 'Denim Jeans',
                classification: 'Soft',
                hardness_score: 0.22,
                confidence: 0.86,
                fragility_class: 'Low',
                recommended_zone: 'Zone B (Apparel/Softlines - Standard)',
                scanned_at: '2025-12-04T09:55:00',
                quantity: 40
            }
        ];
        setScannedItems(mockItems);
    }, []);

    // Filter items
    const filteredItems = scannedItems.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'hard') return item.classification === 'Hard';
        if (filter === 'soft') return item.classification === 'Soft';
        return true;
    });

    // Calculate statistics
    const totalItems = scannedItems.length;
    const hardItems = scannedItems.filter(item => item.classification === 'Hard');
    const softItems = scannedItems.filter(item => item.classification === 'Soft');
    const hardPercentage = totalItems > 0 ? (hardItems.length / totalItems) * 100 : 0;
    const softPercentage = totalItems > 0 ? (softItems.length / totalItems) * 100 : 0;

    const totalQuantity = scannedItems.reduce((sum, item) => sum + item.quantity, 0);
    const hardQuantity = hardItems.reduce((sum, item) => sum + item.quantity, 0);
    const softQuantity = softItems.reduce((sum, item) => sum + item.quantity, 0);

    const avgConfidence = scannedItems.length > 0
        ? scannedItems.reduce((sum, item) => sum + item.confidence, 0) / scannedItems.length
        : 0;

    const highFragilityCount = scannedItems.filter(item => item.fragility_class === 'High').length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Product Analysis & Reports</h1>
                    <p className="text-slate-400">Comprehensive insights into scanned products with hard/soft classification.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <CubeIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="text-white font-medium">Total Scanned</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{totalItems}</p>
                        <p className="text-slate-400 text-sm mt-1">{totalQuantity} units total</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-white font-medium">Hard Items</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-400">{hardItems.length}</p>
                        <p className="text-slate-400 text-sm mt-1">{hardPercentage.toFixed(1)}% • {hardQuantity} units</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <ChartPieIcon className="h-5 w-5 text-purple-500" />
                            </div>
                            <h3 className="text-white font-medium">Soft Items</h3>
                        </div>
                        <p className="text-3xl font-bold text-purple-400">{softItems.length}</p>
                        <p className="text-slate-400 text-sm mt-1">{softPercentage.toFixed(1)}% • {softQuantity} units</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                            </div>
                            <h3 className="text-white font-medium">Avg Confidence</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{(avgConfidence * 100).toFixed(1)}%</p>
                        <p className="text-slate-400 text-sm mt-1">{highFragilityCount} high fragility items</p>
                    </motion.div>
                </div>

                {/* Distribution Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-6">Classification Distribution</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-300 text-sm font-medium">Hard Items</span>
                                    <span className="text-blue-400 text-sm font-bold">{hardPercentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${hardPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                                    />
                                </div>
                                <p className="text-slate-500 text-xs mt-1">{hardItems.length} items • {hardQuantity} units</p>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-300 text-sm font-medium">Soft Items</span>
                                    <span className="text-purple-400 text-sm font-bold">{softPercentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${softPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                                    />
                                </div>
                                <p className="text-slate-500 text-xs mt-1">{softItems.length} items • {softQuantity} units</p>
                            </div>
                        </div>
                    </div>

                    {/* Risk Assessment Card */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                                Risk Assessment
                            </h3>
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
                                Medium Risk
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-300 text-sm">Supply Chain Disruption</span>
                                    <span className="text-orange-400 text-sm font-bold">65% Probability</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <p className="text-slate-500 text-xs mt-2">
                                    Potential delays detected from suppliers in East Asia due to weather conditions.
                                </p>
                            </div>

                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-300 text-sm">Stockout Risk</span>
                                    <span className="text-yellow-400 text-sm font-bold">32% Probability</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                                </div>
                                <p className="text-slate-500 text-xs mt-2">
                                    High demand predicted for Electronics category next week.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scanned Items List */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Scanned Products</h3>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                All ({totalItems})
                            </button>
                            <button
                                onClick={() => setFilter('hard')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'hard' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Hard ({hardItems.length})
                            </button>
                            <button
                                onClick={() => setFilter('soft')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'soft' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Soft ({softItems.length})
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Product</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Classification</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Hardness</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Confidence</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Fragility</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Quantity</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Zone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-slate-500 text-xs">
                                                {new Date(item.scanned_at).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.classification === 'Hard'
                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                                }`}>
                                                {item.classification}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-slate-700 h-1.5 rounded-full">
                                                    <div
                                                        className={`h-1.5 rounded-full ${item.hardness_score > 0.7 ? 'bg-blue-500' : 'bg-purple-500'
                                                            }`}
                                                        style={{ width: `${item.hardness_score * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-slate-300 text-sm">{item.hardness_score.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-white text-sm">{(item.confidence * 100).toFixed(1)}%</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.fragility_class === 'High' ? 'bg-red-500/20 text-red-400' :
                                                    item.fragility_class === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'
                                                }`}>
                                                {item.fragility_class}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-white text-sm">{item.quantity}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-slate-300 text-xs">{item.recommended_zone}</p>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <CubeIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No items found for this filter</p>
                        </div>
                    )}
                </div>

                {/* Carbon Footprint Card */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <GlobeAmericasIcon className="h-5 w-5 text-green-500" />
                            Carbon Footprint
                        </h3>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                            -12% vs Last Month
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                            <p className="text-slate-400 text-xs mb-1">Total Emissions</p>
                            <p className="text-2xl font-bold text-white">2.4T</p>
                            <p className="text-slate-500 text-xs">CO2e</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                            <p className="text-slate-400 text-xs mb-1">Energy Usage</p>
                            <p className="text-2xl font-bold text-white">450</p>
                            <p className="text-slate-500 text-xs">kWh</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-300">Reduction Strategies</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Optimize forklift routes to reduce travel distance
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Consolidate shipments for Zone B
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
