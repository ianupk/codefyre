import type { editor as MonacoEditor } from "monaco-editor";

export interface Theme {
    id: string;
    label: string;
    color: string;
}
export interface Language {
    id: string;
    label: string;
    logoPath: string;
    monacoLanguage: string;
    defaultCode: string;
    ocLanguage: string;
}
export interface ExecuteCodeResponse {
    stdout: string;
    stderr: string;
    exception: string | null;
    executionTime: number | null;
}
export interface ExecutionResult {
    code: string;
    output: string;
    error: string | null;
    executionTime?: number | null;
}

export interface CodeEditorState {
    language: string;
    output: string;
    isRunning: boolean;
    error: string | null;
    theme: string;
    fontSize: number;
    stdin: string;
    executionTime: number | null;
    editor: MonacoEditor.IStandaloneCodeEditor | null;
    executionResult: ExecutionResult | null;
    setEditor: (editor: MonacoEditor.IStandaloneCodeEditor) => void;
    getCode: () => string;
    setLanguage: (language: string) => void;
    setTheme: (theme: string) => void;
    setFontSize: (fontSize: number) => void;
    setStdin: (stdin: string) => void;
    runCode: () => Promise<void>;
}

export interface Snippet {
    id: string;
    createdAt: string;
    userId: string;
    language: string;
    code: string;
    title: string;
    userName: string;
}
