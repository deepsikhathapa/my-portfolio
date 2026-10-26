"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

function Item({ cfg, it, onSaved, onDeleted }) {
  const [f, setF] = useState(it.data);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState({});
  const set = (k, v) => setF({ ...f, [k]: v });

  async function save() {
    setMsg("Saving…");
    setErr({});
    const body = { ...f };
    cfg.fields.forEach((x) => { if (x.t === "number") body[x.k] = Number(body[x.k]) || 0; });
    try {
      const d = await api(it.id ? `${cfg.path}/${it.id}/` : `${cfg.path}/`, { method: it.id ? "PATCH" : "POST", body });
      onSaved(it.key, d);
      setMsg("Saved.");
    } catch (x) {
      setErr(x.data && typeof x.data === "object" ? x.data : {});
      setMsg(x.status === 400 ? "Please fix the marked fields." : "Could not save. Is the backend running?");
    }
  }

  async function remove() {
    if (it.id) {
      if (!confirm(`Delete “${cfg.itemTitle(f) || "this entry"}”?`)) return;
      try { await api(`${cfg.path}/${it.id}/`, { method: "DELETE" }); } catch { return setMsg("Could not delete."); }
    }
    onDeleted(it.key);
  }

  const input = (x) => {
    const v = f[x.k] ?? "";
    if (x.t === "area") return <textarea rows={x.rows || 4} value={v} onChange={(e) => set(x.k, e.target.value)} />;
    if (x.t === "select") return <select value={v} onChange={(e) => set(x.k, e.target.value)}>{x.options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}</select>;
    if (x.t === "number") return <input type="number" min="0" value={v} onChange={(e) => set(x.k, e.target.value)} />;
    return <input value={v} onChange={(e) => set(x.k, e.target.value)} />;
  };

  return (
    <div className="card dash-box">
      <h3>{cfg.itemTitle(f) || "New entry"}</h3>
      <div className="f2">
        {cfg.fields.map((x) => x.t === "check" ? (
          <label key={x.k} className="check"><input type="checkbox" checked={!!f[x.k]} onChange={(e) => set(x.k, e.target.checked)} /> {x.l}</label>
        ) : (
          <label key={x.k} style={x.wide ? { gridColumn: "1 / -1" } : undefined}>{x.l}{input(x)}
            {err[x.k] && <small className="fielderr">{[].concat(err[x.k]).join(" ")}</small>}
          </label>
        ))}
      </div>
      <div className="row-actions">
        <button className="btn solid" onClick={save}>Save</button>
        <button className="btn danger" onClick={remove}>Delete</button>
        <p role="status" className={msg === "Saved." ? "msg sent" : "msg error"}>{msg}</p>
      </div>
    </div>
  );
}

export default function ListEditor({ cfg }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api(cfg.path).then((d) => setItems(d.map((x) => ({ key: x.id, id: x.id, data: x })))).catch(() => setItems([]));
  }, []);

  if (!items) return <p className="mut">Loading…</p>;

  const add = () => setItems([...items, { key: "new-" + Date.now(), id: null, data: { ...cfg.blank, order: items.length } }]);
  const saved = (key, d) => setItems(items.map((i) => (i.key === key ? { ...i, id: d.id, data: d } : i)));
  const removed = (key) => setItems(items.filter((i) => i.key !== key));

  return (
    <>
      {cfg.title && <h1 className="dash-h">{cfg.title}</h1>}{cfg.heading && <h2 className="dash-h2">{cfg.heading}</h2>}
      {cfg.hint && <p className="mut hint">{cfg.hint}</p>}
      <div className="dash-form">
        {items.map((i) => <Item key={i.key} cfg={cfg} it={i} onSaved={saved} onDeleted={removed} />)}
        <button className="btn ghost" onClick={add}>{cfg.addLabel}</button>
      </div>
    </>
  );
}
