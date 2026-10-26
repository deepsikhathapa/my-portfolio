import Portfolio from "../components/Portfolio";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default async function Page() {
  let data = null;
  try {
    const r = await fetch(`${API}/api/portfolio/`, { next: { revalidate: 30 } });
    if (r.ok) data = await r.json();
  } catch {}
  if (!data || !data.profile) {
    return (
      <main className="empty">
        <h1>Content is not ready</h1>
        <p>Start the Django API, then add a Profile in the admin at /admin.</p>
      </main>
    );
  }
  return <Portfolio data={data} />;
}
