
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MasterAssignment, StudentAssignment } from '../types';
import { PlusIcon, ChevronDownIcon, CheckCircleIcon, PencilIcon, UserMinusIcon, TrashIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import AssignmentFormModal from './AssignmentFormModal';
import GradeModal from './GradeModal';
import ExemptModal from './ExemptModal';
import ConfirmationModal from './ConfirmationModal';
import SkeletonLoader from './SkeletonLoader';
import Pagination from './Pagination';

const STUDENTS_PER_PAGE = 10;

const getStatusClasses = (status: StudentAssignment['status']) => {
    switch (status) {
        case 'Graded': return 'bg-green-100 text-green-800';
        case 'Submitted': return 'bg-blue-100 text-blue-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Missing': case 'Late': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const TeacherAssignments: React.FC = () => {
    const { masterAssignments, studentAssignments, students, loading } = useData();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [isExemptModalOpen, setIsExemptModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedStudentAssignment, setSelectedStudentAssignment] = useState<StudentAssignment | null>(null);
    const [studentListCurrentPage, setStudentListCurrentPage] = useState<Record<string, number>>({});


    const handleGradeClick = (sa: StudentAssignment) => {
        setSelectedStudentAssignment(sa);
        setIsGradeModalOpen(true);
    };

    const handleExemptClick = (sa: StudentAssignment) => {
        setSelectedStudentAssignment(sa);
        setIsExemptModalOpen(true);
    };

    const getStudentName = (studentId: string) => students.find(s => s.id === studentId)?.name || 'Unknown Student';

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-dark-text">Manage Assignments</h1>
                <button onClick={() => setIsFormModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Assignment
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                     Array.from({length: 3}).map((_, i) => <SkeletonLoader key={i} className="h-16 w-full rounded-xl" />)
                ) : (
                    masterAssignments.map(ma => {
                        const assignedStudentsData = studentAssignments.filter(sa => sa.masterAssignmentId === ma.id);
                        const totalAssignedStudents = ma.assignedStudentCount || assignedStudentsData.length;
                        const totalStudentPages = Math.ceil(totalAssignedStudents / STUDENTS_PER_PAGE);
                        const currentPage = studentListCurrentPage[ma.id] || 1;

                        // Paginate the actual data we have
                        const paginatedStudentAssignments = assignedStudentsData.slice(
                            (currentPage - 1) * STUDENTS_PER_PAGE,
                            currentPage * STUDENTS_PER_PAGE
                        );
                        
                        return (
                        <div key={ma.id} className="bg-white rounded-xl shadow-lg border border-border-color overflow-hidden">
                            <button onClick={() => setExpandedId(expandedId === ma.id ? null : ma.id)} className="w-full text-left p-4 flex justify-between items-center hover:bg-light-bg">
                                <div>
                                    <h2 className="text-xl font-bold text-dark-text">{ma.title}</h2>
                                    <p className="text-sm text-medium-text">Due: {new Date(ma.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-medium-text">{totalAssignedStudents.toLocaleString()} students</span>
                                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${expandedId === ma.id ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            <AnimatePresence>
                                {expandedId === ma.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                        <div className="border-t border-border-color p-4">
                                            <ul className="divide-y divide-border-color">
                                                {paginatedStudentAssignments.map(sa => (
                                                    <li key={sa.id} className="p-3 flex justify-between items-center">
                                                        <span>{getStudentName(sa.studentId)}</span>
                                                        <div className="flex items-center space-x-3">
                                                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusClasses(sa.status)}`}>
                                                                {sa.isExempt ? 'Exempt' : sa.status}
                                                            </span>
                                                            {sa.status === 'Submitted' && <button onClick={() => handleGradeClick(sa)} className="text-green-600 hover:text-green-800 p-1 rounded-full bg-green-100"><CheckCircleIcon className="w-5 h-5"/></button>}
                                                            {!sa.isExempt && <button onClick={() => handleExemptClick(sa)} className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full bg-yellow-100"><UserMinusIcon className="w-5 h-5" /></button>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            {totalStudentPages > 1 && (
                                                <div className="mt-4">
                                                    <Pagination 
                                                        currentPage={currentPage}
                                                        totalPages={totalStudentPages}
                                                        onPageChange={(page) => setStudentListCurrentPage(prev => ({...prev, [ma.id]: page}))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )})
                )}
            </div>
            {isFormModalOpen && <AssignmentFormModal masterAssignment={null} onClose={() => setIsFormModalOpen(false)} />}
            {isGradeModalOpen && selectedStudentAssignment && <GradeModal studentAssignment={selectedStudentAssignment} onClose={() => setIsGradeModalOpen(false)} />}
            {isExemptModalOpen && selectedStudentAssignment && <ExemptModal studentAssignment={selectedStudentAssignment} onClose={() => setIsExemptModalOpen(false)} />}
        </div>
    );
};

export default TeacherAssignments;