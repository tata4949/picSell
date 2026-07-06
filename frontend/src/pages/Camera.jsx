import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const G2 = "#34A36A"; const GRAY = "#8A8A8E";

export default function Camera() {
  const navigate = useNavigate();
  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>‹ 戻る</button>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      {/* カメラプレビュー */}
      <div style={s.preview}>
        <div style={s.focusFrame} />
        <p style={s.guide}>商品全体が枠に収まるように撮影してください</p>
      </div>

      {/* コントロール */}
      <div style={s.controls}>
        <button style={s.ctrlBtn} onClick={() => navigate(-1)}>🖼</button>
        <button style={s.shutter} onClick={() => navigate("/confirm")}>
          <div style={s.shutterInner} />
        </button>
        <button style={s.ctrlBtn}>🔄</button>
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:"#111", display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  status: { background:G, display:"flex", justifyContent:"space-between", padding:"12px 24px 0", flexShrink:0 },
  statusTime: { color:"white", fontSize:14, fontWeight:600 },
  header: { background:G, padding:"8px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  backBtn: { background:"none", border:"none", color:"white", fontSize:16, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  badge: { background:"white", borderRadius:8, padding:"4px 10px" },
  badgeText: { color:G, fontSize:13, fontWeight:700 },
  preview: { flex:1, background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" },
  focusFrame: { width:200, height:200, border:"2px solid rgba(255,255,255,0.6)", borderRadius:16, position:"absolute" },
  guide: { position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", color:"rgba(255,255,255,0.8)", fontSize:12, whiteSpace:"nowrap", background:"rgba(0,0,0,0.4)", padding:"5px 14px", borderRadius:20 },
  controls: { background:"#111", padding:"20px 40px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
  ctrlBtn: { width:48, height:48, borderRadius:24, background:"rgba(255,255,255,0.12)", border:"none", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  shutter: { width:72, height:72, borderRadius:36, background:"white", border:"5px solid rgba(255,255,255,0.35)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 0 6px rgba(255,255,255,0.15)" },
  shutterInner: { width:56, height:56, borderRadius:28, background:"white", border:"3px solid #ddd" },
};
