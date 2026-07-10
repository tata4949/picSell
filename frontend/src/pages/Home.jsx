import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const G      = "#2A7A50";
const G2     = "#34A36A";
const GL     = "#E6F4EC";
const GRAY   = "#8A8A8E";
const DARK   = "#1C1C1E";
const BORDER = "#F0F0F0";
const BG     = "#F5F8F6";

const tagColor = { "フリマ":"#2A7A50", "買取店":"#E07B00", "処分":"#D04040" };

export default function App() {
  const [tab, setTab] = useState("home");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={s.root}>
      <div style={s.header}>
        <span style={s.logo}>PicSell</span>
      </div>

      <div style={s.content}>
        {tab === "home"     && <HomeScreen     key="home"     navigate={navigate} user={user} />}
        {tab === "history"  && <HistoryScreen  key="history"  navigate={navigate} />}
        {tab === "stats"    && <StatsScreen    key="stats"    />}
        {tab === "settings" && <SettingsScreen key="settings" navigate={navigate} user={user} />}
      </div>

      <div style={s.tabBar}>
        {TABS.map(({ key, label, Icon }) => {
          const active = tab === key;
          return (
            <button key={key} style={s.tabBtn} onClick={() => setTab(key)}>
              {active && <div style={s.tabLine} />}
              <Icon active={active} />
              <span style={{ ...s.tabLabel, color: active ? G : GRAY, fontWeight: active ? 700 : 400 }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

function HomeScreen({ navigate, user }) {
  const [pressingCamera, setPressingCamera] = useState(false);
  const [pressingAlbum,  setPressingAlbum]  = useState(false);

  const handleCamera = () => {
    setPressingCamera(true);
    setTimeout(() => { setPressingCamera(false); navigate("/camera"); }, 180);
  };
  const handleAlbum = () => {
    setPressingAlbum(true);
    setTimeout(() => { setPressingAlbum(false); navigate("/camera"); }, 180);
  };

  return (
    <div style={{ ...s.page, animation: "fadeIn 0.3s ease forwards" }}>
      <p style={s.greeting}>
        {user?.display_name ? `こんにちは、${user.display_name}さん 👋` : "今日も不用品を賢く手放そう 👋"}
      </p>
      <div style={s.heroCard}>
        <div style={s.heroGlow} />
        <div style={s.heroIconWrap}>
          <CameraIcon size={40} color="white" />
        </div>
        <p style={s.heroTitle}>アイテムを査定する</p>
        <p style={s.heroSub}>写真1枚で相場と最適な手放し方を提案</p>
        <button
          style={{
            ...s.btnCamera,
            transform: pressingCamera ? "scale(0.96)" : "scale(1)",
            boxShadow: pressingCamera ? "0 2px 8px rgba(42,122,80,0.18)" : "0 4px 16px rgba(42,122,80,0.28)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseDown={() => setPressingCamera(true)}
          onMouseUp={handleCamera}
          onTouchStart={() => setPressingCamera(true)}
          onTouchEnd={handleCamera}
        >
          <CameraIcon size={17} color="white" />
          <span style={{ marginLeft: 8 }}>カメラを起動</span>
        </button>
        <button
          style={{
            ...s.btnAlbum,
            transform: pressingAlbum ? "scale(0.97)" : "scale(1)",
            transition: "transform 0.15s ease",
          }}
          onMouseDown={() => setPressingAlbum(true)}
          onMouseUp={handleAlbum}
          onTouchStart={() => setPressingAlbum(true)}
          onTouchEnd={handleAlbum}
        >
          <AlbumIcon size={14} color={GRAY} />
          <span style={{ marginLeft: 6, color: GRAY, fontSize: 13 }}>アルバムから選ぶ</span>
        </button>
      </div>
      <div style={s.miniStats}>
        {[
          { label:"査定件数",   value:"0件"   },
          { label:"手放し済み", value:"0件"   },
          { label:"累計推定額", value:"¥0"    },
        ].map(({ label, value }) => (
          <div key={label} style={s.miniStatItem}>
            <p style={s.miniStatValue}>{value}</p>
            <p style={s.miniStatLabel}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryScreen({ navigate }) {
  return (
    <div style={{ ...s.page, gap: 0, animation: "fadeIn 0.3s ease forwards" }}>
      <p style={s.pageTitle}>査定履歴</p>
      <div style={s.emptyWrap}>
        <p style={s.emptyIcon}>📦</p>
        <p style={s.emptyText}>まだ査定履歴がありません</p>
        <p style={s.emptySub}>カメラで商品を撮影して査定してみましょう</p>
      </div>
    </div>
  );
}

function StatsScreen() {
  return (
    <div style={{ ...s.statsPage, animation: "fadeIn 0.3s ease forwards" }}>
      <p style={s.pageTitle}>あなたの実績</p>
      <div style={s.statGrid}>
        {[
          { label:"総査定数",   value:"0件",  color: G        },
          { label:"手放し済み", value:"0件",  color:"#E07B00" },
          { label:"累計推定額", value:"¥0",   color: G        },
          { label:"平均査定額", value:"¥0",   color:"#5B6CF6" },
        ].map(({ label, value, color }) => (
          <div key={label} style={s.statCard}>
            <p style={{ ...s.statValue, color }}>{value}</p>
            <p style={s.statLabel}>{label}</p>
          </div>
        ))}
      </div>
      <div style={s.emptyWrap}>
        <p style={s.emptyIcon}>📊</p>
        <p style={s.emptyText}>まだデータがありません</p>
        <p style={s.emptySub}>査定を行うと統計が表示されます</p>
      </div>
    </div>
  );
}

function SettingsScreen({ navigate, user }) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const items = [
    { label:"アカウント情報",       action: null         },
    { label:"通知設定",             action: null         },
    { label:"プラン",               action: () => navigate("/plan") },
    { label:"利用規約",             action: null         },
    { label:"プライバシーポリシー", action: null         },
    { label:"ログアウト",           action: handleLogout, red: true },
  ];

  return (
    <div style={{ ...s.page, gap: 0, animation: "fadeIn 0.3s ease forwards" }}>
      <div style={s.userCard}>
        <div style={s.userAvatar}>
          <span style={{ fontSize: 28 }}>👤</span>
        </div>
        <div>
          <p style={s.userName}>{user?.display_name || "ユーザー"}</p>
          <p style={s.userEmail}>{user?.email || ""}</p>
        </div>
      </div>
      <div style={s.settingList}>
        {items.map(({ label, action, red }, i) => (
          <div key={label}
            style={{ ...s.settingRow, borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : "none" }}
            onClick={() => action && action()}
          >
            <span style={{ ...s.settingLabel, color: red ? "#D04040" : DARK }}>{label}</span>
            <span style={{ color: GRAY, fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CameraIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}
function AlbumIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}
function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? G : "none"} stroke={active ? G : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function HistoryIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? G : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function StatsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? G : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}
function SettingsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? G : GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

const TABS = [
  { key:"home",     label:"ホーム",  Icon: HomeIcon     },
  { key:"history",  label:"履歴",    Icon: HistoryIcon  },
  { key:"stats",    label:"統計",    Icon: StatsIcon    },
  { key:"settings", label:"設定",    Icon: SettingsIcon },
];

const s = {
  root: { width:"100%", height:"100dvh", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", overflow:"hidden", maxWidth:430, margin:"0 auto" },
  header: { background:G, padding:"16px 20px 16px", display:"flex", alignItems:"center", flexShrink:0 },
  logo: { color:"white", fontSize:22, fontWeight:800 },
  content: { flex:1, overflow:"hidden", display:"flex", flexDirection:"column" },
  page: { flex:1, padding:"16px 16px 0", display:"flex", flexDirection:"column", gap:14, overflow:"hidden" },
  pageTitle: { fontSize:17, fontWeight:700, color:DARK, margin:"0 0 12px 2px" },
  greeting: { fontSize:13, color:GRAY, margin:"0 0 0 2px", fontWeight:500 },
  heroCard: { background:"white", borderRadius:22, padding:"22px 20px 16px", display:"flex", flexDirection:"column", alignItems:"center", boxShadow:"0 4px 20px rgba(42,122,80,0.10)", position:"relative", overflow:"hidden", flexShrink:0 },
  heroGlow: { position:"absolute", top:-50, left:"50%", transform:"translateX(-50%)", width:180, height:180, borderRadius:90, background:"radial-gradient(circle, rgba(42,122,80,0.10) 0%, transparent 70%)" },
  heroIconWrap: { width:72, height:72, borderRadius:36, background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(42,122,80,0.30)", marginBottom:12, position:"relative", zIndex:1 },
  heroTitle: { fontSize:17, fontWeight:700, color:DARK, margin:"0 0 4px", zIndex:1 },
  heroSub: { fontSize:12, color:GRAY, margin:"0 0 18px", textAlign:"center", zIndex:1 },
  btnCamera: { width:"100%", background:`linear-gradient(135deg,${G} 0%,${G2} 100%)`, color:"white", border:"none", borderRadius:14, padding:"14px 0", fontSize:16, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", marginBottom:8 },
  btnAlbum: { width:"100%", background:"white", border:`1.5px solid ${BORDER}`, borderRadius:14, padding:"10px 0", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" },
  miniStats: { background:"white", borderRadius:18, display:"flex", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", flexShrink:0 },
  miniStatItem: { flex:1, padding:"14px 8px", textAlign:"center", borderRight:`1px solid ${BORDER}` },
  miniStatValue: { fontSize:15, fontWeight:800, color:G, margin:"0 0 3px" },
  miniStatLabel: { fontSize:10, color:GRAY, margin:0 },
  emptyWrap: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 },
  emptyIcon: { fontSize:40, margin:0 },
  emptyText: { fontSize:15, fontWeight:700, color:DARK, margin:0 },
  emptySub: { fontSize:12, color:GRAY, margin:0, textAlign:"center" },
  statsPage: { flex:1, padding:"16px 16px 0", display:"flex", flexDirection:"column", gap:12, overflowY:"auto" },
  statGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  statCard: { background:"white", borderRadius:16, padding:"14px 16px", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" },
  statValue: { fontSize:20, fontWeight:800, margin:"0 0 4px" },
  statLabel: { fontSize:11, color:GRAY, margin:0 },
  userCard: { background:"white", borderRadius:18, padding:"16px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", marginBottom:12 },
  userAvatar: { width:52, height:52, borderRadius:26, background:GL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  userName: { fontSize:15, fontWeight:700, color:DARK, margin:"0 0 3px" },
  userEmail: { fontSize:12, color:GRAY, margin:0 },
  settingList: { background:"white", borderRadius:18, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" },
  settingRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 18px", cursor:"pointer" },
  settingLabel: { fontSize:15 },
  tabBar: { display:"flex", background:"white", borderTop:`1px solid ${BORDER}`, padding:"8px 0 28px", flexShrink:0 },
  tabBtn: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"6px 0 0", position:"relative" },
  tabLine: { position:"absolute", top:0, width:28, height:3, borderRadius:2, background:G },
  tabLabel: { fontSize:10, letterSpacing:0.2 },
};