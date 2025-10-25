import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Simplified pagination logic for display
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return pageNumbers;
    }
    const pages = [];
    if (currentPage > 2) {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
    }
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const displayedPages = getPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-white border border-border-color text-dark-text hover:bg-light-bg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &larr; Prev
      </button>
      
      {displayedPages.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'string' ? (
            <span className="px-3 py-1 text-medium-text">{page}</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === page
                  ? 'bg-primary text-white font-bold border-primary'
                  : 'bg-white border-border-color text-dark-text hover:bg-light-bg'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-white border border-border-color text-dark-text hover:bg-light-bg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next &rarr;
      </button>
    </nav>
  );
};

export default Pagination;
