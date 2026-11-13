async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const body =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  return body;
}

export function getJSON(url) {
  return request(url);
}

export function postJSON(url, data) {
  return request(url, { method: "POST", body: JSON.stringify(data ?? {}) });
}

export function putJSON(url, data) {
  return request(url, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteJSON(url) {
  return request(url, { method: "DELETE" });
}
