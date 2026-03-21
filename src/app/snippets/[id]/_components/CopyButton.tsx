"use client";
import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={async () => {
                await navigator.clipboard.writeText(code);
                setCopied(true);
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
        >
            {copied ? "✓ Copied" : "Copy"}
        </button>
    );
}
