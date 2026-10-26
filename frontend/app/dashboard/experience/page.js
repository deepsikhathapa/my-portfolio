"use client";
import ListEditor from "../../../components/dashboard/ListEditor";

const cfg = {
  title: "Experience",
  hint: "Lower order numbers show first, so give your newest job 0.",
  path: "/dashboard/experiences",
  addLabel: "+ Add experience",
  blank: { role: "", company: "", period: "", location: "", current: false, bullets: "", order: 0 },
  itemTitle: (f) => [f.role, f.company].filter(Boolean).join(" · "),
  fields: [
    { k: "role", l: "Job title" },
    { k: "company", l: "Company" },
    { k: "period", l: "Dates (for example May 2026 – Present)" },
    { k: "location", l: "Location" },
    { k: "order", l: "Order (lower shows first)", t: "number" },
    { k: "current", l: "This is my current job", t: "check" },
    { k: "bullets", l: "What you did (one point per line)", t: "area", rows: 8, wide: 1 },
  ],
};

export default function Page() {
  return <ListEditor cfg={cfg} />;
}
