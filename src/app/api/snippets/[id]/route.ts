import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/snippets/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const snippet = await db.snippet.findUnique({ where: { id } });
        if (!snippet) {
            return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
        }
        return NextResponse.json(snippet);
    } catch (error) {
        console.error("[GET /api/snippets/[id]]", error);
        return NextResponse.json({ error: "Failed to fetch snippet" }, { status: 500 });
    }
}

// DELETE /api/snippets/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const snippet = await db.snippet.findUnique({ where: { id } });
        if (!snippet) {
            return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
        }
        if (snippet.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await db.snippet.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DELETE /api/snippets/[id]]", error);
        return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
    }
}
