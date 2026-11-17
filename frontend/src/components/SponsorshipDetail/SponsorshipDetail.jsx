import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  deleteSponsorshipRequest,
  getSponsorshipRequest,
  saveSponsorshipRequest,
  updateAmountRaised,
} from "../../api/sponsorshipRequestsAPI.js";
import "./SponsorshipDetail.css";

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

function progressPercent(request) {
  if (!request?.budget) return 0;

  return Math.min(
    100,
    Math.round((request.amountRaised / request.budget) * 100)
  );
}

export default function SponsorshipDetail({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [amountRaised, setAmountRaised] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequest() {
      try {
        setLoading(true);
        setError("");

        const data = await getSponsorshipRequest(id);

        setRequest(data);
        setAmountRaised(String(data.amountRaised ?? 0));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id]);

  if (loading) return <p>Loading sponsorship request...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!request) return <p>Sponsorship request not found.</p>;

  const currentUserId = currentUser?._id || currentUser?.id;

  const isOwner =
    Boolean(currentUserId) &&
    Boolean(request.authorId) &&
    String(currentUserId) === String(request.authorId);

  const percent = progressPercent(request);

  async function handleAmountSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const updated = await updateAmountRaised(id, Number(amountRaised));

      setRequest(updated);
      setAmountRaised(String(updated.amountRaised));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      await saveSponsorshipRequest(id);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this sponsorship request?")) return;

    try {
      setSaving(true);
      setError("");

      await deleteSponsorshipRequest(id);
      navigate("/sponsorships");
    } catch (deleteError) {
      setError(deleteError.message);
      setSaving(false);
    }
  }

  return (
    <main className="sponsorship-detail">
      <Link to="/sponsorships">Back to sponsorship requests</Link>

      <h1>{request.eventType}</h1>

      {request.isDemo && <p>Demo data</p>}

      <dl>
        <dt>Event date</dt>
        <dd>{formatDate(request.eventDate)}</dd>

        <dt>Location</dt>
        <dd>{request.location}</dd>

        <dt>Audience size</dt>
        <dd>{request.audienceSize}</dd>

        <dt>Budget</dt>
        <dd>${request.budget.toLocaleString()}</dd>

        <dt>Sponsor benefits</dt>
        <dd>{request.sponsorBenefits}</dd>
      </dl>

      <p>{request.description}</p>

      <section aria-labelledby="funding-progress">
        <h2 id="funding-progress">Funding progress</h2>

        <progress value={request.amountRaised} max={request.budget}>
          {percent}%
        </progress>

        <p>
          ${request.amountRaised.toLocaleString()} raised of $
          {request.budget.toLocaleString()} ({percent}%)
        </p>
      </section>

      {isOwner && (
        <form onSubmit={handleAmountSubmit}>
          <label htmlFor="amount-raised">Update amount raised</label>

          <input
            id="amount-raised"
            type="number"
            min="0"
            max={request.budget}
            value={amountRaised}
            onChange={(event) => setAmountRaised(event.target.value)}
            required
          />

          <button type="submit" disabled={saving}>
            Update amount
          </button>
        </form>
      )}

      <div className="sponsorship-detail__actions">
        {isOwner && (
          <>
            <Link to={`/sponsorships/${request._id}/edit`}>
              Edit request details
            </Link>

            <button
              type="button"
              className="sponsorship-detail__delete"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete request
            </button>
          </>
        )}

        {currentUser && (
          <button
            type="button"
            className="sponsorship-detail__save"
            onClick={handleSave}
            disabled={saving}
          >
            Save request
          </button>
        )}
      </div>

      {error && <p role="alert">{error}</p>}
    </main>
  );
}

SponsorshipDetail.propTypes = {
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
  }),
};
