"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import Image from "next/image";
import Link from "next/link";
import StarButton from "@/components/StarButton";
import CodeBlock from "../profile/_components/CodeBlock";

interface Execution {
    id: string;
    language: string;
    code: string;
    output: string | null;
    error: string | null;
    createdAt: string;
}
interface Snippet {
    id: string;
    title: string;
    language: string;
    code: string;
    createdAt: string;
}
interface Stats {
    totalExecutions: number;
    languagesCount: number;
    last24Hours: number;
    favoriteLanguage: string;
    mostStarredLanguage: string;
}

/* ── Inline SVGs ──────────────────────────────────────────────────────────── */
const Icons = {
    runs: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    ),
    clock: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    langs: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    star: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    play: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    ),
    chevDown: (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    chevRight: (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    ),
    loader: (
        <span
            style={{
                width: 12,
                height: 12,
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "rgba(249,98,159,0.3)",
                borderTopColor: "#F9629F",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
                display: "inline-block",
            }}
        />
    ),
    exec: (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    ),
    starred: (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    ok: (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
};

/* ── Stat card ────────────────────────────────────────────────────────────── */
function StatCard({
    icon,
    label,
    value,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent: string;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: hovered ? `${accent}40` : "rgba(255,255,255,0.08)",
                borderRadius: "var(--r-lg)",
                padding: "18px 20px",
                transition: "all 0.2s",
                cursor: "default",
                position: "relative" as const,
                overflow: "hidden" as const,
                boxShadow: hovered ? `0 8px 32px ${accent}18` : "none",
            }}
        >
            {/* Glow orb */}
            <div
                style={{
                    position: "absolute",
                    top: "-30%",
                    right: "-10%",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
                    pointerEvents: "none",
                    transition: "opacity 0.2s",
                    opacity: hovered ? 1 : 0,
                }}
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    color: hovered ? accent : "var(--text-muted)",
                    transition: "color 0.2s",
                }}
            >
                {icon}
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: "Inter,sans-serif",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.06em",
                    }}
                >
                    {label}
                </span>
            </div>
            <p
                style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    fontFamily: "Inter,sans-serif",
                    letterSpacing: "-0.03em",
                }}
            >
                {value}
            </p>
        </div>
    );
}

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [tab, setTab] = useState<"executions" | "starred">("executions");
    const [stats, setStats] = useState<Stats | null>(null);
    const [starred, setStarred] = useState<Snippet[]>([]);
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadAll = useCallback(async () => {
        const [s, e, u] = await Promise.all([
            fetch("/api/executions?stats=true").then((r) => r.json()),
            fetch("/api/executions?page=1&limit=8").then((r) => r.json()),
            fetch("/api/user").then((r) => r.json()),
        ]);
        setStats(s);
        setExecutions(e.executions);
        setHasMore(e.hasMore);
        setStarred(u.starredSnippets ?? []);
    }, []);

    useEffect(() => {
        if (!session && !isPending) {
            router.push("/sign-in");
            return;
        }
        if (session) loadAll();
    }, [session, isPending, router, loadAll]);

    const loadMore = async () => {
        setLoadingMore(true);
        const r = await fetch(`/api/executions?page=${page + 1}&limit=8`).then((r) => r.json());
        setExecutions((p) => [...p, ...r.executions]);
        setHasMore(r.hasMore);
        setPage((p) => p + 1);
        setLoadingMore(false);
    };

    if (isPending || !session) return null;

    const STATS = [
        {
            icon: Icons.runs,
            label: "Total runs",
            value: stats?.totalExecutions ?? "—",
            accent: "#F9629F",
        },
        {
            icon: Icons.clock,
            label: "Last 24 h",
            value: stats?.last24Hours ?? "—",
            accent: "#60a5fa",
        },
        {
            icon: Icons.langs,
            label: "Languages",
            value: stats?.languagesCount ?? "—",
            accent: "#34d399",
        },
        {
            icon: Icons.star,
            label: "Favourite",
            value: stats?.favoriteLanguage ?? "—",
            accent: "#fbbf24",
        },
    ];

    const tabBtnStyle = (active: boolean): React.CSSProperties => ({
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 16px",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        fontFamily: "Inter,sans-serif",
        background: "none",
        borderWidth: 0,
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        borderBottomColor: active ? "#F9629F" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-muted)",
        cursor: "pointer",
        marginBottom: -1,
        transition: "all 0.15s",
    });

    return (
        <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
            <NavigationHeader />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
                {/* User hero card */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px 20px",
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "rgba(255,255,255,0.08)",
                        borderRadius: "var(--r-xl)",
                        marginBottom: 20,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: 200,
                            height: 200,
                            borderRadius: "50%",
                            background:
                                "radial-gradient(circle, rgba(249,98,159,0.06) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />
                    <div
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#F9629F,#c73f7f)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 17,
                            color: "white",
                            flexShrink: 0,
                        }}
                    >
                        {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p
                            style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                fontFamily: "Inter,sans-serif",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {session.user.name}
                        </p>
                        <p
                            style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                fontFamily: "JetBrains Mono,monospace",
                                marginTop: 2,
                            }}
                        >
                            {session.user.email}
                        </p>
                    </div>
                    <div style={{ flex: 1 }} />
                    <Link
                        href="/editor"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: 13,
                            fontWeight: 700,
                            color: "white",
                            background: "#F9629F",
                            padding: "8px 18px",
                            borderRadius: "var(--r-lg)",
                            textDecoration: "none",
                            boxShadow: "0 0 16px rgba(249,98,159,0.35)",
                            transition: "all 0.2s",
                        }}
                        className="hover:opacity-90"
                    >
                        {Icons.play} Open editor
                    </Link>
                </div>

                {/* Stat cards grid */}
                <div
                    className="dash-stats-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    {STATS.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))}
                </div>

                {/* Tabs */}
                <div
                    style={{
                        borderBottomWidth: 1,
                        borderBottomStyle: "solid",
                        borderBottomColor: "var(--border-subtle)",
                        marginBottom: 0,
                        display: "flex",
                    }}
                >
                    <button
                        style={tabBtnStyle(tab === "executions")}
                        onClick={() => setTab("executions")}
                    >
                        {Icons.exec} Executions
                    </button>
                    <button
                        style={tabBtnStyle(tab === "starred")}
                        onClick={() => setTab("starred")}
                    >
                        {Icons.starred} Starred
                    </button>
                </div>

                {/* Tab content */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        backdropFilter: "blur(8px)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "var(--border-subtle)",
                        borderTopWidth: 0,
                        borderRadius: "0 0 var(--r-xl) var(--r-xl)",
                        padding: 16,
                        minHeight: 280,
                    }}
                >
                    {tab === "executions" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {executions.length === 0 && (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "48px 0",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    <div style={{ fontSize: 32, marginBottom: 10 }}>⚡</div>
                                    <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14 }}>
                                        No executions yet — run some code!
                                    </p>
                                </div>
                            )}
                            {executions.map((ex, i) => (
                                <div
                                    key={ex.id}
                                    style={{
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "var(--border-subtle)",
                                        borderRadius: "var(--r-lg)",
                                        overflow: "hidden",
                                        background: "var(--bg-surface)",
                                        transition: "border-color 0.15s",
                                    }}
                                    className="hover:border-[rgba(249,98,159,0.25)]"
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "9px 14px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            setExpandedId(expandedId === ex.id ? null : ex.id)
                                        }
                                    >
                                        <Image
                                            src={`/${ex.language}.png`}
                                            alt={ex.language}
                                            width={16}
                                            height={16}
                                            style={{ objectFit: "contain" }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: "var(--text-primary)",
                                                fontFamily: "JetBrains Mono,monospace",
                                            }}
                                        >
                                            {ex.language.toUpperCase()}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: "var(--text-muted)",
                                                fontFamily: "Inter,sans-serif",
                                            }}
                                        >
                                            {new Date(ex.createdAt).toLocaleString()}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                padding: "1px 8px",
                                                borderRadius: 100,
                                                background: ex.error
                                                    ? "rgba(239,68,68,0.1)"
                                                    : "rgba(34,197,94,0.1)",
                                                color: ex.error ? "#ef4444" : "#22c55e",
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderColor: ex.error
                                                    ? "rgba(239,68,68,0.25)"
                                                    : "rgba(34,197,94,0.25)",
                                                fontFamily: "Inter,sans-serif",
                                                fontWeight: 600,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            {ex.error ? (
                                                "✕ Error"
                                            ) : (
                                                <>
                                                    <span style={{ display: "flex" }}>
                                                        {Icons.ok}
                                                    </span>{" "}
                                                    OK
                                                </>
                                            )}
                                        </span>
                                        <div style={{ flex: 1 }} />
                                        <span
                                            style={{
                                                color: "var(--text-muted)",
                                                display: "flex",
                                                transition: "transform 0.2s",
                                                transform:
                                                    expandedId === ex.id
                                                        ? "rotate(180deg)"
                                                        : "none",
                                            }}
                                        >
                                            {Icons.chevDown}
                                        </span>
                                    </div>
                                    {expandedId === ex.id && (
                                        <div
                                            style={{
                                                padding: "0 14px 12px",
                                                borderTopWidth: 1,
                                                borderTopStyle: "solid",
                                                borderTopColor: "var(--border-subtle)",
                                                animation: "fadeIn 0.15s ease-out",
                                            }}
                                        >
                                            <div style={{ marginTop: 10 }}>
                                                <CodeBlock code={ex.code} language={ex.language} />
                                            </div>
                                            {(ex.output || ex.error) && (
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                        padding: "8px 12px",
                                                        background: "rgba(0,0,0,0.3)",
                                                        borderRadius: "var(--r-lg)",
                                                        borderWidth: 1,
                                                        borderStyle: "solid",
                                                        borderColor: ex.error
                                                            ? "rgba(239,68,68,0.2)"
                                                            : "rgba(34,197,94,0.2)",
                                                    }}
                                                >
                                                    <pre
                                                        style={{
                                                            margin: 0,
                                                            fontSize: 12,
                                                            color: ex.error ? "#ef4444" : "#22c55e",
                                                            whiteSpace: "pre-wrap",
                                                            lineHeight: 1.5,
                                                            fontFamily: "JetBrains Mono,monospace",
                                                        }}
                                                    >
                                                        {ex.error || ex.output}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {hasMore && (
                                <div style={{ textAlign: "center", paddingTop: 8 }}>
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        style={{
                                            fontSize: 13,
                                            color: "#F9629F",
                                            background: "rgba(249,98,159,0.08)",
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderColor: "rgba(249,98,159,0.25)",
                                            borderRadius: "var(--r-lg)",
                                            padding: "7px 20px",
                                            cursor: "pointer",
                                            fontFamily: "Inter,sans-serif",
                                            fontWeight: 600,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            transition: "all 0.15s",
                                        }}
                                        className="hover:bg-[rgba(249,98,159,0.15)]"
                                    >
                                        {loadingMore ? (
                                            Icons.loader
                                        ) : (
                                            <>{Icons.chevRight} Load more</>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "starred" && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                                gap: 12,
                            }}
                        >
                            {starred.length === 0 && (
                                <div
                                    style={{
                                        gridColumn: "1/-1",
                                        textAlign: "center",
                                        padding: "48px 0",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    <div style={{ fontSize: 32, marginBottom: 10 }}>⭐</div>
                                    <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14 }}>
                                        No starred snippets yet.
                                    </p>
                                </div>
                            )}
                            {starred.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/snippets/${s.id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        style={{
                                            background: "rgba(255,255,255,0.02)",
                                            backdropFilter: "blur(8px)",
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderColor: "var(--border-subtle)",
                                            borderRadius: "var(--r-lg)",
                                            padding: 14,
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                        className="hover:border-[rgba(249,98,159,0.3)] hover:bg-[rgba(249,98,159,0.04)]"
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 7,
                                                }}
                                            >
                                                <Image
                                                    src={`/${s.language}.png`}
                                                    alt={s.language}
                                                    width={15}
                                                    height={15}
                                                    style={{ objectFit: "contain" }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: "#F9629F",
                                                        background: "rgba(249,98,159,0.1)",
                                                        borderWidth: 1,
                                                        borderStyle: "solid",
                                                        borderColor: "rgba(249,98,159,0.2)",
                                                        padding: "1px 7px",
                                                        borderRadius: 100,
                                                        fontFamily: "JetBrains Mono,monospace",
                                                    }}
                                                >
                                                    {s.language}
                                                </span>
                                            </div>
                                            <div onClick={(e) => e.preventDefault()}>
                                                <StarButton snippetId={s.id} />
                                            </div>
                                        </div>
                                        <h3
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "var(--text-primary)",
                                                marginBottom: 6,
                                                fontFamily: "Inter,sans-serif",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {s.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: 11,
                                                color: "var(--text-muted)",
                                                fontFamily: "Inter,sans-serif",
                                            }}
                                        >
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
