"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signUp.email({
            name,
            email,
            password,
            callbackURL: "/",
        });

        if (error) {
            toast.error(error.message ?? "Sign up failed");
            setLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-[#0f172a] border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)] mb-4">
                        <span className="text-blue-400 font-bold text-2xl tracking-widest">
                            &lt;/&gt;
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white">Create account</h1>
                    <p className="text-gray-400 mt-1 text-sm">Join CodeFyre today</p>
                </div>

                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your name"
                                className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                placeholder="Min. 8 characters"
                                className="w-full px-4 py-2.5 bg-[#1e1e2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
