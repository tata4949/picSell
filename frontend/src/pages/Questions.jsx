import { useState } from "react";
import { useNavigate } from "react-router-dom";

const G = "#2A7A50"; const G2 = "#34A36A";
const GRAY = "#8A8A8E"; const DARK = "#1C1C1E"; const BORDER = "#F0F0F0"; const BG = "#F5F8F6";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Questions() {
  const navigate = useNavigate();

  const raw = sessionStorage.getItem("assessmentResult");
  const result = raw ? JSON.parse(raw) : null;
  const questions = result?.questions || [];
  const assessmentId = result?.assessment_id || "";
  const imageUrl = result?.image_url || "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = [...answers, { question: currentQuestion.question, answer: selected }];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("assessment_id", assessmentId);
        formData.append("image_url", imageUrl);
        formData.append("answers", JSON.stringify(newAnswers));
        const token = localStorage.getItem("access_token") || "";
        const response = await fetch(`${API_BASE}/assessments/answer`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        const finalResult = await response.json();
        sessionStorage.setItem("assessmentResult", JSON.stringify(finalResult));
        navigate("/result");
      } catch (e) {
        navigate("/result");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setCurrentIndex(currentIndex - 1);
    setAnswers(answers.slice(0, -1));
    setSelected(null);
  };

  if (!currentQuestion) return null;

  return (
    <div style={s.root}>
      <div style={s.header}>
        {currentIndex > 0 ? (
          <button style={s.backBtn} onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        ) : (
          <div style={{ width:40 }} />
        )}
        <span style={s.headerTitle}>追加情報</span>
        <div style={{ width:40 }} />
      </div>

      <div style={s.content}>
        <div style={s.progressWrap}>
          <div style={s.progressBg}>
            <div style={{
              ...s.progressFill,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }} />
          </div>
          <span style={s.progressText}>{currentIndex + 1} / {questions.length}</span>
        </div>

        <div style={s.questionCard}>
          <div style={s.questionIconWrap}>
            <span style={{ fontSize:28 }}>🤔</span>
          </div>
          <p style={s.questionText}>{currentQuestion.question}</p>
        </div>

        <div style={s.optionList}>
          {currentQuestion.options.map((option) => {
            const isSelected = selected === option;
            return (
              <button
                key={option}
                style={{
                  ...s.optionBtn,
                  background: isSelected ? G : "white",
                  color: isSelected ? "white" : DARK,
                  border: isSelected ? `2px solid ${G}` : `1.5px solid ${BORDER}`,
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  boxShadow: isSelected ? `0 4px 16px rgba(42,122,80,0.25)` : "0 2px 8px rgba(0,0,0,0.06)",
                }}
                onClick={() => setSelected(option)}
                disabled={loading}
              >
                {isSelected && <span style={{ marginRight:8 }}>✓</span>}
                {option}
              </button>
            );
          })}
        </div>

        <button
          style={{
            ...s.nextBtn,
            opacity: selected ? 1 : 0.4,
            cursor: selected ? "pointer" : "not-allowed",
          }}
          onClick={handleNext}
          disabled={!selected || loading}
        >
          {loading ? "査定中..." : currentIndex < questions.length - 1 ? "次へ" : "査定する"}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

const s = {
  root: { width:"100%", height:"100dvh", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", maxWidth:430, margin:"0 auto", overflow:"hidden" },
  header: { background:G, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  backBtn: { width:40, height:40, borderRadius:20, background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 },
  headerTitle: { color:"white", fontSize:17, fontWeight:700 },
  content: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"24px 20px" },
  progressWrap: { width:"100%", display:"flex", alignItems:"center", gap:10 },
  progressBg: { flex:1, height:6, borderRadius:3, background:BORDER, overflow:"hidden" },
  progressFill: { height:"100%", borderRadius:3, background:`linear-gradient(90deg,${G},${G2})`, transition:"width 0.4s ease" },
  progressText: { fontSize:12, color:GRAY, flexShrink:0 },
  questionCard: { background:"white", borderRadius:20, padding:"28px 24px", width:"100%", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", textAlign:"center" },
  questionIconWrap: { marginBottom:12 },
  questionText: { fontSize:17, fontWeight:700, color:DARK, margin:0, lineHeight:1.6 },
  optionList: { display:"flex", flexDirection:"column", gap:10, width:"100%" },
  optionBtn: { width:"100%", padding:"16px", borderRadius:14, fontSize:15, fontWeight:600, fontFamily:"inherit", cursor:"pointer", transition:"all 0.15s ease", display:"flex", alignItems:"center", justifyContent:"center" },
  nextBtn: { width:"100%", padding:"16px", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:14, fontSize:16, fontWeight:700, fontFamily:"inherit", boxShadow:`0 4px 16px rgba(42,122,80,0.28)` },
};