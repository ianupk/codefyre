import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/snippets/[id]/comments
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const comments = await db.snippetComment.findMany({
            where: { snippetId: id },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("[GET /api/snippets/[id]/comments]", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

// POST /api/snippets/[id]/comments — add comment
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content } = await req.json();
        if (!content?.trim()) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const comment = await db.snippetComment.create({
            data: {
                snippetId: id,
                userId: session.user.id,
                userName: session.user.name,
                content,
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("[POST /api/snippets/[id]/comments]", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}

// DELETE /api/snippets/[id]/comments?commentId=xxx
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await params;
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get("commentId");
        if (!commentId) {
            return NextResponse.json({ error: "commentId is required" }, { status: 400 });
        }

        const comment = await db.snippetComment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }
        if (comment.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await db.snippetComment.delete({ where: { id: commentId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DELETE /api/snippets/[id]/comments]", error);
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
