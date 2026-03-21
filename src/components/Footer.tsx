export default function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--border-subtle)",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--bg-base)",
            }}
        >
            <span
                style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                codefyre
            </span>
            <span
                style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                © {new Date().getFullYear()}
            </span>
        </footer>
    );
}
