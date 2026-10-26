"use client";
import ListEditor from "../../../components/dashboard/ListEditor";

const cfg = {
  title: "Stats",
  hint: "The small cards under your intro on the home page. Lower order shows first.",
  path: "/dashboard/stats",
  addLabel: "+ Add stat",
  blank: { value: "", label: "", order: 0 },
  itemTitle: (f) => [f.value, f.label].filter(Boolean).join(" "),
  fields: [
    { k: "value", l: "Big text (for example 3 or API + UI)" },
    { k: "label", l: "Small text under it" },
    { k: "order", l: "Order (lower shows first)", t: "number" },
  ],
};

export default function Page() {
  return <ListEditor cfg={cfg} />;
}
