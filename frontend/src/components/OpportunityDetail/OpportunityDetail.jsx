import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeadlineBadge from "../DeadlineBadge/DeadlineBadge.jsx";
import SaveOpportunityControl from "../SaveOpportunityControl/SaveOpportunityControl.jsx";
import {
  deleteOpportunity,
  getOpportunity,
} from "../../api/opportunitiesAPI.js";
import { useSavedOpportunities } from "../../hooks/useSavedOpportunities.js";
import { userShape } from "../../propTypes/userShape.js";
import {
  formatCurrency,
  formatDeadline,
} from "../../utils/formatOpportunity.js";
import "./OpportunityDetail.css";

export default function OpportunityDetail({ user = null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { savedByOpportunityId, save, changeStatus, remove } =
    useSavedOpportunities(user);
  const userId = user?.id;

  useEffect(() => {
    let ignore = false;
    getOpportunity(id)
      .then((data) => {
        if (!ignore) setOpportunity(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });
    return () => {
      ignore = true;
    };
  }, [id, userId]);

  async function handleDelete() {
    if (!window.confirm("Delete this opportunity? This can’t be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      await deleteOpportunity(id);
      navigate("/opportunities", { replace: true });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (error && !opportunity) {
    return (
      <section className="status-message">
        <p role="alert">{error}</p>
        <Link to="/opportunities">Back to opportunities</Link>
      </section>
    );
  }

  if (!opportunity) {
    return <p className="status-message">Loading…</p>;
  }

  const savedItem = savedByOpportunityId.get(opportunity._id) ?? null;

  return (
    <article className="opportunity-detail">
      <Link className="opportunity-detail__back" to="/opportunities">
        ← All opportunities
      </Link>

      <header className="opportunity-detail__header">
        <div className="opportunity-detail__badges">
          <DeadlineBadge status={opportunity.status} />
          {opportunity.isSynthetic && (
            <span className="opportunity-detail__demo">Demo data</span>
          )}
        </div>
        <h1>{opportunity.title}</h1>
        <p className="opportunity-detail__org">{opportunity.organization}</p>
      </header>

      <dl className="opportunity-detail__facts">
        <div>
          <dt>Type</dt>
          <dd>{opportunity.type}</dd>
        </div>
        <div>
          <dt>Industry</dt>
          <dd>{opportunity.industry}</dd>
        </div>
        <div>
          <dt>Startup stage</dt>
          <dd>{opportunity.stage}</dd>
        </div>
        <div>
          <dt>Funding amount</dt>
          <dd>{formatCurrency(opportunity.amount)}</dd>
        </div>
        <div>
          <dt>Equity</dt>
          <dd>{opportunity.equityRequired ? "Required" : "None"}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{formatDeadline(opportunity.deadline)}</dd>
        </div>
        <div>
          <dt>Posted by</dt>
          <dd>{opportunity.ownerName}</dd>
        </div>
      </dl>

      <section className="opportunity-detail__section">
        <h2>Eligibility</h2>
        <p>{opportunity.eligibility}</p>
      </section>

      <section className="opportunity-detail__section">
        <h2>About this opportunity</h2>
        <p>{opportunity.description}</p>
      </section>

      <div className="opportunity-detail__actions">
        <a
          className="opportunity-detail__apply"
          href={opportunity.applicationLink}
          target="_blank"
          rel="noreferrer"
        >
          Apply on the organization’s site
        </a>
        <SaveOpportunityControl
          isLoggedIn={Boolean(user)}
          savedItem={savedItem}
          onSave={(status) => save(opportunity._id, status)}
          onChangeStatus={(status) => changeStatus(savedItem._id, status)}
          onRemove={() => remove(savedItem._id)}
        />
      </div>

      {opportunity.isMine && (
        <section className="opportunity-detail__owner">
          <h2>Manage your post</h2>
          <div className="opportunity-detail__owner-actions">
            <Link
              className="opportunity-detail__edit"
              to={`/opportunities/${opportunity._id}/edit`}
            >
              Edit
            </Link>
            <button
              type="button"
              className="opportunity-detail__delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
          {error && (
            <p className="opportunity-detail__error" role="alert">
              {error}
            </p>
          )}
        </section>
      )}
    </article>
  );
}

OpportunityDetail.propTypes = {
  user: userShape,
};
