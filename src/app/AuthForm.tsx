"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await signIn.email({ email, password, callbackURL: "/editor" });
      if (error) { toast.error(error.message ?? "Sign in failed"); setLoading(false); return; }
    } else {
      const { error } = await signUp.email({ name, email, password, callbackURL: "/editor" });
      if (error) { toast.error(error.message ?? "Sign up failed"); setLoading(false); return; }
    }
    router.push("/editor");
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10, color: "white", fontSize: 14,
    outline: "none", fontFamily: "Inter,sans-serif",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0c0f",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.05)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(0.96)} }
        @keyframes pulse-dot { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
      `}</style>

      {/* ── Full-page background — the "landing" layer ───────────────────── */}
      {/* Large ambient orbs */}
      <div style={{ position:"absolute", top:"-15%", left:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,98,159,0.14) 0%, transparent 65%)", pointerEvents:"none", animation:"drift1 12s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"-20%", right:"-8%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(120,40,180,0.10) 0%, transparent 65%)", pointerEvents:"none", animation:"drift2 15s ease-in-out infinite" }} />
      <div style={{ position:"absolute", top:"40%", right:"20%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,98,159,0.06) 0%, transparent 65%)", pointerEvents:"none" }} />
      {/* Dot grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }} />

      {/* ── Top nav bar spanning full page width ────────────────────────── */}
      <header style={{ position:"relative", zIndex:10, padding:"18px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, overflow:"hidden", boxShadow:"0 0 14px rgba(249,98,159,0.5)", flexShrink:0 }}>
            <Image src="/logo.png" alt="codefyre" width={32} height={32} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:16, letterSpacing:"-0.03em", color:"white" }}>codefyre</span>
        </div>
        <nav style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Link href="/snippets" style={{ fontSize:13, color:"rgba(255,255,255,0.45)", padding:"6px 14px", borderRadius:100, textDecoration:"none", fontFamily:"Inter,sans-serif", transition:"all 0.2s" }}
            className="hover:text-white hover:bg-[rgba(255,255,255,0.06)]">
            Snippets
          </Link>
          <Link href="/editor" style={{ fontSize:13, color:"rgba(255,255,255,0.45)", padding:"6px 14px", borderRadius:100, textDecoration:"none", fontFamily:"Inter,sans-serif", transition:"all 0.2s" }}
            className="hover:text-white hover:bg-[rgba(255,255,255,0.06)]">
            Editor
          </Link>
        </nav>
      </header>

      {/* ── Hero text + card — centred in remaining space ────────────────── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 20px 40px", position:"relative", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:64, maxWidth:960, width:"100%", flexWrap:"wrap" as const, justifyContent:"center" }}>

          {/* LEFT — headline copy */}
          <div style={{ flex:"1 1 320px", minWidth:0 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 13px", borderRadius:100, borderWidth:1, borderStyle:"solid", borderColor:"rgba(249,98,159,0.25)", background:"rgba(249,98,159,0.08)", fontSize:12, color:"rgba(249,98,159,0.9)", marginBottom:22, fontFamily:"JetBrains Mono,monospace" }}>
              <span style={{ width:5,height:5,borderRadius:"50%",background:"#F9629F",animation:"pulse-dot 2s ease-in-out infinite" }} />
              free forever · no credit card
            </div>

            <h1 style={{ fontFamily:"Inter,sans-serif", fontSize:"clamp(2.2rem,4vw,3.2rem)", fontWeight:800, letterSpacing:"-0.05em", lineHeight:1.08, color:"white", marginBottom:16 }}>
              Build, break,<br/>
              <span style={{ color:"#F9629F" }}>repeat.</span>
            </h1>

            <p style={{ fontSize:16, color:"rgba(255,255,255,0.45)", lineHeight:1.75, marginBottom:32, fontFamily:"Inter,sans-serif", maxWidth:360 }}>
              A premium browser-based code editor. Run 10 languages instantly — no setup, no install.
            </p>

            {/* Feature pills */}
            <div style={{ display:"flex", flexWrap:"wrap" as const, gap:8 }}>
              {["⚡ 10 languages","📝 Monaco editor","🔗 Share snippets","📊 Dashboard"].map(f => (
                <span key={f} style={{ fontSize:12, padding:"5px 12px", borderRadius:100, background:"rgba(255,255,255,0.04)", borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.55)", fontFamily:"Inter,sans-serif" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — floating auth card */}
          <div style={{
            flex:"0 0 380px",
            background:"rgba(18,18,22,0.92)",
            backdropFilter:"blur(24px)",
            WebkitBackdropFilter:"blur(24px)",
            borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,255,255,0.09)",
            borderRadius:20,
            padding:"32px 30px",
            boxShadow:"0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(249,98,159,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
            position:"relative",
            overflow:"hidden",
          }}>
            {/* Subtle top glow inside card */}
            <div style={{ position:"absolute", top:-60, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,98,159,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />

            <h2 style={{ fontSize:20, fontWeight:800, color:"white", fontFamily:"Inter,sans-serif", letterSpacing:"-0.03em", marginBottom:4, position:"relative" }}>
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", fontFamily:"Inter,sans-serif", marginBottom:22, position:"relative" }}>
              {mode === "signin" ? "Sign in to continue to codefyre" : "Start coding for free today"}
            </p>

            {/* Mode toggle */}
            <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:3, marginBottom:20, borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,255,255,0.07)", position:"relative" }}>
              {(["signin","signup"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setName(""); setEmail(""); setPassword(""); }}
                  style={{ flex:1, padding:"8px 0", fontSize:13, fontWeight: mode===m ? 700 : 400, fontFamily:"Inter,sans-serif", background: mode===m ? "#F9629F" : "transparent", borderWidth:0, borderRadius:8, color: mode===m ? "white" : "rgba(255,255,255,0.35)", cursor:"pointer", transition:"all 0.2s", boxShadow: mode===m ? "0 2px 10px rgba(249,98,159,0.4)" : "none" }}>
                  {m === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13, position:"relative" }}>
              {mode === "signup" && (
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.35)", marginBottom:6, fontFamily:"Inter,sans-serif", letterSpacing:"0.06em", textTransform:"uppercase" as const }}>Name</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="Your name" style={inp}
                    onFocus={e=>{e.target.style.borderColor="rgba(249,98,159,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(249,98,159,0.09)"}}
                    onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none"}} />
                </div>
              )}
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.35)", marginBottom:6, fontFamily:"Inter,sans-serif", letterSpacing:"0.06em", textTransform:"uppercase" as const }}>Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={inp}
                  onFocus={e=>{e.target.style.borderColor="rgba(249,98,159,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(249,98,159,0.09)"}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none"}} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.35)", marginBottom:6, fontFamily:"Inter,sans-serif", letterSpacing:"0.06em", textTransform:"uppercase" as const }}>Password</label>
                <div style={{ position:"relative" }}>
                  <input type={showPass ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" minLength={mode==="signup" ? 8 : undefined}
                    style={{ ...inp, paddingRight:50 }}
                    onFocus={e=>{e.target.style.borderColor="rgba(249,98,159,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(249,98,159,0.09)"}}
                    onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none"}} />
                  <button type="button" onClick={()=>setShowPass(p=>!p)}
                    style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", borderWidth:0, color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:11, fontFamily:"Inter,sans-serif" }}
                    className="hover:text-white transition-colors">
                    {showPass ? "hide" : "show"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", background: loading ? "rgba(249,98,159,0.4)" : "#F9629F", borderWidth:0, borderRadius:10, color:"white", fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", fontFamily:"Inter,sans-serif", marginTop:4, boxShadow: loading ? "none" : "0 4px 18px rgba(249,98,159,0.45)", transition:"all 0.2s" }}
                className="hover:opacity-90">
                {loading
                  ? <><span style={{ width:13,height:13,borderWidth:2,borderStyle:"solid",borderColor:"rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.6s linear infinite",display:"inline-block" }} />{mode==="signin"?"Signing in…":"Creating…"}</>
                  : (mode==="signin" ? "Sign in →" : "Create account →")
                }
              </button>
            </form>

            <p style={{ marginTop:18, textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.22)", fontFamily:"Inter,sans-serif", position:"relative" }}>
              <Link href="/snippets" style={{ color:"inherit", textDecoration:"none" }}
                className="hover:text-[rgba(255,255,255,0.5)] transition-colors">
                Browse snippets without signing in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
