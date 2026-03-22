"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const UserIcon = () => (
    <svg
        width="14"
        height="14"
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
const LogOutIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default function HeaderProfileBtn() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    if (!session) {
        return (
            <Link
                href="/"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    padding: "5px 12px",
                    borderRadius: "var(--r)",
                    border: "1px solid var(--border-default)",
                    textDecoration: "none",
                    background: "var(--bg-surface)",
                }}
                className="hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] transition-all"
            >
                <UserIcon /> Sign in
            </Link>
        );
    }

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                    border: "2px solid rgba(255,161,22,0.4)",
                }}
            >
                {session.user.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={28}
                        height={28}
                    />
                ) : (
                    session.user.name?.charAt(0).toUpperCase()
                )}
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 6px)",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--r-lg)",
                        minWidth: 190,
                        zIndex: 200,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                        overflow: "hidden",
                        animation: "fadeIn 0.1s ease-out",
                    }}
                >
                    <div
                        style={{
                            padding: "10px 12px",
                            borderBottom: "1px solid var(--border-subtle)",
                            background: "var(--bg-overlay)",
                        }}
                    >
                        <p
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            {session.user.name}
                        </p>
                        <p
                            style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                marginTop: 2,
                                fontFamily: "JetBrains Mono, monospace",
                            }}
                        >
                            {session.user.email}
                        </p>
                    </div>
                    <div style={{ padding: 4 }}>
                        <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "7px 10px",
                                fontSize: 12,
                                color: "var(--text-primary)",
                                borderRadius: "var(--r)",
                                textDecoration: "none",
                            }}
                            className="hover:bg-[var(--bg-overlay)] transition-all"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/snippets"
                            onClick={() => setOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "7px 10px",
                                fontSize: 12,
                                color: "var(--text-primary)",
                                borderRadius: "var(--r)",
                                textDecoration: "none",
                            }}
                            className="hover:bg-[var(--bg-overlay)] transition-all"
                        >
                            Snippets
                        </Link>
                        <div
                            style={{
                                height: 1,
                                background: "var(--border-subtle)",
                                margin: "4px 0",
                            }}
                        />
                        <button
                            onClick={async () => {
                                await signOut({
                                    fetchOptions: { onSuccess: () => router.push("/") },
                                });
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "7px 10px",
                                fontSize: 12,
                                color: "var(--red)",
                                borderRadius: "var(--r)",
                                width: "100%",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                            }}
                            className="hover:bg-[rgba(239,71,67,0.08)] transition-all"
                        >
                            <LogOutIcon /> Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
