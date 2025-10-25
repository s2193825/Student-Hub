import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { StudentAssignment } from '../types';
import SkeletonLoader from './SkeletonLoader';
import StudyBuddy from './StudyBuddy';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusClasses = (status: StudentAssignment['status']) => {
  switch (status) {
    case 'Graded':
      return 'bg-green-100 text-green-800';
    case 'Submitted':
      return 'bg-blue-100 text-blue-800';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'Missing':
    case 'Late':
      return 'bg-red-100 text-red-800';
    case 'Not Started':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StudentAssignments: React.FC = () => {
  const { assignments, loading } = useData();
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);
  const [isStudyBuddyOpen, setIsStudyBuddyOpen] = useState(false);

  const openStudyBuddy = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
    setIsStudyBuddyOpen(true);
  };
  
  const handleAssignmentClick = (assignment: StudentAssignment) => {
    setSelectedAssignment(selectedAssignment?.id === assignment.id ? null : assignment);
  };


  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-dark-text mb-6">My Assignments</h1>
      <div className="bg-white rounded-xl shadow-lg border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <ul className="divide-y divide-border-color">
            {loading ? (
                Array.from({length: 5}).map((_, i) => (
                    <li key={i} className="p-4"><SkeletonLoader className="h-12 w-full" /></li>
                ))
            ) : (
                assignments.map((assignment) => (
              <li key={assignment.id}>
                <button onClick={() => handleAssignmentClick(assignment)} className="w-full text-left p-4 flex items-center space-x-4 hover:bg-light-bg focus:outline-none">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-dark-text">{assignment.title}</h3>
                      <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusClasses(assignment.status)}`}>
                        {assignment.isExempt ? 'Exempt' : assignment.status}
                      </span>
                    </div>
                    <p className="text-sm text-medium-text">{assignment.subject} &bull; Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                </button>
                <AnimatePresence>
                  {selectedAssignment?.id === assignment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-light-bg overflow-hidden"
                    >
                      <div className="p-6 border-t border-border-color">
                        <h4 className="font-bold text-dark-text mb-2">Instructions</h4>
                        <p className="text-medium-text whitespace-pre-wrap mb-4">{assignment.instructions}</p>
                        
                        {assignment.isExempt && (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-r-lg">
                                <p className="font-bold">This assignment is exempt.</p>
                                <p>Reason: {assignment.exemptionReason}</p>
                            </div>
                        )}

                        {assignment.grade && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-r-lg">
                                <p className="font-bold">Grade: {assignment.grade}</p>
                                <p className="mt-2"><span className="font-semibold">Feedback:</span> {assignment.feedback}</p>
                            </div>
                        )}

                        <div className="flex space-x-4">
                           <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                             Submit Assignment
                           </button>
                           <button onClick={() => openStudyBuddy(assignment)} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                             Ask Study Buddy
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )))}
          </ul>
        </div>
      </div>
      {isStudyBuddyOpen && selectedAssignment && <StudyBuddy assignment={selectedAssignment} onClose={() => setIsStudyBuddyOpen(false)} />}
    </div>
  );
};

export default StudentAssignments;