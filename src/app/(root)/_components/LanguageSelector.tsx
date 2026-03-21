"use client";

import { useCodeEditorRestore } from "@/restore/useCodeEditorRestore";
import { useEffect, useRef, useState } from "react";
import { LANGUAGE_CONFIG } from "../_constants";
import Image from "next/image";
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

export default function LanguageSelector() {
    const [open, setOpen] = useState(false);
    const mounted = useMounted();
    const { language, setLanguage } = useCodeEditorRestore();
    const ref = useRef<HTMLDivElement>(null);
    const current = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG["javascript"];

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
                    color: "var(--text-primary)",
                    transition: "all 0.15s",
                    minWidth: 130,
                }}
            >
                <Image
                    src={current.logoPath}
                    alt={current.label}
                    width={14}
                    height={14}
                    style={{ objectFit: "contain" }}
                />
                <span
                    style={{
                        fontSize: 12,
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif",
                        flex: 1,
                    }}
                >
                    {current.label}
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
                        minWidth: 160,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        padding: 4,
                        overflow: "hidden",
                        animation: "fadeIn 0.1s ease-out",
                    }}
                >
                    {Object.values(LANGUAGE_CONFIG).map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => {
                                setLanguage(lang.id);
                                setOpen(false);
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                width: "100%",
                                padding: "7px 10px",
                                background:
                                    language === lang.id ? "rgba(255,161,22,0.1)" : "transparent",
                                border: "none",
                                borderRadius: "var(--r)",
                                cursor: "pointer",
                                color:
                                    language === lang.id ? "var(--accent)" : "var(--text-primary)",
                                fontSize: 12,
                                fontFamily: "Inter, sans-serif",
                                transition: "all 0.1s",
                            }}
                            className="hover:bg-[var(--bg-overlay)]"
                        >
                            <Image
                                src={lang.logoPath}
                                alt={lang.label}
                                width={14}
                                height={14}
                                style={{ objectFit: "contain" }}
                            />
                            {lang.label}
                            {language === lang.id && (
                                <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
