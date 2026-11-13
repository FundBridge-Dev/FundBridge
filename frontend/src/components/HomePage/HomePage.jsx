import { Link } from "react-router-dom";
import { userShape } from "../../propTypes/userShape.js";
import "./HomePage.css";

export default function HomePage({ user = null }) {
  return (
    <div className="home">
      <section className="home__hero">
        <h1>Find funding. Find sponsors.</h1>
        <p className="home__lead">
          FundBridge brings grants, accelerators, fellowships, and pitch
          competitions together with sponsorship requests from student
          organizations and nonprofits.
        </p>
        <div className="home__actions">
          <Link className="home__cta" to="/opportunities">
            Browse funding opportunities
          </Link>
          <Link className="home__cta home__cta--secondary" to="/sponsorships">
            Browse sponsorship requests
          </Link>
        </div>
      </section>

      <div className="home__features">
        <article className="home__card">
          <h2>Opportunity Board</h2>
          <p>
            Founders search funding by type, industry, stage, amount, equity,
            and deadline, and see which ones are open, closing soon, or closed.
          </p>
        </article>
        <article className="home__card">
          <h2>Sponsorship Board</h2>
          <p>
            Organizations post events that need sponsors, with a progress bar
            showing how much support is still needed.
          </p>
        </article>
      </div>

      <section className="home__how" aria-labelledby="how-to-use">
        <h2 id="how-to-use">How to use FundBridge</h2>
        <ol>
          <li>
            Browse either board without an account. Use the search, filters, and
            sorting to narrow the list.
          </li>
          <li>
            <Link to="/register">Create an account</Link> to post funding
            opportunities or sponsorship requests. You can edit or delete only
            your own posts.
          </li>
          <li>
            Save opportunities and track them as planning to apply, applied, or
            skipped.
          </li>
          <li>
            Save sponsorship requests and track them as under review, contacted,
            approved, or declined.
          </li>
        </ol>
        {user && (
          <p className="home__welcome">You are logged in as {user.username}.</p>
        )}
      </section>

      <p className="home__note">
        All listings in this demo are synthetic data.
      </p>
    </div>
  );
}

HomePage.propTypes = {
  user: userShape,
};
