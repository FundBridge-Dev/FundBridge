import PropTypes from "prop-types";
import "./OpportunityPagination.css";

export default function OpportunityPagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <nav className="opportunity-pagination" aria-label="Opportunity pages">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
      >
        Next
      </button>
    </nav>
  );
}

OpportunityPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
