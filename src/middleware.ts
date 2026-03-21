import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile"];

// Routes only for unauthenticated users
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for Better Auth session cookie
    const sessionCookie =
        request.cookies.get("better-auth.session_token") ??
        request.cookies.get("__Secure-better-auth.session_token");

    const isAuthenticated = !!sessionCookie;

    // Redirect unauthenticated users away from protected routes
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
