import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    ChartBarIcon,
    CubeIcon,
    TruckIcon,
    CloudArrowUpIcon,
    BellAlertIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
    const metrics = [
        { icon: CubeIcon, label: 'Total Inventory', value: '12,543', change: '+5.2%', positive: true },
        { icon: TruckIcon, label: 'Active Routes', value: '47', change: '-2.1%', positive: false },
        { icon: ChartBarIcon, label: 'Forecast Accuracy', value: '94.3%', change: '+3.5%', positive: true },
        { icon: CloudArrowUpIcon, label: 'Carbon Footprint', value: '2.4T', change: '-12.3%', positive: true },
    ];

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back! Here's what's happening with your warehouse.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                    <div key={index} className="card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                                <metric.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className={`text-sm font-semibold ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                                {metric.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                        <p className="text-slate-400 text-sm">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <BellAlertIcon className="h-5 w-5 text-yellow-400" />
                            <div>
                                <p className="text-white text-sm">Low stock alert: Item #1234</p>
                                <p className="text-slate-400 text-xs">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
                            <div>
                                <p className="text-white text-sm">Forecast accuracy improved</p>
                                <p className="text-slate-400 text-xs">1 hour ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <TruckIcon className="h-5 w-5 text-blue-400" />
                            <div>
                                <p className="text-white text-sm">Route #45 optimized successfully</p>
                                <p className="text-slate-400 text-xs">3 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/warehouse" className="btn-primary text-center flex flex-col items-center justify-center py-6 gap-2">
                            <CubeIcon className="h-6 w-6" />
                            <span>Optimize Layout</span>
                        </Link>
                        <Link to="/forecasting" className="btn-secondary text-center flex flex-col items-center justify-center py-6 gap-2">
                            <ChartBarIcon className="h-6 w-6" />
                            <span>Run Forecast</span>
                        </Link>
                        <Link to="/routes" className="btn-secondary text-center flex flex-col items-center justify-center py-6 gap-2">
                            <TruckIcon className="h-6 w-6" />
                            <span>Plan Routes</span>
                        </Link>
                        <Link to="/analytics" className="btn-secondary text-center flex flex-col items-center justify-center py-6 gap-2">
                            <CloudArrowUpIcon className="h-6 w-6" />
                            <span>View Analytics</span>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
