"use client";
import { Snippet } from "@/types";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import StarButton from "@/components/StarButton";

const TrashIco = () => (
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
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);
const UserIco = () => (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const ClockIco = () => (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
    const { data: session } = useSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/snippets/${snippet.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            toast.success("Snippet deleted");
            window.location.reload();
        } catch {
            toast.error("Error deleting");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? "var(--bg-elevated)" : "var(--bg-surface)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: hovered ? "rgba(249,98,159,0.35)" : "var(--border-default)",
                borderRadius: "var(--r-xl)",
                overflow: "hidden",
                transition: "all 0.2s",
                boxShadow: hovered ? "0 6px 24px rgba(249,98,159,0.1)" : "none",
                position: "relative",
            }}
        >
            {/* Pink accent top bar on hover */}
            <div
                style={{
                    height: 2,
                    background: "linear-gradient(90deg,#F9629F,rgba(249,98,159,0.3),transparent)",
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.2s",
                }}
            />

            <Link
                href={`/snippets/${snippet.id}`}
                style={{ textDecoration: "none", display: "block", padding: "16px 18px 14px" }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "var(--r-lg)",
                                background: "rgba(249,98,159,0.08)",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "rgba(249,98,159,0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Image
                                src={`/${snippet.language}.png`}
                                alt={snippet.language}
                                width={18}
                                height={18}
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                        <div>
                            <span
                                style={{
                                    display: "inline-block",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#F9629F",
                                    background: "rgba(249,98,159,0.08)",
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor: "rgba(249,98,159,0.18)",
                                    padding: "1px 8px",
                                    borderRadius: 100,
                                    fontFamily: "JetBrains Mono,monospace",
                                }}
                            >
                                {snippet.language}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    marginTop: 3,
                                    fontSize: 11,
                                    color: "var(--text-muted)",
                                    fontFamily: "Inter,sans-serif",
                                }}
                            >
                                <ClockIco />
                                {new Date(snippet.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <StarButton snippetId={snippet.id} />
                        {session?.user.id === snippet.userId && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "5px 7px",
                                    borderRadius: "var(--r)",
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor: "var(--border-subtle)",
                                    background: "transparent",
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                                className="hover:bg-[rgba(239,68,68,0.08)] hover:text-red-400 hover:border-[rgba(239,68,68,0.3)]"
                            >
                                {isDeleting ? (
                                    <span
                                        style={{
                                            width: 11,
                                            height: 11,
                                            borderWidth: 2,
                                            borderStyle: "solid",
                                            borderColor: "rgba(239,68,68,0.3)",
                                            borderTopColor: "#ef4444",
                                            borderRadius: "50%",
                                            animation: "spin 0.6s linear infinite",
                                            display: "inline-block",
                                        }}
                                    />
                                ) : (
                                    <TrashIco />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2
                    style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 6,
                        fontFamily: "Inter,sans-serif",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        transition: "color 0.15s",
                    }}
                    className={hovered ? "text-[#F9629F]" : ""}
                >
                    {snippet.title}
                </h2>

                {/* Author */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginBottom: 12,
                        fontFamily: "Inter,sans-serif",
                    }}
                >
                    <UserIco />
                    {snippet.userName}
                </div>

                {/* Code preview */}
                <div
                    style={{
                        background: "var(--bg-input)",
                        borderRadius: "var(--r-lg)",
                        padding: "8px 10px",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "var(--border-subtle)",
                    }}
                >
                    <pre
                        style={{
                            fontSize: 11,
                            color: "var(--text-secondary)",
                            margin: 0,
                            fontFamily: "JetBrains Mono,monospace",
                            lineHeight: 1.6,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical" as const,
                        }}
                    >
                        {snippet.code}
                    </pre>
                </div>
            </Link>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}
