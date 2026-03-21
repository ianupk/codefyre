"use client";

import { useCodeEditorRestore } from "@/restore/useCodeEditorRestore";
import { useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

/* ── SVGs — stdin now uses ">_" prompt style, matching stdout ─────────────── */
const Ico = {
    copy: (
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
    ),
    check: (
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
    ),
    /* stdin: keyboard/input prompt — same visual language as terminal */

    /* stdout: terminal arrow */
    terminal: (
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
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    ),
    ok: (
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    err: (
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    clock: (
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
    ),
    cpu: (
        <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
        </svg>
    ),
    empty: (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    ),
};

function CopyBtn({ getText }: { getText: () => string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={async () => {
                const t = getText();
                if (!t) return;
                await navigator.clipboard.writeText(t);
                setCopied(true);
                toast.success("Copied!");
                setTimeout(() => setCopied(false), 2000);
            }}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 8px",
                background: "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "var(--border-default)",
                borderRadius: "var(--r)",
                color: copied ? "var(--green)" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "Inter,sans-serif",
                transition: "all 0.15s",
            }}
            className="hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]"
        >
            {copied ? Ico.check : Ico.copy}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

function TabBar({
    icon,
    label,
    accent,
    dot,
    extra,
}: {
    icon: React.ReactNode;
    label: string;
    accent: string;
    dot?: boolean;
    extra?: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: "var(--panel-bg)",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "var(--border-subtle)",
                height: 36,
                display: "flex",
                alignItems: "stretch",
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0 14px",
                    height: "100%",
                    borderTopWidth: 2,
                    borderTopStyle: "solid",
                    borderTopColor: accent,
                    borderRightWidth: 1,
                    borderRightStyle: "solid",
                    borderRightColor: "var(--border-subtle)",
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                    background: "var(--editor-bg)",
                    fontSize: 12,
                    fontFamily: "Inter,sans-serif",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    flexShrink: 0,
                }}
            >
                {icon}
                <span>{label}</span>
                {dot && (
                    <span
                        style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: accent,
                            display: "inline-block",
                        }}
                    />
                )}
            </div>
            <div style={{ flex: 1 }} />
            {extra && (
                <div style={{ display: "flex", alignItems: "center", paddingRight: 10 }}>
                    {extra}
                </div>
            )}
        </div>
    );
}

