import React from 'react';
import { useData } from '../contexts/DataContext';
import SkeletonLoader from './SkeletonLoader';
import { UsersIcon, AcademicCapIcon, ShieldCheckIcon } from './icons';

const AdminDashboard: React.FC = () => {
    const { users, loading, totalStudentCount, totalTeacherCount } = useData();

    if (loading) {
        return (
            <div className="p-8">
                <SkeletonLoader className="h-10 w-1/2 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                </div>
            </div>
        );
    }
    
    const adminCount = users.filter(u => u.role === 'admin').length;

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-dark-text mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <AcademicCapIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Total Students</p>
                        <p className="text-3xl font-bold text-dark-text">{totalStudentCount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-green-100 p-4 rounded-full">
                        <UsersIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Total Teachers</p>
                        <p className="text-3xl font-bold text-dark-text">{totalTeacherCount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <ShieldCheckIcon className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Total Admins</p>
                        <p className="text-3xl font-bold text-dark-text">{adminCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;