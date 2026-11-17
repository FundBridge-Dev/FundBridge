import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DeadlineBadge from "../DeadlineBadge/DeadlineBadge.jsx";
import SaveOpportunityControl from "../SaveOpportunityControl/SaveOpportunityControl.jsx";
import {
  opportunityShape,
  savedOpportunityShape,
} from "../../propTypes/opportunityShapes.js";
import {
  formatCurrency,
  formatDeadline,
} from "../../utils/formatOpportunity.js";
import "./OpportunityCard.css";

export default function OpportunityCard({
  opportunity,
  isLoggedIn,
  savedItem = null,
  onSave,
  onChangeStatus,
  onRemove,
}) {
  return (
    <article className="opportunity-card">
      <div className="opportunity-card__badges">
        <DeadlineBadge status={opportunity.status} />
        {opportunity.isSynthetic && (
          <span className="opportunity-card__demo">Demo data</span>
        )}
      </div>

      <h2 className="opportunity-card__title">
        <Link to={`/opportunities/${opportunity._id}`}>
          {opportunity.title}
        </Link>
      </h2>
      <p className="opportunity-card__org">{opportunity.organization}</p>

      <dl className="opportunity-card__facts">
        <div>
          <dt>Type</dt>
          <dd>{opportunity.type}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>{formatCurrency(opportunity.amount)}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{formatDeadline(opportunity.deadline)}</dd>
        </div>
        <div>
          <dt>Industry</dt>
          <dd>{opportunity.industry}</dd>
        </div>
        <div>
          <dt>Stage</dt>
          <dd>{opportunity.stage}</dd>
        </div>
        <div>
          <dt>Equity</dt>
          <dd>{opportunity.equityRequired ? "Required" : "None"}</dd>
        </div>
      </dl>

      <SaveOpportunityControl
        isLoggedIn={isLoggedIn}
        savedItem={savedItem}
        onSave={(status) => onSave(opportunity._id, status)}
        onChangeStatus={(status) => onChangeStatus(savedItem._id, status)}
        onRemove={() => onRemove(savedItem._id)}
      />
    </article>
  );
}

OpportunityCard.propTypes = {
  opportunity: opportunityShape.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  savedItem: savedOpportunityShape,
  onSave: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
