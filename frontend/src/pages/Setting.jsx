import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

const ITEMS = [
  { label:"アカウント情報",         route:null     },
  { label:"通知設定",               route:null     },
  { label:"プラン",                 route:"/plan", sub:"無料プラン" },
  { label:"利用規約",               route:null     },
  { label:"プライバシーポリシー",   route:null     },
  { label:"ログアウト",             route:"/",     red:true },
];

export default function Setting() {
  const navigate = useNavigate();
  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>‹ 戻る</button>
        <span style={s.headerTitle}>設定</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.scroll}>
        {/* アバター */}
        <div style={s.avatarSection}>
          <div style={s.avatar}>
            <img src="" alt="アバター" style={s.avatarImg} />
            <span style={s.avatarFallback}>👤</span>
          </div>
          <p style={s.avatarName}>アカウント名</p>
          <p style={s.avatarEmail}>email@example.com</p>
        </div>

        {/* 設定リスト */}
        <div style={s.listCard}>
          {ITEMS.map(({ label, route, red, sub }, i) => (
            <div key={label} style={{ ...s.row, borderBottom: i < ITEMS.length - 1 ? `1px solid ${BORDER}` : "none" }} onClick={() => route && navigate(route)}>
              <div>
                <span style={{ ...s.rowLabel, color: red ? "#D04040" : DARK }}>{label}</span>
                {sub && <p style={s.rowSub}>{sub}</p>}
              </div>
              <span style={{ color:"#ccc", fontSize:18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  status: { background:G, display:"flex", justifyContent:"space-between", padding:"12px 24px 0", flexShrink:0 },
  statusTime: { color:"white", fontSize:14, fontWeight:600 },
  header: { background:G, padding:"8px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  backBtn: { background:"none", border:"none", color:"white", fontSize:16, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  headerTitle: { color:"white", fontSize:18, fontWeight:700 },
  badge: { background:"white", borderRadius:8, padding:"4px 10px" },
  badgeText: { color:G, fontSize:13, fontWeight:700 },
  scroll: { flex:1, overflowY:"auto", padding:"16px 16px 40px", display:"flex", flexDirection:"column", gap:14 },
  avatarSection: { display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"8px 0 4px" },
  avatar: { width:72, height:72, borderRadius:36, background:"#e0e0e0", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" },
  avatarImg: { width:"100%", height:"100%", objectFit:"cover" },
  avatarFallback: { fontSize:32 },
  avatarName: { fontSize:16, fontWeight:700, color:DARK, margin:0 },
  avatarEmail: { fontSize:12, color:GRAY, margin:0 },
  listCard: { background:"white", borderRadius:18, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  row: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 18px", cursor:"pointer" },
  rowLabel: { fontSize:15 },
  rowSub: { fontSize:11, color:GRAY, margin:"2px 0 0" },
};
