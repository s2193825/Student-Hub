import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { User } from '../types';
import Pagination from './Pagination';
import SkeletonLoader from './SkeletonLoader';

const ITEMS_PER_PAGE = 10;

const StudentRoster: React.FC = () => {
  const { students, loading } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() =>
    students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [students, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-dark-text">Student Roster</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full max-w-sm p-2 border border-border-color rounded-lg"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-border-color overflow-hidden">
        <table className="w-full">
          <thead className="bg-light-bg">
            <tr>
              <th className="p-4 text-left font-semibold text-medium-text">Name</th>
              <th className="p-4 text-left font-semibold text-medium-text">Email</th>
              <th className="p-4 text-left font-semibold text-medium-text">Student ID</th>
              <th className="p-4 text-left font-semibold text-medium-text">Grade</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="p-4">
                    <SkeletonLoader className="h-8 w-full" />
                  </td>
                </tr>
              ))
            ) : (
              paginatedStudents.map(student => (
                <tr key={student.id} className="border-b border-border-color last:border-b-0">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />
                    <span className="font-semibold text-dark-text">{student.name}</span>
                  </td>
                  <td className="p-4 text-medium-text">{student.email}</td>
                  <td className="p-4 text-medium-text">{student.studentId}</td>
                  <td className="p-4 text-medium-text">{student.grade}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default StudentRoster;
