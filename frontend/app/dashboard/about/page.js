"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import ListEditor from "../../../components/dashboard/ListEditor";

const edu = {
  heading: "Education and training",
  hint: "The first education entry also shows in the About section. Lower order shows first.",
  path: "/dashboard/education",
  addLabel: "+ Add education or training",
  blank: { kind: "education", title: "", institution: "", years: "", order: 0 },
  itemTitle: (f) => f.title,
  fields: [
    { k: "title", l: "Degree or course name" },
    { k: "institution", l: "School or institute" },
    { k: "years", l: "Years (for example 2022 – 2026)" },
    { k: "kind", l: "Type", t: "select", options: [["education", "Education"], ["training", "Training"]] },
    { k: "order", l: "Order (lower shows first)", t: "number" },
  ],
};

function AboutText() {
  const [f, setF] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/dashboard/profile/").then((p) => setF({ about: p.about || "", about_ne: p.about_ne || "" })).catch(() => setMsg("Could not load."));
  }, []);

  if (!f) return <p className="mut">{msg || "Loading…"}</p>;

  async function save() {
    setMsg("Saving…");
    try {
      await api("/dashboard/profile/", { method: "PATCH", body: f });
      setMsg("Saved.");
    } catch (x) {
      setMsg(x.status === 400 ? "Please check the text." : "Could not save. Is the backend running?");
    }
  }

  return (
    <div className="card dash-box">
      <h2 className="dash-h2">About text</h2>
      <label>About me (leave a blank line between paragraphs)<textarea rows={9} value={f.about} onChange={(e) => setF({ ...f, about: e.target.value })} /></label>
      <label>About me in Nepali<textarea rows={9} value={f.about_ne} onChange={(e) => setF({ ...f, about_ne: e.target.value })} /></label>
      <p className="mut">Your job title, company and location in the “Current role” card are edited under Profile.</p>
      <div className="row-actions">
        <button className="btn solid" onClick={save}>Save</button>
        <p role="status" className={msg === "Saved." ? "msg sent" : "msg error"}>{msg}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <h1 className="dash-h">About</h1>
      <div className="dash-form"><AboutText /></div>
      <div style={{ height: 36 }} />
      <ListEditor cfg={edu} />
    </>
  );
}
