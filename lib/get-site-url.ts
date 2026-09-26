// lib/get-site-url.ts
// Server actions have no `window`, so they can't read window.location.origin
// the way client components can. This gives every server action one place
// to get the right base URL, whether running locally or deployed.
//
// Set NEXT_PUBLIC_SITE_URL in your .env.local once you have a real domain,
// e.g. NEXT_PUBLIC_SITE_URL=https://musafirrrr.in — until then it falls
// back to localhost so local testing works with no extra setup.
export async function getSiteURL() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}