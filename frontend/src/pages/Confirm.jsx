import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const BORDER = "#F0F0F0";

export default function Confirm() {
  const navigate = useNavigate();
  const image = sessionStorage.getItem("capturedImage");

  return (
    <div style={s.root}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>確認</span>
        <div style={{ width:40 }} />
      </div>

      <div style={s.preview}>
        <div style={s.imgWrap}>
          {image ? (
            <img src={image} alt="撮影した商品画像" style={s.img} />
          ) : (
            <p style={s.placeholder}>画像が見つかりません</p>
          )}
        </div>
      </div>

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
  header: { background:"rgba(0,0,0,0.2)", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  backBtn: { width:40, height:40, borderRadius:20, background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 },
  headerTitle: { color:"white", fontSize:17, fontWeight:700 },
  preview: { flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  imgWrap: { width:"100%", maxHeight:460, borderRadius:18, background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", aspectRatio:"4/3", overflow:"hidden" },
  img: { width:"100%", height:"100%", objectFit:"cover", display:"block" },
  placeholder: { color:"rgba(255,255,255,0.8)", fontSize:13, textAlign:"center" },
  bottom: { background:"white", borderRadius:"18px 18px 0 0", padding:"20px 20px 36px", flexShrink:0 },
  btnRow: { display:"flex", gap:10, marginBottom:14 },
  btnRetake: { flex:1, padding:"13px", background:"white", color:"#1C1C1E", border:`1.5px solid ${BORDER}`, borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  btnAssess: { flex:1.5, padding:"13px", background:"#1C1C1E", color:"white", border:"none", borderRadius:14, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" },
  aiMsg: { fontSize:13, color:"#555", display:"flex", alignItems:"center", gap:6 },
};