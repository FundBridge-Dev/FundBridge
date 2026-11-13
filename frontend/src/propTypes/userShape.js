import PropTypes from "prop-types";

export const userShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
});
