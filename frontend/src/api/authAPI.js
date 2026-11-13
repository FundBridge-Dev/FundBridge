import { getJSON, postJSON } from "./http.js";

export async function getCurrentUser() {
  const { user } = await getJSON("/api/auth/me");
  return user;
}

export async function login(username, password) {
  const { user } = await postJSON("/api/auth/login", { username, password });
  return user;
}

export async function register(username, password) {
  const { user } = await postJSON("/api/auth/register", {
    username,
    password,
  });
  return user;
}

export function logout() {
  return postJSON("/api/auth/logout");
}
