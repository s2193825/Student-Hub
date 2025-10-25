import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { ClipboardListIcon, SparklesIcon } from './icons';

const AIPlanner: React.FC = () => {
    const [tasks, setTasks] = useState('');
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        if (!tasks.trim()) {
            setError('Please enter at least one task.');
            return;
        }
        setIsLoading(true);
        setError('');
        setPlan('');
        try {
            const response = await generateStudyPlan(tasks);
            setPlan(response);
        } catch (err) {
            setError('Failed to generate study plan. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 h-full">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-border-color p-8">
                <div className="flex items-center mb-6">
                    <ClipboardListIcon className="w-10 h-10 text-primary" />
                    <h1 className="text-3xl font-bold text-dark-text ml-4">AI Study Planner</h1>
                </div>
                <p className="text-medium-text mb-6">
                    Feeling overwhelmed? List your assignments, upcoming tests, and study topics below.
                    Our AI will create a customized study plan to help you stay on track.
                </p>

                <div className="bg-light-bg p-6 rounded-lg">
                    <label htmlFor="tasks" className="block text-lg font-semibold text-dark-text mb-2">
                        What do you need to work on?
                    </label>
                    <textarea
                        id="tasks"
                        value={tasks}
                        onChange={(e) => setTasks(e.target.value)}
                        placeholder="e.g.,- Finish Roman Empire essay- Study for Algebra test on Friday- Read chapter 5 of 'To Kill a Mockingbird'"
                        className="w-full h-32 p-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                    />
                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading}
                        className="mt-4 w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover disabled:bg-gray-400 transition-colors flex items-center justify-center shadow-md"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoading ? 'Generating Plan...' : 'Create My Study Plan'}
                    </button>
                </div>

                {isLoading && (
                    <div className="my-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-medium-text">Your personalized plan is being generated...</p>
                    </div>
                )}

                {plan && (
                    <div className="mt-8 border-t border-border-color pt-6">
                        <h2 className="text-2xl font-bold text-dark-text mb-4">Your Personalized Study Plan</h2>
                        <div className="prose prose-lg max-w-none bg-primary/5 p-6 rounded-lg whitespace-pre-wrap font-sans text-dark-text">
                           {plan}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIPlanner;