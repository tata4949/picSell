import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

const PROPOSALS = [
  { icon:"📦", name:"メルカリ",     desc:"フリマアプリ",  price:"¥8,550", recommended:true  },
  { icon:"🏪", name:"ヤフオク",     desc:"オークション",  price:"¥7,200", recommended:false },
  { icon:"🔄", name:"買取サービス", desc:"即日買取",      price:"¥6,000", recommended:false },
];

export default function Proposal() {
  const navigate = useNavigate();
  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>‹ 戻る</button>
        <span style={s.headerTitle}>手放し方の提案</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.scroll}>
        <p style={s.sectionTitle}>おすすめの手放し方</p>

        {PROPOSALS.map((p, i) => (
          <div key={p.name} style={{ ...s.card, border: p.recommended ? `2px solid ${G}` : `1.5px solid ${BORDER}` }}>
            {p.recommended && <div style={s.recBadge}>おすすめ ⭐</div>}
            <div style={s.proposalRow}>
              <div style={s.propIcon}>{p.icon}</div>
              <div style={s.propInfo}>
                <p style={s.propName}>{p.name}</p>
                <p style={s.propDesc}>{p.desc}</p>
              </div>
              <div style={s.propRight}>
                <p style={s.propLabel}>手取り</p>
                <p style={{ ...s.propPrice, color: p.recommended ? G : DARK }}>{p.price}</p>
              </div>
            </div>
          </div>
        ))}

        <div style={s.infoCard}>
          <p style={s.infoLabel}>メルカリで出品した場合の推定手取り</p>
          <p style={s.infoValue}>¥8,550</p>
        </div>

        <button style={s.btnPrimary} onClick={() => navigate("/listing")}>出品画面へ進む</button>
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
  scroll: { flex:1, overflowY:"auto", padding:"16px 16px 40px", display:"flex", flexDirection:"column", gap:12 },
  sectionTitle: { fontSize:15, fontWeight:700, color:DARK, margin:0 },
  card: { background:"white", borderRadius:16, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", position:"relative" },
  recBadge: { position:"absolute", top:-10, left:14, background:G, color:"white", fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20 },
  proposalRow: { display:"flex", alignItems:"center", gap:12, marginTop:4 },
  propIcon: { fontSize:28, flexShrink:0 },
  propInfo: { flex:1 },
  propName: { fontSize:15, fontWeight:700, color:DARK, margin:"0 0 2px" },
  propDesc: { fontSize:12, color:GRAY, margin:0 },
  propRight: { textAlign:"right" },
  propLabel: { fontSize:11, color:GRAY, margin:"0 0 2px" },
  propPrice: { fontSize:17, fontWeight:800, margin:0 },
  infoCard: { background:GL, borderRadius:16, padding:"14px 16px", border:`1.5px solid ${G}44` },
  infoLabel: { fontSize:12, color:GRAY, margin:"0 0 4px" },
  infoValue: { fontSize:22, fontWeight:800, color:G, margin:0 },
  btnPrimary: { width:"100%", padding:"16px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:16, fontSize:16, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:`0 4px 16px rgba(42,122,80,0.28)` },
};
