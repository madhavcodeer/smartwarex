import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

const Inventory: React.FC = () => {
    const inventoryItems = [
        { id: 'SKU-001', name: 'Wireless Headphones', category: 'Electronics', stock: 145, status: 'In Stock', reorderPoint: 50 },
        { id: 'SKU-002', name: 'Ergonomic Chair', category: 'Furniture', stock: 12, status: 'Low Stock', reorderPoint: 15 },
        { id: 'SKU-003', name: 'Mechanical Keyboard', category: 'Electronics', stock: 89, status: 'In Stock', reorderPoint: 30 },
        { id: 'SKU-004', name: 'Monitor Stand', category: 'Accessories', stock: 0, status: 'Out of Stock', reorderPoint: 20 },
        { id: 'SKU-005', name: 'USB-C Hub', category: 'Electronics', stock: 230, status: 'Overstock', reorderPoint: 100 },
        { id: 'SKU-006', name: 'Desk Lamp', category: 'Furniture', stock: 45, status: 'In Stock', reorderPoint: 25 },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
                        <p className="text-slate-400">Track stock levels, manage reorder points, and view item details.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <PlusIcon className="h-5 w-5" />
                        Add Item
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="card p-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by SKU, Name, or Category..."
                                className="input-field pl-10"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="btn-secondary flex items-center gap-2 px-4 py-2">
                                <FunnelIcon className="h-5 w-5" />
                                Filter
                            </button>
                            <button className="btn-secondary flex items-center gap-2 px-4 py-2">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-800/50 text-xs uppercase text-slate-300">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Item Details</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Stock Level</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Reorder Point</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {inventoryItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-white">{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{item.category}</td>
                                        <td className="px-6 py-4 font-medium text-white">{item.stock}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.status === 'In Stock' ? 'bg-green-500/10 text-green-400' :
                                                    item.status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-400' :
                                                        item.status === 'Out of Stock' ? 'bg-red-500/10 text-red-400' :
                                                            'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{item.reorderPoint}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-white transition-colors">
                                                <EllipsisHorizontalIcon className="h-6 w-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-slate-800/30 px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
                        <span className="text-sm text-slate-400">Showing <span className="text-white font-medium">1-6</span> of <span className="text-white font-medium">145</span> items</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50">Previous</button>
                            <button className="px-3 py-1 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Inventory;
