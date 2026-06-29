import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── カラー ─────────────────────────────────────────
const G      = "#2A7A50";
const G2     = "#34A36A";
const GL     = "#E6F4EC";
const GRAY   = "#8A8A8E";
const DARK   = "#1C1C1E";
const BORDER = "#F0F0F0";
const BG     = "#F5F8F6";

// ── ダミーデータ ────────────────────────────────────
const historyData = [
  { id:1, date:"2026/05/18", name:"Panasonic 炊飯器 3合",    price:"¥3,200〜¥5,500",   tag:"買取店", done:false },
  { id:2, date:"2026/05/10", name:"NIKE AIR MAX 27cm",       price:"¥8,000〜¥12,000",  tag:"フリマ",  done:true  },
  { id:3, date:"2026/04/29", name:"COACH ショルダーバッグ",   price:"¥15,000〜¥22,000", tag:"フリマ",  done:true  },
  { id:4, date:"2026/04/12", name:"iPad Air 第5世代",         price:"¥40,000〜¥55,000", tag:"買取店", done:true  },
  { id:5, date:"2026/03/30", name:"ユニクロ ダウンジャケット", price:"¥2,500〜¥4,000",  tag:"処分",   done:true  },
];

const statsData = {
  total:     12,
  sold:       9,
  totalYen:  "¥148,500",
  avgYen:    "¥16,500",
  monthly: [3, 5, 2, 7, 4, 8, 6, 9, 4, 5, 7, 12],
  breakdown: [
    { label:"フリマ",  count:6, pct:50, color: G         },
    { label:"買取店",  count:4, pct:33, color:"#E07B00"  },
    { label:"処分",    count:2, pct:17, color:"#D04040"  },
  ],
};

const tagColor = { "フリマ":"#2A7A50", "買取店":"#E07B00", "処分":"#D04040" };

// ── タブ定義 ────────────────────────────────────────
const TABS = [
  { key:"home",     label:"ホーム",  Icon: HomeIcon     },
  { key:"history",  label:"履歴",    Icon: HistoryIcon  },
  { key:"stats",    label:"統計",    Icon: StatsIcon    },
  { key:"settings", label:"設定",    Icon: SettingsIcon },
];

// ── メインコンポーネント ────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");

  return (
    <div style={s.root}>
      {/* ステータスバー */}
      <div style={s.status}>
        <span style={s.statusTime}>12:30</span>
        <span style={s.statusRight}>▲▲ 🔋</span>
      </div>

      {/* ヘッダー */}
      <div style={s.header}>
        <span style={s.logo}>PicSell</span>
        <div style={s.badge}><span style={s.badgeText}>PicSell</span></div>
      </div>

      {/* コンテンツ */}
      <div style={s.content}>
        {tab === "home"     && <HomeScreen     navigate={navigate} />}
        {tab === "history"  && <HistoryScreen  navigate={navigate} />}
        {tab === "stats"    && <StatsScreen />}
        {tab === "settings" && <SettingsScreen navigate={navigate} />}
      </div>

      {/* ボトムタブ */}
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
    </div>
  );
}

