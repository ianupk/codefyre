"use client";
import { useCodeEditorRestore } from "@/restore/useCodeEditorRestore";
import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareSnippetDialog({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const { language, getCode } = useCodeEditorRestore();

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSharing(true);
        try {
            const res = await fetch("/api/snippets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, language, code: getCode() }),
            });
            if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
            onClose();
            toast.success("Snippet shared!");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error");
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 500,
                backdropFilter: "blur(4px)",
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--r-xl)",
                    padding: 22,
                    width: "100%",
                    maxWidth: 380,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    animation: "fadeIn 0.15s ease-out",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 18,
                    }}
                >
                    <span
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        Share Snippet
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            display: "flex",
                            padding: 4,
                            borderRadius: "var(--r)",
                        }}
                        className="hover:bg-[var(--bg-overlay)] hover:text-white transition-all"
                    >
                        <X size={14} />
                    </button>
                </div>
                <form onSubmit={handleShare}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "var(--text-secondary)",
                            marginBottom: 6,
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My awesome snippet…"
                        required
                        autoFocus
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            background: "var(--bg-input)",
                            border: "1px solid var(--border-default)",
                            borderRadius: "var(--r-lg)",
                            color: "var(--text-primary)",
                            fontSize: 14,
                            outline: "none",
                            fontFamily: "Inter, sans-serif",
                            marginBottom: 16,
                            transition: "border-color 0.15s",
                            boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                    />
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "8px 16px",
                                fontSize: 13,
                                color: "var(--text-secondary)",
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border-default)",
                                borderRadius: "var(--r-lg)",
                                cursor: "pointer",
                                fontFamily: "Inter, sans-serif",
                            }}
                            className="hover:text-white hover:border-[var(--border-strong)] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSharing}
                            style={{
                                padding: "8px 18px",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#000",
                                background: isSharing ? "rgba(255,161,22,0.5)" : "var(--accent)",
                                border: "none",
                                borderRadius: "var(--r-lg)",
                                cursor: isSharing ? "not-allowed" : "pointer",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            {isSharing ? "Sharing…" : "Share"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
