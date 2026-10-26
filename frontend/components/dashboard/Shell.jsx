"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api, setToken } from "../../lib/api";

const NAV = [["/dashboard", "Overview"], ["/dashboard/profile", "Profile"], ["/dashboard/about", "About"], ["/dashboard/skills", "Skills"], ["/dashboard/experience", "Experience"], ["/dashboard/projects", "Projects"], ["/dashboard/stats", "Stats"], ["/dashboard/messages", "Messages"], ["/dashboard/texts", "Site text"]];

export default function Shell({ children }) {
  const [state, setState] = useState("checking");
  const [user, setUser] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const out = () => setState("out");
    window.addEventListener("dash-expired", out);
    api("/dashboard/me/").then((d) => { setUser(d.username); setState("in"); }).catch(out);
    return () => window.removeEventListener("dash-expired", out);
  }, []);

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const d = await api("/auth/login/", { method: "POST", body: form });
      setToken(d.token);
      setUser(d.username);
      setForm({ username: "", password: "" });
      setState("in");
    } catch (x) {
      setErr(x.status ? x.message : "Cannot reach the server. Is the backend running?");
    } finally { setBusy(false); }
  }

  async function logout() {
    try { await api("/dashboard/me/", { method: "DELETE" }); } catch {}
    setToken(null);
    setState("out");
  }

  if (state === "checking") return <div className="dash-login"><p className="mut">Loading…</p></div>;

  if (state === "out") {
    return (
      <div className="dash-login">
        <form className="card" onSubmit={login}>
          <h1 className="dash-h">Dashboard login</h1>
          <label>Username<input required autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
          <label>Password<input required type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <button className="btn solid full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
          <p role="alert" className="msg error">{err}</p>
          <a className="mut" href="/">← Back to site</a>
        </form>
      </div>
    );
  }

  return (
    <div className="dash">
      <aside>
        <div className="dash-brand">Dashboard<small>{user}</small></div>
        <div className="dash-nav">
          {NAV.map(([href, label]) => <Link key={href} href={href} className={path === href ? "on" : ""}>{label}</Link>)}
        </div>
        <div className="dash-foot">
          <a href="/" target="_blank" rel="noreferrer">Open site ↗</a>
          <a href="/admin">Django admin</a>
          <button onClick={logout}>Log out</button>
        </div>
      </aside>
      <section className="dash-main">{children}</section>
    </div>
  );
}
