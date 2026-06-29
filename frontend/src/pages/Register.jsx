import { useState } from "react";
import { useNavigate } from "react-router-dom";

const G = "#2A7A50"; const G2 = "#34A36A"; const GRAY = "#8A8A8E";
const DARK = "#1C1C1E"; const BORDER = "#F0F0F0";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <span style={s.headerTitle}>新規登録</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.scroll}>
        <div style={s.logoArea}>
          <p style={s.logoText}>PicSell</p>
        </div>
        <div style={s.card}>
          {[
            { label:"メールアドレス", ph:"example@example.com", val:email,    set:setEmail,    type:"email"    },
            { label:"パスワード",     ph:"半角英数字で入力",      val:password, set:setPassword, type:"password" },
            { label:"パスワード（確認）", ph:"もう一度同じパスワードを入力", val:confirm, set:setConfirm, type:"password" },
          ].map(({ label, ph, val, set, type }) => (
            <div key={label} style={s.field}>
              <p style={s.fieldLabel}>{label}</p>
              <input style={s.input} type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} />
              <p style={s.required}>必須</p>
            </div>
          ))}

          <button style={s.btnPrimary} onClick={() => navigate("/home")}>登録する</button>
          <p style={s.orText}>または</p>
          <div style={s.socialRow}>
            <button style={s.btnSocial} onClick={() => navigate("/home")}>Appleで登録</button>
            <button style={{ ...s.btnSocial, ...s.btnSocialDark }} onClick={() => navigate("/home")}>Googleで登録</button>
          </div>
          <p style={s.loginLink} onClick={() => navigate("/")}>すでにアカウントをお持ちの方はこちら</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:G, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  status: { background:G, display:"flex", justifyContent:"space-between", padding:"12px 24px 0", flexShrink:0 },
  statusTime: { color:"white", fontSize:14, fontWeight:600 },
  header: { background:G, padding:"8px 20px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  headerTitle: { color:"white", fontSize:20, fontWeight:800 },
  badge: { background:"white", borderRadius:8, padding:"4px 10px" },
  badgeText: { color:G, fontSize:13, fontWeight:700 },
  scroll: { flex:1, overflowY:"auto", padding:"0 0 40px" },
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
};
