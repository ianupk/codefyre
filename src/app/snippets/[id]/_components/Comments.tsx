"use client";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Link from "next/link";

interface CommentData {
    id: string;
    snippetId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
}

export default function Comments({ snippetId }: { snippetId: string }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<CommentData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        try {
            const r = await fetch(`/api/snippets/${snippetId}/comments`);
            setComments(await r.json());
        } catch (e) {
            console.error(e);
        }
    }, [snippetId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (content: string) => {
        setIsSubmitting(true);
        try {
            const r = await fetch(`/api/snippets/${snippetId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (!r.ok) throw new Error("Failed");
            await fetchComments();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        setDeletingId(commentId);
        try {
            const r = await fetch(`/api/snippets/${snippetId}/comments?commentId=${commentId}`, {
                method: "DELETE",
            });
            if (!r.ok) throw new Error("Failed");
            setComments((p) => p.filter((c) => c.id !== commentId));
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div
            style={{
                background: "var(--bg-surface)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "var(--border-default)",
                borderRadius: "var(--r-xl)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: "14px 20px",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontFamily: "Inter,sans-serif",
                    }}
                >
                    Discussion ({comments.length})
                </span>
            </div>
            <div style={{ padding: "16px 20px" }}>
                {session ? (
                    <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                ) : (
                    <div
                        style={{
                            background: "var(--bg-elevated)",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "var(--border-default)",
                            borderRadius: "var(--r-lg)",
                            padding: "20px 16px",
                            textAlign: "center",
                            marginBottom: 20,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--text-muted)",
                                marginBottom: 12,
                                fontFamily: "Inter,sans-serif",
                            }}
                        >
                            Sign in to join the discussion
                        </p>
                        <Link
                            href="/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "7px 18px",
                                background: "#F9629F",
                                borderRadius: "var(--r-lg)",
                                color: "white",
                                fontSize: 13,
                                fontWeight: 600,
                                textDecoration: "none",
                                fontFamily: "Inter,sans-serif",
                            }}
                        >
                            Sign in
                        </Link>
                    </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {comments.map((c) => (
                        <Comment
                            key={c.id}
                            comment={c}
                            onDelete={handleDelete}
                            isDeleting={deletingId === c.id}
                            currentUserId={session?.user.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
