import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/execute
 *
 * Proxies code execution to OneCompiler API.
 * Docs: https://onecompiler.com/apis/code-execution
 *
 * OneCompiler file naming convention:
 *   javascript  → index.js
 *   typescript  → index.ts
 *   python      → index.py
 *   java        → Main.java  (public class must be named Main)
 *   go          → index.go
 *   rust        → index.rs
 *   cpp         → index.cpp
 *   csharp      → index.cs
 *   ruby        → index.rb
 *   swift       → index.swift
 */

const OC_TOKEN = process.env.ONECOMPILER_API_KEY!;

const FILE_NAMES: Record<string, string> = {
  javascript: "index.js",
  typescript: "index.ts",
  python:     "index.py",
  java:       "Main.java",
  go:         "main.go",   // must be main.go for Go modules
  rust:       "main.rs",
  cpp:        "index.cpp",
  csharp:     "index.cs",
  ruby:       "index.rb",
  swift:      "index.swift",
};

// Go requires a go.mod file for module-aware mode
const GO_MOD = `module codefyre\n\ngo 1.21\n`;

function buildFiles(language: string, source_code: string) {
  const fileName = FILE_NAMES[language] ?? `index.${language}`;
  const files = [{ name: fileName, content: source_code }];
  if (language === "go") {
    files.push({ name: "go.mod", content: GO_MOD });
  }
  return files;
}

export async function POST(req: NextRequest) {
  try {
    const { source_code, language, stdin = "" } = await req.json();

    if (!source_code || !language) {
      return NextResponse.json(
        { error: "source_code and language are required." },
        { status: 400 }
      );
    }

    if (!OC_TOKEN) {
      return NextResponse.json(
        { error: "ONECOMPILER_API_KEY is not set in .env.local" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://onecompiler.com/api/v1/run?access_token=${OC_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          stdin,
          files: buildFiles(language, source_code),
        }),
      }
    );

    const data = await res.json();

    // OneCompiler response: { status, stdout, stderr, exception, executionTime }
    // status = "success" | "failed"
    if (!res.ok || data.status === "failed") {
      const msg =
        data.exception || data.stderr || data.stdout || `OneCompiler error (${res.status})`;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({
      stdout:        data.stdout        || "",
      stderr:        data.stderr        || "",
      exception:     data.exception     || null,
      executionTime: data.executionTime || null,
    });
  } catch (err) {
    console.error("[/api/execute]", err);
    return NextResponse.json(
      { error: "Internal server error while executing code." },
      { status: 500 }
    );
  }
}
