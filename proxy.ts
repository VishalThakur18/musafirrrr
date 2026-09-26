import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isTravellerRoute = path.startsWith("/traveller");
  const isOrganizerRoute = path.startsWith("/organizer");

  if (!user && (isTravellerRoute || isOrganizerRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && (isTravellerRoute || isOrganizerRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "traveller" && isOrganizerRoute) {
      return NextResponse.redirect(new URL("/traveller/dashboard", request.url));
    }
    if (profile?.role === "organizer" && isTravellerRoute) {
      return NextResponse.redirect(new URL("/organizer/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/traveller/:path*", "/organizer/:path*"],
};