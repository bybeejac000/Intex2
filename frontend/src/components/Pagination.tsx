interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  // Helper function to create page numbers array with ellipsis
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];

    // Always add page 1
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always add last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add the page numbers with dots
    let l = null;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
      <div className="d-flex align-items-center">
        <button
          className="btn btn-outline-primary me-2"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        <div className="btn-group">
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              className={`btn ${
                pageNum === currentPage
                  ? 'btn-primary'
                  : pageNum === '...'
                  ? 'btn-secondary disabled'
                  : 'btn-outline-primary'
              }`}
              onClick={() => {
                if (typeof pageNum === 'number') {
                  onPageChange(pageNum);
                }
              }}
              disabled={pageNum === '...'}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          className="btn btn-outline-primary ms-2"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <div className="d-flex align-items-center ms-3">
        <label className="me-2">
          Results per page:
          <select
            className="form-select ms-2"
            value={pageSize}
            onChange={(p) => {
              onPageSizeChange(Number(p.target.value));
              onPageChange(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Pagination;
