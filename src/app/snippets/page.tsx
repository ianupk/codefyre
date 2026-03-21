"use client";
import { useState, useEffect } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import SnippetCard from "./_components/SnippetCard";
import Image from "next/image";

interface Snippet {
    id: string;
    userId: string;
    title: string;
    language: string;
    code: string;
    userName: string;
    createdAt: string;
}

const SearchIco = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const GridIco = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);
const ListIco = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
    >
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

export default function SnippetsPage() {
    const [snippets, setSnippets] = useState<Snippet[] | null>(null);
    const [search, setSearch] = useState("");
    const [lang, setLang] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        fetch("/api/snippets")
            .then((r) => r.json())
            .then(setSnippets)
            .catch(console.error);
    }, []);

    const languages = snippets ? [...new Set(snippets.map((s) => s.language))].slice(0, 6) : [];
    const filtered = (snippets ?? []).filter(
        (s) =>
            (!search ||
                s.title.toLowerCase().includes(search.toLowerCase()) ||
                s.language.toLowerCase().includes(search.toLowerCase()) ||
                s.userName.toLowerCase().includes(search.toLowerCase())) &&
            (!lang || s.language === lang)
    );

    return (
        <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
            <NavigationHeader />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
                {/* Hero — not sticky, scrolls away normally */}
                <div style={{ marginBottom: 36, textAlign: "center" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 14px",
                            borderRadius: 100,
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "rgba(249,98,159,0.3)",
                            background: "rgba(249,98,159,0.07)",
                            fontSize: 12,
                            color: "#F9629F",
                            marginBottom: 16,
                            fontFamily: "JetBrains Mono,monospace",
                        }}
                    >
                        Community Code Library
                    </div>
                    <h1
                        style={{
                            fontSize: "clamp(1.8rem,4vw,2.6rem)",
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            lineHeight: 1.1,
                            marginBottom: 10,
                            fontFamily: "Inter,sans-serif",
                        }}
                    >
                        <span style={{ color: "var(--text-primary)" }}>Discover & Share </span>
                        <span style={{ color: "#F9629F" }}>Code Snippets</span>
                    </h1>
                    <p
                        style={{
                            fontSize: 15,
                            color: "var(--text-secondary)",
                            fontFamily: "Inter,sans-serif",
                        }}
                    >
                        Explore community code snippets across 10 languages
                    </p>
                </div>

                {/* ── Sticky search + filters ───────────────────────────────────── */}
                <div
                    style={{
                        position: "sticky",
                        top: 72 /* pill nav height (52px) + nav top padding (10px) + a little gap */,
                        zIndex: 40,
                        background: "var(--bg-base)",
                        paddingTop: 8,
                        paddingBottom: 14,
                        marginBottom: 4,
                        /* Soft fade shadow so cards slide under cleanly */
                        boxShadow: "0 8px 24px 4px var(--bg-base)",
                    }}
                >
                    {/* Search */}
                    <div style={{ position: "relative", marginBottom: 12 }}>
                        <span
                            style={{
                                position: "absolute",
                                left: 14,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--text-muted)",
                                pointerEvents: "none",
                                display: "flex",
                            }}
                        >
                            <SearchIco />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, language, or author…"
                            style={{
                                width: "100%",
                                padding: "12px 14px 12px 42px",
                                background: "var(--bg-surface)",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "var(--border-default)",
                                borderRadius: "var(--r-lg)",
                                color: "var(--text-primary)",
                                fontSize: 14,
                                outline: "none",
                                fontFamily: "Inter,sans-serif",
                                boxSizing: "border-box" as const,
                                transition: "border-color 0.15s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                        />
                    </div>

                    {/* Filters row */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap" as const,
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {languages.map((l) => (
                            <button
                                key={l}
                                onClick={() => setLang(lang === l ? null : l)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "5px 12px",
                                    borderRadius: "var(--r-lg)",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor:
                                        lang === l
                                            ? "rgba(249,98,159,0.4)"
                                            : "var(--border-default)",
                                    background:
                                        lang === l ? "rgba(249,98,159,0.1)" : "var(--bg-surface)",
                                    color: lang === l ? "#F9629F" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    fontFamily: "Inter,sans-serif",
                                }}
                                className="hover:border-[rgba(249,98,159,0.35)] hover:text-[#F9629F]"
                            >
                                <Image
                                    src={`/${l}.png`}
                                    alt={l}
                                    width={14}
                                    height={14}
                                    style={{ objectFit: "contain" }}
                                    unoptimized
                                />
                                {l}
                            </button>
                        ))}
                        {lang && (
                            <button
                                onClick={() => setLang(null)}
                                style={{
                                    fontSize: 12,
                                    color: "var(--text-muted)",
                                    background: "none",
                                    borderWidth: 0,
                                    cursor: "pointer",
                                    fontFamily: "Inter,sans-serif",
                                }}
                                className="hover:text-[var(--red)]"
                            >
                                ✕ clear
                            </button>
                        )}
                        <div
                            style={{
                                marginLeft: "auto",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "var(--text-muted)",
                                    fontFamily: "JetBrains Mono,monospace",
                                }}
                            >
                                {snippets === null ? "…" : `${filtered.length} snippets`}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor: "var(--border-default)",
                                    borderRadius: "var(--r)",
                                    overflow: "hidden",
                                }}
                            >
                                {(
                                    [
                                        ["grid", <GridIco key="g" />],
                                        ["list", <ListIco key="l" />],
                                    ] as const
                                ).map(([v, icon]) => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        style={{
                                            padding: "5px 8px",
                                            background:
                                                view === v ? "rgba(249,98,159,0.1)" : "transparent",
                                            borderWidth: 0,
                                            color: view === v ? "#F9629F" : "var(--text-muted)",
                                            cursor: "pointer",
                                            display: "flex",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* ── End sticky bar ────────────────────────────────────────────── */}

                {/* Grid */}
                {snippets === null ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
                            gap: 14,
                        }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    height: 180,
                                    borderRadius: "var(--r-xl)",
                                    background: "var(--bg-surface)",
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background:
                                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                                        animation: "shimmer 1.5s infinite",
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 0",
                            color: "var(--text-muted)",
                        }}
                    >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                        <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14 }}>
                            No snippets found
                        </p>
                    </div>
                ) : (
                    <div
                        className="snippets-grid"
                        style={{
                            display: "grid",
                            gap: 14,
                            gridTemplateColumns:
                                view === "grid" ? "repeat(auto-fill,minmax(280px,1fr))" : "1fr",
                            maxWidth: view === "list" ? 740 : "none",
                            margin: "0 auto",
                        }}
                    >
                        {filtered.map((s) => (
                            <SnippetCard key={s.id} snippet={s} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
