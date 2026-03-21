"use client";

import { useRef, useState, useCallback } from "react";
import { useCodeEditorRestore } from "@/restore/useCodeEditorRestore";
import EditorTopBar from "./EditorTopBar";
import EditorPanel from "./EditorPanel";
import OutputPanel from "./OutputPanel";
import useMounted from "@/hooks/useMounted";

export default function EditorLayout() {
    const { language, fontSize } = useCodeEditorRestore();
    const mounted = useMounted();

    const containerRef = useRef<HTMLDivElement>(null);
    const [leftPercent, setLeftPercent] = useState(50);
    const isColDragging = useRef(false);

    const onColMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isColDragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        const onMove = (ev: MouseEvent) => {
            if (!isColDragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const pct = ((ev.clientX - rect.left) / rect.width) * 100;
            setLeftPercent(Math.min(Math.max(pct, 20), 80));
        };
        const onUp = () => {
            isColDragging.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                background: "var(--bg-base)",
                overflow: "hidden",
            }}
        >
            <style>{`
                @media (max-width: 768px) {
                    .editor-split-row { flex-direction: column !important; overflow-y: auto !important; overflow-x: hidden !important; }
                    .editor-col      { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border-subtle); flex-shrink: 0; height: 55vmax; min-height: 320px; max-height: 60vh; }
                    .editor-drag-col { display: none !important; }
                    .editor-out-col  { flex: none !important; width: 100% !important; min-height: 0; }
                }
            `}</style>

            <EditorTopBar />

            {/* Desktop: side-by-side. Mobile: stacked Editor → stdin → stdout */}
            <div
                ref={containerRef}
                className="editor-split-row"
                style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
            >
                {/* Code editor */}
                <div
                    className="editor-col"
                    style={{
                        width: `${leftPercent}%`,
                        minWidth: 0,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        borderRightWidth: 1,
                        borderRightStyle: "solid",
                        borderRightColor: "var(--border-subtle)",
                    }}
                >
                    <EditorPanel />
                </div>

                {/* Desktop-only drag handle */}
                <div
                    className="editor-drag-col"
                    onMouseDown={onColMouseDown}
                    style={{
                        width: 5,
                        flexShrink: 0,
                        cursor: "col-resize",
                        background: "transparent",
                        zIndex: 10,
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(249,98,159,0.35)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                />

                {/* stdin + stdout — on mobile these become two stacked sections */}
                <div
                    className="editor-out-col"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <OutputPanel />
                </div>
            </div>

            {/* Status bar */}
            <div
                style={{
                    height: 22,
                    background: "var(--panel-bg)",
                    borderTopWidth: 1,
                    borderTopStyle: "solid",
                    borderTopColor: "var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    gap: 14,
                    flexShrink: 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--green)",
                            animation: "pulse 2s ease-in-out infinite",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        Ready
                    </span>
                </div>
                <div style={{ width: 1, height: 12, background: "var(--border-subtle)" }} />
                {mounted && (
                    <span
                        style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            fontFamily: "JetBrains Mono, monospace",
                            textTransform: "capitalize",
                        }}
                    >
                        {language}
                    </span>
                )}
                <div style={{ flex: 1 }} />
                <span
                    style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        fontFamily: "JetBrains Mono, monospace",
                    }}
                >
                    UTF-8
                </span>
                {mounted && (
                    <span
                        style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            fontFamily: "JetBrains Mono, monospace",
                        }}
                    >
                        {fontSize}px
                    </span>
                )}
            </div>
        </div>
    );
}
