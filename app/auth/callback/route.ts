import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isSafeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//");
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";
  const next = isSafeNextPath(nextParam) ? nextParam : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Could not confirm your email. Try logging in again.")}`,
  );
}
