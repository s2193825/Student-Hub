import React, { useState } from 'react';
import { StudentAssignment } from '../types';
import { useData } from '../contexts/DataContext';
import { CloseIcon } from './icons';
import { useNotification } from '../contexts/NotificationContext';

interface ExemptModalProps {
    studentAssignment: StudentAssignment;
    onClose: () => void;
}

const ExemptModal: React.FC<ExemptModalProps> = ({ studentAssignment, onClose }) => {
    const { exemptStudentAssignment, students } = useData();
    const { addNotification } = useNotification();
    const [reason, setReason] = useState(studentAssignment.exemptionReason || '');
    const [isLoading, setIsLoading] = useState(false);

    const student = students.find(s => s.id === studentAssignment.studentId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;
        setIsLoading(true);
        try {
            await exemptStudentAssignment(studentAssignment.id, reason);
            addNotification('success', `${student?.name} has been exempted.`);
            onClose();
        } catch (error) {
            addNotification('error', 'Failed to exempt student.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b border-border-color flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-dark-text">Exempt Student</h2>
                        <p className="text-medium-text">For: {student?.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label className="block text-sm font-bold text-medium-text mb-1">Reason for Exemption</label>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2 border border-border-color rounded-md h-24" required />
                    </div>
                    <div className="p-6 border-t border-border-color flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-400">
                            {isLoading ? 'Saving...' : 'Confirm Exemption'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExemptModal;
