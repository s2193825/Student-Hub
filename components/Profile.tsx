import React from 'react';
import { Achievement, StudentAssignment } from '../types';
import { useData } from '../contexts/DataContext';
import SkeletonLoader from './SkeletonLoader';
import { TrophyIcon, StarIcon, TargetIcon } from './icons';

const achievementIcons: Record<Achievement['icon'], React.ReactNode> = {
    Trophy: <TrophyIcon className="w-8 h-8 text-yellow-500" />,
    Star: <StarIcon className="w-8 h-8 text-blue-500" />,
    Target: <TargetIcon className="w-8 h-8 text-red-500" />,
};

const Profile: React.FC = () => {
  const { user, assignments, loading } = useData();

  if (loading || !user) {
    return (
        <div className="p-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-border-color p-8">
                    <div className="flex items-center space-x-6">
                        <SkeletonLoader className="w-24 h-24 rounded-full" />
                        <div>
                            <SkeletonLoader className="h-10 w-48 mb-2" />
                            <SkeletonLoader className="h-6 w-24" />
                        </div>
                    </div>
                    <div className="mt-8 border-t border-border-color pt-6">
                        <SkeletonLoader className="h-8 w-1/3 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SkeletonLoader className="h-12 w-full" />
                            <SkeletonLoader className="h-12 w-full" />
                            <SkeletonLoader className="h-12 w-full" />
                            <SkeletonLoader className="h-12 w-full" />
                        </div>
                    </div>
                     <div className="mt-8 border-t border-border-color pt-6">
                        <SkeletonLoader className="h-8 w-1/3 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SkeletonLoader className="h-24 w-full" />
                            <SkeletonLoader className="h-24 w-full" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-border-color p-8 flex flex-col justify-center">
                    <SkeletonLoader className="h-8 w-1/2 mx-auto mb-6" />
                    <div className="space-y-6">
                        <SkeletonLoader className="h-24 w-full" />
                        <SkeletonLoader className="h-24 w-full" />
                        <SkeletonLoader className="h-24 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
  }

  const completedCount = assignments.filter(a => a.status === 'Graded' || a.status === 'Submitted').length;
  const completionRate = assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0;
  
  const gradedAssignments = assignments.filter(a => a.grade);
  const averageGrade = gradedAssignments.length > 0 ? 'A-' : 'N/A';

  return (
    <div className="p-8 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-border-color p-8">
          <div className="flex items-center space-x-6">
            <img 
              src={user.avatarUrl}
              alt="Student Avatar" 
              className="w-24 h-24 rounded-full border-4 border-primary shadow-md"
            />
            <div>
              <h2 className="text-3xl font-bold text-dark-text">{user.name}</h2>
              <p className="text-medium-text">Grade {user.grade}</p>
            </div>
          </div>
          <div className="mt-8 border-t border-border-color pt-6">
            <h3 className="text-xl font-semibold text-dark-text mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-medium-text">Full Name</label>
                <p className="text-dark-text font-semibold text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-medium-text">Email Address</label>
                <p className="text-dark-text font-semibold text-lg">{user.email}</p>
              </div>
               <div>
                <label className="text-sm font-medium text-medium-text">Student ID</label>
                <p className="text-dark-text font-semibold text-lg">{user.studentId}</p>
              </div>
               <div>
                <label className="text-sm font-medium text-medium-text">Enrollment Date</label>
                <p className="text-dark-text font-semibold text-lg">{user.enrollmentDate}</p>
              </div>
            </div>
             <button className="mt-8 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
                Edit Profile
              </button>
          </div>
           <div className="mt-8 border-t border-border-color pt-6">
                <h3 className="text-xl font-semibold text-dark-text mb-4">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.achievements.map(ach => (
                        <div key={ach.id} className="bg-light-bg p-4 rounded-lg flex items-center space-x-4">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                {achievementIcons[ach.icon]}
                            </div>
                            <div>
                                <p className="font-bold text-dark-text">{ach.name}</p>
                                <p className="text-sm text-medium-text">{ach.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-border-color p-8 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-dark-text mb-6 text-center">Academic Snapshot</h3>
            <div className="space-y-6">
                <div className="text-center bg-primary-light p-4 rounded-lg">
                    <p className="text-4xl font-bold text-primary">{completionRate}%</p>
                    <p className="text-medium-text font-medium">Completion Rate</p>
                </div>
                 <div className="text-center bg-green-100 p-4 rounded-lg">
                    <p className="text-4xl font-bold text-green-700">{averageGrade}</p>
                    <p className="text-medium-text font-medium">Average Grade</p>
                </div>
                 <div className="text-center bg-yellow-100 p-4 rounded-lg">
                    <p className="text-4xl font-bold text-yellow-700">{completedCount}</p>
                    <p className="text-medium-text font-medium">Assignments Submitted</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
