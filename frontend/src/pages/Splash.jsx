import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const G = "#2A7A50"; const G2 = "#34A36A";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={s.root}>
      <div style={s.inner}>
        <div style={s.circle}>
          <CamIcon size={44} color="white" />
        </div>
        <p style={s.logo}>PicSell</p>
        <p style={s.sub}>写真を撮って、チェックするだけ。{"\n"}売値をAIが提案する。</p>
      </div>
    </div>
  );
}

function CamIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:`linear-gradient(160deg,${G} 0%,${G2} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  inner: { display:"flex", flexDirection:"column", alignItems:"center", gap:16 },
  circle: { width:90, height:90, borderRadius:45, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 32px rgba(0,0,0,0.15)" },
  logo: { fontSize:40, fontWeight:800, color:"white", margin:0 },
  sub: { fontSize:13, color:"rgba(255,255,255,0.8)", textAlign:"center", whiteSpace:"pre-line", lineHeight:1.8, margin:0 },
};
