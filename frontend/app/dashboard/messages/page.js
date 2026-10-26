"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

export default function Messages() {
  const [list, setList] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api("/dashboard/messages/").then(setList).catch(() => setList([]));
  }, []);

  if (!list) return <p className="mut">Loading…</p>;

  async function setRead(m, is_read) {
    try {
      const d = await api(`/dashboard/messages/${m.id}/`, { method: "PATCH", body: { is_read } });
      setList((l) => l.map((x) => (x.id === m.id ? d : x)));
    } catch {}
  }
  async function remove(m) {
    if (!confirm("Delete this message?")) return;
    try {
      await api(`/dashboard/messages/${m.id}/`, { method: "DELETE" });
      setList((l) => l.filter((x) => x.id !== m.id));
    } catch {}
  }
  function show(m) {
    setOpen(open === m.id ? null : m.id);
    if (!m.is_read) setRead(m, true);
  }

  const unread = list.filter((m) => !m.is_read).length;
  return (
    <>
      <h1 className="dash-h">Messages</h1>
      <p className="mut hint">{list.length === 0 ? "Nothing yet. Messages from your contact form show up here." : `${unread} unread of ${list.length}.`}</p>
      <div className="dash-form">
        {list.map((m) => (
          <div key={m.id} className="card dash-box">
            <button className="mhead" onClick={() => show(m)} aria-expanded={open === m.id}>
              <span><b>{m.subject}</b>{!m.is_read && <span className="badge solid-b">New</span>}<br /><span className="mdate">{m.name} · {new Date(m.created).toLocaleString()}</span></span>
              <span>{open === m.id ? "−" : "+"}</span>
            </button>
            {open === m.id && (
              <>
                <p className="mbody">{m.message}</p>
                <div className="row-actions">
                  <a className="btn solid" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}>Reply to {m.email}</a>
                  <button className="btn ghost" onClick={() => setRead(m, !m.is_read)}>{m.is_read ? "Mark unread" : "Mark read"}</button>
                  <button className="btn danger" onClick={() => remove(m)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
