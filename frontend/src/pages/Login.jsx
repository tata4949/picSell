import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../firebase";

const G = "#2A7A50"; const G2 = "#34A36A"; const GRAY = "#8A8A8E";
const DARK = "#1C1C1E"; const BORDER = "#F0F0F0";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.detail === "string"
          ? data.detail : JSON.stringify(data.detail);
        setError(msg || "ログインに失敗しました");
        return;
      }
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setExiting(true);
      setTimeout(() => navigate("/home"), 400);
    } catch (e) {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem("access_token", idToken);
      localStorage.setItem("user", JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        display_name: result.user.displayName,
        plan: "free",
      }));
      setExiting(true);
      setTimeout(() => navigate("/home"), 400);
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError("ログインに失敗しました");
      }
    }
  };

  return (
    <div style={{
      ...s.root,
      transform: exiting ? "translateY(-100%)" : "translateY(0)",
      transition: exiting ? "transform 0.4s cubic-bezier(0.4,0,0.2,1)" : "none",
    }}>
      <div style={s.header}>
        <div style={{ width:40 }} />
        <span style={s.headerTitle}>ログイン</span>
        <div style={{ width:40 }} />
      </div>

      <div style={s.scroll}>
        <div style={s.logoArea}>
          <div style={s.logoCircle}>
            <CamIcon size={36} color="white" />
          </div>
          <p style={s.logoText}>PicSell</p>
          <p style={s.logoSub}>写真1枚で不用品を賢く手放そう</p>
        </div>

        <div style={s.card}>
          <div style={s.field}>
            <p style={s.fieldLabel}>メールアドレス</p>
            <input style={s.input} type="email" placeholder="example@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
            <p style={s.required}>必須</p>
          </div>
          <div style={s.field}>
            <p style={s.fieldLabel}>パスワード</p>
            <input style={s.input} type="password" placeholder="半角英数字で入力"
              value={password} onChange={e => setPassword(e.target.value)} />
            <p style={s.required}>必須</p>
          </div>

          {error && <p style={s.errorText}>{error}</p>}

          <p style={s.forgot}>🔒 パスワードを忘れた方</p>

          <button style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}
            onClick={handleLogin} disabled={loading}>
            {loading ? "ログイン中..." : "ログイン"}
          </button>

          <p style={s.orText}>または</p>

          <div style={s.socialRow}>
            <button style={s.btnSocial} onClick={() => handleSocialLogin(appleProvider)}>
              Appleでログイン
            </button>
            <button style={{ ...s.btnSocial, ...s.btnSocialDark }} onClick={() => handleSocialLogin(googleProvider)}>
              Googleでログイン
            </button>
          </div>

          <p style={s.registerLink} onClick={() => navigate("/register")}>
            📋 アカウントをお持ちでない方はこちら
          </p>
        </div>
      </div>
    </div>
  );
}

function CamIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:G, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto", overflow:"hidden" },
  header: { background:G, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  headerTitle: { color:"white", fontSize:17, fontWeight:700 },
  scroll: { flex:1, overflowY:"auto", overflowX:"hidden", padding:"0 0 40px", WebkitOverflowScrolling:"touch" },
  logoArea: { display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 0 24px", gap:10 },
  logoCircle: { width:72, height:72, borderRadius:36, background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(42,122,80,0.35)" },
  logoText: { fontSize:28, fontWeight:800, color:"white", margin:0 },
  logoSub: { fontSize:12, color:"rgba(255,255,255,0.75)", margin:0 },
  card: { background:"white", margin:"0 16px", borderRadius:22, padding:"24px 20px", boxShadow:"0 4px 24px rgba(0,0,0,0.10)" },
  field: { marginBottom:4 },
  fieldLabel: { fontSize:13, fontWeight:600, color:DARK, margin:"0 0 6px" },
  input: { width:"100%", padding:"11px 13px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", color:DARK },
  required: { fontSize:11, color:GRAY, margin:"4px 0 14px" },
  forgot: { fontSize:13, color:GRAY, margin:"0 0 18px", cursor:"pointer" },
  btnPrimary: { width:"100%", padding:"14px", background:"#1C1C1E", color:"white", border:"none", borderRadius:14, fontSize:16, fontWeight:700, fontFamily:"inherit", cursor:"pointer", marginBottom:16 },
  orText: { fontSize:13, color:GRAY, textAlign:"center", margin:"0 0 14px" },
  socialRow: { display:"flex", gap:10, marginBottom:16 },
  btnSocial: { flex:1, padding:"11px 6px", background:"white", color:DARK, border:`1.5px solid ${BORDER}`, borderRadius:12, fontSize:12, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  btnSocialDark: { background:"#1C1C1E", color:"white", border:"none" },
  registerLink: { fontSize:12, color:GRAY, textAlign:"center", cursor:"pointer", marginTop:4 },
  errorText: { fontSize:13, color:"#D04040", margin:"0 0 12px", textAlign:"center" },
};