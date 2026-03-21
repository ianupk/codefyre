"use client";

import { useCodeEditorRestore } from "@/restore/useCodeEditorRestore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import Image from "next/image";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import { getExecutionResult } from "@/restore/useCodeEditorRestore";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

/* ── Premium SVG icons ─────────────────────────────────────────────────────── */
const PlayIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
);
const CopyIcon = () => (
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
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);
const CheckIcon = () => (
    <svg
        width="14"
        height="14"
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
const ResetIcon = () => (
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
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);
const ShareIcon = () => (
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
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);
const MinusIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const PlusIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

/* ── Reusable toolbar button style ─────────────────────────────────────────── */
const tbBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    background: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.09)",
    borderRadius: 8,
    color: "rgba(255,255,255,0.65)",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    transition: "all 0.15s",
    letterSpacing: "0.01em",
};

/* ── Copy button ────────────────────────────────────────────────────────────── */
function CopyButton({ getText }: { getText: () => string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        const text = getText();
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            title="Copy code"
            style={{
                ...tbBtn,
                color: copied ? "#22c55e" : "rgba(255,255,255,0.65)",
                borderColor: copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.09)",
            }}
            className="hover:bg-[rgba(255,255,255,0.08)] hover:text-white hover:border-[rgba(255,255,255,0.18)]"
        >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

/* ── Run button inside editor bar ──────────────────────────────────────────── */
function RunInEditorButton({ language }: { language: string }) {
    const { data: session } = useSession();
    const { runCode, isRunning } = useCodeEditorRestore() as {
        runCode: () => Promise<void>;
        isRunning: boolean;
    };

    const handleRun = async () => {
        await runCode();
        const result = getExecutionResult();
        if (session?.user && result) {
            fetch("/api/executions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language,
                    code: result.code,
                    output: result.output || null,
                    error: result.error || null,
                }),
            }).catch(console.error);
        }
    };

    return (
        <button
            onClick={handleRun}
            disabled={isRunning}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                background: isRunning ? "rgba(249,98,159,0.2)" : "#F9629F",
                borderWidth: 0,
                borderRadius: 8,
                color: isRunning ? "#F9629F" : "white",
                fontSize: 12,
                fontWeight: 700,
                cursor: isRunning ? "not-allowed" : "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.15s",
                boxShadow: isRunning ? "none" : "0 2px 12px rgba(249,98,159,0.45)",
            }}
            className="hover:opacity-90"
        >
            {isRunning ? (
                <>
                    <span
                        style={{
                            width: 11,
                            height: 11,
                            borderWidth: 2,
                            borderStyle: "solid",
                            borderColor: "rgba(249,98,159,0.3)",
                            borderTopColor: "#F9629F",
                            borderRadius: "50%",
                            animation: "spin 0.6s linear infinite",
                            display: "inline-block",
                        }}
                    />
                    Running
                </>
            ) : (
                <>
                    <PlayIcon />
                    Run
                </>
            )}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </button>
    );
}

