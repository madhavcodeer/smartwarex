import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';

const Suppliers: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Supplier Management</h1>
                <p className="text-slate-400">Monitor supplier performance, reliability, and delivery timelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                    { name: 'Global Logistics Inc.', score: 4.8, status: 'Excellent' },
                    { name: 'FastTrack Supply', score: 4.2, status: 'Good' },
                    { name: 'EcoWare Solutions', score: 3.9, status: 'Average' },
                ].map((supplier, idx) => (
                    <div key={idx} className="card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-xl">
                                <UserGroupIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${supplier.score >= 4.5 ? 'bg-green-500/20 text-green-400' :
                                    supplier.score >= 4.0 ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {supplier.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{supplier.name}</h3>
                        <div className="flex items-center gap-1 mb-4">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-medium">{supplier.score}</span>
                            <span className="text-slate-500 text-sm">/ 5.0 Reliability Score</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                            <div>
                                <p className="text-slate-400 text-xs">On-Time Delivery</p>
                                <p className="text-white font-semibold">98.5%</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs">Defect Rate</p>
                                <p className="text-white font-semibold">0.2%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Supplier Performance Trends</h3>
                <div className="h-64 flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-700/30 border-dashed">
                    <p className="text-slate-500">Performance chart visualization placeholder</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Suppliers;
