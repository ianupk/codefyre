"use client";
// RunButton still exists but is no longer used in top bar
// Kept for potential future use
import { getExecutionResult, useCodeEditorRestore } from "@/restore/useCodeEditorRestore";
import { useSession } from "@/lib/auth-client";

export default function RunButton() {
    const { data: session } = useSession();
    const { runCode, language, isRunning } = useCodeEditorRestore();
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
                background: isRunning ? "rgba(249,98,159,0.15)" : "#F9629F",
                borderWidth: 0,
                borderRadius: "var(--r)",
                color: isRunning ? "#F9629F" : "white",
                fontSize: 12,
                fontWeight: 700,
                cursor: isRunning ? "not-allowed" : "pointer",
                fontFamily: "Inter,sans-serif",
                transition: "all 0.15s",
            }}
        >
            {isRunning ? (
                <>
                    <span
                        style={{
                            width: 12,
                            height: 12,
                            borderWidth: 2,
                            borderStyle: "solid",
                            borderColor: "rgba(249,98,159,0.4)",
                            borderTopColor: "#F9629F",
                            borderRadius: "50%",
                            animation: "spin 0.6s linear infinite",
                            display: "inline-block",
                        }}
                    />
                    Running
                </>
            ) : (
                <>▶ Run</>
            )}
        </button>
    );
}
