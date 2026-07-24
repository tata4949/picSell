import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../firebase";

const G = "#2A7A50"; const G2 = "#34A36A"; const GRAY = "#8A8A8E";
const DARK = "#1C1C1E"; const BORDER = "#F0F0F0";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Register() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (password !== confirm) { setError("パスワードが一致しません"); return; }
    if (password.length < 8)  { setError("パスワードは8文字以上で入力してください"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, display_name: displayName }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.detail === "string"
          ? data.detail : JSON.stringify(data.detail);
        setError(msg || "登録に失敗しました");
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
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
      navigate("/home");
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError("ログインに失敗しました");
      }
    }
  };

  if (success) {
    return (
      <div style={s.root}>
        <div style={s.successWrap}>
          <div style={s.successIcon}>✓</div>
          <p style={s.successTitle}>登録が完了しました！</p>
          <p style={s.successSub}>ログイン画面に移動します...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/login")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>新規登録</span>
        <div style={{ width:40 }} />
      </div>

      <div style={s.scroll}>
        <div style={s.logoArea}>
          <p style={s.logoText}>PicSell</p>
        </div>
        <div style={s.card}>
          {[
            { label:"ニックネーム",       ph:"PicSellユーザー",           val:displayName, set:setDisplayName, type:"text"     },
            { label:"メールアドレス",     ph:"example@example.com",       val:email,       set:setEmail,       type:"email"    },
            { label:"パスワード",         ph:"半角英数字8文字以上",         val:password,    set:setPassword,    type:"password" },
            { label:"パスワード（確認）", ph:"もう一度同じパスワードを入力", val:confirm,     set:setConfirm,     type:"password" },
          ].map(({ label, ph, val, set, type }) => (
            <div key={label} style={s.field}>
              <p style={s.fieldLabel}>{label}</p>
              <input style={s.input} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
              <p style={s.required}>必須</p>
            </div>
          ))}

          {error && <p style={s.errorText}>{error}</p>}

          <button style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}
            onClick={handleRegister} disabled={loading}>
            {loading ? "登録中..." : "登録する"}
          </button>
          <p style={s.orText}>または</p>
          <div style={s.socialRow}>
            <button style={s.btnSocial} onClick={() => handleSocialLogin(appleProvider)}>Appleで登録</button>
            <button style={{ ...s.btnSocial, ...s.btnSocialDark }} onClick={() => handleSocialLogin(googleProvider)}>Googleで登録</button>
          </div>
          <p style={s.loginLink} onClick={() => navigate("/login")}>すでにアカウントをお持ちの方はこちら</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:G, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto", overflow:"hidden" },
  header: { background:G, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  backBtn: { width:40, height:40, borderRadius:20, background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 },
  headerTitle: { color:"white", fontSize:17, fontWeight:700 },
  scroll: { flex:1, overflowY:"auto", overflowX:"hidden", padding:"0 0 40px", WebkitOverflowScrolling:"touch" },
  logoArea: { padding:"24px 0 16px", textAlign:"center" },
  logoText: { fontSize:32, fontWeight:800, color:"white", margin:0 },
  card: { background:"white", margin:"0 16px", borderRadius:22, padding:"24px 20px", boxShadow:"0 4px 24px rgba(0,0,0,0.10)" },
  field: { marginBottom:4 },
  fieldLabel: { fontSize:13, fontWeight:600, color:DARK, margin:"0 0 6px" },
  input: { width:"100%", padding:"11px 13px", borderRadius:10, border:`1.5px solid ${BORDER}`, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", color:DARK },
  required: { fontSize:11, color:GRAY, margin:"4px 0 14px" },
  btnPrimary: { width:"100%", padding:"14px", background:"#1C1C1E", color:"white", border:"none", borderRadius:14, fontSize:16, fontWeight:700, fontFamily:"inherit", cursor:"pointer", marginBottom:16 },
  orText: { fontSize:13, color:GRAY, textAlign:"center", margin:"0 0 14px" },
  socialRow: { display:"flex", gap:10, marginBottom:14 },
  btnSocial: { flex:1, padding:"11px 6px", background:"white", color:DARK, border:`1.5px solid ${BORDER}`, borderRadius:12, fontSize:12, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  btnSocialDark: { background:"#1C1C1E", color:"white", border:"none" },
  loginLink: { fontSize:12, color:GRAY, textAlign:"center", cursor:"pointer" },
  errorText: { fontSize:13, color:"#D04040", margin:"0 0 12px", textAlign:"center" },
  successWrap: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 },
  successIcon: { width:80, height:80, borderRadius:40, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, color:"white" },
  successTitle: { fontSize:22, fontWeight:800, color:"white", margin:0 },
  successSub: { fontSize:14, color:"rgba(255,255,255,0.75)", margin:0 },
};