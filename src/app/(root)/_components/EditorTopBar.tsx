"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import HeaderProfileBtn from "./HeaderProfileBtn";

const NavIcons = {
    snippets: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
    ),
    dashboard: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
};

export default function EditorTopBar() {
    return (
        <div
            style={{
                background: "var(--topbar-bg)",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "var(--border-subtle)",
                height: 44,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 8,
                flexShrink: 0,
            }}
        >
            {/* Logo with image */}
            <Link
                href="/"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    marginRight: 6,
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        overflow: "hidden",
                        boxShadow: "0 0 10px rgba(249,98,159,0.45)",
                        flexShrink: 0,
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="codefyre"
                        width={26}
                        height={26}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                <span
                    style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 800,
                        fontSize: 14,
                        letterSpacing: "-0.02em",
                        color: "var(--text-primary)",
                    }}
                >
                    Codefyre
                </span>
            </Link>

            <div
                style={{ width: 1, height: 18, background: "var(--border-default)", flexShrink: 0 }}
            />

            <LanguageSelector />
            <ThemeSelector />

            <div style={{ flex: 1 }} />

            {[
                { href: "/snippets", icon: NavIcons.snippets, label: "Snippets" },
                { href: "/dashboard", icon: NavIcons.dashboard, label: "Dashboard" },
            ].map(({ href, icon, label }) => (
                <Link
                    key={href}
                    href={href}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                        padding: "5px 10px",
                        borderRadius: "var(--r)",
                        textDecoration: "none",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "transparent",
                        transition: "all 0.15s",
                    }}
                    className="hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.09)]"
                >
                    {icon}
                    {label}
                </Link>
            ))}

            <div
                style={{ width: 1, height: 18, background: "var(--border-subtle)", flexShrink: 0 }}
            />
            <HeaderProfileBtn />
        </div>
    );
}
