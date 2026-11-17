import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { APPLICATION_STATUS_OPTIONS } from "../../constants/opportunityOptions.js";
import { savedOpportunityShape } from "../../propTypes/opportunityShapes.js";
import "./SaveOpportunityControl.css";

export default function SaveOpportunityControl({
  isLoggedIn,
  savedItem = null,
  onSave,
  onChangeStatus,
  onRemove,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <Link
        className="save-control__login"
        to="/login"
        state={{ from: location.pathname }}
      >
        Log in to save
      </Link>
    );
  }

  if (!savedItem) {
    return (
      <div className="save-control">
        <button
          type="button"
          className="save-control__save"
          disabled={busy}
          onClick={() => run(() => onSave("planning"))}
        >
          Save
        </button>
        {error && (
          <p className="save-control__error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  const selectId = `save-status-${savedItem._id}`;

  return (
    <div className="save-control">
      <label className="save-control__label" htmlFor={selectId}>
        My status
      </label>
      <select
        id={selectId}
        value={savedItem.status}
        disabled={busy}
        onChange={(event) => run(() => onChangeStatus(event.target.value))}
      >
        {APPLICATION_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="save-control__remove"
        disabled={busy}
        onClick={() => run(onRemove)}
      >
        Remove
      </button>
      {error && (
        <p className="save-control__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

SaveOpportunityControl.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  savedItem: savedOpportunityShape,
  onSave: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
