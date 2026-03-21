import type { editor as MonacoEditor } from "monaco-editor";
import { Id } from "../../convex/_generated/dataModel";

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
    ocLanguage: string; // OneCompiler language ID
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
}

export interface CodeEditorState {
    language: string;
    output: string;
    isRunning: boolean;
    error: string | null;
    theme: string;
    fontSize: number;
    editor: MonacoEditor.IStandaloneCodeEditor | null;
    executionResult: ExecutionResult | null;
    setEditor: (editor: MonacoEditor.IStandaloneCodeEditor) => void;
    getCode: () => string;
    setLanguage: (language: string) => void;
    setTheme: (theme: string) => void;
    setFontSize: (fontSize: number) => void;
    runCode: () => Promise<void>;
}

export interface Snippet {
    _id: Id<"snippets">;
    _creationTime: number;
    userId: string;
    language: string;
    code: string;
    title: string;
    userName: string;
}
