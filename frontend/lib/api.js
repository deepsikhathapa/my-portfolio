export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const KEY = "dash_token";

export const getToken = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch {} };

// Calls the Django API with the dashboard login token. Throws an Error with .status on failure.
export async function api(path, { method = "GET", body } = {}) {
  const token = getToken();
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const headers = {};
  if (token) headers.Authorization = `Token ${token}`;
  if (body && !isForm) headers["Content-Type"] = "application/json";
  const r = await fetch(`${API}/api${path}`, { method, headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined });
  if (r.status === 401) {
    setToken(null);
    window.dispatchEvent(new Event("dash-expired"));
  }
  if (!r.ok) {
    let data = null;
    try { data = await r.json(); } catch {}
    const e = new Error((data && data.detail) || "Something went wrong.");
    e.status = r.status;
    e.data = data;
    throw e;
  }
  return r.status === 204 ? null : r.json();
}
