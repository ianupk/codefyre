"use client";

import { Activity, Code2, Star, Timer, TrendingUp, Trophy, UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface UserStats {
    totalExecutions: number;
    languagesCount: number;
    languages: string[];
    last24Hours: number;
    favoriteLanguage: string;
    languageStats: Record<string, number>;
    mostStarredLanguage: string;
}

interface ProfileHeaderUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
}

interface ProfileHeaderProps {
    userStats: UserStats;
    user: ProfileHeaderUser;
}

function ProfileHeader({ userStats, user }: ProfileHeaderProps) {
    const STATS = [
        {
            label: "Code Executions",
            value: userStats?.totalExecutions ?? 0,
            icon: Activity,
            color: "from-blue-500 to-cyan-500",
            gradient: "group-hover:via-blue-400",
            description: "Total code runs",
            metric: { label: "Last 24h", value: userStats?.last24Hours ?? 0, icon: Timer },
        },
        {
            label: "Languages Used",
            value: userStats?.languagesCount ?? 0,
            icon: Code2,
            color: "from-purple-500 to-pink-500",
            gradient: "group-hover:via-purple-400",
            description: "Different languages",
            metric: {
                label: "Most used",
                value: userStats?.favoriteLanguage ?? "N/A",
                icon: TrendingUp,
            },
        },
        {
            label: "Most Starred",
            value: userStats?.mostStarredLanguage ?? "N/A",
            icon: Star,
            color: "from-yellow-500 to-orange-500",
            gradient: "group-hover:via-yellow-400",
            description: "Top language in stars",
            metric: {
                label: "Favorite",
                value: userStats?.favoriteLanguage ?? "N/A",
                icon: Trophy,
            },
        },
    ];

    return (
        <div className="relative mb-8 bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-2xl p-8 border border-gray-800/50 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
            <div className="relative flex items-center gap-8">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full border-4 border-gray-800/50 relative z-10 group-hover:scale-105 transition-transform"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-gray-800/50 relative z-10 bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {STATS.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        key={index}
                        className="group relative bg-gradient-to-br from-black/40 to-black/20 rounded-2xl overflow-hidden"
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-all duration-500 ${stat.gradient}`}
                        />
                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-400">
                                        {stat.description}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                                        {typeof stat.value === "number"
                                            ? stat.value.toLocaleString()
                                            : stat.value}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                                </div>
                                <div
                                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
                                >
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
                                <stat.metric.icon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-400">{stat.metric.label}:</span>
                                <span className="text-sm font-medium text-white">
                                    {stat.metric.value}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
export default ProfileHeader;
