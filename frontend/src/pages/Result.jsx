import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

export default function Result() {
  const navigate = useNavigate();
  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>‹ 戻る</button>
        <span style={s.headerTitle}>査定結果</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.scroll}>
        {/* 商品画像 */}
        <div style={s.imgWrap}>
          <img src="" alt="アップロードした商品画像" style={s.img} />
          <p style={s.imgPlaceholder}>アップロードした商品画像</p>
        </div>

        {/* 商品情報カード */}
        <div style={s.card}>
          <div style={s.productRow}>
            <div style={s.thumb}>
              <img src="" alt="" style={s.thumbImg} />
              <p style={s.thumbPh}>商品画像</p>
            </div>
            <div style={s.productInfo}>
              <p style={s.productDesc}>スニーカー / ブランド品</p>
              <p style={s.productName}>NIKE AIR MAX 27cm</p>
            </div>
          </div>

          {/* 価格 */}
          <div style={s.priceRow}>
            <div style={s.priceBox}>
              <p style={s.priceLabel}>市場相場</p>
              <p style={s.priceValue}>¥13,000</p>
            </div>
            <div style={{ ...s.priceBox, background:`linear-gradient(135deg,${G}18,${G2}18)`, border:`1.5px solid ${G}44` }}>
              <p style={s.priceLabel}>推定売値</p>
              <p style={{ ...s.priceValue, color:G }}>¥9,500〜¥11,000</p>
            </div>
          </div>
        </div>

        {/* 内訳 */}
        <div style={s.card}>
          <p style={s.cardTitle}>手取り内訳（メルカリ想定）</p>
          {[
            { label:"フリマ想定価格", value:"¥9,500" },
            { label:"販売手数料 (10%)", value:"-¥950" },
            { label:"手取り", value:"¥8,550", bold:true },
          ].map(({ label, value, bold }) => (
            <div key={label} style={s.breakRow}>
              <span style={{ ...s.breakLabel, fontWeight: bold ? 700 : 400, color: bold ? DARK : GRAY }}>{label}</span>
              <span style={{ ...s.breakValue, fontWeight: bold ? 700 : 400, color: bold ? G : GRAY }}>{value}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button style={s.btnPrimary} onClick={() => navigate("/proposal")}>手放し方を提案する</button>
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
  imgWrap: { width:"100%", height:180, background:"#e0e0e0", borderRadius:16, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  img: { width:"100%", height:"100%", objectFit:"cover", display:"block" },
  imgPlaceholder: { color:"#aaa", fontSize:13 },
  card: { background:"white", borderRadius:18, padding:"16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:12 },
  productRow: { display:"flex", gap:12, alignItems:"center" },
  thumb: { width:72, height:72, borderRadius:12, background:"#e8e8e8", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" },
  thumbImg: { width:"100%", height:"100%", objectFit:"cover" },
  thumbPh: { fontSize:10, color:"#aaa", textAlign:"center", padding:4 },
  productInfo: { flex:1 },
  productDesc: { fontSize:11, color:GRAY, margin:"0 0 4px" },
  productName: { fontSize:15, fontWeight:700, color:DARK, margin:0 },
  priceRow: { display:"flex", gap:10 },
  priceBox: { flex:1, background:GL, borderRadius:12, padding:"12px", textAlign:"center" },
  priceLabel: { fontSize:11, color:GRAY, margin:"0 0 4px" },
  priceValue: { fontSize:16, fontWeight:800, color:DARK, margin:0 },
  cardTitle: { fontSize:13, fontWeight:700, color:DARK, margin:0 },
  breakRow: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  breakLabel: { fontSize:13 },
  breakValue: { fontSize:13 },
  btnPrimary: { width:"100%", padding:"16px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:16, fontSize:16, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:`0 4px 16px rgba(42,122,80,0.28)` },
};
