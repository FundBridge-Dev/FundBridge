import { deleteJSON, getJSON, patchJSON, postJSON, putJSON } from "./http.js";

const BASE_URL = "/api/sponsorship-requests";

export function searchSponsorshipRequests(filters = {}) {
  const params = new URLSearchParams();

  const supportedFilters = [
    "q",
    "eventType",
    "location",
    "minBudget",
    "maxBudget",
    "minAudienceSize",
    "maxAudienceSize",
    "dateFrom",
    "dateTo",
    "sort",
    "page",
    "limit",
  ];

  for (const key of supportedFilters) {
    if (filters[key] !== undefined && filters[key] !== "") {
      params.set(key, filters[key]);
    }
  }

  return getJSON(`${BASE_URL}?${params.toString()}`);
}

export function getSponsorshipRequest(id) {
  return getJSON(`${BASE_URL}/${encodeURIComponent(id)}`);
}

export function createSponsorshipRequest(data) {
  return postJSON(BASE_URL, data);
}

export function updateSponsorshipRequest(id, data) {
  return putJSON(`${BASE_URL}/${encodeURIComponent(id)}`, data);
}

export function updateAmountRaised(id, amountRaised) {
  return patchJSON(`${BASE_URL}/${encodeURIComponent(id)}/amount-raised`, {
    amountRaised,
  });
}

export function deleteSponsorshipRequest(id) {
  return deleteJSON(`${BASE_URL}/${encodeURIComponent(id)}`);
}

export function getSavedRequests(filters = {}) {
  const params = new URLSearchParams();

  if (filters.page) {
    params.set("page", filters.page);
  }

  if (filters.limit) {
    params.set("limit", filters.limit);
  }

  return getJSON(`${BASE_URL}/saved?${params.toString()}`);
}

export function saveSponsorshipRequest(id) {
  return postJSON(`${BASE_URL}/${encodeURIComponent(id)}/save`, {});
}

export function updateSavedRequest(id, status) {
  return patchJSON(`${BASE_URL}/saved/${encodeURIComponent(id)}`, {
    status,
  });
}

export function deleteSavedRequest(id) {
  return deleteJSON(`${BASE_URL}/saved/${encodeURIComponent(id)}`);
}
