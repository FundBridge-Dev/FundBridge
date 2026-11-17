import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  createSponsorshipRequest,
  updateSponsorshipRequest,
} from "../../api/sponsorshipRequestsAPI.js";
import "./SponsorshipForm.css";

const EVENT_TYPES = [
  "Hackathon",
  "Workshop",
  "Demo Day",
  "Conference",
  "Career Fair",
  "Product Launch",
];

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function getInitialValues(request) {
  return {
    eventType: request?.eventType || "",
    eventDate: toDateInputValue(request?.eventDate),
    budget: request?.budget || "",
    audienceSize: request?.audienceSize || "",
    location: request?.location || "",
    sponsorBenefits: request?.sponsorBenefits || "",
    description: request?.description || "",
  };
}

export default function SponsorshipForm({ request, onSaved = () => {} }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => getInitialValues(request));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(request?._id);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...formData,
      budget: Number(formData.budget),
      audienceSize: Number(formData.audienceSize),
    };

    try {
      const savedRequest = isEditing
        ? await updateSponsorshipRequest(request._id, payload)
        : await createSponsorshipRequest(payload);

      onSaved(savedRequest);
      navigate(`/sponsorships/${savedRequest._id}`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="sponsorship-form-page">
      <header>
        <p className="eyebrow">FundBridge Sponsorship Board</p>
        <h1>
          {isEditing
            ? "Edit sponsorship request"
            : "Create sponsorship request"}
        </h1>
        <p>
          Share the event details sponsors need to decide whether they can help.
        </p>
      </header>

      <form className="sponsorship-form" onSubmit={handleSubmit}>
        {error && <p role="alert">{error}</p>}

        <label>
          Event type
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select an event type</option>
            {EVENT_TYPES.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </label>

        <label>
          Event date
          <input
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Sponsorship budget
          <input
            name="budget"
            type="number"
            min="1"
            step="1"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Expected audience size
          <input
            name="audienceSize"
            type="number"
            min="0"
            step="1"
            value={formData.audienceSize}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Boston, MA or Remote"
            required
          />
        </label>

        <label>
          Sponsor benefits
          <textarea
            name="sponsorBenefits"
            value={formData.sponsorBenefits}
            onChange={handleChange}
            placeholder="Describe the visibility or access sponsors receive"
            rows="4"
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event or project"
            rows="6"
            maxLength="1000"
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create request"}
          </button>

          <button type="button" onClick={() => navigate(-1)} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

SponsorshipForm.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string,
    eventType: PropTypes.string,
    eventDate: PropTypes.string,
    budget: PropTypes.number,
    audienceSize: PropTypes.number,
    location: PropTypes.string,
    sponsorBenefits: PropTypes.string,
    description: PropTypes.string,
  }),
  onSaved: PropTypes.func,
};
