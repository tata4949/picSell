import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const BORDER = "#F0F0F0"; const DARK = "#1C1C1E";

export default function Confirm() {
  const navigate = useNavigate();
  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>‹ 確認</button>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      {/* 画像プレビュー */}
      <div style={s.preview}>
        <div style={s.imgWrap}>
          {/* src="" に撮影した画像URLをセット */}
          <img src="" alt="撮影した商品画像" style={s.img} />
          <p style={s.placeholder}>撮影した商品画像（プレビュー）</p>
        </div>
      </div>

      {/* ボタン + AIメッセージ */}
      <div style={s.bottom}>
        <div style={s.btnRow}>
          <button style={s.btnRetake} onClick={() => navigate(-1)}>撮り直す</button>
          <button style={s.btnAssess} onClick={() => navigate("/assessing")}>この写真で査定する</button>
        </div>
        <p style={s.aiMsg}>AIが商品を自動で認識します</p>
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:G, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  status: { background:G, display:"flex", justifyContent:"space-between", padding:"12px 24px 0", flexShrink:0 },
  statusTime: { color:"white", fontSize:14, fontWeight:600 },
  header: { background:G, padding:"8px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  backBtn: { background:"none", border:"none", color:"white", fontSize:16, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  badge: { background:"white", borderRadius:8, padding:"4px 10px" },
  badgeText: { color:G, fontSize:13, fontWeight:700 },
  preview: { flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  imgWrap: { width:"100%", maxHeight:420, borderRadius:18, background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", aspectRatio:"4/3", overflow:"hidden" },
  img: { width:"100%", height:"100%", objectFit:"cover", display:"block" },
  placeholder: { color:"rgba(255,255,255,0.8)", fontSize:13, textAlign:"center" },
  bottom: { background:"white", borderRadius:"18px 18px 0 0", padding:"20px 20px 36px", flexShrink:0 },
  btnRow: { display:"flex", gap:10, marginBottom:14 },
  btnRetake: { flex:1, padding:"13px", background:"white", color:"#1C1C1E", border:`1.5px solid ${BORDER}`, borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  btnAssess: { flex:1.5, padding:"13px", background:"#1C1C1E", color:"white", border:"none", borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  aiMsg: { fontSize:13, color:"#555", display:"flex", alignItems:"center", gap:6 },
};
