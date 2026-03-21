"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Editor } from "@monaco-editor/react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import Comments from "./_components/Comments";
import StarButton from "@/components/StarButton";
import Image from "next/image";
import toast from "react-hot-toast";

interface Snippet {
    id: string;
    title: string;
    language: string;
    code: string;
    userName: string;
    createdAt: string;
}

const CopyIco = () => (
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
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);
const CheckIco = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const UserIco = () => (
    <svg
        width="13"
        height="13"
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
const CalIco = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const MsgIco = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={async () => {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                toast.success("Copied!");
                setTimeout(() => setCopied(false), 2000);
            }}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                background: "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "var(--border-default)",
                borderRadius: "var(--r)",
                color: copied ? "var(--green)" : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "Inter,sans-serif",
                transition: "all 0.15s",
            }}
            className="hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]"
        >
            {copied ? <CheckIco /> : <CopyIco />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

export default function SnippetDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`/api/snippets/${id}`).then((r) => r.json()),
            fetch(`/api/snippets/${id}/comments`).then((r) => r.json()),
        ])
            .then(([s, c]) => {
                setSnippet(s);
                setCommentCount(c.length);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading)
        return (
            <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
                <NavigationHeader />
                <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
                    {[200, 500, 300].map((h, i) => (
                        <div
                            key={i}
                            style={{
                                height: h,
                                background: "var(--bg-surface)",
                                borderRadius: "var(--r-xl)",
                                marginBottom: 16,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "var(--border-subtle)",
                            }}
                        />
                    ))}
                </div>
            </div>
        );

    if (!snippet)
        return (
            <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
                <NavigationHeader />
                <div
                    style={{
                        textAlign: "center",
                        padding: "80px 20px",
                        color: "var(--text-muted)",
                        fontFamily: "Inter,sans-serif",
                    }}
                >
                    Snippet not found
                </div>
            </div>
        );

    return (
        <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
            <NavigationHeader />
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}>
                {/* Header card */}
                <div
                    style={{
                        background: "var(--bg-surface)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "var(--border-default)",
                        borderRadius: "var(--r-xl)",
                        padding: "22px 24px",
                        marginBottom: 16,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background:
                                "linear-gradient(90deg,#F9629F,rgba(249,98,159,0.3),transparent)",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 16,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "var(--r-lg)",
                                    background: "rgba(249,98,159,0.08)",
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor: "rgba(249,98,159,0.18)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    src={`/${snippet.language}.png`}
                                    alt={snippet.language}
                                    width={26}
                                    height={26}
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <h1
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 800,
                                        color: "var(--text-primary)",
                                        fontFamily: "Inter,sans-serif",
                                        letterSpacing: "-0.02em",
                                        marginBottom: 8,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {snippet.title}
                                </h1>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap" as const,
                                        gap: 16,
                                        fontSize: 12,
                                        color: "var(--text-muted)",
                                        fontFamily: "Inter,sans-serif",
                                    }}
                                >
                                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <UserIco />
                                        {snippet.userName}
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <CalIco />
                                        {new Date(snippet.createdAt).toLocaleDateString()}
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <MsgIco />
                                        {commentCount} comments
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
                        >
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#F9629F",
                                    background: "rgba(249,98,159,0.08)",
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor: "rgba(249,98,159,0.2)",
                                    padding: "3px 10px",
                                    borderRadius: 100,
                                    fontFamily: "JetBrains Mono,monospace",
                                }}
                            >
                                {snippet.language}
                            </span>
                            <StarButton snippetId={snippet.id} />
                        </div>
                    </div>
                </div>

                {/* Code editor */}
                <div
                    style={{
                        background: "var(--bg-surface)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "var(--border-default)",
                        borderRadius: "var(--r-xl)",
                        overflow: "hidden",
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 16px",
                            borderBottomWidth: 1,
                            borderBottomStyle: "solid",
                            borderBottomColor: "var(--border-subtle)",
                            background: "var(--panel-bg)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--text-muted)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: "var(--text-secondary)",
                                    fontFamily: "Inter,sans-serif",
                                }}
                            >
                                Source Code
                            </span>
                        </div>
                        <CopyButton code={snippet.code} />
                    </div>
                    <Editor
                        height="420px"
                        language={
                            LANGUAGE_CONFIG[snippet.language]?.monacoLanguage ?? snippet.language
                        }
                        value={snippet.code}
                        theme="vs-dark"
                        beforeMount={defineMonacoThemes}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            readOnly: true,
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            padding: { top: 14, bottom: 14 },
                            fontFamily: '"JetBrains Mono","Fira Code",monospace',
                            fontLigatures: true,
                            scrollbar: { verticalScrollbarSize: 5 },
                            lineDecorationsWidth: 4,
                        }}
                    />
                </div>

                {/* Comments */}
                <Comments snippetId={snippet.id} />
            </div>
        </div>
    );
}
