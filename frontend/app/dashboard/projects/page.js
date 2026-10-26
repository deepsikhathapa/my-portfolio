"use client";
import ListEditor from "../../../components/dashboard/ListEditor";

const COLORS = ["teal", "blue", "red", "purple", "amber", "sky"].map((c) => [c, c]);

const cfg = {
  title: "Projects",
  hint: "Lower order numbers show first.",
  path: "/dashboard/projects",
  addLabel: "+ Add project",
  blank: { title: "", summary: "", tags: "", url: "", color: "teal", order: 0 },
  itemTitle: (f) => f.title,
  fields: [
    { k: "title", l: "Project or system name" },
    { k: "tags", l: "Tags (separated by commas)" },
    { k: "color", l: "Card color", t: "select", options: COLORS },
    { k: "order", l: "Order (lower shows first)", t: "number" },
    { k: "url", l: "Link (optional, for example a GitHub repo)", wide: 1 },
    { k: "summary", l: "What you tested and what you found", t: "area", rows: 5, wide: 1 },
  ],
};

export default function Page() {
  return <ListEditor cfg={cfg} />;
}
