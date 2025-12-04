import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChartBarIcon,
    CubeIcon,
    TruckIcon,
    CloudArrowUpIcon,
    ShieldCheckIcon,
    BoltIcon,
    ArrowRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
    const features = [
        {
            icon: CubeIcon,
            title: 'Warehouse Layout Optimization',
            description: 'AI-powered clustering and heatmap analysis to reduce picking time by up to 60%',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: ChartBarIcon,
            title: 'Demand Forecasting',
            description: 'Multi-model predictions using Prophet, ARIMA, and LSTM for accurate planning',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            icon: TruckIcon,
            title: 'Route Optimization',
            description: 'Google OR-Tools powered routing to minimize distance and maximize efficiency',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: CloudArrowUpIcon,
            title: 'Inventory Intelligence',
            description: 'Smart reorder points, safety stock, and EOQ calculations',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Risk Management',
            description: 'Predictive analytics for supply chain disruptions and anomaly detection',
            gradient: 'from-indigo-500 to-purple-500'
        },
        {
            icon: BoltIcon,
            title: 'Carbon Footprint Tracking',
            description: 'Monitor and reduce environmental impact with actionable insights',
            gradient: 'from-teal-500 to-green-500'
        }
    ];

    const stats = [
        { value: '60%', label: 'Picking Time Reduction' },
        { value: '45%', label: 'Inventory Cost Savings' },
        { value: '35%', label: 'Forecast Accuracy Improvement' },
        { value: '25%', label: 'Carbon Emission Reduction' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <SparklesIcon className="h-8 w-8 text-blue-400" />
                            <span className="text-2xl font-display font-bold text-white">SmartWareX</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-slate-300 hover:text-white transition-colors px-4 py-2"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-glow"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                            AI-Driven Warehouse
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 text-transparent bg-clip-text">
                                Optimization System
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Transform your warehouse operations with cutting-edge AI and machine learning.
                            Optimize layouts, forecast demand, plan routes, and reduce carbon footprint—all in one powerful platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/dashboard"
                                className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-2xl hover:shadow-glow flex items-center space-x-2"
                            >
                                <span>Launch Dashboard</span>
                                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#features"
                                className="bg-slate-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-700/50 transition-all border border-slate-600"
                            >
                                Learn More
                            </a>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Everything you need to optimize your warehouse operations in one integrated platform
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all hover:shadow-glass"
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 rounded-2xl transition-all" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 p-12 rounded-3xl shadow-2xl"
                    >
                        <h2 className="text-4xl font-display font-bold text-white mb-4">
                            Ready to Transform Your Warehouse?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join leading companies using SmartWareX to optimize their operations
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
                        >
                            Start Free Trial
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/80 border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <SparklesIcon className="h-6 w-6 text-blue-400" />
                        <span className="text-xl font-display font-bold text-white">SmartWareX</span>
                    </div>
                    <p className="text-slate-400">
                        © 2024 SmartWareX. All rights reserved. Built with ❤️ for warehouse excellence.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
