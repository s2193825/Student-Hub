import React, { useState } from 'react';
import { User } from '../types';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import { CloseIcon } from './icons';

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose }) => {
  const { addUser, updateUser } = useData();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student',
    avatarUrl: user?.avatarUrl || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (user) {
        await updateUser({ ...user, ...formData });
        addNotification('success', 'User updated successfully!');
      } else {
        await addUser(formData as Omit<User, 'id'>);
        addNotification('success', 'User added successfully!');
      }
      onClose();
    } catch (error) {
      addNotification('error', 'Failed to save user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-border-color flex justify-between items-center">
          <h2 className="text-2xl font-bold text-dark-text">{user ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-medium-text mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-medium-text mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-medium-text mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-white">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="p-6 border-t border-border-color flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-400">
              {isLoading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
