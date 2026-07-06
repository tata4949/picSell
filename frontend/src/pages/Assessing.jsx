import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const G = "#2A7A50"; const G2 = "#34A36A"; const GL = "#E6F4EC";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BG = "#F5F8F6";

export default function Assessing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    "商品を認識中...",
    "相場を検索中...",
    "査定額を計算中...",
    "結果をまとめています...",
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 2600),
      setTimeout(() => navigate("/result"), 3400),
    ];
    return () => timers.forEach(clearTimeout);
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
        {/* レンズアニメーション */}
        <div style={s.lensWrap}>
          {/* 外側リング（回転） */}
          <div style={s.ringOuter} />
          {/* 中間リング（逆回転） */}
          <div style={s.ringMid} />
          {/* レンズ本体 */}
          <div style={s.lens}>
            <div style={s.lensInner}>
              <div style={s.lensCore} />
            </div>
            {/* スキャンライン */}
            <div style={s.scanLine} />
          </div>
          {/* 四隅フォーカス枠 */}
          {["topLeft","topRight","bottomLeft","bottomRight"].map(pos => (
            <div key={pos} style={{ ...s.corner, ...s[pos] }} />
          ))}
        </div>

        {/* ステップテキスト */}
        <div style={s.stepWrap}>
          {steps.map((text, i) => (
            <div key={i} style={{
              ...s.stepRow,
              opacity: i <= step ? 1 : 0.25,
              transform: i === step ? "translateX(0)" : i < step ? "translateX(0)" : "translateX(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}>
              <div style={{
                ...s.stepDot,
                background: i < step ? G : i === step ? G2 : "#ddd",
                transform: i === step ? "scale(1.3)" : "scale(1)",
                transition: "all 0.3s ease",
              }} />
              <span style={{
                ...s.stepText,
                color: i === step ? DARK : i < step ? G : GRAY,
                fontWeight: i === step ? 700 : 400,
              }}>{text}</span>
              {i < step && <span style={s.checkMark}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rotateCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rotateCCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes scanMove {
          0%   { top: 10%; opacity: 0.8; }
          50%  { top: 85%; opacity: 0.6; }
          100% { top: 10%; opacity: 0.8; }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1);    opacity: 1; }
          50%      { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

const LENS_SIZE = 180;

const s = {
  root: { width:"100%", height:"100dvh", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto", overflow:"hidden" },
  status: { background:G, display:"flex", justifyContent:"space-between", padding:"12px 24px 0", flexShrink:0 },
  statusTime: { color:"white", fontSize:14, fontWeight:600 },
  header: { background:G, padding:"8px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  headerTitle: { color:"white", fontSize:20, fontWeight:800 },
  badge: { background:"white", borderRadius:8, padding:"4px 10px" },
  badgeText: { color:G, fontSize:13, fontWeight:700 },
  content: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:40, padding:24 },

  // レンズ
  lensWrap: {
    width: LENS_SIZE, height: LENS_SIZE,
    position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: LENS_SIZE, height: LENS_SIZE,
    borderRadius: "50%",
    border: `3px solid transparent`,
    borderTopColor: G,
    borderRightColor: G,
    animation: "rotateCW 1.5s linear infinite",
  },
  ringMid: {
    position: "absolute",
    width: LENS_SIZE - 20, height: LENS_SIZE - 20,
    borderRadius: "50%",
    border: `2px solid transparent`,
    borderTopColor: G2,
    borderLeftColor: G2,
    animation: "rotateCCW 2s linear infinite",
  },
  lens: {
    width: LENS_SIZE - 40, height: LENS_SIZE - 40,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${GL} 0%, white 100%)`,
    border: `3px solid ${G}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden",
    animation: "pulse 2s ease-in-out infinite",
  },
  lensInner: {
    width: 60, height: 60,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${G2} 0%, ${G} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 0 20px rgba(42,122,80,0.4)`,
  },
  lensCore: {
    width: 24, height: 24,
    borderRadius: "50%",
    background: "white",
    opacity: 0.9,
  },
  scanLine: {
    position: "absolute",
    left: 0, right: 0,
    height: 2,
    background: `linear-gradient(90deg, transparent, ${G}, transparent)`,
    animation: "scanMove 1.8s ease-in-out infinite",
    boxShadow: `0 0 8px ${G}`,
  },

  // 四隅
  corner: {
    position: "absolute",
    width: 16, height: 16,
    borderColor: G, borderStyle: "solid",
  },
  topLeft:     { top: 0,    left: 0,    borderWidth: "3px 0 0 3px" },
  topRight:    { top: 0,    right: 0,   borderWidth: "3px 3px 0 0" },
  bottomLeft:  { bottom: 0, left: 0,    borderWidth: "0 0 3px 3px" },
  bottomRight: { bottom: 0, right: 0,   borderWidth: "0 3px 3px 0" },

  // ステップ
  stepWrap: {
    display: "flex", flexDirection: "column", gap: 14,
    width: "100%", maxWidth: 280,
    animation: "fadeUp 0.5s ease forwards",
  },
  stepRow: {
    display: "flex", alignItems: "center", gap: 12,
  },
  stepDot: {
    width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
  },
  stepText: { fontSize: 14, flex: 1 },
  checkMark: { color: G, fontSize: 14, fontWeight: 700 },
};