export default function OutputPanel() {
    const { output, error, isRunning, stdin, setStdin, executionTime } = useCodeEditorRestore() as {
        output: string;
        error: string | null;
        isRunning: boolean;
        stdin: string;
        setStdin: (s: string) => void;
        executionTime: number | null;
    };

    /* Desktop: vertical drag between stdin (top) and stdout (bottom) */
    const containerRef = useRef<HTMLDivElement>(null);
    const [topPercent, setTopPercent] = useState(35);
    const isDragging = useRef(false);

    const onRowMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
        const onMove = (ev: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const pct = ((ev.clientY - rect.top) / rect.height) * 100;
            setTopPercent(Math.min(Math.max(pct, 15), 75));
        };
        const onUp = () => {
            isDragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, []);

    const hasOutput = !!(error || output);

    return (
        <>
            <style>{`
        /* On mobile, OutputPanel stacks stdin then stdout as natural block flow */
        @media (max-width: 768px) {
          .out-container { flex-direction: column !important; height: auto !important; overflow: visible !important; }
          .out-stdin-pane { height: auto !important; min-height: 160px; flex-shrink: 0; }
          .out-drag-row   { display: none !important; }
          .out-stdout-pane { height: auto !important; min-height: 200px; flex-shrink: 0; }
        }
      `}</style>

            {/* Outer wrapper — desktop: fixed height flex-col; mobile: auto-height block */}
            <div
                ref={containerRef}
                className="out-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    background: "var(--editor-bg)",
                    overflow: "hidden",
                }}
            >
                {/* ── stdin ───────────────────────────────────────────────────────── */}
                <div
                    className="out-stdin-pane"
                    style={{
                        height: `${topPercent}%`,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <TabBar
                        icon={Ico.terminal}
                        label="stdin"
                        accent="var(--accent)"
                        dot={!!stdin}
                        extra={
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                {stdin && (
                                    <button
                                        onClick={() => setStdin("")}
                                        style={{
                                            fontSize: 11,
                                            color: "var(--text-muted)",
                                            background: "none",
                                            borderWidth: 0,
                                            cursor: "pointer",
                                            fontFamily: "Inter,sans-serif",
                                        }}
                                        className="hover:text-[var(--red)] transition-colors"
                                    >
                                        clear
                                    </button>
                                )}
                                <CopyBtn getText={() => stdin} />
                            </div>
                        }
                    />
                    <div style={{ flex: 1, padding: "8px 10px", overflow: "hidden" }}>
                        <textarea
                            value={stdin}
                            onChange={(e) => setStdin(e.target.value)}
                            placeholder={"Enter program input…\n(one value per line)"}
                            style={{
                                width: "100%",
                                height: "100%",
                                background: "var(--bg-input)",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "var(--border-default)",
                                borderRadius: "var(--r-lg)",
                                padding: "8px 10px",
                                fontSize: 12,
                                color: "var(--text-primary)",
                                fontFamily: "JetBrains Mono,monospace",
                                resize: "none",
                                outline: "none",
                                lineHeight: 1.7,
                                boxSizing: "border-box" as const,
                                transition: "border-color 0.15s",
                                minHeight: 80,
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "var(--accent)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "var(--border-default)";
                            }}
                        />
                    </div>
                </div>

                {/* ── Vertical drag handle (desktop only) ─────────────────────────── */}
                <div
                    className="out-drag-row"
                    onMouseDown={onRowMouseDown}
                    style={{
                        height: 5,
                        flexShrink: 0,
                        cursor: "row-resize",
                        background: "var(--border-subtle)",
                        zIndex: 10,
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(249,98,159,0.4)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "var(--border-subtle)")
                    }
                />

                {/* ── stdout ──────────────────────────────────────────────────────── */}
                <div
                    className="out-stdout-pane"
                    style={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <TabBar
                        icon={Ico.terminal}
                        label="stdout"
                        accent="#22c55e"
                        dot={hasOutput && !isRunning}
                        extra={
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {executionTime != null && !isRunning && (
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                            fontSize: 11,
                                            color: "var(--text-muted)",
                                            fontFamily: "JetBrains Mono,monospace",
                                        }}
                                    >
                                        {Ico.clock} {executionTime}ms
                                    </span>
                                )}
                                {hasOutput && <CopyBtn getText={() => error || output} />}
                            </div>
                        }
                    />
                    <div
                        style={{
                            flex: 1,
                            overflow: "auto",
                            padding: "12px 14px",
                            fontFamily: "JetBrains Mono,monospace",
                            fontSize: 13,
                            lineHeight: 1.7,
                        }}
                    >
                        {isRunning ? (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    color: "var(--text-muted)",
                                    paddingTop: 8,
                                }}
                            >
                                <span
                                    style={{
                                        width: 13,
                                        height: 13,
                                        borderWidth: 2,
                                        borderStyle: "solid",
                                        borderColor: "rgba(249,98,159,0.3)",
                                        borderTopColor: "var(--accent)",
                                        borderRadius: "50%",
                                        animation: "spin 0.7s linear infinite",
                                        display: "inline-block",
                                    }}
                                />
                                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13 }}>
                                    Executing…
                                </span>
                            </div>
                        ) : error ? (
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        color: "var(--red)",
                                        marginBottom: 10,
                                        fontFamily: "Inter,sans-serif",
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}
                                >
                                    {Ico.err} Runtime Error
                                </div>
                                <div
                                    style={{
                                        background: "var(--red-dim)",
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "rgba(239,68,68,0.18)",
                                        borderRadius: "var(--r-lg)",
                                        padding: "10px 12px",
                                    }}
                                >
                                    <pre
                                        style={{
                                            color: "rgba(239,68,68,0.9)",
                                            whiteSpace: "pre-wrap",
                                            margin: 0,
                                        }}
                                    >
                                        {error}
                                    </pre>
                                </div>
                            </div>
                        ) : output ? (
                            <div>
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
                                            gap: 6,
                                            color: "var(--green)",
                                            fontFamily: "Inter,sans-serif",
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {Ico.ok} Execution complete
                                    </div>
                                    {executionTime != null && (
                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                fontSize: 11,
                                                color: "var(--text-muted)",
                                                fontFamily: "Inter,sans-serif",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                {Ico.clock} {executionTime}ms
                                            </span>
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                {Ico.cpu} N/A
                                            </span>
                                        </span>
                                    )}
                                </div>
                                <div
                                    style={{
                                        background: "var(--green-dim)",
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: "rgba(34,197,94,0.18)",
                                        borderRadius: "var(--r-lg)",
                                        padding: "10px 12px",
                                    }}
                                >
                                    <pre
                                        style={{
                                            color: "var(--text-primary)",
                                            whiteSpace: "pre-wrap",
                                            margin: 0,
                                        }}
                                    >
                                        {output}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--text-muted)",
                                    gap: 8,
                                    minHeight: 100,
                                }}
                            >
                                <span style={{ opacity: 0.3 }}>{Ico.empty}</span>
                                <span style={{ fontSize: 12, fontFamily: "Inter,sans-serif" }}>
                                    Run your code to see output
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
