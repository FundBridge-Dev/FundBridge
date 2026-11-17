import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OpportunityCard from "../OpportunityCard/OpportunityCard.jsx";
import OpportunityFilters from "../OpportunityFilters/OpportunityFilters.jsx";
import OpportunityPagination from "../OpportunityPagination/OpportunityPagination.jsx";
import { searchOpportunities } from "../../api/opportunitiesAPI.js";
import { useSavedOpportunities } from "../../hooks/useSavedOpportunities.js";
import { userShape } from "../../propTypes/userShape.js";
import "./OpportunityBoard.css";

const PAGE_SIZE = 12;
const DEFAULT_FILTERS = {
  q: "",
  type: "",
  industry: "",
  stage: "",
  minAmount: "",
  maxAmount: "",
  equity: "",
  deadlineBefore: "",
  status: "upcoming",
  sort: "deadline-asc",
  mine: false,
};

export default function OpportunityBoard({ user = null }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { savedByOpportunityId, save, changeStatus, remove } =
    useSavedOpportunities(user);

  const isLoggedIn = Boolean(user);
  const mine = isLoggedIn && filters.mine;

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      searchOpportunities({ ...filters, mine, page, limit: PAGE_SIZE })
        .then((data) => {
          if (!ignore) setResult(data);
        })
        .catch((err) => {
          if (!ignore) setError(err.message);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [filters, mine, page]);

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="opportunity-board">
      <div className="opportunity-board__header">
        <div>
          <h1>Funding opportunities</h1>
          <p className="opportunity-board__intro">
            Grants, accelerators, fellowships, and pitch competitions for
            early-stage founders.
          </p>
        </div>
        <div className="opportunity-board__actions">
          {isLoggedIn ? (
            <>
              <Link
                className="opportunity-board__button"
                to="/opportunities/new"
              >
                Post an opportunity
              </Link>
              <Link
                className="opportunity-board__button opportunity-board__button--secondary"
                to="/opportunities/saved"
              >
                My saved opportunities
              </Link>
            </>
          ) : (
            <p>
              <Link to="/login" state={{ from: "/opportunities" }}>
                Log in
              </Link>{" "}
              to post or save opportunities.
            </p>
          )}
        </div>
      </div>

      <OpportunityFilters
        filters={filters}
        isLoggedIn={isLoggedIn}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <p className="opportunity-board__count" aria-live="polite">
        {loading
          ? "Loading…"
          : `${result.total.toLocaleString()} opportunities found`}
      </p>

      {error && (
        <p className="opportunity-board__error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && result.items.length === 0 && (
        <p className="opportunity-board__empty">
          No opportunities match these filters. Try clearing some of them.
        </p>
      )}

      <ul className="opportunity-board__list">
        {result.items.map((opportunity) => (
          <li key={opportunity._id}>
            <OpportunityCard
              opportunity={opportunity}
              isLoggedIn={isLoggedIn}
              savedItem={savedByOpportunityId.get(opportunity._id) ?? null}
              onSave={save}
              onChangeStatus={changeStatus}
              onRemove={remove}
            />
          </li>
        ))}
      </ul>

      <OpportunityPagination
        page={page}
        pages={result.pages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

OpportunityBoard.propTypes = {
  user: userShape,
};
