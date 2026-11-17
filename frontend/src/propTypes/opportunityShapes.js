import PropTypes from "prop-types";

export const opportunityShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  industry: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  equityRequired: PropTypes.bool.isRequired,
  eligibility: PropTypes.string.isRequired,
  deadline: PropTypes.string.isRequired,
  applicationLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ownerName: PropTypes.string,
  isSynthetic: PropTypes.bool,
  status: PropTypes.oneOf(["open", "closing-soon", "closed"]).isRequired,
  isMine: PropTypes.bool.isRequired,
});

export const savedOpportunityShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  opportunityId: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["planning", "applied", "skipped"]).isRequired,
  opportunity: opportunityShape,
});
