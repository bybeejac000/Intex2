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
          className="btn me-2"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ backgroundColor: '#F0F2F5', border: 'none' }}
        >
          Previous
        </button>

        <div className="btn-group">
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              className="btn"
              style={{
                backgroundColor: pageNum === currentPage ? '#1976d2' : '#F0F2F5',
                color: pageNum === currentPage ? 'white' : '#00294D',
                border: 'none'
              }}
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
          className="btn ms-2"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ backgroundColor: '#F0F2F5', border: 'none' }}
        >
          Next
        </button>
      </div>

      <div className="d-flex align-items-center ms-3">
        <label className="me-2" style={{ color: '#FFFFFF', fontWeight: '250', textAlign: 'center', display: 'block' }}>
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
