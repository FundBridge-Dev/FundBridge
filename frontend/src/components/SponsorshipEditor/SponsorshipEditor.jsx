import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSponsorshipRequest } from "../../api/sponsorshipRequestsAPI.js";
import SponsorshipForm from "../SponsorshipForm/SponsorshipForm.jsx";
import "./SponsorshipEditor.css";

export default function SponsorshipEditor() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadRequest() {
      try {
        const data = await getSponsorshipRequest(id);
        setRequest(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id]);

  if (loading) return <p>Loading sponsorship request...</p>;
  if (error) return <p role="alert">{error}</p>;

  return <SponsorshipForm key={request?._id || "new"} request={request} />;
}

SponsorshipEditor.propTypes = {};
