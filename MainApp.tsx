import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentAssignments from './components/StudentAssignments';
import TeacherAssignments from './components/TeacherAssignments';
import Forums from './components/Forums';
import Messages from './components/Messages';
import Profile from './components/Profile';
import AIPlanner from './components/AIPlanner';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import StudentRoster from './components/StudentRoster';
import { useAuth } from './contexts/AuthContext';

const MainApp: React.FC = () => {
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');

    const renderContent = () => {
        if (!user) return null;

        switch (currentView) {
            case 'dashboard':
                return user.role === 'admin' ? <AdminDashboard /> : <Dashboard />;
            case 'assignments':
                if (user.role === 'student') return <StudentAssignments />;
                if (user.role === 'teacher') return <TeacherAssignments />;
                return null;
            case 'forums':
                return <Forums />;
            case 'messages':
                return <Messages />;
            case 'planner':
                return <AIPlanner />;
            case 'profile':
                return <Profile />;
            case 'users':
                return <UserManagement />;
            case 'students':
                return <StudentRoster />;
            default:
                return user.role === 'admin' ? <AdminDashboard /> : <Dashboard />;
        }
    };

    return (
        <div className="flex bg-light-bg min-h-screen">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-grow">
                {renderContent()}
            </main>
        </div>
    );
};

export default MainApp;
