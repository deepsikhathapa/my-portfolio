"use client";
import { useEffect, useState } from "react";
import { T, applyTexts } from "../lib/i18n";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IDS = ["home", "about", "skills", "experience", "projects", "contact"];
const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

function Title({ text, ey }) {
  const [a, b] = text.split("|");
  return (
    <div className="title">
      <p className="ey">{ey}</p>
      <h2>{a} {b && <span>{b}</span>}</h2>
    </div>
  );
}

export default function Portfolio({ data }) {
  const { profile: p, stats, skillGroups, experiences, projects, education } = data;
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle");
  const t = applyTexts(T[lang], data.texts, lang);
  const pick = (en, ne) => (lang === "ne" && ne ? ne : en);

  useEffect(() => {
    try {
      setTheme(localStorage.getItem("theme") || "dark");
      setLang(localStorage.getItem("lang") || "en");
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang === "ne" ? "ne" : "en";
    try { localStorage.setItem("theme", theme); localStorage.setItem("lang", lang); } catch {}
  }, [theme, lang]);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setProgress((h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    IDS.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  async function send(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await fetch(`${API}/api/contact/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!r.ok) throw new Error();
      setStatus("sent");
      setForm(EMPTY);
    } catch { setStatus("error"); }
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const [h1, h2] = pick(p.headline, p.headline_ne).split("|");
  const initials = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const about = pick(p.about, p.about_ne).split(/\n\s*\n/);
  const eds = education.filter((x) => x.kind === "education");
  const trs = education.filter((x) => x.kind === "training");

  return (
    <>
      <div className="progress" style={{ width: `${progress}%` }} />
      <header className="bar">
        <div className="wrap bar-in">
          <a className="logo" href="#home">{p.name.split(" ")[0]}<span>.{p.name.split(" ").slice(1).join(" ")}</span></a>
          <nav className={menu ? "open" : ""} aria-label="Main">
            {IDS.map((id) => (
              <a key={id} href={`#${id}`} className={active === id ? "on" : ""} onClick={() => setMenu(false)}>{t.nav[id]}</a>
            ))}
          </nav>
          <div className="tools">
            <button className="pill" onClick={() => setLang(lang === "en" ? "ne" : "en")}>{t.langBtn}</button>
            <button className="pill" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? t.light : t.dark}</button>
            <button className="pill burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="wrap hero">
          <div>
            {p.available && <span className="badge"><i /> {t.available}</span>}
            <p className="kicker">{p.role}</p>
            <h1>{h1}<br /><span>{h2}</span></h1>
            <p className="lede">{pick(p.intro, p.intro_ne)}</p>
            <div className="btns">
              <a className="btn solid" href="#projects">{t.cta1}</a>
              {p.resume && <a className="btn ghost" href={p.resume} target="_blank" rel="noreferrer">{t.cta2}</a>}
            </div>
            <div className="stats">
              {stats.map((s) => <div key={s.label} className="card"><b>{s.value}</b><small>{s.label}</small></div>)}
            </div>
          </div>
          <div className="portrait">
            <div className="ring">{p.photo ? <img src={p.photo} alt={p.name} /> : <span>{initials}</span>}</div>
            <em className="chip c1">{t.chip1}</em>
            <em className="chip c2">{t.chip2}</em>
            <strong className="name">{p.name}</strong>
          </div>
        </section>

        <section id="about" className="wrap sec">
          <Title ey={t.aboutEy} text={t.about} />
          <div className="two">
            <div className="prose">{about.map((x, i) => <p key={i}>{x}</p>)}</div>
            <div className="stack">
              <div className="card info"><small>{t.role}</small><h3>{p.role}</h3><p>{p.company}{p.location && ` · ${p.location}`}</p></div>
              {eds[0] && <div className="card info"><small>{t.edu}</small><h3>{eds[0].title}</h3><p>{eds[0].institution} · {eds[0].years}</p></div>}
            </div>
          </div>
        </section>

        <section id="skills" className="wrap sec">
          <Title ey={t.skillsEy} text={t.skills} />
          <div className="grid3">
            {skillGroups.map((g) => (
              <div key={g.title} className={`card tint c-${g.color}`}>
                <h3>{g.title}</h3><p>{g.description}</p>
                <ul className="tags">{g.skills.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="wrap sec">
          <Title ey={t.expEy} text={t.exp} />
          <div className="timeline">
            {experiences.map((x, i) => (
              <article key={i} className={`card tint dot c-${["teal", "blue", "purple"][i % 3]}`}>
                <div className="row"><small>{x.period}{x.location && ` · ${x.location}`}</small>{x.current && <span className="badge solid-b">{t.now}</span>}</div>
                <h3>{x.role}</h3><b className="co">{x.company}</b>
                <small className="lab">{t.resp}</small>
                <ul className="bul">{x.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="wrap sec">
          <Title ey={t.projEy} text={t.proj} />
          <div className="grid3">
            {projects.map((x) => (
              <article key={x.title} className={`card tint c-${x.color}`}>
                <h3>{x.title}</h3><p>{x.summary}</p>
                <ul className="tags">{x.tags.map((g) => <li key={g}>{g}</li>)}</ul>
                {x.url && <a className="more" href={x.url} target="_blank" rel="noreferrer">↗</a>}
              </article>
            ))}
          </div>
          <div className="gap" />
          <Title ey={t.eduEy} text={t.eduT} />
          <div className={trs.length ? "two even" : "one"}>
            {[[t.edu, eds, "teal"], [t.train, trs, "purple"]].map(([label, list, c]) => list.length > 0 && (
              <div key={label} className={`card tint c-${c}`}>
                <h3>{label}</h3>
                {list.map((x) => <div key={x.title} className="mini"><b>{x.title}</b><p>{x.institution}{x.years && ` · ${x.years}`}</p></div>)}
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="wrap sec">
          <Title ey={t.contactEy} text={t.contact} />
          <p className="center mut">{t.contactSub}</p>
          <form className="card form" onSubmit={send}>
            <div className="f2">
              <label>{t.f.name}<input required maxLength={120} value={form.name} onChange={set("name")} autoComplete="name" /></label>
              <label>{t.f.email}<input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></label>
            </div>
            <label>{t.f.subject}<input required maxLength={200} value={form.subject} onChange={set("subject")} /></label>
            <label>{t.f.message}<textarea required rows={6} value={form.message} onChange={set("message")} /></label>
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set("website")} />
            <button className="btn solid full" disabled={status === "sending"}>{status === "sending" ? t.f.sending : t.f.send}</button>
            <p role="status" className={`msg ${status}`}>{status === "sent" ? t.f.sent : status === "error" ? t.f.error : ""}</p>
          </form>
          <p className="links center">
            {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
            {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
          </p>
        </section>
      </main>
      <footer className="wrap foot">© {new Date().getFullYear()} {p.name}. {t.rights}</footer>
    </>
  );
}
