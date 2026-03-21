"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
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

function Comments({ snippetId }: { snippetId: string }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<CommentData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/snippets/${snippetId}/comments`);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }, [snippetId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmitComment = async (content: string) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/snippets/${snippetId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error("Failed to add comment");

            await fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        setDeletingCommentId(commentId);
        try {
            const res = await fetch(
                `/api/snippets/${snippetId}/comments?commentId=${commentId}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to delete comment");

            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Something went wrong");
        } finally {
            setDeletingCommentId(null);
        }
    };

    return (
        <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Discussion ({comments.length})
                </h2>
            </div>

            <div className="p-6 sm:p-8">
                {session ? (
                    <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
                ) : (
                    <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
                        <p className="text-[#808086] mb-4">Sign in to join the discussion</p>
                        <Link
                            href="/sign-in"
                            className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors inline-block"
                        >
                            Sign In
                        </Link>
                    </div>
                )}

                <div className="space-y-6">
                    {comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            onDelete={handleDeleteComment}
                            isDeleting={deletingCommentId === comment.id}
                            currentUserId={session?.user.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Comments;
