import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

export default function Listing() {
  const navigate = useNavigate();

  const raw = sessionStorage.getItem("assessmentResult");
  const result = raw ? JSON.parse(raw) : null;
  const data = result?.data || result || {};
  const image = sessionStorage.getItem("capturedImage");

  const productName = data?.product_name || "";
  const brand = data?.brand || "";
  const condition = data?.condition || "";
  const category = data?.category || "";
  const priceAvg = data?.price?.avg;

  const title = [
    condition === "良好" ? "【美品】" : condition === "やや傷あり" ? "【訳あり】" : "",
    brand,
    productName,
  ].filter(Boolean).join(" ");

  const description = [
    category ? `【商品】${category}` : "",
    brand ? `【ブランド】${brand}` : "",
    `【状態】${condition || "不明"}`,
    "ご不明点はコメントください。",
  ].filter(Boolean).join("\n");

  const handleCopy = () => {
    const text = `${title}\n\n${description}\n\n価格：¥${priceAvg?.toLocaleString() || "応相談"}`;
    navigator.clipboard.writeText(text).then(() => {
      alert("出品文をコピーしました！");
      navigate("/home");
    });
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>出品文を作成</span>
        <div style={{ width:40 }} />
      </div>

      <div style={s.scroll}>
        <div style={s.card}>
          <p style={s.cardTitle}>商品画像</p>
          <div style={s.imgRow}>
            <div style={s.imgBox}>
              {image
                ? <img src={image} alt="メイン" style={s.img} />
                : <p style={s.imgPh}>画像なし</p>
              }
            </div>
          </div>
        </div>

        <div style={s.card}>
          <p style={s.cardTitle}>販売タイトル</p>
          <div style={s.fieldBox}>{title || "タイトルを生成できませんでした"}</div>
        </div>

        <div style={s.card}>
          <p style={s.cardTitle}>販売価格</p>
          <p style={s.priceText}>
            {priceAvg ? `¥${priceAvg.toLocaleString()}` : "価格データなし"}
          </p>
        </div>

        <div style={s.card}>
          <p style={s.cardTitle}>商品説明文</p>
          <div style={s.textarea}>{description}</div>
        </div>

        <div style={s.btnRow}>
          <button style={s.btnOutline} onClick={() => navigate(-1)}>戻る</button>
          <button style={s.btnPrimary} onClick={handleCopy}>コピーして出品</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  header: { background:G, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  backBtn: { width:40, height:40, borderRadius:20, background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 },
  headerTitle: { color:"white", fontSize:17, fontWeight:700 },
  scroll: { flex:1, overflowY:"auto", padding:"16px 16px 40px", display:"flex", flexDirection:"column", gap:12 },
  card: { background:"white", borderRadius:18, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:10 },
  cardTitle: { fontSize:13, fontWeight:700, color:DARK, margin:0 },
  imgRow: { display:"flex", gap:8 },
  imgBox: { width:100, height:100, background:"#e0e0e0", borderRadius:10, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  img: { width:"100%", height:"100%", objectFit:"cover" },
  imgPh: { fontSize:9, color:"#aaa", textAlign:"center" },
  fieldBox: { background:"#f8f8f8", borderRadius:10, padding:"10px 12px", fontSize:14, color:DARK, border:`1px solid ${BORDER}` },
  priceText: { fontSize:22, fontWeight:800, color:DARK, margin:0 },
  textarea: { background:"#f8f8f8", borderRadius:10, padding:"10px 12px", fontSize:13, color:DARK, border:`1px solid ${BORDER}`, lineHeight:1.7, whiteSpace:"pre-line" },
  btnRow: { display:"flex", gap:10 },
  btnOutline: { flex:1, padding:"13px", background:"white", color:DARK, border:`1.5px solid ${BORDER}`, borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  btnPrimary: { flex:1.5, padding:"13px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
};