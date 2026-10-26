"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function Overview() {
  const [d, setD] = useState(null);

  useEffect(() => {
    Promise.all(["messages", "projects", "experiences", "skill-groups"].map((x) => api(`/dashboard/${x}/`)))
      .then(([m, p, e, s]) => setD({ m, p, e, s }))
      .catch(() => {});
  }, []);

  if (!d) return <p className="mut">Loading…</p>;
  const unread = d.m.filter((x) => !x.is_read).length;
  const cards = [["Unread messages", unread], ["Projects", d.p.length], ["Jobs", d.e.length], ["Skill groups", d.s.length]];

  return (
    <>
      <h1 className="dash-h">Overview</h1>
      <div className="dash-cards">
        {cards.map(([label, value]) => <div key={label} className="card"><b>{value}</b><small>{label}</small></div>)}
      </div>
      <h2 className="dash-h2">Latest messages</h2>
      {d.m.length === 0 ? (
        <p className="mut">No messages yet. They show up here when someone uses your contact form.</p>
      ) : (
        d.m.slice(0, 3).map((x) => (
          <div key={x.id} className="card msg-row">
            <b>{x.subject}</b>{!x.is_read && <span className="badge solid-b">New</span>}
            <p>{x.name} · {x.email}</p>
          </div>
        ))
      )}
    </>
  );
}