/* ── Main EditorPanel ──────────────────────────────────────────────────────── */
export default function EditorPanel() {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { language, theme, fontSize, editor, setFontSize, setEditor } =
        useCodeEditorRestore() as {
            language: string;
            theme: string;
            fontSize: number;
            editor: MonacoEditor.IStandaloneCodeEditor | null;
            setFontSize: (s: number) => void;
            setEditor: (e: MonacoEditor.IStandaloneCodeEditor) => void;
        };
    const mounted = useMounted();

    useEffect(() => {
        const saved = localStorage.getItem(`editor-code-${language}`);
        if (editor) editor.setValue(saved || LANGUAGE_CONFIG[language].defaultCode);
    }, [language, editor]);

    useEffect(() => {
        const s = localStorage.getItem("editor-font-size");
        if (s) setFontSize(parseInt(s));
    }, [setFontSize]);

    const handleChange = (v?: string) => {
        if (v) localStorage.setItem(`editor-code-${language}`, v);
    };

    const handleReset = () => {
        if (editor) editor.setValue(LANGUAGE_CONFIG[language].defaultCode);
        localStorage.removeItem(`editor-code-${language}`);
        toast.success("Code reset to default");
    };

    const changeFont = (d: number) => {
        const s = Math.min(Math.max(fontSize + d, 10), 28);
        setFontSize(s);
        localStorage.setItem("editor-font-size", s.toString());
    };

    if (!mounted) return null;
    const lang = LANGUAGE_CONFIG[language];
    const extMap: Record<string, string> = {
        javascript: "js",
        typescript: "ts",
        python: "py",
        java: "java",
        csharp: "cs",
        cpp: "cpp",
        go: "go",
        rust: "rs",
        ruby: "rb",
        swift: "swift",
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "var(--editor-bg)",
                overflow: "hidden",
            }}
        >
            {/* Tab bar */}
            <div
                style={{
                    background: "var(--panel-bg)",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "var(--border-subtle)",
                    height: 42,
                    display: "flex",
                    alignItems: "stretch",
                    flexShrink: 0,
                    paddingLeft: 4,
                }}
            >
                {/* Active file tab */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 14px",
                        borderRightWidth: 1,
                        borderRightStyle: "solid",
                        borderRightColor: "var(--border-subtle)",
                        borderTopWidth: 2,
                        borderTopStyle: "solid",
                        borderTopColor: "#F9629F",
                        borderBottomWidth: 0,
                        borderLeftWidth: 0,
                        background: "var(--editor-bg)",
                        fontSize: 12,
                        color: "var(--text-primary)",
                        flexShrink: 0,
                        fontFamily: "JetBrains Mono, monospace",
                        fontWeight: 500,
                    }}
                >
                    <Image
                        src={lang.logoPath}
                        alt={lang.label}
                        width={13}
                        height={13}
                        style={{ objectFit: "contain" }}
                    />
                    main.{extMap[language] ?? language}
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#F9629F",
                            display: "inline-block",
                            marginLeft: 2,
                            boxShadow: "0 0 6px rgba(249,98,159,0.7)",
                        }}
                        title="Unsaved changes"
                    />
                </div>
                <div style={{ flex: 1 }} />

                {/* Toolbar — Copy | font-/+ | Reset | Share | Run */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 10px" }}>
                    {/* Copy */}
                    <CopyButton getText={() => editor?.getValue() ?? ""} />

                    {/* Font size */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            background: "rgba(255,255,255,0.04)",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "rgba(255,255,255,0.09)",
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                    >
                        <button
                            onClick={() => changeFont(-1)}
                            title="Decrease font size"
                            style={{
                                padding: "5px 7px",
                                background: "transparent",
                                borderWidth: 0,
                                color: "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.15s",
                            }}
                            className="hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
                        >
                            <MinusIcon />
                        </button>
                        <span
                            style={{
                                fontSize: 11,
                                color: "rgba(255,255,255,0.5)",
                                padding: "0 6px",
                                borderLeftWidth: 1,
                                borderLeftStyle: "solid",
                                borderLeftColor: "rgba(255,255,255,0.09)",
                                borderRightWidth: 1,
                                borderRightStyle: "solid",
                                borderRightColor: "rgba(255,255,255,0.09)",
                                lineHeight: "22px",
                                fontFamily: "JetBrains Mono,monospace",
                            }}
                        >
                            {fontSize}
                        </span>
                        <button
                            onClick={() => changeFont(1)}
                            title="Increase font size"
                            style={{
                                padding: "5px 7px",
                                background: "transparent",
                                borderWidth: 0,
                                color: "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.15s",
                            }}
                            className="hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
                        >
                            <PlusIcon />
                        </button>
                    </div>

                    {/* Reset */}
                    <button
                        onClick={handleReset}
                        title="Reset to default"
                        style={tbBtn}
                        className="hover:bg-[rgba(255,255,255,0.08)] hover:text-white hover:border-[rgba(255,255,255,0.18)]"
                    >
                        <ResetIcon />
                        Reset
                    </button>

                    {/* Share */}
                    <button
                        onClick={() => setIsShareOpen(true)}
                        title="Share snippet"
                        style={{
                            ...tbBtn,
                            background: "rgba(249,98,159,0.1)",
                            borderColor: "rgba(249,98,159,0.25)",
                            color: "#F9629F",
                        }}
                        className="hover:bg-[rgba(249,98,159,0.2)] hover:border-[rgba(249,98,159,0.45)]"
                    >
                        <ShareIcon />
                        Share
                    </button>

                    {/* Run — rightmost */}
                    <RunInEditorButton language={language} />
                </div>
            </div>

            {/* Monaco */}
            <div style={{ flex: 1, overflow: "hidden" }}>
                <Editor
                    height="100%"
                    language={lang.monacoLanguage}
                    onChange={handleChange}
                    theme={theme}
                    beforeMount={defineMonacoThemes}
                    onMount={(e) => setEditor(e)}
                    options={{
                        minimap: { enabled: false },
                        fontSize,
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        padding: { top: 14, bottom: 14 },
                        renderWhitespace: "selection",
                        fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                        fontLigatures: true,
                        cursorBlinking: "smooth",
                        smoothScrolling: true,
                        renderLineHighlight: "line",
                        lineHeight: 1.7,
                        scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
                        glyphMargin: false,
                        lineDecorationsWidth: 4,
                        overviewRulerLanes: 0,
                        hideCursorInOverviewRuler: true,
                        overviewRulerBorder: false,
                    }}
                />
            </div>

            {isShareOpen && <ShareSnippetDialog onClose={() => setIsShareOpen(false)} />}
        </div>
    );
}
