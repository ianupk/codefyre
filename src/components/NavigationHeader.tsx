"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderProfileBtn from "@/app/(root)/_components/HeaderProfileBtn";
import Image from "next/image";

const NavIcons: Record<string, React.ReactNode> = {
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
            <path d="M14 2v6h6M16 13H8M16 17H8" />
        </svg>
    ),
    editor: (
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
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
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

export default function NavigationHeader() {
    const pathname = usePathname();
    const links = [
        { href: "/snippets", key: "snippets", label: "Snippets" },
        { href: "/editor", key: "editor", label: "Editor" },
        { href: "/dashboard", key: "dashboard", label: "Dashboard" },
    ];

    return (
        <header style={{ position: "sticky", top: 0, zIndex: 50, padding: "10px 20px", pointerEvents: "none" }}>
            {/* Fade mask — covers the gap above + below the pill so content fades out */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: -20,
                    background:
                        "linear-gradient(to bottom, var(--bg-base) 0%, var(--bg-base) 55%, transparent 100%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    /* match the 1100px content width used by dashboard/snippets */
                    maxWidth: 1100,
                    margin: "0 auto",
                    background: "rgba(24,24,27,0.92)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: 100,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,98,159,0.05)",
                    height: 52,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 8px 0 16px",
                    gap: 4,
                    position: "relative",
                    pointerEvents: "auto",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        textDecoration: "none",
                        marginRight: 8,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            overflow: "hidden",
                            flexShrink: 0,
                            filter: "drop-shadow(0 0 6px rgba(249,98,159,0.5))",
                        }}
                    >
                        <Image
                            src="/logo.png"
                            alt="codefyre"
                            width={28}
                            height={28}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <span
                        style={{
                            fontFamily: "Inter,sans-serif",
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
                    style={{
                        width: 1,
                        height: 18,
                        background: "rgba(255,255,255,0.08)",
                        flexShrink: 0,
                        marginRight: 4,
                    }}
                />

                {links.map(({ href, key, label }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                                fontWeight: active ? 600 : 400,
                                color: active ? "white" : "var(--text-secondary)",
                                padding: "6px 14px",
                                borderRadius: 100,
                                textDecoration: "none",
                                background: active ? "rgba(249,98,159,0.15)" : "transparent",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: active ? "rgba(249,98,159,0.35)" : "transparent",
                                transition: "all 0.2s",
                                fontFamily: "Inter,sans-serif",
                                whiteSpace: "nowrap" as const,
                            }}
                            className="hover:text-white hover:bg-[rgba(255,255,255,0.06)]"
                        >
                            <span
                                style={{ color: active ? "#F9629F" : "inherit", display: "flex" }}
                            >
                                {NavIcons[key]}
                            </span>
                            <span className="nav-pill-label">{label}</span>
                        </Link>
                    );
                })}

                <div style={{ flex: 1 }} />
                <div style={{ padding: "0 4px" }}>
                    <HeaderProfileBtn />
                </div>
            </div>
        </header>
    );
}
