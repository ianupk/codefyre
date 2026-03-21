"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

function HeaderProfileBtn() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => router.push("/sign-in"),
            },
        });
    };

    if (!session) {
        return (
            <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700
                    text-white text-sm rounded-md font-medium transition-all duration-200
                    shadow shadow-blue-500/30"
            >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
            </Link>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {session.user.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                        {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e1e2e] border border-gray-800 rounded-lg shadow-xl z-50 py-1">
                    <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm font-medium text-white truncate">
                            {session.user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export default HeaderProfileBtn;
