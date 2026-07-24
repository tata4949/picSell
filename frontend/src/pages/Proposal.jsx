import { useState } from "react";
import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

const METHOD_INFO = {
  "フリマアプリ": { icon:"📦", name:"フリマアプリ", desc:"メルカリ・ラクマなど" },
  "買取店":       { icon:"🏪", name:"買取店",       desc:"即日現金化" },
  "処分":         { icon:"🗑️", name:"処分",         desc:"廃棄・寄付" },
};

const BUYOUT_TIPS = [
  { name:"ブックオフ", icon:"📚", point:"総合買取・全国展開" },
  { name:"ゲオ",       icon:"🎮", point:"家電・スマホ強い" },
  { name:"ハードオフ", icon:"🔧", point:"ジャンク品もOK" },
  { name:"イオシス",   icon:"📱", point:"スマホ・タブレット特化" },
];

const DISPOSAL_TIPS = [
  { icon:"♻️", title:"粗大ごみ",   desc:"自治体に申し込んで回収" },
  { icon:"🤝", title:"寄付・譲渡", desc:"ジモティーやフリマで無料出品" },
  { icon:"🏭", title:"リサイクル", desc:"家電量販店の回収ボックス" },
  { icon:"📦", title:"宅配買取",   desc:"送るだけの簡単買取サービス" },
];

export default function Proposal() {
  const navigate = useNavigate();
  const raw = sessionStorage.getItem("assessmentResult");
  const result = raw ? JSON.parse(raw) : null;
  const data = result?.data || result || {};

  const disposalMethod = data?.disposal?.method || "フリマアプリ";
  const disposalReason = data?.disposal?.reason || "";
  const options = data?.disposal?.options || ["フリマアプリ", "買取店", "処分"];
  const priceAvg = data?.price?.avg;
  const fee = priceAvg ? Math.round(priceAvg * 0.1) : null;
  const takeHome = priceAvg && fee ? priceAvg - fee : null;

  const [selected, setSelected] = useState(disposalMethod);

  return (
    <div style={s.root}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>手放し方の提案</span>
        <div style={{ width:40 }} />
      </div>

      <div style={s.scroll}>
        <div style={s.aiCard}>
          <p style={s.aiLabel}>🤖 AIのおすすめ</p>
          <p style={s.aiMethod}>{disposalMethod}</p>
          {disposalReason && <p style={s.aiReason}>{disposalReason}</p>}
        </div>

        <p style={s.sectionTitle}>手放し方を選ぶ</p>

        {options.map((method) => {
          const info = METHOD_INFO[method] || { icon:"📦", name:method, desc:"" };
          const isSelected = selected === method;
          const isRecommended = method === disposalMethod;
          return (
            <div key={method}
              style={{
                ...s.card,
                border: isSelected ? `2px solid ${G}` : `1.5px solid ${BORDER}`,
                background: isSelected ? GL : "white",
              }}
              onClick={() => setSelected(method)}
            >
              {isRecommended && <div style={s.recBadge}>おすすめ ⭐</div>}
              <div style={s.proposalRow}>
                <div style={s.propIcon}>{info.icon}</div>
                <div style={s.propInfo}>
                  <p style={s.propName}>{info.name}</p>
                  <p style={s.propDesc}>{info.desc}</p>
                </div>
                <div style={{
                  ...s.radio,
                  background: isSelected ? G : "transparent",
                  border: isSelected ? "none" : "2px solid #ccc",
                }} />
              </div>
            </div>
          );
        })}

        {selected === "フリマアプリ" && takeHome && (
          <div style={s.infoCard}>
            <p style={s.infoLabel}>フリマ出品した場合の推定手取り（手数料10%）</p>
            <p style={s.infoValue}>¥{takeHome.toLocaleString()}</p>
          </div>
        )}

        {selected === "買取店" && (
          <div style={s.extraCard}>
            <p style={s.extraTitle}>💡 高値がつきやすい買取店</p>
            {BUYOUT_TIPS.map(({ name, icon, point }) => (
              <div key={name} style={s.tipRow}>
                <span style={s.tipIcon}>{icon}</span>
                <div>
                  <p style={s.tipName}>{name}</p>
                  <p style={s.tipDesc}>{point}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected === "処分" && (
          <div style={s.extraCard}>
            <p style={s.extraTitle}>🗑️ 処分の方法</p>
            {DISPOSAL_TIPS.map(({ icon, title, desc }) => (
              <div key={title} style={s.tipRow}>
                <span style={s.tipIcon}>{icon}</span>
                <div>
                  <p style={s.tipName}>{title}</p>
                  <p style={s.tipDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected === "フリマアプリ" ? (
          <button style={s.btnPrimary} onClick={() => navigate("/listing")}>
            出品画面へ進む
          </button>
        ) : (
          <button style={s.btnPrimary} onClick={() => navigate("/home")}>
            ホームに戻る
          </button>
        )}
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
  aiCard: { background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, borderRadius:16, padding:"16px", color:"white" },
  aiLabel: { fontSize:12, opacity:0.8, margin:"0 0 4px" },
  aiMethod: { fontSize:20, fontWeight:800, margin:"0 0 6px" },
  aiReason: { fontSize:12, opacity:0.85, margin:0, lineHeight:1.6 },
  sectionTitle: { fontSize:15, fontWeight:700, color:DARK, margin:0 },
  card: { borderRadius:16, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", position:"relative", cursor:"pointer", transition:"all 0.15s ease" },
  recBadge: { position:"absolute", top:-10, left:14, background:G, color:"white", fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20 },
  proposalRow: { display:"flex", alignItems:"center", gap:12, marginTop:4 },
  propIcon: { fontSize:28, flexShrink:0 },
  propInfo: { flex:1 },
  propName: { fontSize:15, fontWeight:700, color:DARK, margin:"0 0 2px" },
  propDesc: { fontSize:12, color:GRAY, margin:0 },
  radio: { width:20, height:20, borderRadius:10, flexShrink:0 },
  infoCard: { background:GL, borderRadius:16, padding:"14px 16px", border:`1.5px solid ${G}44` },
  infoLabel: { fontSize:12, color:GRAY, margin:"0 0 4px" },
  infoValue: { fontSize:22, fontWeight:800, color:G, margin:0 },
  extraCard: { background:"white", borderRadius:16, padding:"16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:12 },
  extraTitle: { fontSize:14, fontWeight:700, color:DARK, margin:0 },
  tipRow: { display:"flex", alignItems:"flex-start", gap:12, paddingBottom:10, borderBottom:`1px solid ${BORDER}` },
  tipIcon: { fontSize:22, flexShrink:0, marginTop:2 },
  tipName: { fontSize:14, fontWeight:600, color:DARK, margin:"0 0 2px" },
  tipDesc: { fontSize:12, color:GRAY, margin:0 },
  btnPrimary: { width:"100%", padding:"16px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:16, fontSize:16, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:`0 4px 16px rgba(42,122,80,0.28)` },
};