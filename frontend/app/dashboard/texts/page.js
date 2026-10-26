"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { T, flatten } from "../../../lib/i18n";

const EN = Object.fromEntries(flatten(T.en));
const NE = Object.fromEntries(flatten(T.ne));
const KEYS = Object.keys(EN);
const LABELS = {
  available: "Badge above the headline", chip1: "Photo chip 1", chip2: "Photo chip 2",
  cta1: "Hero button 1", cta2: "Hero button 2 (resume)", aboutEy: "About: small label", about: "About: heading (| splits white and teal)",
  role: "About: role card label", edu: "Education label", train: "Training label",
  skillsEy: "Skills: small label", skills: "Skills: heading", expEy: "Experience: small label", exp: "Experience: heading",
  now: "Current job badge", resp: "Key responsibilities label", projEy: "Projects: small label", proj: "Projects: heading",
  eduEy: "Education: small label", eduT: "Education: heading", contactEy: "Contact: small label", contact: "Contact: heading",
  contactSub: "Contact: text under heading", light: "Light mode button", dark: "Dark mode button", langBtn: "Language button", rights: "Footer text",
};
const label = (k) => LABELS[k] || (k.startsWith("nav.") ? `Menu: ${k.slice(4)}` : k.startsWith("f.") ? `Contact form: ${k.slice(2)}` : k);
const GROUPS = [
  ["Page text and buttons", (k) => !k.includes(".")],
  ["Menu", (k) => k.startsWith("nav.")],
  ["Contact form", (k) => k.startsWith("f.")],
];

export default function TextsPage() {
  const [vals, setVals] = useState(null);
  const [ids, setIds] = useState({});
  const [orig, setOrig] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/dashboard/texts/").then((rows) => {
      const i = {}, o = {};
      rows.forEach((r) => { i[r.key] = r.id; o[r.key] = { en: r.en, ne: r.ne }; });
      const v = {};
      KEYS.forEach((k) => { v[k] = { en: (o[k] && o[k].en) || EN[k], ne: (o[k] && o[k].ne) || NE[k] }; });
      setIds(i); setOrig(o); setVals(v);
    }).catch(() => setMsg("Could not load. Is the backend running?"));
  }, []);

  if (!vals) return <p className="mut">{msg || "Loading…"}</p>;

  const set = (k, lang, v) => setVals({ ...vals, [k]: { ...vals[k], [lang]: v } });

  async function save() {
    setMsg("Saving…");
    let n = 0;
    try {
      const nextIds = { ...ids }, nextOrig = { ...orig };
      for (const k of KEYS) {
        const en = vals[k].en === EN[k] ? "" : vals[k].en;
        const ne = vals[k].ne === NE[k] ? "" : vals[k].ne;
        const o = orig[k] || { en: "", ne: "" };
        if (en === o.en && ne === o.ne) continue;
        if (!en && !ne) {
          if (ids[k]) await api(`/dashboard/texts/${ids[k]}/`, { method: "DELETE" });
          delete nextIds[k]; delete nextOrig[k];
        } else if (ids[k]) {
          await api(`/dashboard/texts/${ids[k]}/`, { method: "PATCH", body: { en, ne } });
          nextOrig[k] = { en, ne };
        } else {
          const d = await api("/dashboard/texts/", { method: "POST", body: { key: k, en, ne } });
          nextIds[k] = d.id; nextOrig[k] = { en, ne };
        }
        n++;
      }
      setIds(nextIds); setOrig(nextOrig);
      setMsg(n ? `Saved ${n} change${n > 1 ? "s" : ""}. The site updates within about 30 seconds.` : "Nothing changed.");
    } catch { setMsg("Could not save everything. Please try again."); }
  }

  return (
    <>
      <h1 className="dash-h">Site text</h1>
      <p className="mut hint">Every heading, button and label on the site. Change the English and the Nepali text, then save. Put the original text back to reset a line.</p>
      <div className="dash-form">
        {GROUPS.map(([title, test]) => (
          <div key={title} className="card dash-box">
            <h2 className="dash-h2">{title}</h2>
            {KEYS.filter(test).map((k) => (
              <div key={k} className="trow">
                <b>{label(k)}</b>
                <div className="f2">
                  <label>English<input value={vals[k].en} onChange={(e) => set(k, "en", e.target.value)} /></label>
                  <label>Nepali<input value={vals[k].ne} onChange={(e) => set(k, "ne", e.target.value)} /></label>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="savebar">
          <button className="btn solid" onClick={save}>Save all changes</button>
          <p role="status" className={msg.startsWith("Saved") ? "msg sent" : "msg"}>{msg}</p>
        </div>
      </div>
    </>
  );
}
