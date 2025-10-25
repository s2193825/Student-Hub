import React from 'react';
import { useData } from '../contexts/DataContext';
import { FireIcon, ClipboardListIcon, TrophyIcon, AcademicCapIcon, CheckCircleIcon, PencilIcon } from './icons';
import SkeletonLoader from './SkeletonLoader';

const StudentDashboard: React.FC = () => {
    const { user, assignments, loading } = useData();

    const upcomingAssignments = assignments
        .filter(a => new Date(a.dueDate) > new Date() && a.status !== 'Submitted' && a.status !== 'Graded' && !a.isExempt)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3);
    
    const recentlyGraded = assignments
        .filter(a => a.status === 'Graded')
        .slice(0, 2);

    if (loading) {
        return (
            <div className="p-8">
                <SkeletonLoader className="h-10 w-1/2 mb-2" />
                <SkeletonLoader className="h-6 w-1/3 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3"><SkeletonLoader className="h-64 w-full rounded-xl" /></div>
                    <div className="lg:col-span-2"><SkeletonLoader className="h-64 w-full rounded-xl" /></div>
                 </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-dark-text mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p className="text-lg text-medium-text mb-8">Here's what's happening today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-orange-100 p-4 rounded-full">
                        <FireIcon className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Login Streak</p>
                        <p className="text-3xl font-bold text-dark-text">{user?.loginStreak} Days</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <ClipboardListIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Assignments Due Soon</p>
                        <p className="text-3xl font-bold text-dark-text">{upcomingAssignments.length}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <TrophyIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Achievements</p>
                        <p className="text-3xl font-bold text-dark-text">{user?.achievements?.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-border-color p-6">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Upcoming Deadlines</h2>
                    {upcomingAssignments.length > 0 ? (
                        <ul className="space-y-3">
                            {upcomingAssignments.map(a => (
                                <li key={a.id} className="p-3 bg-light-bg rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-dark-text">{a.title}</p>
                                        <p className="text-sm text-medium-text">{a.subject}</p>
                                    </div>
                                    <p className="font-bold text-red-600">{new Date(a.dueDate).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-medium-text">You're all caught up! No assignments due soon.</p>
                    )}
                </div>
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-border-color p-6">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Recent Grades</h2>
                     {recentlyGraded.length > 0 ? (
                         <ul className="space-y-3">
                            {recentlyGraded.map(a => (
                                <li key={a.id} className="p-3 bg-light-bg rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-dark-text">{a.title}</p>
                                        <p className="text-sm text-medium-text">{a.subject}</p>
                                    </div>
                                    <p className="font-bold text-2xl text-green-600">{a.grade}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-medium-text">No recently graded assignments.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const TeacherDashboard: React.FC = () => {
    const { user, masterAssignments, studentAssignments, students, loading } = useData();

    if (loading) {
        return (
             <div className="p-8">
                <SkeletonLoader className="h-10 w-1/2 mb-2" />
                <SkeletonLoader className="h-6 w-1/3 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                    <SkeletonLoader className="h-24 w-full rounded-xl" />
                </div>
            </div>
        );
    }
    
    const toGradeCount = studentAssignments.filter(sa => sa.status === 'Submitted').length;
    
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-dark-text mb-2">Welcome, {user?.name}!</h1>
            <p className="text-lg text-medium-text mb-8">Here's a summary of your classes.</p>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <PencilIcon className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Assignments to Grade</p>
                        <p className="text-3xl font-bold text-dark-text">{toGradeCount}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <AcademicCapIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Total Students</p>
                        <p className="text-3xl font-bold text-dark-text">{students.length}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color flex items-center space-x-4">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-medium-text">Active Assignments</p>
                        <p className="text-3xl font-bold text-dark-text">{masterAssignments.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { user } = useData();

    if (!user) {
        return <div className="p-8"><SkeletonLoader className="w-full h-64 rounded-xl" /></div>;
    }

    switch (user.role) {
        case 'student':
            return <StudentDashboard />;
        case 'teacher':
            return <TeacherDashboard />;
        default:
            return <div className="p-8"><h1 className="text-2xl">Dashboard not available for this role.</h1></div>;
    }
};

export default Dashboard;
