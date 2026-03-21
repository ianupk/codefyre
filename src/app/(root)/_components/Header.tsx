import Link from "next/link";
import { Code2 } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";

function Header() {
    return (
        <div className="relative z-10">
            <div className="flex items-center lg:justify-between justify-center bg-[#0a0a0f]/80 backdrop-blur-xl p-6 mb-4 rounded-lg">
                <div className="hidden lg:flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 group relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
                        <div className="flex items-center space-x-3 group">
                            <div className="relative flex items-center justify-center w-12 h-12 rounded-md bg-[#0f172a] border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow duration-300">
                                <span className="text-blue-400 font-bold text-xl tracking-widest">
                                    &lt;/&gt;
                                </span>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-white font-extrabold text-xl tracking-tight">
                                    CodeFyre
                                </span>
                                <span className="text-sm text-slate-400">Build, Break, Repeat.</span>
                            </div>
                        </div>
                    </Link>

                    <nav className="flex items-center space-x-1">
                        <Link
                            href="/snippets"
                            className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
                            <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                                Snippets
                            </span>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <ThemeSelector />
                        <LanguageSelector />
                    </div>
                    <RunButton />
                    <div className="pl-3 border-l border-gray-800">
                        <HeaderProfileBtn />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Header;
