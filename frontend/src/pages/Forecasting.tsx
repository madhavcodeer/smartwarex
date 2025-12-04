import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
    ArrowTrendingUpIcon,
    CalendarIcon,
    ArrowPathIcon,
    CloudArrowUpIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Forecasting: React.FC = () => {
    const [selectedModel, setSelectedModel] = useState('ensemble');
    const [timeRange, setTimeRange] = useState('30d');
    const [isForecasting, setIsForecasting] = useState(false);

    // Mock data generation
    const generateData = () => {
        const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        const historical = Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 100);
        const forecast = historical.map(v => v + Math.floor(Math.random() * 20) - 10);
        const upper = forecast.map(v => v + 15);
        const lower = forecast.map(v => v - 15);

        return { labels, historical, forecast, upper, lower };
    };

    const data = generateData();

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Historical Demand',
                data: data.historical,
                borderColor: '#94a3b8', // slate-400
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                tension: 0.4,
                pointRadius: 2,
            },
            {
                label: 'Forecast',
                data: data.forecast,
                borderColor: '#3b82f6', // blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                pointRadius: 3,
            },
            {
                label: 'Confidence Interval',
                data: data.upper,
                borderColor: 'transparent',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: '+1', // fill to next dataset (lower)
                pointRadius: 0,
            },
            {
                label: 'Lower Bound',
                data: data.lower,
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#cbd5e1', // slate-300
                    usePointStyle: true,
                },
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#334155',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            y: {
                grid: {
                    color: '#334155',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },
    };

    const handleForecast = () => {
        setIsForecasting(true);
        setTimeout(() => {
            setIsForecasting(false);
        }, 2000);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Demand Forecasting</h1>
                        <p className="text-slate-400">Predict future inventory needs using advanced ML models.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        >
                            <option value="7d">Next 7 Days</option>
                            <option value="30d">Next 30 Days</option>
                            <option value="90d">Next Quarter</option>
                        </select>
                        <button
                            onClick={handleForecast}
                            disabled={isForecasting}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isForecasting ? (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            ) : (
                                <CloudArrowUpIcon className="h-5 w-5" />
                            )}
                            {isForecasting ? 'Running Models...' : 'Generate Forecast'}
                        </button>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="card h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Demand Projection</h2>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            {['prophet', 'arima', 'lstm', 'ensemble'].map((model) => (
                                <button
                                    key={model}
                                    onClick={() => setSelectedModel(model)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${selectedModel === model ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {model}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <Line options={options} data={chartData} />
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Predicted Growth</p>
                                <h3 className="text-2xl font-bold text-white">+12.5%</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-400">
                            Expected increase in demand over the next 30 days based on seasonal trends.
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <CalendarIcon className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Model Confidence</p>
                                <h3 className="text-2xl font-bold text-white">94.2%</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-400">
                            High confidence score based on historical accuracy of the Ensemble model.
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <CloudArrowUpIcon className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Seasonality</p>
                                <h3 className="text-2xl font-bold text-white">Detected</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-400">
                            Strong weekly patterns identified. Peak demand expected on Fridays.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Forecasting;
