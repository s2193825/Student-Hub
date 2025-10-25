import React, { useState } from 'react';
import { MasterAssignment, User } from '../types';
import { useData } from '../contexts/DataContext';
import { CloseIcon } from './icons';

interface AssignmentFormModalProps {
    masterAssignment: MasterAssignment | null;
    onClose: () => void;
}

const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({ masterAssignment, onClose }) => {
    const { createMasterAssignment, students } = useData();
    const [title, setTitle] = useState(masterAssignment?.title || '');
    const [instructions, setInstructions] = useState(masterAssignment?.instructions || '');
    const [dueDate, setDueDate] = useState(masterAssignment?.dueDate.split('T')[0] || '');
    const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>(masterAssignment?.assignedStudentIds || []);
    const [isLoading, setIsLoading] = useState(false);

    const handleStudentSelect = (studentId: string) => {
        setAssignedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const assignmentData = {
            title,
            instructions,
            dueDate: new Date(dueDate).toISOString(),
            assignedStudentIds,
            subject: 'History', // Hardcoded for now
            teacherId: 'user-teacher-aryan' // Hardcoded for now
        };

        try {
            if (masterAssignment) {
                // Update logic would go here
            } else {
                await createMasterAssignment(assignmentData);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save assignment", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-border-color flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-dark-text">{masterAssignment ? 'Edit Assignment' : 'Create Assignment'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-medium-text mb-1">Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-border-color rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-medium-text mb-1">Instructions</label>
                            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full p-2 border border-border-color rounded-md h-32" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-medium-text mb-1">Due Date</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border border-border-color rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-medium-text mb-1">Assign to Students</label>
                            <div className="max-h-40 overflow-y-auto border border-border-color rounded-md p-2 space-y-1">
                                {students.map(student => (
                                    <label key={student.id} className="flex items-center space-x-3 p-2 hover:bg-light-bg rounded-md">
                                        <input
                                            type="checkbox"
                                            checked={assignedStudentIds.includes(student.id)}
                                            onChange={() => handleStudentSelect(student.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span>{student.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-border-color flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-400">
                            {isLoading ? 'Saving...' : 'Save Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignmentFormModal;
