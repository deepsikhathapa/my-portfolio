import { Outfit } from "next/font/google";
import "./globals.css";

const font = Outfit({ subsets: ["latin"], display: "swap" });
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// The browser tab title and search description come from your Profile in the dashboard.
export async function generateMetadata() {
  try {
    const r = await fetch(`${API}/api/portfolio/`, { next: { revalidate: 30 } });
    const p = (await r.json()).profile;
    if (p) return { title: `${p.name} | ${p.role}`, description: p.intro };
  } catch {}
  return { title: "Portfolio" };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={font.className}>{children}</body>
    </html>
  );
}
