import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "ffj_session";

async function readSession(token: string | undefined): Promise<{ role: string } | null> {
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return { role: (payload.role as string) ?? "restaurant" };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const session = await readSession(request.cookies.get(COOKIE)?.value);
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isCandidate = pathname.startsWith("/candidate");

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Enforce role boundaries.
  if (isAdmin && session.role !== "restaurant") {
    return NextResponse.redirect(new URL("/candidate", request.url));
  }
  if (isCandidate && session.role !== "candidate") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/candidate/:path*"],
};
