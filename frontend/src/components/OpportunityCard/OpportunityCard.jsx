import { Link } from "react-router-dom";
import DeadlineBadge from "../DeadlineBadge/DeadlineBadge.jsx";
import { opportunityShape } from "../../propTypes/opportunityShapes.js";
import {
  formatCurrency,
  formatDeadline,
} from "../../utils/formatOpportunity.js";
import "./OpportunityCard.css";

export default function OpportunityCard({ opportunity }) {
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
    </article>
  );
}

OpportunityCard.propTypes = {
  opportunity: opportunityShape.isRequired,
};
