import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/snippets/[id]/star — get star count + whether current user starred it
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });

        const [starCount, isStarred] = await Promise.all([
            db.star.count({ where: { snippetId: id } }),
            session
                ? db.star.findUnique({
                      where: { userId_snippetId: { userId: session.user.id, snippetId: id } },
                  })
                : null,
        ]);

        return NextResponse.json({ starCount, isStarred: !!isStarred });
    } catch (error) {
        console.error("[GET /api/snippets/[id]/star]", error);
        return NextResponse.json({ error: "Failed to fetch star data" }, { status: 500 });
    }
}

// POST /api/snippets/[id]/star — toggle star
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const existing = await db.star.findUnique({
            where: { userId_snippetId: { userId: session.user.id, snippetId: id } },
        });

        if (existing) {
            await db.star.delete({
                where: { userId_snippetId: { userId: session.user.id, snippetId: id } },
            });
        } else {
            await db.star.create({ data: { userId: session.user.id, snippetId: id } });
        }

        const starCount = await db.star.count({ where: { snippetId: id } });
        return NextResponse.json({ starCount, isStarred: !existing });
    } catch (error) {
        console.error("[POST /api/snippets/[id]/star]", error);
        return NextResponse.json({ error: "Failed to toggle star" }, { status: 500 });
    }
}
