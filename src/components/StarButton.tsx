"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={filled ? "#ffa116" : "none"}
        stroke={filled ? "#ffa116" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default function StarButton({ snippetId }: { snippetId: string }) {
    const { data: session } = useSession();
    const [isStarred, setIsStarred] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/snippets/${snippetId}/star`)
            .then((r) => r.json())
            .then((d) => {
                setIsStarred(d.isStarred);
                setCount(d.starCount);
            })
            .catch(console.error);
    }, [snippetId]);

    const handleStar = async () => {
        if (!session || loading) return;
        setLoading(true);
        setIsStarred((p) => !p);
        setCount((p) => (isStarred ? p - 1 : p + 1));
        try {
            const d = await fetch(`/api/snippets/${snippetId}/star`, { method: "POST" }).then((r) =>
                r.json()
            );
            setIsStarred(d.isStarred);
            setCount(d.starCount);
        } catch {
            setIsStarred((p) => !p);
            setCount((p) => (isStarred ? p + 1 : p - 1));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleStar}
            disabled={!session || loading}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 9px",
                borderRadius: "var(--r)",
                background: isStarred ? "rgba(255,161,22,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isStarred ? "rgba(255,161,22,0.3)" : "var(--border-default)"}`,
                color: isStarred ? "var(--accent)" : "var(--text-muted)",
                cursor: session ? "pointer" : "default",
                transition: "all 0.15s",
                fontFamily: "Inter, sans-serif",
            }}
            className="hover:bg-[rgba(255,161,22,0.12)]"
        >
            <StarIcon filled={isStarred} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{count}</span>
        </button>
    );
}
