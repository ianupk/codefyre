"use client";
import { useState } from "react";
import CommentContent from "./CommentContent";

interface CommentProps {
    comment: {
        id: string;
        userId: string;
        userName: string;
        snippetId: string;
        content: string;
        createdAt: string;
    };
    onDelete: (id: string) => void;
    isDeleting: boolean;
    currentUserId?: string;
}

export default function Comment({ comment, currentUserId, isDeleting, onDelete }: CommentProps) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: hov ? "var(--bg-elevated)" : "var(--bg-input)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: hov ? "rgba(249,98,159,0.2)" : "var(--border-subtle)",
                borderRadius: "var(--r-lg)",
                padding: "14px 16px",
                transition: "all 0.15s",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: "rgba(249,98,159,0.1)",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "rgba(249,98,159,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#F9629F",
                            fontWeight: 700,
                            fontSize: 13,
                            fontFamily: "Inter,sans-serif",
                        }}
                    >
                        {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                fontFamily: "Inter,sans-serif",
                            }}
                        >
                            {comment.userName}
                        </p>
                        <p
                            style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                fontFamily: "Inter,sans-serif",
                            }}
                        >
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {comment.userId === currentUserId && (
                    <button
                        onClick={() => onDelete(comment.id)}
                        disabled={isDeleting}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "4px 6px",
                            background: "none",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "transparent",
                            borderRadius: "var(--r)",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            opacity: hov ? 1 : 0,
                            transition: "all 0.15s",
                        }}
                        className="hover:bg-[rgba(239,68,68,0.08)] hover:text-red-400 hover:border-[rgba(239,68,68,0.25)]"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                    </button>
                )}
            </div>
            <CommentContent content={comment.content} />
        </div>
    );
}
