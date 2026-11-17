import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteSavedRequest,
  getSavedRequests,
  updateSavedRequest,
} from "../../api/sponsorshipRequestsAPI.js";
import "./SavedRequests.css";

const DECISIONS = ["under review", "contacted", "approved", "declined"];

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export default function SavedRequests() {
  const [savedRequests, setSavedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSavedRequests() {
      try {
        setLoading(true);
        setError("");
        const data = await getSavedRequests();
        setSavedRequests(data.items ?? data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadSavedRequests();
  }, []);

  async function handleDecisionChange(savedId, decision) {
    try {
      setError("");
      const updated = await updateSavedRequest(savedId, decision);

      setSavedRequests((current) =>
        current.map((saved) =>
          saved._id === updated._id ? { ...saved, ...updated } : saved
        )
      );
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function handleRemove(savedId) {
    try {
      setError("");
      await deleteSavedRequest(savedId);
      setSavedRequests((current) =>
        current.filter((saved) => saved._id !== savedId)
      );
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  if (loading) return <p>Loading saved requests...</p>;

  return (
    <main className="saved-requests">
      <h1>Saved sponsorship requests</h1>

      {error && <p role="alert">{error}</p>}

      {savedRequests.length === 0 ? (
        <p>You have not saved any sponsorship requests yet.</p>
      ) : (
        <ul>
          {savedRequests.map((saved) => {
            const request = saved.request ?? saved;

            return (
              <li key={saved._id}>
                <h2>
                  <Link to={`/sponsorships/${request._id}`}>
                    {request.eventType}
                  </Link>
                </h2>

                <p>
                  {request.location} · {formatDate(request.eventDate)}
                </p>

                <label htmlFor={`decision-${saved._id}`}>
                  Partnership decision
                </label>

                <select
                  id={`decision-${saved._id}`}
                  value={saved.decision || "under review"}
                  onChange={(event) =>
                    handleDecisionChange(saved._id, event.target.value)
                  }
                >
                  {DECISIONS.map((decision) => (
                    <option key={decision} value={decision}>
                      {decision}
                    </option>
                  ))}
                </select>

                <button type="button" onClick={() => handleRemove(saved._id)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

SavedRequests.propTypes = {};
