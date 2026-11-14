import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="status-message">
      <h1>Page not found</h1>
      <p>
        <Link to="/">Go back to the home page</Link>
      </p>
    </section>
  );
}
