"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteURL } from "@/lib/get-site-url";

type ActionResult = { error?: string; success?: boolean };

// ---------- Traveller signup ----------
// Does NOT insert into `profiles` here — there's no active session yet
// (email confirmation is required), so an insert would fail RLS. The
// signup details ride along as auth metadata instead, and the actual
// `profiles` row gets created in app/auth/callback/route.ts, once the
// person has clicked the email link and a real session exists.
export async function signupTraveller(formData: FormData): Promise<ActionResult> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Name, email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteURL()}/auth/callback`,
      data: {
        // Stored on auth.users.user_metadata immediately, confirmed or
        // not. The callback route reads this to build the profile.
        pending_role: "traveller",
        pending_full_name: fullName,
        pending_phone: phone,
      },
    },
  });

  if (error) {
    // Supabase returns a generic-looking message for "email already
    // registered" too, by design, so as not to leak which emails exist.
    return { error: error.message };
  }

  return { success: true };
}

// ---------- Organizer signup ----------
export async function signupOrganizer(formData: FormData): Promise<ActionResult> {
  const communityName = String(formData.get("communityName") ?? "").trim();
  const contactPerson = String(formData.get("contactPerson") ?? "").trim();
  const basedIn = String(formData.get("basedIn") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").replace(/\D/g, "");
  const instagram = String(formData.get("instagram") ?? "").trim().replace(/^@/, "");
  const bio = String(formData.get("bio") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!communityName || !email || !password || !whatsapp) {
    return { error: "Community name, email, password and WhatsApp number are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteURL()}/auth/callback`,
      data: {
        pending_role: "organizer",
        pending_community_name: communityName,
        pending_contact_person: contactPerson,
        pending_based_in: basedIn,
        pending_phone: phone,
        pending_whatsapp: whatsapp,
        pending_instagram: instagram,
        pending_bio: bio,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}