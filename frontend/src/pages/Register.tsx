import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full glass-dark p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>
                <p className="text-slate-400 mb-6">Register page - Coming soon</p>
                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default Register;
