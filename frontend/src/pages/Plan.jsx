import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

const FREE    = ["AI査定", "写真レート評価", "査定履歴", "✖ AI出品文生成", "✖ 高精度査定"];
const PREMIUM = ["AI査定", "写真レート評価", "査定履歴", "AI出品文生成", "高精度査定", "広告なし"];

export default function Plan() {
  const navigate = useNavigate();
  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>‹ 戻る</button>
        <span style={s.headerTitle}>プランを選択</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.scroll}>
        {/* 無料プラン */}
        <div style={s.planCard}>
          <div style={s.planHeader}>
            <p style={s.planName}>無料プランの内容</p>
            <span style={s.currentBadge}>現在のプラン</span>
          </div>
          <p style={s.planPrice}>¥0 <span style={s.planPriceSub}>/月</span></p>
          <div style={s.featureList}>
            {FREE.map(f => (
              <div key={f} style={s.featureRow}>
                <span style={{ ...s.check, color: f.startsWith("✖") ? "#ccc" : G }}>{f.startsWith("✖") ? "✖" : "✔"}</span>
                <span style={{ ...s.featureText, color: f.startsWith("✖") ? "#bbb" : DARK }}>{f.replace("✖ ", "")}</span>
              </div>
            ))}
          </div>
          <button style={s.btnCurrent} disabled>現在のプラン</button>
        </div>

        {/* プレミアムプラン */}
        <div style={{ ...s.planCard, border:`2px solid ${G}` }}>
          <div style={s.recRibbon}>おすすめ</div>
          <div style={s.planHeader}>
            <p style={s.planName}>プレミアムプランの内容</p>
          </div>
          <p style={s.planPrice}>¥980 <span style={s.planPriceSub}>/月</span></p>
          <div style={s.featureList}>
            {PREMIUM.map(f => (
              <div key={f} style={s.featureRow}>
                <span style={{ ...s.check, color:G }}>✔</span>
                <span style={s.featureText}>{f}</span>
              </div>
            ))}
          </div>
          <button style={s.btnUpgrade}>アップグレードする</button>
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
  planCard: { background:"white", borderRadius:20, padding:"20px 18px", boxShadow:"0 2px 16px rgba(0,0,0,0.07)", position:"relative", display:"flex", flexDirection:"column", gap:14, border:`1.5px solid ${BORDER}` },
  planHeader: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  planName: { fontSize:15, fontWeight:700, color:DARK, margin:0 },
  currentBadge: { background:"#eee", color:"#888", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 },
  recRibbon: { position:"absolute", top:-12, left:16, background:G, color:"white", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:20 },
  planPrice: { fontSize:26, fontWeight:800, color:DARK, margin:0 },
  planPriceSub: { fontSize:14, fontWeight:400, color:GRAY },
  featureList: { display:"flex", flexDirection:"column", gap:8 },
  featureRow: { display:"flex", alignItems:"center", gap:8 },
  check: { fontSize:14, fontWeight:700, width:18, flexShrink:0 },
  featureText: { fontSize:14, color:DARK },
  btnCurrent: { width:"100%", padding:"13px", background:"#eee", color:"#aaa", border:"none", borderRadius:14, fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"not-allowed" },
  btnUpgrade: { width:"100%", padding:"13px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:14, fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:`0 4px 16px rgba(42,122,80,0.28)` },
};
