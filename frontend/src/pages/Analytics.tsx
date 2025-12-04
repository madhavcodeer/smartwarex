import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    ChartPieIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    GlobeAmericasIcon
} from '@heroicons/react/24/outline';

const Analytics: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
                <p className="text-slate-400">Deep insights into warehouse performance, risks, and sustainability.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

            {/* General Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <ChartPieIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-white font-medium">Space Utilization</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">88%</p>
                    <p className="text-slate-400 text-sm mt-1">Optimal range: 85-90%</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <ArrowTrendingUpIcon className="h-5 w-5 text-purple-500" />
                        </div>
                        <h3 className="text-white font-medium">Order Throughput</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">1,240</p>
                    <p className="text-slate-400 text-sm mt-1">Orders processed today</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                            <ChartPieIcon className="h-5 w-5 text-pink-500" />
                        </div>
                        <h3 className="text-white font-medium">Return Rate</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">2.1%</p>
                    <p className="text-slate-400 text-sm mt-1">-0.5% from last week</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
