import { deleteJSON, getJSON, postJSON, putJSON } from "./http.js";

export function searchOpportunities(params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (
      value !== "" &&
      value !== false &&
      value !== null &&
      value !== undefined
    ) {
      query.set(key, String(value));
    }
  }
  return getJSON(`/api/opportunities?${query}`);
}

export function getOpportunity(id) {
  return getJSON(`/api/opportunities/${encodeURIComponent(id)}`);
}

export function createOpportunity(data) {
  return postJSON("/api/opportunities", data);
}

export function updateOpportunity(id, data) {
  return putJSON(`/api/opportunities/${encodeURIComponent(id)}`, data);
}

export function deleteOpportunity(id) {
  return deleteJSON(`/api/opportunities/${encodeURIComponent(id)}`);
}
