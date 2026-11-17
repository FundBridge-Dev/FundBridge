import PropTypes from "prop-types";
import {
  INDUSTRIES,
  OPPORTUNITY_TYPES,
  SORT_OPTIONS,
  STARTUP_STAGES,
  STATUS_FILTER_OPTIONS,
} from "../../constants/opportunityOptions.js";
import "./OpportunityFilters.css";

export default function OpportunityFilters({
  filters,
  isLoggedIn,
  onChange,
  onReset,
}) {
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    onChange(name, type === "checkbox" ? checked : value);
  }

  return (
    <form
      className="opportunity-filters"
      role="search"
      aria-label="Filter opportunities"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="opportunity-filters__field opportunity-filters__field--search">
        <label htmlFor="filter-q">Search</label>
        <input
          id="filter-q"
          name="q"
          type="search"
          placeholder="Title, organization, or keyword"
          value={filters.q}
          onChange={handleChange}
        />
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-type">Type</label>
        <select
          id="filter-type"
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="">Any type</option>
          {OPPORTUNITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-industry">Industry</label>
        <select
          id="filter-industry"
          name="industry"
          value={filters.industry}
          onChange={handleChange}
        >
          <option value="">Any industry</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-stage">Startup stage</label>
        <select
          id="filter-stage"
          name="stage"
          value={filters.stage}
          onChange={handleChange}
        >
          <option value="">Any stage</option>
          {STARTUP_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-min">Min amount ($)</label>
        <input
          id="filter-min"
          name="minAmount"
          type="number"
          min="0"
          step="1000"
          value={filters.minAmount}
          onChange={handleChange}
        />
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-max">Max amount ($)</label>
        <input
          id="filter-max"
          name="maxAmount"
          type="number"
          min="0"
          step="1000"
          value={filters.maxAmount}
          onChange={handleChange}
        />
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-equity">Equity</label>
        <select
          id="filter-equity"
          name="equity"
          value={filters.equity}
          onChange={handleChange}
        >
          <option value="">Any</option>
          <option value="none">No equity</option>
          <option value="required">Equity required</option>
        </select>
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-deadline">Deadline by</label>
        <input
          id="filter-deadline"
          name="deadlineBefore"
          type="date"
          value={filters.deadlineBefore}
          onChange={handleChange}
        />
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="opportunity-filters__field">
        <label htmlFor="filter-sort">Sort by</label>
        <select
          id="filter-sort"
          name="sort"
          value={filters.sort}
          onChange={handleChange}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="opportunity-filters__footer">
        {isLoggedIn && (
          <label className="opportunity-filters__checkbox">
            <input
              type="checkbox"
              name="mine"
              checked={filters.mine}
              onChange={handleChange}
            />
            Only my posts
          </label>
        )}
        <button
          type="button"
          className="opportunity-filters__reset"
          onClick={onReset}
        >
          Clear filters
        </button>
      </div>
    </form>
  );
}

OpportunityFilters.propTypes = {
  filters: PropTypes.shape({
    q: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    industry: PropTypes.string.isRequired,
    stage: PropTypes.string.isRequired,
    minAmount: PropTypes.string.isRequired,
    maxAmount: PropTypes.string.isRequired,
    equity: PropTypes.string.isRequired,
    deadlineBefore: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
    mine: PropTypes.bool.isRequired,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
