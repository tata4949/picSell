import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const G = "#2A7A50"; const GL = "#E6F4EC"; const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

export default function Assessing() {
  const navigate = useNavigate();
  // 3秒後に自動遷移
  useEffect(() => {
    const t = setTimeout(() => navigate("/result"), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={s.root}>
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={{ color:"white", fontSize:12 }}>▲▲ 🔋</span>
      </div>
      <div style={s.header}>
        <span style={s.headerTitle}>査定中</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      <div style={s.content}>
        <div style={s.card}>
          <div style={s.iconWrap}>
            <span style={{ fontSize:20 }}>🏷️</span>
          </div>
          <div>
            <p style={s.label}>準備中...</p>
            <p style={s.sub}>AIが起動しています</p>
          </div>
        </div>

        {/* ローディングアニメーション */}
        <div style={s.loadingWrap}>
          <div style={s.dots}>
            {[0,1,2].map(i => (
              <div key={i} style={{ ...s.dot, animationDelay:`${i * 0.3}s` }} />
            ))}
          </div>
          <p style={s.loadingText}>AI解析中...</p>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
        .dot { animation: bounce 1.4s infinite ease-in-out; }
      `}</style>
    </div>
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
  content: { flex:1, padding:16, display:"flex", flexDirection:"column", gap:16 },
  card: { background:"white", borderRadius:16, padding:"16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  iconWrap: { width:44, height:44, borderRadius:12, background:GL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  label: { fontSize:15, fontWeight:700, color:DARK, margin:"0 0 3px" },
  sub: { fontSize:12, color:GRAY, margin:0 },
  loadingWrap: { display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginTop:32 },
  dots: { display:"flex", gap:8 },
  dot: { width:12, height:12, borderRadius:6, background:G },
  loadingText: { fontSize:13, color:GRAY },
};
