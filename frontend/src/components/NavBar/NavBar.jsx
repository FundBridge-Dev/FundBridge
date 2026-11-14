import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { userShape } from "../../propTypes/userShape.js";
import "./NavBar.css";

export default function NavBar({ user = null, onLogout }) {
  return (
    <header className="navbar">
      <Link className="navbar__brand" to="/">
        FundBridge
      </Link>

      <nav aria-label="Main">
        <ul className="navbar__links">
          <li>
            <NavLink to="/opportunities">Opportunities</NavLink>
          </li>
          <li>
            <NavLink to="/sponsorships">Sponsorships</NavLink>
          </li>
        </ul>
      </nav>

      <div className="navbar__account">
        {user ? (
          <>
            <span className="navbar__user">Hi, {user.username}</span>
            <button type="button" className="navbar__button" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link className="navbar__button" to="/register">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

NavBar.propTypes = {
  user: userShape,
  onLogout: PropTypes.func.isRequired,
};
