"use client";
import { useState } from "react";
import CommentContent from "./CommentContent";

export default function CommentForm({
    onSubmit,
    isSubmitting,
}: {
    onSubmit: (c: string) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [comment, setComment] = useState("");
    const [preview, setPreview] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const s = e.currentTarget.selectionStart,
                en = e.currentTarget.selectionEnd;
            const n = comment.substring(0, s) + "  " + comment.substring(en);
            setComment(n);
            setTimeout(() => {
                e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s + 2;
            }, 0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        await onSubmit(comment);
        setComment("");
        setPreview(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <div
                style={{
                    background: "var(--bg-elevated)",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "var(--border-default)",
                    borderRadius: "var(--r-lg)",
                    overflow: "hidden",
                }}
            >
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 12px 0" }}>
                    <button
                        type="button"
                        onClick={() => setPreview((p) => !p)}
                        style={{
                            fontSize: 12,
                            padding: "4px 10px",
                            borderRadius: "var(--r)",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: preview ? "rgba(249,98,159,0.3)" : "var(--border-default)",
                            background: preview ? "rgba(249,98,159,0.08)" : "transparent",
                            color: preview ? "#F9629F" : "var(--text-muted)",
                            cursor: "pointer",
                            fontFamily: "Inter,sans-serif",
                            transition: "all 0.15s",
                        }}
                    >
                        {preview ? "Edit" : "Preview"}
                    </button>
                </div>
                {preview ? (
                    <div
                        style={{
                            minHeight: 100,
                            padding: "10px 14px",
                            color: "var(--text-primary)",
                            fontSize: 13,
                            fontFamily: "Inter,sans-serif",
                        }}
                    >
                        <CommentContent content={comment} />
                    </div>
                ) : (
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add to the discussion…"
                        style={{
                            width: "100%",
                            background: "transparent",
                            borderWidth: 0,
                            color: "var(--text-primary)",
                            outline: "none",
                            resize: "none",
                            minHeight: 100,
                            padding: "10px 14px",
                            fontFamily: "JetBrains Mono,monospace",
                            fontSize: 13,
                            lineHeight: 1.6,
                            boxSizing: "border-box" as const,
                        }}
                    />
                )}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderTopWidth: 1,
                        borderTopStyle: "solid",
                        borderTopColor: "var(--border-subtle)",
                        background: "var(--bg-input)",
                    }}
                >
                    <span
                        style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            fontFamily: "Inter,sans-serif",
                        }}
                    >
                        Format code with ```language
                    </span>
                    <button
                        type="submit"
                        disabled={isSubmitting || !comment.trim()}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 16px",
                            background:
                                isSubmitting || !comment.trim()
                                    ? "rgba(249,98,159,0.3)"
                                    : "#F9629F",
                            borderWidth: 0,
                            borderRadius: "var(--r-lg)",
                            color: "white",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: isSubmitting || !comment.trim() ? "not-allowed" : "pointer",
                            fontFamily: "Inter,sans-serif",
                            transition: "all 0.15s",
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <span
                                    style={{
                                        width: 11,
                                        height: 11,
                                        borderWidth: 2,
                                        borderStyle: "solid",
                                        borderColor: "rgba(255,255,255,0.3)",
                                        borderTopColor: "white",
                                        borderRadius: "50%",
                                        animation: "spin 0.6s linear infinite",
                                        display: "inline-block",
                                    }}
                                />
                                Posting…
                            </>
                        ) : (
                            <>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Comment
                            </>
                        )}
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </form>
    );
}
