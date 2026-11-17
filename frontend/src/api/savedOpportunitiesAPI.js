import { deleteJSON, getJSON, postJSON, putJSON } from "./http.js";

export function getSavedOpportunities() {
  return getJSON("/api/saved-opportunities");
}

export function saveOpportunity(opportunityId, status) {
  return postJSON("/api/saved-opportunities", { opportunityId, status });
}

export function updateSavedStatus(savedId, status) {
  return putJSON(`/api/saved-opportunities/${encodeURIComponent(savedId)}`, {
    status,
  });
}

export function removeSavedOpportunity(savedId) {
  return deleteJSON(`/api/saved-opportunities/${encodeURIComponent(savedId)}`);
}
