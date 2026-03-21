import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST /api/executions — save a code execution
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { language, code, output, error } = await req.json();

        const execution = await db.codeExecution.create({
            data: {
                userId: session.user.id,
                language,
                code,
                output: output ?? null,
                error: error ?? null,
            },
        });

        return NextResponse.json(execution, { status: 201 });
    } catch (error) {
        console.error("[POST /api/executions]", error);
        return NextResponse.json({ error: "Failed to save execution" }, { status: 500 });
    }
}

// GET /api/executions?page=1&limit=5 — get user's executions + stats
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") ?? "1");
        const limit = parseInt(searchParams.get("limit") ?? "5");
        const statsOnly = searchParams.get("stats") === "true";
        const userId = session.user.id;

        if (statsOnly) {
            // Return user stats
            const executions = await db.codeExecution.findMany({ where: { userId } });

            const stars = await db.star.findMany({
                where: { userId },
                include: { snippet: { select: { language: true } } },
            });

            const starredLanguages = stars.reduce(
                (acc, s) => {
                    if (s.snippet?.language) {
                        acc[s.snippet.language] = (acc[s.snippet.language] || 0) + 1;
                    }
                    return acc;
                },
                {} as Record<string, number>
            );

            const mostStarredLanguage =
                Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A";

            const last24Hours = executions.filter(
                (e) => e.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
            ).length;

            const languageStats = executions.reduce(
                (acc, e) => {
                    acc[e.language] = (acc[e.language] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            );

            const languages = Object.keys(languageStats);
            const favoriteLanguage = languages.length
                ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b))
                : "N/A";

            return NextResponse.json({
                totalExecutions: executions.length,
                languagesCount: languages.length,
                languages,
                last24Hours,
                favoriteLanguage,
                languageStats,
                mostStarredLanguage,
            });
        }

        // Paginated executions
        const [executions, total] = await Promise.all([
            db.codeExecution.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.codeExecution.count({ where: { userId } }),
        ]);

        return NextResponse.json({
            executions,
            total,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error("[GET /api/executions]", error);
        return NextResponse.json({ error: "Failed to fetch executions" }, { status: 500 });
    }
}
