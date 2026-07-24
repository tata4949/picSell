import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const G = "#2A7A50";

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [error, setError] = useState("");

  const startCamera = async (mode) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      setError("カメラにアクセスできませんでした");
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [facingMode]);

  const handleShutter = () => {
    const canvas = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    sessionStorage.setItem("capturedImage", dataUrl);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    navigate("/confirm");
  };

  const handleAlbum = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      sessionStorage.setItem("capturedImage", ev.target.result);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      navigate("/confirm");
    };
    reader.readAsDataURL(file);
  };

  const handleFlip = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  const handleBack = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    navigate(-1);
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={s.headerTitle}>撮影</span>
        <div style={{ width:40 }} />
      </div>

      <div style={s.preview}>
        {error ? (
          <p style={s.errorText}>{error}</p>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted style={s.video} />
        )}
        <div style={s.focusFrame} />
        <p style={s.guide}>商品全体が枠に収まるように撮影してください</p>
      </div>

      <div style={s.controls}>
        <button style={s.ctrlBtn} onClick={() => fileInputRef.current.click()}>
          🖼
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display:"none" }}
          onChange={handleAlbum}
        />
        <button style={s.shutter} onClick={handleShutter}>
          <div style={s.shutterInner} />
        </button>
        <button style={s.ctrlBtn} onClick={handleFlip}>🔄</button>
      </div>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:"#000", display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto" },
  header: { background:"rgba(0,0,0,0.4)", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, position:"absolute", top:0, left:0, right:0, zIndex:10 },
  backBtn: { width:40, height:40, borderRadius:20, background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 },
  headerTitle: { color:"white", fontSize:17, fontWeight:700 },
  preview: { flex:1, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" },
  video: { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" },
  focusFrame: { width:220, height:220, border:"2px solid rgba(255,255,255,0.7)", borderRadius:16, position:"absolute", zIndex:2 },
  guide: { position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", color:"rgba(255,255,255,0.9)", fontSize:12, whiteSpace:"nowrap", background:"rgba(0,0,0,0.5)", padding:"5px 14px", borderRadius:20, zIndex:2 },
  controls: { background:"#111", padding:"20px 40px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
  ctrlBtn: { width:48, height:48, borderRadius:24, background:"rgba(255,255,255,0.12)", border:"none", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  shutter: { width:72, height:72, borderRadius:36, background:"white", border:"5px solid rgba(255,255,255,0.35)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 0 6px rgba(255,255,255,0.15)" },
  shutterInner: { width:56, height:56, borderRadius:28, background:"white", border:"3px solid #ddd" },
  errorText: { color:"white", fontSize:14, textAlign:"center", padding:20 },
};