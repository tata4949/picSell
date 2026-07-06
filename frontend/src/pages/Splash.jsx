import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const G = "#2A7A50"; const G2 = "#34A36A";

export default function Splash() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("rise"),    800);
    const t2 = setTimeout(() => setPhase("shutter"), 1500);
    const t3 = setTimeout(() => setPhase("flash"),   2000);
    const t4 = setTimeout(() => navigate("/login"),  2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const risen   = phase === "rise" || phase === "shutter" || phase === "flash";
  const closed  = phase === "shutter" || phase === "flash";
  const flashed = phase === "flash";

  return (
    <div style={s.root}>
      {/* カメラ中心から広がるフラッシュ */}
      <div style={{
        ...s.flash,
        clipPath: flashed ? "circle(150% at 50% 62%)" : "circle(0% at 50% 62%)",
        transition: flashed ? "clip-path 0.4s ease-out" : "none",
      }} />

      <div style={s.inner}>
        {/* PicSellロゴ：上にスライド */}
        <div style={{
          ...s.logoWrap,
          transform: risen ? "translateY(-32px)" : "translateY(0)",
          transition: "transform 0.7s cubic-bezier(0.34,1.2,0.64,1)",
        }}>
          <span style={s.logo}>PicSell</span>
          <span style={s.sub}>写真を撮って、チェックするだけ。{"\n"}売値をAIが提案する。</span>
        </div>

        {/* カメラアイコン：下からスライドイン */}
        <div style={{
          ...s.cameraWrap,
          opacity:   risen ? 1 : 0,
          transform: risen ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(0.34,1.2,0.64,1)",
        }}>
          <div style={s.cameraBody}>
            <CameraIcon />
            {/* シャッター閉じるオーバーレイ */}
            <div style={{
              ...s.shutterOverlay,
              transform: closed ? "scale(1)" : "scale(0)",
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
          {/* レンズ光 */}
          <div style={{
            ...s.lensGlow,
            opacity: risen && !closed ? 1 : 0,
            transition: "opacity 0.5s ease",
            animation: risen && !closed ? "glowPulse 1.5s ease-in-out infinite" : "none",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { opacity:0.4; transform:scale(1); }
          50%     { opacity:0.8; transform:scale(1.15); }
        }
      `}</style>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

const s = {
  root: {
    width: "100%", height: "100dvh",
    background: `linear-gradient(160deg,${G} 0%,${G2} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Hiragino Sans','Noto Sans JP',sans-serif",
    maxWidth: 430, margin: "0 auto",
    overflow: "hidden",
    animation: "fadeUp 0.5s ease forwards",
  },
  flash: {
    position: "fixed", inset: 0,
    background: "white", zIndex: 100,
    pointerEvents: "none",
  },
  inner: {
    display: "flex", flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  logoWrap: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 10,
  },
  logo: {
    fontSize: 44, fontWeight: 800,
    color: "white", letterSpacing: -1,
  },
  sub: {
    fontSize: 13, color: "rgba(255,255,255,0.75)",
    textAlign: "center", whiteSpace: "pre-line",
    lineHeight: 1.8, margin: 0,
  },
  cameraWrap: {
    position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginTop: 16,
  },
  cameraBody: {
    width: 80, height: 80,
    borderRadius: 24,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(4px)",
    border: "1.5px solid rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden",
  },
  shutterOverlay: {
    position: "absolute", inset: 0,
    background: "white",
    borderRadius: 24,
    transformOrigin: "center",
  },
  lensGlow: {
    position: "absolute",
    width: 100, height: 100,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)",
    pointerEvents: "none",
  },
};