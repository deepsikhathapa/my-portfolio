const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Visiting /admin on the site sends you to the Django CMS.
module.exports = {
  async redirects() {
    return [
      { source: "/admin", destination: `${API}/admin/`, permanent: false },
      { source: "/admin/:path*", destination: `${API}/admin/:path*`, permanent: false },
    ];
  },
};
