
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, AssignmentIcon, ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon, SparklesIcon, ClipboardListIcon, UsersIcon, LogOutIcon, MessageIcon } from './icons';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
        <div className="w-6 h-6 mr-4">{icon}</div>
        <span className="font-semibold text-lg">{label}</span>
    </button>
);


const Sidebar: React.FC<{ currentView: string; setCurrentView: (view: string) => void }> = ({ currentView, setCurrentView }) => {
    const { user, logout } = useAuth();
    if (!user) return null;

    const studentNav = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
        { id: 'forums', label: 'Forums', icon: <ChatBubbleOvalLeftEllipsisIcon /> },
        { id: 'messages', label: 'Messages', icon: <MessageIcon /> },
        { id: 'planner', label: 'AI Planner', icon: <ClipboardListIcon /> },
        { id: 'profile', label: 'Profile', icon: <UserCircleIcon /> },
    ];

    const teacherNav = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
        { id: 'students', label: 'Students', icon: <UsersIcon /> },
        { id: 'forums', label: 'Forums', icon: <ChatBubbleOvalLeftEllipsisIcon /> },
        { id: 'messages', label: 'Messages', icon: <MessageIcon /> },
    ];

    const adminNav = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'users', label: 'User Management', icon: <UsersIcon /> },
    ];
    
    const navItems = user.role === 'admin' ? adminNav : (user.role === 'teacher' ? teacherNav : studentNav);

    return (
        <aside className="w-72 bg-gray-800 text-white flex flex-col flex-shrink-0 h-screen sticky top-0">
            <div className="h-20 flex items-center px-6 border-b border-gray-700">
                <SparklesIcon className="w-8 h-8 text-primary-50" />
                <h1 className="text-2xl font-bold ml-3">Classroom Connect</h1>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={currentView === item.id}
                        onClick={() => setCurrentView(item.id)}
                    />
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700/50">
                    <img src={user.avatarUrl} alt="User Avatar" className="w-12 h-12 rounded-full" />
                    <div className="flex-grow">
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-sm text-gray-400 capitalize">{user.role}</p>
                    </div>
                    <button onClick={logout} title="Logout" className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full">
                        <LogOutIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
