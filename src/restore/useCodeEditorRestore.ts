import { CodeEditorState } from "./../types/index";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { create } from "zustand";
import type { editor as MonacoEditor } from "monaco-editor";

const DEFAULT_LANGUAGE = "javascript";
const DEFAULT_THEME = "vs-dark";
const DEFAULT_FONT_SIZE = 16;

const isValidLanguage = (lang: string): lang is keyof typeof LANGUAGE_CONFIG =>
    lang in LANGUAGE_CONFIG;

const getInitialState = () => {
    if (typeof window === "undefined") {
        return { language: DEFAULT_LANGUAGE, fontSize: DEFAULT_FONT_SIZE, theme: DEFAULT_THEME };
    }
    const storedLanguage = localStorage.getItem("editor-language") || DEFAULT_LANGUAGE;
    const language = isValidLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
    return {
        language,
        theme: localStorage.getItem("editor-theme") || DEFAULT_THEME,
        fontSize: parseInt(localStorage.getItem("editor-font-size") || `${DEFAULT_FONT_SIZE}`),
    };
};

export const useCodeEditorRestore = create<
    CodeEditorState & {
        editor: MonacoEditor.IStandaloneCodeEditor | null;
        setEditor: (editor: MonacoEditor.IStandaloneCodeEditor) => void;
    }
>((set, get) => {
    const initialState = getInitialState();
    return {
        ...initialState,
        output: "",
        isRunning: false,
        error: null,
        editor: null,
        executionResult: null,
        stdin: "",

        getCode: () => get().editor?.getValue() || "",

        setEditor: (editor: MonacoEditor.IStandaloneCodeEditor) => {
            const savedCode = localStorage.getItem(`editor-code-${get().language}`);
            if (savedCode) editor.setValue(savedCode);
            set({ editor });
        },

        setTheme: (theme: string) => {
            localStorage.setItem("editor-theme", theme);
            set({ theme });
        },

        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-font-size", fontSize.toString());
            set({ fontSize });
        },

        setStdin: (stdin: string) => set({ stdin }),

        setLanguage: (language: string) => {
            if (!isValidLanguage(language)) {
                console.warn(`Invalid language: ${language}. Using default.`);
                language = DEFAULT_LANGUAGE;
            }
            const currentCode = get().editor?.getValue();
            if (currentCode) localStorage.setItem(`editor-code-${get().language}`, currentCode);
            localStorage.setItem("editor-language", language);
            set({ language, output: "", error: null });
        },

        runCode: async () => {
            const { language, getCode, stdin } = get();
            const code = getCode();
            if (!code) {
                set({ error: "Please enter some code" });
                return;
            }

            set({ isRunning: true, error: null, output: "" });

            try {
                const ocLanguage = LANGUAGE_CONFIG[language].ocLanguage;

                const res = await fetch("/api/execute", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        source_code: code,
                        language: ocLanguage,
                        stdin: stdin, // ← uses the stdin from state
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    const msg = data.error || `Execution failed (${res.status})`;
                    set({ error: msg, executionResult: { code, output: "", error: msg } });
                    return;
                }

                if (data.exception) {
                    set({
                        error: data.exception,
                        executionResult: { code, output: "", error: data.exception },
                    });
                    return;
                }

                if (data.stderr) {
                    set({
                        error: data.stderr,
                        executionResult: { code, output: "", error: data.stderr },
                    });
                    return;
                }

                const output = data.stdout || "";
                set({
                    output: output.trim(),
                    error: null,
                    executionResult: { code, output: output.trim(), error: null },
                });
            } catch (err) {
                console.error("Error running code:", err);
                set({
                    error: "Error running code",
                    executionResult: { code, output: "", error: "Error running code" },
                });
            } finally {
                set({ isRunning: false });
            }
        },
    };
});

export const getExecutionResult = () => useCodeEditorRestore.getState().executionResult;
