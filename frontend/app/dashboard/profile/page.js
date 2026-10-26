"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

const SHORT = [
  ["name", "Name"], ["role", "Job title"], ["company", "Company"], ["location", "Location"],
  ["email", "Email"], ["linkedin", "LinkedIn URL"], ["github", "GitHub URL"],
];
const HEAD = [["headline", "Headline (use | to split white and teal text)"], ["headline_ne", "Headline in Nepali"]];
const LONG = [
  ["intro", "Intro under the headline", 3], ["intro_ne", "Intro in Nepali", 3],
  ["about", "About me (blank line between paragraphs)", 6], ["about_ne", "About me in Nepali", 6],
];

export default function ProfilePage() {
  const [p, setP] = useState(null);
  const [files, setFiles] = useState({});
  const [fk, setFk] = useState(0);
  const [status, setStatus] = useState("");
  const [errs, setErrs] = useState({});

  useEffect(() => {
    api("/dashboard/profile/").then(setP).catch(() => setStatus("Could not load the profile."));
  }, []);

  if (!p) return <p className="mut">{status || "Loading…"}</p>;

  const set = (k) => (e) => setP({ ...p, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const field = (k, label, rows) => (
    <label key={k}>{label}
      {rows ? <textarea rows={rows} value={p[k] ?? ""} onChange={set(k)} /> : <input value={p[k] ?? ""} onChange={set(k)} />}
      {errs[k] && <small className="fielderr">{[].concat(errs[k]).join(" ")}</small>}
    </label>
  );

  async function save(e) {
    e.preventDefault();
    setStatus("Saving…");
    setErrs({});
    const fd = new FormData();
    [...SHORT, ...HEAD, ...LONG].forEach(([k]) => fd.append(k, p[k] ?? ""));
    fd.append("available", p.available ? "true" : "false");
    if (files.photo) fd.append("photo", files.photo);
    if (files.resume) fd.append("resume", files.resume);
    try {
      setP(await api("/dashboard/profile/", { method: "PATCH", body: fd }));
      setFiles({});
      setFk((n) => n + 1);
      setStatus("Saved. The site updates within about 30 seconds.");
    } catch (x) {
      setErrs(x.data && typeof x.data === "object" ? x.data : {});
      setStatus(x.status === 400 ? "Please fix the marked fields." : "Could not save. Is the backend running?");
    }
  }

  return (
    <>
      <h1 className="dash-h">Profile</h1>
      <form className="dash-form" onSubmit={save}>
        <div className="card dash-box">
          <h2 className="dash-h2">Photo and resume</h2>
          <div className="photo-row">
            {p.photo ? <img className="avatar-prev" src={p.photo} alt="Current photo" /> : <span className="avatar-prev empty">No photo</span>}
            <div className="stack">
              <label>Photo (square works best)<input key={"ph" + fk} type="file" accept="image/*" onChange={(e) => setFiles({ ...files, photo: e.target.files[0] })} />{errs.photo && <small className="fielderr">{[].concat(errs.photo).join(" ")}</small>}</label>
              <label>Resume (PDF)<input key={"re" + fk} type="file" accept=".pdf,application/pdf" onChange={(e) => setFiles({ ...files, resume: e.target.files[0] })} />{errs.resume && <small className="fielderr">{[].concat(errs.resume).join(" ")}</small>}</label>
              {p.resume && <a className="mut" href={p.resume} target="_blank" rel="noreferrer">Open current resume ↗</a>}
            </div>
          </div>
        </div>
        <div className="card dash-box">
          <h2 className="dash-h2">Details</h2>
          <div className="f2">{SHORT.map(([k, l]) => field(k, l))}</div>
          <label className="check"><input type="checkbox" checked={!!p.available} onChange={set("available")} /> Show the “available for QA roles” badge</label>
        </div>
        <div className="card dash-box">
          <h2 className="dash-h2">Text on the site</h2>
          {HEAD.map(([k, l]) => field(k, l))}
          {LONG.map(([k, l, r]) => field(k, l, r))}
        </div>
        <div className="savebar">
          <button className="btn solid">Save changes</button>
          <p role="status" className={status.startsWith("Saved") ? "msg sent" : "msg error"}>{status}</p>
        </div>
      </form>
    </>
  );
}
