import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

const tagColor = { "フリマ":"#2A7A50", "買取店":"#E07B00", "処分":"#D04040" };

const historyData = [
  { id:1, date:"2026/05/18", name:"Panasonic 炊飯器 3合",    price:"¥3,200〜¥5,500",   tag:"買取店" },
  { id:2, date:"2026/05/10", name:"NIKE AIR MAX 27cm",       price:"¥8,000〜¥12,000",  tag:"フリマ"  },
  { id:3, date:"2026/04/29", name:"COACH ショルダーバッグ",   price:"¥15,000〜¥22,000", tag:"フリマ"  },
  { id:4, date:"2026/04/12", name:"iPad Air 第5世代",         price:"¥40,000〜¥55,000", tag:"買取店" },
  { id:5, date:"2026/03/30", name:"ユニクロ ダウンジャケット",price:"¥2,500〜¥4,000",  tag:"処分"   },
];

export default function History() {
  const navigate = useNavigate();
  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <span style={s.headerTitle}>査定履歴</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.scroll}>
        {/* トップボタン */}
        <div style={s.topBtns}>
          <button style={s.btnAlbum} onClick={() => navigate("/camera")}>アルバムから選ぶ</button>
          <button style={s.btnShoot} onClick={() => navigate("/camera")}>写真を撮って査定する</button>
        </div>

        <p style={s.sectionTitle}>査定済みアイテム</p>

        {/* 履歴リスト */}
        <div style={s.listCard}>
          {historyData.map((item, i) => (
            <div key={item.id} style={{ ...s.row, borderBottom: i < historyData.length - 1 ? `1px solid ${BORDER}` : "none" }} onClick={() => navigate("/result")}>
              <div style={s.rowIcon}>
                <CalIcon color={G} />
              </div>
              <div style={s.rowBody}>
                <p style={s.rowName}>{item.name}</p>
                <p style={s.rowDate}>{item.date}</p>
              </div>
              <div style={s.rowRight}>
                <span style={{ ...s.tag, background: tagColor[item.tag] + "18", color: tagColor[item.tag] }}>{item.tag}</span>
                <p style={s.rowPrice}>{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <button style={s.btnMore}>もっと見る</button>
      </div>
    </div>
  );
}

function CalIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  status: { background:G, display:"flex", justifyContent:"space-between", padding:"12px 24px 0", flexShrink:0 },
  statusTime: { color:"white", fontSize:14, fontWeight:600 },
  header: { background:G, padding:"8px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  headerTitle: { color:"white", fontSize:20, fontWeight:800 },
  badge: { background:"white", borderRadius:8, padding:"4px 10px" },
  badgeText: { color:G, fontSize:13, fontWeight:700 },
  scroll: { flex:1, overflowY:"auto", padding:"16px 16px 40px", display:"flex", flexDirection:"column", gap:12 },
  topBtns: { display:"flex", gap:10 },
  btnAlbum: { flex:1, padding:"12px 8px", background:"white", color:DARK, border:`1.5px solid ${BORDER}`, borderRadius:14, fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  btnShoot: { flex:1.4, padding:"12px 8px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:14, fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  sectionTitle: { fontSize:15, fontWeight:700, color:DARK, margin:0 },
  listCard: { background:"white", borderRadius:18, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  row: { display:"flex", alignItems:"center", padding:"13px 16px", gap:12, cursor:"pointer" },
  rowIcon: { width:36, height:36, borderRadius:10, background:GL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  rowBody: { flex:1, minWidth:0 },
  rowName: { fontSize:13, fontWeight:600, color:DARK, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  rowDate: { fontSize:11, color:GRAY, margin:"3px 0 0" },
  rowRight: { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 },
  tag: { fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 },
  rowPrice: { fontSize:11, color:GRAY, margin:0 },
  btnMore: { width:"100%", padding:"12px", background:"white", color:G, border:`1.5px solid ${G}44`, borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
};
