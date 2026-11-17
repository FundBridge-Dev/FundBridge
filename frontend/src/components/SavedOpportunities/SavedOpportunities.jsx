import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeadlineBadge from "../DeadlineBadge/DeadlineBadge.jsx";
import SaveOpportunityControl from "../SaveOpportunityControl/SaveOpportunityControl.jsx";
import { APPLICATION_STATUS_OPTIONS } from "../../constants/opportunityOptions.js";
import { useSavedOpportunities } from "../../hooks/useSavedOpportunities.js";
import { userShape } from "../../propTypes/userShape.js";
import {
  formatCurrency,
  formatDeadline,
} from "../../utils/formatOpportunity.js";
import "./SavedOpportunities.css";

const TABS = [{ value: "all", label: "All" }, ...APPLICATION_STATUS_OPTIONS];

export default function SavedOpportunities({ user = null }) {
  const [activeTab, setActiveTab] = useState("all");
  const { savedItems, loading, error, save, changeStatus, remove } =
    useSavedOpportunities(user);

  const counts = useMemo(() => {
    const result = { all: savedItems.length };
    for (const option of APPLICATION_STATUS_OPTIONS) {
      result[option.value] = savedItems.filter(
        (item) => item.status === option.value
      ).length;
    }
    return result;
  }, [savedItems]);

  const visibleItems =
    activeTab === "all"
      ? savedItems
      : savedItems.filter((item) => item.status === activeTab);

  return (
    <section className="saved-opportunities">
      <Link className="saved-opportunities__back" to="/opportunities">
        ← All opportunities
      </Link>
      <h1>My saved opportunities</h1>
      <p className="saved-opportunities__intro">
        Track each opportunity as planning to apply, applied, or skipped.
        Soonest deadlines are listed first.
      </p>

      <div
        className="saved-opportunities__tabs"
        role="group"
        aria-label="Filter by status"
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className="saved-opportunities__tab"
            aria-pressed={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label} ({counts[tab.value]})
          </button>
        ))}
      </div>

      {loading && <p className="status-message">Loading…</p>}
      {error && (
        <p className="saved-opportunities__error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && savedItems.length === 0 && (
        <p className="saved-opportunities__empty">
          You haven’t saved any opportunities yet.{" "}
          <Link to="/opportunities">Browse the Opportunity Board</Link> and
          select Save on anything that fits your startup.
        </p>
      )}

      {!loading && savedItems.length > 0 && visibleItems.length === 0 && (
        <p className="saved-opportunities__empty">
          Nothing has this status yet.
        </p>
      )}

      <ul className="saved-opportunities__list">
        {visibleItems.map((item) => (
          <li key={item._id} className="saved-opportunities__item">
            <div className="saved-opportunities__info">
              <DeadlineBadge status={item.opportunity.status} />
              <h2>
                <Link to={`/opportunities/${item.opportunity._id}`}>
                  {item.opportunity.title}
                </Link>
              </h2>
              <p>
                {item.opportunity.organization} ·{" "}
                {formatCurrency(item.opportunity.amount)} · Due{" "}
                {formatDeadline(item.opportunity.deadline)}
              </p>
            </div>
            <SaveOpportunityControl
              isLoggedIn
              savedItem={item}
              onSave={(status) => save(item.opportunityId, status)}
              onChangeStatus={(status) => changeStatus(item._id, status)}
              onRemove={() => remove(item._id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

SavedOpportunities.propTypes = {
  user: userShape,
};
