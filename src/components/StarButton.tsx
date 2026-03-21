"use client";

import { useSession } from "@/lib/auth-client";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface StarButtonProps {
    snippetId: string;
}

function StarButton({ snippetId }: StarButtonProps) {
    const { data: session } = useSession();
    const [isStarred, setIsStarred] = useState(false);
    const [starCount, setStarCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/snippets/${snippetId}/star`)
            .then((r) => r.json())
            .then((data) => {
                setIsStarred(data.isStarred);
                setStarCount(data.starCount);
            })
            .catch(console.error);
    }, [snippetId]);

    const handleStar = async () => {
        if (!session || loading) return;
        setLoading(true);

        // Optimistic update
        setIsStarred((prev) => !prev);
        setStarCount((prev) => (isStarred ? prev - 1 : prev + 1));

        try {
            const res = await fetch(`/api/snippets/${snippetId}/star`, { method: "POST" });
            const data = await res.json();
            setIsStarred(data.isStarred);
            setStarCount(data.starCount);
        } catch (error) {
            // Revert on error
            setIsStarred((prev) => !prev);
            setStarCount((prev) => (isStarred ? prev + 1 : prev - 1));
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                isStarred
                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                    : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
            }`}
            onClick={handleStar}
            disabled={!session || loading}
        >
            <Star
                className={`w-4 h-4 ${isStarred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"}`}
            />
            <span
                className={`text-xs font-medium ${isStarred ? "text-yellow-500" : "text-gray-400"}`}
            >
                {starCount}
            </span>
        </button>
    );
}

export default StarButton;
