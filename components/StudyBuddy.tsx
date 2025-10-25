import React, { useState } from 'react';
import { getStudyHelp } from '../services/geminiService';
import { SparklesIcon, CloseIcon } from './icons';
import { StudentAssignment } from '../types';

interface StudyBuddyProps {
  assignment: StudentAssignment;
  onClose: () => void;
}

const StudyBuddy: React.FC<StudyBuddyProps> = ({ assignment, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [error, setError] = useState('');

  const handleGetHelp = async () => {
    setIsLoading(true);
    setError('');
    setHelpText('');
    try {
      const response = await getStudyHelp(assignment.instructions);
      setHelpText(response);
    } catch (err) {
      setError('Failed to get help. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-border-color flex justify-between items-center">
          <div className='flex items-center'>
            <SparklesIcon className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-dark-text ml-3">Study Buddy</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <p className="font-semibold text-medium-text">Assignment:</p>
          <h3 className="text-xl font-bold text-dark-text mb-2">{assignment.title}</h3>
          <p className="text-sm bg-gray-100 p-4 rounded-md text-medium-text whitespace-pre-wrap">{assignment.instructions}</p>

          {!helpText && !isLoading && (
            <div className="text-center my-8">
              <p className="text-medium-text mb-4">Stuck on the instructions? Let me help you break it down!</p>
              <button
                onClick={handleGetHelp}
                className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-transform transform hover:scale-105 shadow-lg flex items-center mx-auto"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Get Help from Study Buddy
              </button>
            </div>
          )}

          {isLoading && (
            <div className="my-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-medium-text">Thinking... I'll have some helpful tips for you in just a moment!</p>
            </div>
          )}
          
          {error && <p className="text-red-500 text-center my-8">{error}</p>}
          
          {helpText && (
            <div className="mt-6 prose prose-lg max-w-none bg-primary/5 p-6 rounded-lg">
                <p className="whitespace-pre-wrap font-sans text-dark-text">{helpText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyBuddy;
