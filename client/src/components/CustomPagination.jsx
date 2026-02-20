import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export function CustomPagination({ currentPage, totalPages, onPageChange }) {
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage !== 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>

        {/* Page -2 (only when on last page) */}
        {currentPage - 2 > 0 && currentPage === totalPages && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(currentPage - 2)}>
              {currentPage - 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Page -1 */}
        {currentPage - 1 > 0 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current Page */}
        <PaginationItem>
          <PaginationLink className="bg-(--primary-color) hover:bg-(--primary-color)">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Page +1 */}
        {currentPage + 1 <= totalPages && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Page +2 (only when on first page) */}
        {currentPage + 2 <= totalPages && currentPage === 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(currentPage + 2)}>
              {currentPage + 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage !== totalPages && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
