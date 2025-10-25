
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon } from './icons';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <img
            src={user?.avatarUrl}
            alt="User Avatar"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <div className="font-semibold text-gray-800">{user?.name}</div>
            <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
