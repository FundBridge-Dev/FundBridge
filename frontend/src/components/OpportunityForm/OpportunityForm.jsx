import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createOpportunity,
  getOpportunity,
  updateOpportunity,
} from "../../api/opportunitiesAPI.js";
import {
  INDUSTRIES,
  OPPORTUNITY_TYPES,
  STARTUP_STAGES,
} from "../../constants/opportunityOptions.js";
import "./OpportunityForm.css";

const EMPTY_FORM = {
  title: "",
  organization: "",
  type: OPPORTUNITY_TYPES[0],
  industry: INDUSTRIES[0],
  stage: STARTUP_STAGES[0],
  amount: "",
  equityRequired: false,
  eligibility: "",
  deadline: "",
  applicationLink: "",
  description: "",
};

function toFormValues(opportunity) {
  return {
    title: opportunity.title,
    organization: opportunity.organization,
    type: opportunity.type,
    industry: opportunity.industry,
    stage: opportunity.stage,
    amount: String(opportunity.amount),
    equityRequired: opportunity.equityRequired,
    eligibility: opportunity.eligibility,
    deadline: opportunity.deadline.slice(0, 10),
    applicationLink: opportunity.applicationLink,
    description: opportunity.description,
  };
}

export default function OpportunityForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;
    let ignore = false;
    getOpportunity(id)
      .then((data) => {
        if (ignore) return;
        if (data.isMine) {
          setForm(toFormValues(data));
        } else {
          setLoadError("You can only edit opportunities you posted.");
        }
      })
      .catch((err) => {
        if (!ignore) setLoadError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id, isEdit]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      const saved = isEdit
        ? await updateOpportunity(id, payload)
        : await createOpportunity(payload);
      navigate(`/opportunities/${saved._id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="status-message">Loading…</p>;
  }

  if (loadError) {
    return (
      <section className="status-message">
        <p role="alert">{loadError}</p>
        <Link to="/opportunities">Back to opportunities</Link>
      </section>
    );
  }

  const cancelTo = isEdit ? `/opportunities/${id}` : "/opportunities";

  return (
    <section className="opportunity-form">
      <h1>{isEdit ? "Edit opportunity" : "Post a funding opportunity"}</h1>

      <form onSubmit={handleSubmit}>
        <div className="opportunity-form__field opportunity-form__field--wide">
          <label htmlFor="opp-title">Title</label>
          <input
            id="opp-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={120}
          />
        </div>

        <div className="opportunity-form__field opportunity-form__field--wide">
          <label htmlFor="opp-organization">Organization</label>
          <input
            id="opp-organization"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        <div className="opportunity-form__field">
          <label htmlFor="opp-type">Type</label>
          <select
            id="opp-type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {OPPORTUNITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="opportunity-form__field">
          <label htmlFor="opp-industry">Industry</label>
          <select
            id="opp-industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
          >
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div className="opportunity-form__field">
          <label htmlFor="opp-stage">Startup stage</label>
          <select
            id="opp-stage"
            name="stage"
            value={form.stage}
            onChange={handleChange}
          >
            {STARTUP_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div className="opportunity-form__field">
          <label htmlFor="opp-amount">Funding amount ($)</label>
          <input
            id="opp-amount"
            name="amount"
            type="number"
            min="0"
            max="100000000"
            step="1"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="opportunity-form__field">
          <label htmlFor="opp-deadline">Deadline</label>
          <input
            id="opp-deadline"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="opportunity-form__field opportunity-form__field--checkbox">
          <label htmlFor="opp-equity">
            <input
              id="opp-equity"
              name="equityRequired"
              type="checkbox"
              checked={form.equityRequired}
              onChange={handleChange}
            />
            Requires equity
          </label>
        </div>

        <div className="opportunity-form__field opportunity-form__field--wide">
          <label htmlFor="opp-link">Application link</label>
          <input
            id="opp-link"
            name="applicationLink"
            type="url"
            placeholder="https://"
            value={form.applicationLink}
            onChange={handleChange}
            required
          />
        </div>

        <div className="opportunity-form__field opportunity-form__field--wide">
          <label htmlFor="opp-eligibility">Eligibility requirements</label>
          <textarea
            id="opp-eligibility"
            name="eligibility"
            rows={3}
            value={form.eligibility}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
          />
        </div>

        <div className="opportunity-form__field opportunity-form__field--wide">
          <label htmlFor="opp-description">Description</label>
          <textarea
            id="opp-description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            required
            minLength={20}
            maxLength={3000}
          />
        </div>

        {error && (
          <p className="opportunity-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="opportunity-form__actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Post opportunity"}
          </button>
          <Link to={cancelTo}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}

OpportunityForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
};
