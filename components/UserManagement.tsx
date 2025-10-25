import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { User } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from './icons';
import UserFormModal from './UserFormModal';
import ConfirmationModal from './ConfirmationModal';
import SkeletonLoader from './SkeletonLoader';

const UserManagement: React.FC = () => {
    const { users, deleteUser, loading } = useData();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [filter, setFilter] = useState('all');

    const filteredUsers = useMemo(() => {
        if (filter === 'all') return users;
        return users.filter(u => u.role === filter);
    }, [users, filter]);

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsFormModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsFormModalOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete.id);
        }
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-dark-text">User Management</h1>
                <button onClick={handleAddUser} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add User
                </button>
            </div>

            <div className="mb-4 flex space-x-2">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
                <button onClick={() => setFilter('student')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'student' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>Students</button>
                <button onClick={() => setFilter('teacher')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'teacher' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>Teachers</button>
                <button onClick={() => setFilter('admin')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'admin' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>Admins</button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-border-color overflow-hidden">
                <table className="w-full">
                    <thead className="bg-light-bg">
                        <tr>
                            <th className="p-4 text-left font-semibold text-medium-text">Name</th>
                            <th className="p-4 text-left font-semibold text-medium-text">Email</th>
                            <th className="p-4 text-left font-semibold text-medium-text">Role</th>
                            <th className="p-4 text-left font-semibold text-medium-text">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={4} className="p-4"><SkeletonLoader className="h-8 w-full" /></td></tr>
                            ))
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-border-color last:border-b-0">
                                    <td className="p-4 flex items-center space-x-3">
                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                        <span className="font-semibold text-dark-text">{user.name}</span>
                                    </td>
                                    <td className="p-4 text-medium-text">{user.email}</td>
                                    <td className="p-4 text-medium-text capitalize">{user.role}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-100"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-800 p-2 rounded-full bg-red-100"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isFormModalOpen && <UserFormModal user={selectedUser} onClose={() => setIsFormModalOpen(false)} />}
            {isConfirmModalOpen && userToDelete && (
                <ConfirmationModal 
                    title="Delete User"
                    message={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UserManagement;
