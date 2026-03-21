import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Codefyre — Build, Break, Repeat",
    description: "Browser-based code editor with instant execution in 10 languages.",
    icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: "#2a2a2a",
                            color: "#eff1f6",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontFamily: "Inter, sans-serif",
                        },
                        success: { iconTheme: { primary: "#00b8a3", secondary: "#1a1a1a" } },
                        error: { iconTheme: { primary: "#ef4743", secondary: "#1a1a1a" } },
                    }}
                />
            </body>
        </html>
    );
}
