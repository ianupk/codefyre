import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/user — get current user + their starred snippets
export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const starredSnippets = await db.star.findMany({
            where: { userId: session.user.id },
            include: { snippet: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            user: session.user,
            starredSnippets: starredSnippets.map((s) => s.snippet),
        });
    } catch (error) {
        console.error("[GET /api/user]", error);
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}
