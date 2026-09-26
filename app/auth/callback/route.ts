import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Fires when someone clicks the confirmation link in their email (or
// completes Google OAuth). This is the first point where a real session
// exists for a password signup, so it's where the `profiles` (and
// `organizers`) row actually gets created — not in the signup form.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const user = data.user;

  // Idempotent: if this link is clicked twice, or the person already
  // has a profile (e.g. logging in via Google after already signing up
  // with email), don't try to insert a duplicate row.
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const meta = user.user_metadata ?? {};
    const role = meta.pending_role === "organizer" ? "organizer" : "traveller";

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      role,
      full_name: role === "organizer" ? meta.pending_contact_person : meta.pending_full_name,
      phone: meta.pending_phone ?? null,
    });

    if (profileError) {
      // Don't block the redirect on this — send them home and let the
      // support flag in Settings (or you, checking Supabase directly)
      // catch a signup that didn't fully complete.
      console.error("Profile creation failed:", profileError.message);
    }

    if (role === "organizer" && !profileError) {
      const slug = await uniqueSlug(supabase, slugify(meta.pending_community_name ?? "organizer"));

      const { error: orgError } = await supabase.from("organizers").insert({
        user_id: user.id,
        slug,
        name: meta.pending_community_name ?? "",
        contact_person: meta.pending_contact_person ?? null,
        based_in: meta.pending_based_in ?? null,
        phone: meta.pending_phone ?? null,
        whatsapp_number: meta.pending_whatsapp ?? "",
        instagram_handle: meta.pending_instagram || null,
        bio: meta.pending_bio ?? null,
      });
      if (orgError) console.error("Organizer creation failed:", orgError.message);
    }
  }

  // Per the decision to land on the homescreen after confirming, not
  // straight into a dashboard.
  return NextResponse.redirect(`${origin}/`);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string
): Promise<string> {
  let slug = base || "organizer";
  let n = 2;
  // Auto-suffixes on collision instead of failing — see the earlier
  // "40 organizers" discussion on why this matters once signup is
  // self-serve rather than something you're watching happen.
  while (true) {
    const { data } = await supabase.from("organizers").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n++}`;
  }
}