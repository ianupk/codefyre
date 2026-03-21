import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/editor", "/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session =
        request.cookies.get("better-auth.session_token") ??
        request.cookies.get("__Secure-better-auth.session_token");
    const authed = !!session;

    // Protect editor, dashboard etc
    if (PROTECTED.some((r) => pathname.startsWith(r)) && !authed)
        return NextResponse.redirect(new URL("/", request.url));

    // If authed and hitting auth page, go to editor
    if (pathname === "/" && authed) return NextResponse.redirect(new URL("/editor", request.url));

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
