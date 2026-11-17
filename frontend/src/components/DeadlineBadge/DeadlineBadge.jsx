import PropTypes from "prop-types";
import { DEADLINE_STATUS_LABELS } from "../../constants/opportunityOptions.js";
import "./DeadlineBadge.css";

export default function DeadlineBadge({ status }) {
  return (
    <span className={`deadline-badge deadline-badge--${status}`}>
      {DEADLINE_STATUS_LABELS[status]}
    </span>
  );
}

DeadlineBadge.propTypes = {
  status: PropTypes.oneOf(Object.keys(DEADLINE_STATUS_LABELS)).isRequired,
};
