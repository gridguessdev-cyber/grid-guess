import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasAuthCookie = request.cookies
    .getAll()
    .find((c) =>
      c.name.includes(
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`
      )
    );
  if (hasAuthCookie) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/levels", request.url));
}

export const config = {
  matcher: ["/builder", "/my-levels"],
};
