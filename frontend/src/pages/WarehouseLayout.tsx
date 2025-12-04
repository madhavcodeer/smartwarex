import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    ArrowPathIcon,
    FunnelIcon,
    MapIcon,
    TableCellsIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Types
interface GridCell {
    x: number;
    y: number;
    type: 'empty' | 'shelf' | 'wall' | 'path' | 'zone';
    itemId?: string;
    heat?: number;
    cluster?: number;
}

const WarehouseLayout: React.FC = () => {
    const [gridWidth] = useState(20);
    const [gridHeight] = useState(15);
    const [grid, setGrid] = useState<GridCell[]>([]);
    const [viewMode, setViewMode] = useState<'layout' | 'heatmap' | 'clusters'>('layout');
    const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Initialize grid
    useEffect(() => {
        const newGrid: GridCell[] = [];
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                // Create a simulated warehouse layout
                let type: GridCell['type'] = 'empty';
                let heat = Math.random();
                let cluster = Math.floor(Math.random() * 5);

                // Add some shelves
                if (x % 3 !== 0 && y % 4 !== 0 && x > 2 && x < gridWidth - 2 && y > 2 && y < gridHeight - 2) {
                    type = 'shelf';
                }

                // Add some zones
                if (x < 3 && y < 5) type = 'zone'; // Receiving
                if (x > gridWidth - 4 && y > gridHeight - 6) type = 'zone'; // Shipping

                newGrid.push({ x, y, type, heat, cluster });
            }
        }
        setGrid(newGrid);
    }, [gridWidth, gridHeight]);

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            // Simulate optimization result
            setViewMode('heatmap');
        }, 2000);
    };

    const getCellColor = (cell: GridCell) => {
        if (viewMode === 'heatmap') {
            if (cell.type === 'shelf') {
                // Heatmap color scale (blue to red)
                const intensity = Math.floor(cell.heat! * 255);
                return `rgb(${intensity}, ${100}, ${255 - intensity})`;
            }
            return 'transparent';
        }

        if (viewMode === 'clusters') {
            if (cell.type === 'shelf') {
                const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
                return colors[cell.cluster!];
            }
            return 'transparent';
        }

        // Default layout view
        switch (cell.type) {
            case 'shelf': return '#334155'; // slate-700
            case 'zone': return '#1e40af'; // blue-800
            case 'wall': return '#94a3b8'; // slate-400
            default: return 'transparent';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Warehouse Layout Optimization</h1>
                        <p className="text-slate-400">Visualize and optimize your warehouse floor plan using AI clustering.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleOptimize}
                            disabled={isOptimizing}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isOptimizing ? (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            ) : (
                                <CpuChipIcon className="h-5 w-5" />
                            )}
                            {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Interactive Map</h2>
                            <div className="flex bg-slate-800 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('layout')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'layout' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Layout
                                </button>
                                <button
                                    onClick={() => setViewMode('heatmap')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'heatmap' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Heatmap
                                </button>
                                <button
                                    onClick={() => setViewMode('clusters')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'clusters' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Clusters
                                </button>
                            </div>
                        </div>

                        {/* Grid Visualization */}
                        <div className="relative aspect-video bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden p-4">
                            <div
                                className="grid gap-1 w-full h-full"
                                style={{
                                    gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                                    gridTemplateRows: `repeat(${gridHeight}, 1fr)`,
                                }}
                            >
                                {grid.map((cell, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: idx * 0.001 }}
                                        onClick={() => setSelectedCell(cell)}
                                        className={`
                      rounded-sm cursor-pointer transition-colors hover:ring-2 hover:ring-white/50
                      ${cell.type === 'empty' ? 'bg-slate-800/30' : ''}
                    `}
                                        style={{
                                            backgroundColor: getCellColor(cell),
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
                                <span>Shelf</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-800 rounded-sm"></div>
                                <span>Zone</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-800/30 rounded-sm"></div>
                                <span>Aisle</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">Optimization Stats</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Picking Efficiency</span>
                                        <span className="text-green-400">+24%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Space Utilization</span>
                                        <span className="text-blue-400">88%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Travel Distance</span>
                                        <span className="text-yellow-400">-15%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold text-white mb-4">Selected Zone</h3>
                            {selectedCell ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-slate-700">
                                        <span className="text-slate-400">Coordinates</span>
                                        <span className="text-white">({selectedCell.x}, {selectedCell.y})</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-700">
                                        <span className="text-slate-400">Type</span>
                                        <span className="text-white capitalize">{selectedCell.type}</span>
                                    </div>
                                    {selectedCell.type === 'shelf' && (
                                        <>
                                            <div className="flex justify-between py-2 border-b border-slate-700">
                                                <span className="text-slate-400">Heat Score</span>
                                                <span className="text-white">{Math.round(selectedCell.heat! * 100)}%</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-700">
                                                <span className="text-slate-400">Cluster Group</span>
                                                <span className="text-white">Group {selectedCell.cluster! + 1}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm italic">Select a cell on the map to view details</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WarehouseLayout;
