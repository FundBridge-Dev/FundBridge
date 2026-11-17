import { useEffect, useState } from "react";
import OpportunityCard from "../OpportunityCard/OpportunityCard.jsx";
import { searchOpportunities } from "../../api/opportunitiesAPI.js";
import "./OpportunityBoard.css";

const PAGE_SIZE = 12;

export default function OpportunityBoard() {
  const [result, setResult] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    searchOpportunities({
      status: "upcoming",
      sort: "deadline-asc",
      page: 1,
      limit: PAGE_SIZE,
    })
      .then((data) => {
        if (!ignore) setResult(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

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
      </div>

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
            <OpportunityCard opportunity={opportunity} />
          </li>
        ))}
      </ul>
    </section>
  );
}
