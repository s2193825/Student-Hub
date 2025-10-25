import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { ShieldCheckIcon, AcademicCapIcon, UserCircleIcon, EyeIcon, EyeSlashIcon } from './icons';

const roleConfig = {
    admin: { icon: ShieldCheckIcon, label: "Admin Sign In", color: "yellow" },
    teacher: { icon: AcademicCapIcon, label: "Teacher Sign In", color: "green" },
    student: { icon: UserCircleIcon, label: "Student Sign In", color: "blue" },
};

const RoleCard: React.FC<{ role: UserRole; onSelect: () => void }> = ({ role, onSelect }) => {
    const { icon: Icon, label, color } = roleConfig[role];
    const colors = {
        yellow: "from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700",
        green: "from-green-400 to-green-600 hover:from-green-500 hover:to-green-700",
        blue: "from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700",
    }
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className={`w-full p-8 rounded-2xl text-white font-bold text-2xl flex flex-col items-center justify-center space-y-4 shadow-2xl bg-gradient-to-br ${colors[color]}`}
        >
            <Icon className="w-16 h-16" />
            <span>{label}</span>
        </motion.button>
    );
};

const Login: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'role' | 'form'>('role');
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setCurrentStep('form');
        setError('');
    };
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;
        setIsLoading(true);
        setError('');
        try {
            await login(email, password, selectedRole);
        } catch (err) {
            setError('Error Code 101: Invalid Credentials');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-6xl h-[700px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary-600 to-purple-600 text-white text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-5xl font-bold mb-4">Welcome to Classroom Connect</h1>
                        <p className="text-xl opacity-90">Your digital hub for learning and collaboration.</p>
                    </motion.div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    {currentStep === 'role' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                            <h2 className="text-4xl font-bold text-dark-text mb-2">Sign In As</h2>
                            <p className="text-medium-text mb-8">Please select your role to continue.</p>
                            <div className="space-y-6">
                                <RoleCard role="student" onSelect={() => handleRoleSelect('student')} />
                                <RoleCard role="teacher" onSelect={() => handleRoleSelect('teacher')} />
                                <RoleCard role="admin" onSelect={() => handleRoleSelect('admin')} />
                            </div>
                        </motion.div>
                    )}
                    {currentStep === 'form' && selectedRole && (
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                            <button onClick={() => setCurrentStep('role')} className="text-sm font-semibold text-primary mb-4">&larr; Back to role selection</button>
                            <h2 className="text-4xl font-bold text-dark-text mb-2">{roleConfig[selectedRole].label}</h2>
                            <p className="text-medium-text mb-8">Enter your credentials to access your dashboard.</p>
                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-medium-text mb-1" htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 border border-gray-600 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!error}
                                        aria-describedby="auth-error"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="mb-6 relative">
                                    <label className="block text-sm font-bold text-medium-text mb-1" htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3 border border-gray-600 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!error}
                                        aria-describedby="auth-error"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-6 h-6"/> : <EyeIcon className="w-6 h-6"/>}
                                    </button>
                                </div>
                                {error && <p id="auth-error" role="alert" className="text-red-500 text-center mb-4">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors shadow-lg disabled:bg-gray-400"
                                >
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;