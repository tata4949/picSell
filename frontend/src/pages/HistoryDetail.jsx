import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

export default function HistoryDetail() {
  const navigate = useNavigate();

  const raw = sessionStorage.getItem("historyDetail");
  const item = raw ? JSON.parse(raw) : {};

  const priceMin = item?.price?.min;
  const priceMax = item?.price?.max;
  const priceAvg = item?.price?.avg;
  const priceSummary = item?.price?.summary;
  const disposalMethod = item?.disposal?.method;
  const disposalReason = item?.disposal?.reason;
  const fee = priceAvg ? Math.round(priceAvg * 0.1) : null;
  const takeHome = priceAvg && fee ? priceAvg - fee : null;

  const date = item?.created_at
    ? new Date(item.created_at._seconds ? item.created_at._seconds * 1000 : item.created_at).toLocaleDateString("ja-JP")
    : "";

  return (
    <div style={s.root}>
        <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/home")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
            </svg>
        </button>
        <span style={s.headerTitle}>査定詳細</span>
        <div style={{ width:40 }} />
        </div>

      <div style={s.scroll}>
        {/* 商品画像 */}
        <div style={s.imgWrap}>
          {item?.image_url ? (
            <img src={item.image_url} alt="商品画像" style={s.img} />
          ) : (
            <p style={s.imgPlaceholder}>画像なし</p>
          )}
        </div>

        {/* 商品情報 */}
        <div style={s.card}>
          <div style={s.productRow}>
            <div style={s.thumb}>
              {item?.image_url && <img src={item.image_url} alt="" style={s.thumbImg} />}
            </div>
            <div style={s.productInfo}>
              <p style={s.productDesc}>
                {item?.category || "カテゴリ不明"}{item?.brand ? ` / ${item.brand}` : ""}
              </p>
              <p style={s.productName}>{item?.product_name || "商品名不明"}</p>
              <p style={s.productDate}>査定日：{date}</p>
              <p style={s.productCond}>状態：{item?.condition || "不明"}</p>
            </div>
          </div>

          {/* 価格 */}
          <div style={s.priceRow}>
            <div style={s.priceBox}>
              <p style={s.priceLabel}>市場相場</p>
              <p style={s.priceValue}>
                {priceMin && priceMax
                  ? `¥${priceMin.toLocaleString()}〜¥${priceMax.toLocaleString()}`
                  : "データなし"}
              </p>
            </div>
            <div style={{ ...s.priceBox, background:`linear-gradient(135deg,${G}18,${G2}18)`, border:`1.5px solid ${G}44` }}>
              <p style={s.priceLabel}>推定平均値</p>
              <p style={{ ...s.priceValue, color:G }}>
                {priceAvg ? `¥${priceAvg.toLocaleString()}` : "データなし"}
              </p>
            </div>
          </div>

          {priceSummary && (
            <p style={s.priceSummary}>💡 {priceSummary}</p>
          )}
        </div>

        {/* 手取り内訳 */}
        {priceAvg && (
          <div style={s.card}>
            <p style={s.cardTitle}>手取り内訳（メルカリ想定）</p>
            {[
              { label:"フリマ想定価格",   value:`¥${priceAvg.toLocaleString()}` },
              { label:"販売手数料 (10%)", value:`-¥${fee.toLocaleString()}` },
              { label:"手取り",          value:`¥${takeHome.toLocaleString()}`, bold:true },
            ].map(({ label, value, bold }) => (
              <div key={label} style={s.breakRow}>
                <span style={{ ...s.breakLabel, fontWeight: bold ? 700 : 400, color: bold ? DARK : GRAY }}>{label}</span>
                <span style={{ ...s.breakValue, fontWeight: bold ? 700 : 400, color: bold ? G : GRAY }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* 手放し方 */}
        {disposalMethod && (
          <div style={s.card}>
            <p style={s.cardTitle}>おすすめの手放し方</p>
            <div style={s.disposalRow}>
              <span style={s.disposalBadge}>{disposalMethod}</span>
              {disposalReason && <p style={s.disposalReason}>{disposalReason}</p>}
            </div>
          </div>
        )}

        {/* データなしの場合 */}
        {!priceAvg && !disposalMethod && (
          <div style={s.emptyCard}>
            <p style={s.emptyIcon}>📭</p>
            <p style={s.emptyText}>この査定は価格・手放し方データがありません</p>
            <p style={s.emptySub}>逆質問の途中で終了した可能性があります</p>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  header: { background:G, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
backBtn: { width:40, height:40, borderRadius:20, background:"rgba(255,255,255,0.15)", border:"none", color:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 },
headerTitle: { color:"white", fontSize:17, fontWeight:700 },
  scroll: { flex:1, overflowY:"auto", padding:"16px 16px 40px", display:"flex", flexDirection:"column", gap:12 },
  imgWrap: { width:"100%", height:200, background:"#e0e0e0", borderRadius:16, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  img: { width:"100%", height:"100%", objectFit:"cover", display:"block" },
  imgPlaceholder: { color:"#aaa", fontSize:13 },
  card: { background:"white", borderRadius:18, padding:"16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:12 },
  productRow: { display:"flex", gap:12, alignItems:"center" },
  thumb: { width:72, height:72, borderRadius:12, background:"#e8e8e8", flexShrink:0, overflow:"hidden" },
  thumbImg: { width:"100%", height:"100%", objectFit:"cover" },
  productInfo: { flex:1 },
  productDesc: { fontSize:11, color:GRAY, margin:"0 0 4px" },
  productName: { fontSize:15, fontWeight:700, color:DARK, margin:"0 0 4px" },
  productDate: { fontSize:11, color:GRAY, margin:"0 0 2px" },
  productCond: { fontSize:11, color:GRAY, margin:0 },
  priceRow: { display:"flex", gap:10 },
  priceBox: { flex:1, background:GL, borderRadius:12, padding:"12px", textAlign:"center" },
  priceLabel: { fontSize:11, color:GRAY, margin:"0 0 4px" },
  priceValue: { fontSize:14, fontWeight:800, color:DARK, margin:0 },
  priceSummary: { fontSize:12, color:GRAY, margin:0, lineHeight:1.6 },
  cardTitle: { fontSize:13, fontWeight:700, color:DARK, margin:0 },
  breakRow: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  breakLabel: { fontSize:13 },
  breakValue: { fontSize:13 },
  disposalRow: { display:"flex", flexDirection:"column", gap:8 },
  disposalBadge: { background:G, color:"white", fontSize:13, fontWeight:700, padding:"4px 12px", borderRadius:20, alignSelf:"flex-start" },
  disposalReason: { fontSize:13, color:GRAY, margin:0, lineHeight:1.6 },
  emptyCard: { background:"white", borderRadius:18, padding:"32px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 },
  emptyIcon: { fontSize:36, margin:0 },
  emptyText: { fontSize:14, fontWeight:700, color:DARK, margin:0, textAlign:"center" },
  emptySub: { fontSize:12, color:GRAY, margin:0, textAlign:"center" },
};