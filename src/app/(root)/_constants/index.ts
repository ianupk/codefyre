import { Monaco } from "@monaco-editor/react";
import { Theme } from "../../../types/index";

type LanguageConfig = Record<
    string,
    {
        id: string;
        label: string;
        logoPath: string;
        ocLanguage: string;
        monacoLanguage: string;
        defaultCode: string;
    }
>;

export const LANGUAGE_CONFIG: LanguageConfig = {
    javascript: {
        id: "javascript",
        label: "JavaScript",
        logoPath: "/javascript.png",
        ocLanguage: "javascript",
        monacoLanguage: "javascript",
        defaultCode: `console.log("Hello, World!");`,
    },

    typescript: {
        id: "typescript",
        label: "TypeScript",
        logoPath: "/typescript.png",
        ocLanguage: "typescript",
        monacoLanguage: "typescript",
        defaultCode: `console.log("Hello, World!");`,
    },

    python: {
        id: "python",
        label: "Python",
        logoPath: "/python.png",
        ocLanguage: "python",
        monacoLanguage: "python",
        defaultCode: `print("Hello, World!")`,
    },

    java: {
        id: "java",
        label: "Java",
        logoPath: "/java.png",
        ocLanguage: "java",
        monacoLanguage: "java",
        defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    },

    go: {
        id: "go",
        label: "Go",
        logoPath: "/go.png",
        ocLanguage: "go",
        monacoLanguage: "go",
        defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    },

    rust: {
        id: "rust",
        label: "Rust",
        logoPath: "/rust.png",
        ocLanguage: "rust",
        monacoLanguage: "rust",
        defaultCode: `fn main() {
    println!("Hello, World!");
}`,
    },

    cpp: {
        id: "cpp",
        label: "C++",
        logoPath: "/cpp.png",
        ocLanguage: "cpp",
        monacoLanguage: "cpp",
        defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    },

    csharp: {
        id: "csharp",
        label: "C#",
        logoPath: "/csharp.png",
        ocLanguage: "csharp",
        monacoLanguage: "csharp",
        defaultCode: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    },

    ruby: {
        id: "ruby",
        label: "Ruby",
        logoPath: "/ruby.png",
        ocLanguage: "ruby",
        monacoLanguage: "ruby",
        defaultCode: `puts "Hello, World!"`,
    },

    swift: {
        id: "swift",
        label: "Swift",
        logoPath: "/swift.png",
        ocLanguage: "swift",
        monacoLanguage: "swift",
        defaultCode: `print("Hello, World!")`,
    },
};

export const THEMES: Theme[] = [
    { id: "vs-dark", label: "VS Dark", color: "#1e1e1e" },
    { id: "vs-light", label: "VS Light", color: "#ffffff" },
    { id: "github-dark", label: "GitHub Dark", color: "#0d1117" },
    { id: "monokai", label: "Monokai", color: "#272822" },
    { id: "solarized-dark", label: "Solarized Dark", color: "#002b36" },
];

export const THEME_DEFINITONS = {
    "github-dark": {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "6e7681" },
            { token: "string", foreground: "a5d6ff" },
            { token: "keyword", foreground: "ff7b72" },
            { token: "number", foreground: "79c0ff" },
            { token: "type", foreground: "ffa657" },
            { token: "class", foreground: "ffa657" },
            { token: "function", foreground: "d2a8ff" },
            { token: "variable", foreground: "ffa657" },
            { token: "operator", foreground: "ff7b72" },
        ],
        colors: {
            "editor.background": "#0d1117",
            "editor.foreground": "#c9d1d9",
            "editor.lineHighlightBackground": "#161b22",
            "editorLineNumber.foreground": "#6e7681",
            "editorIndentGuide.background": "#21262d",
            "editor.selectionBackground": "#264f78",
            "editor.inactiveSelectionBackground": "#264f7855",
        },
    },
    monokai: {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "75715E" },
            { token: "string", foreground: "E6DB74" },
            { token: "keyword", foreground: "F92672" },
            { token: "number", foreground: "AE81FF" },
            { token: "type", foreground: "66D9EF" },
            { token: "class", foreground: "A6E22E" },
            { token: "function", foreground: "A6E22E" },
            { token: "variable", foreground: "F8F8F2" },
            { token: "operator", foreground: "F92672" },
        ],
        colors: {
            "editor.background": "#272822",
            "editor.foreground": "#F8F8F2",
            "editorLineNumber.foreground": "#75715E",
            "editor.selectionBackground": "#49483E",
            "editor.lineHighlightBackground": "#3E3D32",
            "editorCursor.foreground": "#F8F8F2",
            "editor.selectionHighlightBackground": "#49483E",
        },
    },
    "solarized-dark": {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "586e75" },
            { token: "string", foreground: "2aa198" },
            { token: "keyword", foreground: "859900" },
            { token: "number", foreground: "d33682" },
            { token: "type", foreground: "b58900" },
            { token: "class", foreground: "b58900" },
            { token: "function", foreground: "268bd2" },
            { token: "variable", foreground: "b58900" },
            { token: "operator", foreground: "859900" },
        ],
        colors: {
            "editor.background": "#002b36",
            "editor.foreground": "#839496",
            "editorLineNumber.foreground": "#586e75",
            "editor.selectionBackground": "#073642",
            "editor.lineHighlightBackground": "#073642",
            "editorCursor.foreground": "#839496",
            "editor.selectionHighlightBackground": "#073642",
        },
    },
};

export const defineMonacoThemes = (monaco: Monaco) => {
    Object.entries(THEME_DEFINITONS).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, {
            base: themeData.base as "vs" | "vs-dark" | "hc-black",
            inherit: themeData.inherit,
            rules: themeData.rules.map((rule) => ({
                ...rule,
                foreground: rule.foreground,
            })),
            colors: themeData.colors,
        });
    });
};
