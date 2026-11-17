import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { userShape } from "../../propTypes/userShape.js";

export default function RequireAuth({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

RequireAuth.propTypes = {
  user: userShape,
  children: PropTypes.node.isRequired,
};
