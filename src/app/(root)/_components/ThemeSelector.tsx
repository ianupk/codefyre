"use client";

import { useCodeEditorRestore } from "@/restore/useCodeEditorRestore";
import React, { useEffect, useRef, useState } from "react";
import { THEMES } from "../_constants";
import useMounted from "@/hooks/useMounted";

const ChevronDown = () => (
    <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

export default function ThemeSelector() {
    const [open, setOpen] = useState(false);
    const mounted = useMounted();
    const { theme, setTheme } = useCodeEditorRestore();
    const ref = useRef<HTMLDivElement>(null);
    const current = THEMES.find((t) => t.id === theme);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    if (!mounted) return null;

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "5px 10px",
                    background: open ? "var(--bg-elevated)" : "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--r)",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    transition: "all 0.15s",
                    minWidth: 110,
                }}
            >
                <div
                    style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: current?.color,
                        flexShrink: 0,
                    }}
                />
                <span
                    style={{
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                        color: "var(--text-primary)",
                        flex: 1,
                    }}
                >
                    {current?.label}
                </span>
                <span style={{ color: "var(--text-muted)", display: "flex" }}>
                    <ChevronDown />
                </span>
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--r-lg)",
                        zIndex: 200,
                        minWidth: 155,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        padding: 4,
                        overflow: "hidden",
                        animation: "fadeIn 0.1s ease-out",
                    }}
                >
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setTheme(t.id);
                                setOpen(false);
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                width: "100%",
                                padding: "7px 10px",
                                background: theme === t.id ? "rgba(255,161,22,0.1)" : "transparent",
                                border: "none",
                                borderRadius: "var(--r)",
                                cursor: "pointer",
                                color: theme === t.id ? "var(--accent)" : "var(--text-primary)",
                                fontSize: 12,
                                fontFamily: "Inter, sans-serif",
                                transition: "all 0.1s",
                            }}
                            className="hover:bg-[var(--bg-overlay)]"
                        >
                            <div
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: "50%",
                                    background: t.color,
                                }}
                            />
                            <span style={{ flex: 1 }}>{t.label}</span>
                            {theme === t.id && (
                                <span style={{ fontSize: 11, color: "var(--accent)" }}>✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