// ── ホーム画面 ──────────────────────────────────────
function HomeScreen({ navigate }) {
  return (
    <div style={s.page}>
      <p style={s.greeting}>今日も不用品を賢く手放そう 👋</p>

      {/* カメラカード */}
      <div style={s.heroCard}>
        <div style={s.heroGlow} />
        <div style={s.heroIconWrap}>
          <CameraIcon size={40} color="white" />
        </div>
        <p style={s.heroTitle}>アイテムを査定する</p>
        <p style={s.heroSub}>写真1枚で相場と最適な手放し方を提案</p>
        {/* ✅ カメラ画面へ遷移 */}
        <button style={s.btnCamera} onClick={() => navigate("/camera")}>
          <CameraIcon size={17} color="white" />
          <span style={{ marginLeft: 8 }}>カメラを起動</span>
        </button>
        <button style={s.btnAlbum} onClick={() => navigate("/camera")}>
          <AlbumIcon size={14} color={GRAY} />
          <span style={{ marginLeft: 6, color: GRAY, fontSize: 13 }}>アルバムから選ぶ</span>
        </button>
      </div>

      {/* ミニ実績 */}
      <div style={s.miniStats}>
        {[
          { label:"査定件数",   value:"12件"      },
          { label:"手放し済み", value:"9件"       },
          { label:"累計推定額", value:"¥148,500"  },
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

// ── 履歴画面 ──────────────────────────────────────
function HistoryScreen({ navigate }) {
  return (
    <div style={{ ...s.page, gap: 0 }}>
      <p style={s.pageTitle}>査定履歴</p>
      <div style={s.historyList}>
        {historyData.map((item, i) => (
          <div
            key={item.id}
            style={{ ...s.historyRow, borderBottom: i < historyData.length - 1 ? `1px solid ${BORDER}` : "none", cursor:"pointer" }}
            onClick={() => navigate("/result")}
          >
            <div style={s.rowIcon}><CalIcon color={G} /></div>
            <div style={s.rowBody}>
              <p style={s.rowName}>{item.name}</p>
              <p style={s.rowDate}>{item.date}</p>
            </div>
            <div style={s.rowRight}>
              <span style={{ ...s.tag, background: tagColor[item.tag] + "18", color: tagColor[item.tag] }}>{item.tag}</span>
              <p style={s.rowPrice}>{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 統計画面 ──────────────────────────────────────
function StatsScreen() {
  const max = Math.max(...statsData.monthly);
  const months = ["1","2","3","4","5","6","7","8","9","10","11","12"];

  return (
    <div style={s.statsPage}>
      <p style={s.pageTitle}>あなたの実績</p>

      <div style={s.statGrid}>
        {[
          { label:"総査定数",   value: statsData.total + "件", color: G         },
          { label:"手放し済み", value: statsData.sold  + "件", color: "#E07B00" },
          { label:"累計推定額", value: statsData.totalYen,     color: G         },
          { label:"平均査定額", value: statsData.avgYen,       color: "#5B6CF6" },
        ].map(({ label, value, color }) => (
          <div key={label} style={s.statCard}>
            <p style={{ ...s.statValue, color }}>{value}</p>
            <p style={s.statLabel}>{label}</p>
          </div>
        ))}
      </div>

      <div style={s.chartCard}>
        <p style={s.chartTitle}>月別査定数</p>
        <div style={s.bars}>
          {statsData.monthly.map((v, i) => (
            <div key={i} style={s.barCol}>
              <div style={{ ...s.bar, height: `${(v / max) * 80}px`, background: i === 11 ? G : GL, border: i === 11 ? "none" : `1px solid ${G}44` }} />
              <span style={s.barLabel}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={s.breakCard}>
        <p style={s.chartTitle}>手放し方の内訳</p>
        {statsData.breakdown.map(({ label, count, pct, color }) => (
          <div key={label} style={s.breakRow}>
            <span style={s.breakLabel}>{label}</span>
            <div style={s.breakBarBg}>
              <div style={{ ...s.breakBar, width: `${pct}%`, background: color }} />
            </div>
            <span style={{ ...s.breakPct, color }}>{count}件</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 設定画面 ──────────────────────────────────────
function SettingsScreen({ navigate }) {
  const items = [
    { label:"アカウント情報",       route:"/setting" },
    { label:"通知設定",             route:"/setting" },
    { label:"プラン",               route:"/plan"    },
    { label:"利用規約",             route:null       },
    { label:"プライバシーポリシー", route:null       },
    { label:"ログアウト",           route:"/",       red: true },
  ];
  return (
    <div style={{ ...s.page, gap: 0 }}>
      <p style={s.pageTitle}>設定</p>
      <div style={s.settingList}>
        {items.map(({ label, red, route }, i) => (
          <div
            key={label}
            style={{ ...s.settingRow, borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : "none" }}
            onClick={() => route && navigate(route)}
          >
            <span style={{ ...s.settingLabel, color: red ? "#D04040" : DARK }}>{label}</span>
            <span style={{ color: GRAY, fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── アイコン ────────────────────────────────────────
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
function CalIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
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

// ── スタイル ────────────────────────────────────────
const s = {
  root: {
    width: "100%", height: "100dvh", background: BG,
    display: "flex", flexDirection: "column",
    fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
    overflow: "hidden", maxWidth: 430, margin: "0 auto",
  },
  status: { background: G, display: "flex", justifyContent: "space-between", padding: "12px 24px 0", flexShrink: 0 },
  statusTime:  { color: "white", fontSize: 14, fontWeight: 600 },
  statusRight: { color: "white", fontSize: 12 },
  header: { background: G, padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 },
  logo:      { color: "white", fontSize: 22, fontWeight: 800 },
  badge:     { background: "white", borderRadius: 8, padding: "4px 10px" },
  badgeText: { color: G, fontSize: 13, fontWeight: 700 },
  content:   { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
  page:      { flex: 1, padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" },
  pageTitle: { fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 8px 2px" },
  greeting:  { fontSize: 13, color: GRAY, margin: "0 0 0 2px", fontWeight: 500 },
  heroCard: {
    background: "white", borderRadius: 22, padding: "22px 20px 16px",
    display: "flex", flexDirection: "column", alignItems: "center",
    boxShadow: "0 4px 20px rgba(42,122,80,0.10)", position: "relative", overflow: "hidden", flexShrink: 0,
  },
  heroGlow: {
    position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)",
    width: 180, height: 180, borderRadius: 90,
    background: "radial-gradient(circle, rgba(42,122,80,0.10) 0%, transparent 70%)",
  },
  heroIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 6px 20px rgba(42,122,80,0.30)", marginBottom: 12, position: "relative", zIndex: 1,
  },
  heroTitle: { fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 4px", zIndex: 1 },
  heroSub:   { fontSize: 12, color: GRAY, margin: "0 0 18px", textAlign: "center", zIndex: 1 },
  btnCamera: {
    width: "100%", background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`,
    color: "white", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 16, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 8,
    boxShadow: "0 4px 16px rgba(42,122,80,0.28)",
  },
  btnAlbum: {
    width: "100%", background: "white", border: `1.5px solid ${BORDER}`,
    borderRadius: 14, padding: "10px 0", fontSize: 13,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  miniStats:     { background: "white", borderRadius: 18, display: "flex", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", flexShrink: 0 },
  miniStatItem:  { flex: 1, padding: "14px 8px", textAlign: "center", borderRight: `1px solid ${BORDER}` },
  miniStatValue: { fontSize: 15, fontWeight: 800, color: G, margin: "0 0 3px" },
  miniStatLabel: { fontSize: 10, color: GRAY, margin: 0 },
  historyList:   { background: "white", borderRadius: 18, overflow: "auto", flex: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
  historyRow:    { display: "flex", alignItems: "center", padding: "13px 16px", gap: 12 },
  rowIcon:       { width: 36, height: 36, borderRadius: 10, background: GL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  rowBody:       { flex: 1, minWidth: 0 },
  rowName:       { fontSize: 13, fontWeight: 600, color: DARK, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  rowDate:       { fontSize: 11, color: GRAY, margin: "3px 0 0" },
  rowRight:      { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  tag:           { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 },
  rowPrice:      { fontSize: 11, color: GRAY, margin: 0 },
  statsPage:     { flex: 1, padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" },
  statGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  statCard:      { background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  statValue:     { fontSize: 20, fontWeight: 800, margin: "0 0 4px" },
  statLabel:     { fontSize: 11, color: GRAY, margin: 0 },
  chartCard:     { background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  chartTitle:    { fontSize: 13, fontWeight: 700, color: DARK, margin: "0 0 12px" },
  bars:          { display: "flex", alignItems: "flex-end", gap: 4, height: 96 },
  barCol:        { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" },
  bar:           { width: "100%", borderRadius: 4, minHeight: 4, transition: "height 0.3s" },
  barLabel:      { fontSize: 8, color: GRAY },
  breakCard:     { background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 16 },
  breakRow:      { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  breakLabel:    { fontSize: 12, color: DARK, width: 44, flexShrink: 0 },
  breakBarBg:    { flex: 1, height: 8, borderRadius: 4, background: BORDER },
  breakBar:      { height: 8, borderRadius: 4 },
  breakPct:      { fontSize: 12, fontWeight: 700, width: 24, textAlign: "right" },
  settingList:   { background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
  settingRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 18px", cursor: "pointer" },
  settingLabel:  { fontSize: 15 },
  tabBar:        { display: "flex", background: "white", borderTop: `1px solid ${BORDER}`, padding: "8px 0 28px", flexShrink: 0 },
  tabBtn:        { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 0 0", position: "relative" },
  tabLine:       { position: "absolute", top: 0, width: 28, height: 3, borderRadius: 2, background: G },
  tabLabel:      { fontSize: 10, letterSpacing: 0.2 },
};
