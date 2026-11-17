import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { searchSponsorshipRequests } from "../../api/sponsorshipRequestsAPI.js";
import "./SponsorshipBoard.css";

const EVENT_TYPES = [
  "Hackathon",
  "Workshop",
  "Demo Day",
  "Conference",
  "Career Fair",
  "Product Launch",
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getProgress(request) {
  if (!request.budget) return 0;

  return Math.min(
    100,
    Math.round((request.amountRaised / request.budget) * 100)
  );
}

export default function SponsorshipBoard({ pageSize = 12 }) {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("date");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      setLoading(true);
      setError("");

      try {
        const result = await searchSponsorshipRequests({
          q: query,
          eventType,
          location,
          sort,
          page,
          limit: pageSize,
        });

        if (!active) return;

        setRequests(result.items);
        setTotal(result.total);
        setPages(result.pages);
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      active = false;
    };
  }, [query, eventType, location, sort, page, pageSize]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
  }

  function handleEventTypeChange(event) {
    setPage(1);
    setEventType(event.target.value);
  }

  function handleLocationChange(event) {
    setPage(1);
    setLocation(event.target.value);
  }

  function handleSortChange(event) {
    setPage(1);
    setSort(event.target.value);
  }

  return (
    <main className="sponsorship-board">
      <header className="sponsorship-board__header">
        <p className="sponsorship-board__eyebrow">
          FundBridge Sponsorship Board
        </p>

        <h1>Find events and projects that need sponsors</h1>

        <p className="sponsorship-board__intro">
          Browse sponsorship requests from student organizations, nonprofits,
          and community groups.
        </p>

        <div className="sponsorship-board__actions">
          <Link
            className="sponsorship-board__primary-action"
            to="/sponsorships/new"
          >
            Create request
          </Link>

          <Link
            className="sponsorship-board__secondary-action"
            to="/saved-requests"
          >
            View saved requests
          </Link>
        </div>
      </header>

      <form className="sponsorship-board__filters" onSubmit={handleSearch}>
        <label>
          Search
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search events, locations, or benefits"
          />
        </label>

        <label>
          Event type
          <select value={eventType} onChange={handleEventTypeChange}>
            <option value="">All event types</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Boston, Remote, etc."
          />
        </label>

        <label>
          Sort by
          <select value={sort} onChange={handleSortChange}>
            <option value="date">Upcoming date</option>
            <option value="newest">Recently added</option>
            <option value="budget">Largest budget</option>
            <option value="audience">Largest audience</option>
          </select>
        </label>

        <button type="submit">Search</button>
      </form>

      <section aria-live="polite">
        <div className="sponsorship-board__heading">
          <h2>Sponsorship requests</h2>
          <p className="sponsorship-board__count">
            {total} {total === 1 ? "request" : "requests"} found
          </p>
        </div>

        {loading && <p>Loading sponsorship requests...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && requests.length === 0 && (
          <p>No sponsorship requests match your filters.</p>
        )}

        {!loading && !error && requests.length > 0 && (
          <ul className="sponsorship-board__list">
            {requests.map((request) => {
              const progress = getProgress(request);

              return (
                <li key={request._id}>
                  <article className="sponsorship-card">
                    <p className="sponsorship-card__type">
                      {request.eventType}
                    </p>

                    <h3>{request.location}</h3>

                    <p className="sponsorship-card__description">
                      {request.description}
                    </p>

                    <dl className="sponsorship-card__details">
                      <div>
                        <dt>Event date</dt>
                        <dd>{formatDate(request.eventDate)}</dd>
                      </div>

                      <div>
                        <dt>Budget</dt>
                        <dd>{formatCurrency(request.budget)}</dd>
                      </div>

                      <div>
                        <dt>Audience</dt>
                        <dd>{request.audienceSize} people</dd>
                      </div>
                    </dl>

                    <div className="sponsorship-card__progress">
                      <div className="sponsorship-card__progress-label">
                        <span>Funding progress</span>
                        <strong>{progress}%</strong>
                      </div>

                      <progress value={progress} max="100">
                        {progress}%
                      </progress>

                      <p>
                        {formatCurrency(request.amountRaised)} raised of{" "}
                        {formatCurrency(request.budget)}
                      </p>
                    </div>

                    <Link
                      className="sponsorship-card__link"
                      to={`/sponsorships/${request._id}`}
                    >
                      View request
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        {!loading && pages > 1 && (
          <nav
            className="sponsorship-board__pagination"
            aria-label="Sponsorship pages"
          >
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <p>
              Page {page} of {pages}
            </p>

            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={page === pages}
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

SponsorshipBoard.propTypes = {
  pageSize: PropTypes.number,
};
