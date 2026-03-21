import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/snippets — fetch all snippets
export async function GET() {
    try {
        const snippets = await db.snippet.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(snippets);
    } catch (error) {
        console.error("[GET /api/snippets]", error);
        return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
    }
}

// POST /api/snippets — create a new snippet
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, language, code } = await req.json();

        if (!title || !language || !code) {
            return NextResponse.json(
                { error: "title, language and code are required" },
                { status: 400 }
            );
        }

        const snippet = await db.snippet.create({
            data: {
                title,
                language,
                code,
                userId: session.user.id,
                userName: session.user.name,
            },
        });

        return NextResponse.json(snippet, { status: 201 });
    } catch (error) {
        console.error("[POST /api/snippets]", error);
        return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
    }
}
