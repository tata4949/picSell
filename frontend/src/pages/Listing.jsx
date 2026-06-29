import { useState } from "react";
import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

const PLATFORMS = [
  { id:"mercari", icon:"📦", name:"メルカリ" },
  { id:"yahoo",   icon:"🏪", name:"ヤフオク" },
  { id:"paypay",  icon:"💳", name:"PayPayフリマ" },
];

export default function Listing() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState("mercari");

  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>‹ 戻る</button>
        <span style={s.headerTitle}>出品文を作成</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.scroll}>
        {/* 画像 */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <p style={s.cardTitle}>商品画像</p>
            <span style={s.proBadge}>PRO</span>
          </div>
          <div style={s.imgRow}>
            {["メイン", "サブ1", "サブ2"].map(label => (
              <div key={label} style={s.imgBox}>
                <img src="" alt={label} style={s.img} />
                <p style={s.imgPh}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* タイトル */}
        <div style={s.card}>
          <p style={s.cardTitle}>販売タイトル</p>
          <div style={s.fieldBox}>【美品】Nike Air Max 97 ナイキ エアマックス 27cm</div>
        </div>

        {/* 価格 */}
        <div style={s.card}>
          <p style={s.cardTitle}>販売価格</p>
          <p style={s.priceText}>¥9,500</p>
        </div>

        {/* 説明文 */}
        <div style={s.card}>
          <p style={s.cardTitle}>商品説明文</p>
          <div style={s.textarea}>
            状態の良いスニーカーです。{"\n"}【状態】目立った傷なし、美品です。{"\n"}【サイズ】27cm{"\n"}ご不明点はコメントください。
          </div>
        </div>

        {/* プラットフォーム */}
        <div style={s.card}>
          <p style={s.cardTitle}>出品先を選択</p>
          <div style={s.platformList}>
            {PLATFORMS.map(p => (
              <div key={p.id} style={{ ...s.platformItem, border: platform === p.id ? `2px solid ${G}` : `1.5px solid ${BORDER}`, background: platform === p.id ? GL : "white" }} onClick={() => setPlatform(p.id)}>
                <div style={s.platformLeft}>
                  <span style={s.platformIcon}>{p.icon}</span>
                  <span style={s.platformName}>{p.name}</span>
                </div>
                <div style={{ ...s.radio, background: platform === p.id ? G : "transparent", border: platform === p.id ? `none` : `2px solid #ccc` }} />
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div style={s.btnRow}>
          <button style={s.btnOutline}>再生成する</button>
          <button style={s.btnPrimary} onClick={() => navigate("/home")}>コピーして出品</button>
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
  scroll: { flex:1, overflowY:"auto", padding:"16px 16px 40px", display:"flex", flexDirection:"column", gap:12 },
  card: { background:"white", borderRadius:18, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:10 },
  cardHeader: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  cardTitle: { fontSize:13, fontWeight:700, color:DARK, margin:0 },
  proBadge: { background:G, color:"white", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20 },
  imgRow: { display:"flex", gap:8 },
  imgBox: { width:72, height:72, background:"#e0e0e0", borderRadius:10, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  img: { width:"100%", height:"100%", objectFit:"cover" },
  imgPh: { fontSize:9, color:"#aaa", textAlign:"center" },
  fieldBox: { background:"#f8f8f8", borderRadius:10, padding:"10px 12px", fontSize:14, color:DARK, border:`1px solid ${BORDER}` },
  priceText: { fontSize:22, fontWeight:800, color:DARK, margin:0 },
  textarea: { background:"#f8f8f8", borderRadius:10, padding:"10px 12px", fontSize:13, color:DARK, border:`1px solid ${BORDER}`, lineHeight:1.7, whiteSpace:"pre-line" },
  platformList: { display:"flex", flexDirection:"column", gap:8 },
  platformItem: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", borderRadius:12, cursor:"pointer" },
  platformLeft: { display:"flex", alignItems:"center", gap:10 },
  platformIcon: { fontSize:20 },
  platformName: { fontSize:14, fontWeight:600, color:DARK },
  radio: { width:18, height:18, borderRadius:9 },
  btnRow: { display:"flex", gap:10 },
  btnOutline: { flex:1, padding:"13px", background:"white", color:DARK, border:`1.5px solid ${BORDER}`, borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  btnPrimary: { flex:1.5, padding:"13px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
};
