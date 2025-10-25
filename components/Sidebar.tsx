import React from 'react';
import { HomeIcon, AssignmentIcon, MessageIcon, ProfileIcon, UsersIcon } from './icons';

type View = 'dashboard' | 'assignments' | 'messages' | 'forums' | 'profile';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-medium-text hover:bg-gray-200 hover:text-dark-text'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-white h-screen p-4 flex flex-col fixed top-0 left-0 border-r border-border-color">
      <div className="flex items-center mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">SH</span>
        </div>
        <h1 className="text-2xl font-bold ml-3 text-dark-text">Student Hub</h1>
      </div>
      <nav className="flex flex-col space-y-3">
        <NavItem
          icon={<HomeIcon className="w-6 h-6" />}
          label="Dashboard"
          isActive={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
        />
        <NavItem
          icon={<AssignmentIcon className="w-6 h-6" />}
          label="Assignments"
          isActive={currentView === 'assignments'}
          onClick={() => setCurrentView('assignments')}
        />
        <NavItem
          icon={<MessageIcon className="w-6 h-6" />}
          label="Messages"
          isActive={currentView === 'messages'}
          onClick={() => setCurrentView('messages')}
        />
        <NavItem
          icon={<UsersIcon className="w-6 h-6" />}
          label="Forums"
          isActive={currentView === 'forums'}
          onClick={() => setCurrentView('forums')}
        />
        <NavItem
          icon={<ProfileIcon className="w-6 h-6" />}
          label="Profile"
          isActive={currentView === 'profile'}
          onClick={() => setCurrentView('profile')}
        />
      </nav>
      <div className="mt-auto p-4 bg-primary/10 rounded-lg text-center">
        <h3 className="font-bold text-primary">Need Help?</h3>
        <p className="text-sm text-medium-text mt-1">
          Our AI Study Buddy in the assignments section can help you understand your tasks!
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
