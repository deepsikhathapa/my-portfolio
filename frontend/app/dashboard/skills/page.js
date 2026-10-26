"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

const COLORS = ["teal", "blue", "red", "purple", "amber", "sky"];

function Group({ g, onSaved, onDeleted }) {
  const [f, setF] = useState({ title: g.title, description: g.description, color: g.color, order: g.order, skills: g.skills.join("\n") });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save() {
    setMsg("Saving…");
    setErr({});
    const body = { ...f, order: Number(f.order) || 0, skills: f.skills.split("\n").map((s) => s.trim()).filter(Boolean) };
    try {
      const d = await api(g.id ? `/dashboard/skill-groups/${g.id}/` : "/dashboard/skill-groups/", { method: g.id ? "PATCH" : "POST", body });
      onSaved(g.key, d);
      setMsg("Saved.");
    } catch (x) {
      setErr(x.data && typeof x.data === "object" ? x.data : {});
      setMsg(x.status === 400 ? "Please fix the marked fields." : "Could not save. Is the backend running?");
    }
  }

  async function remove() {
    if (g.id) {
      if (!confirm(`Delete “${g.title}”?`)) return;
      try { await api(`/dashboard/skill-groups/${g.id}/`, { method: "DELETE" }); } catch { return setMsg("Could not delete."); }
    }
    onDeleted(g.key);
  }

  const e = (k) => err[k] && <small className="fielderr">{[].concat(err[k]).join(" ")}</small>;
  return (
    <div className={`card tint dash-box c-${f.color}`}>
      <div className="f2">
        <label>Group name<input value={f.title} onChange={set("title")} />{e("title")}</label>
        <label>Short description<input value={f.description} onChange={set("description")} />{e("description")}</label>
      </div>
      <div className="f2">
        <label>Color<select value={f.color} onChange={set("color")}>{COLORS.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Order (lower shows first)<input type="number" min="0" value={f.order} onChange={set("order")} />{e("order")}</label>
      </div>
      <label>Skills (one per line)<textarea rows={6} value={f.skills} onChange={set("skills")} />{e("skills")}</label>
      <div className="row-actions">
        <button className="btn solid" onClick={save}>Save</button>
        <button className="btn danger" onClick={remove}>Delete</button>
        <p role="status" className={msg === "Saved." ? "msg sent" : "msg error"}>{msg}</p>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    api("/dashboard/skill-groups/").then((d) => setGroups(d.map((g) => ({ ...g, key: g.id })))).catch(() => setGroups([]));
  }, []);

  if (!groups) return <p className="mut">Loading…</p>;

  const add = () => setGroups([...groups, { key: "new-" + Date.now(), title: "", description: "", color: "teal", order: groups.length, skills: [] }]);
  const saved = (key, d) => setGroups(groups.map((g) => (g.key === key ? { ...d, key } : g)));
  const removed = (key) => setGroups(groups.filter((g) => g.key !== key));

  return (
    <>
      <h1 className="dash-h">Skills</h1>
      <div className="dash-form">
        {groups.map((g) => <Group key={g.key} g={g} onSaved={saved} onDeleted={removed} />)}
        <button className="btn ghost" onClick={add}>+ Add skill group</button>
      </div>
    </>
  );
}
