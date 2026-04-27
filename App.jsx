import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DESIGN SYSTEM — Industrial-Tech Aesthetic
// Dark slate + Electric Cyan + Amber warnings
// Font: Rajdhani (display) + DM Mono (data)
// ============================================================

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-void: #080c12;
      --bg-deep: #0d1421;
      --bg-panel: #111827;
      --bg-card: #161f2e;
      --bg-raised: #1c2a3f;
      --border: rgba(56, 189, 248, 0.12);
      --border-bright: rgba(56, 189, 248, 0.35);
      --cyan: #38bdf8;
      --cyan-dim: rgba(56, 189, 248, 0.15);
      --cyan-glow: rgba(56, 189, 248, 0.4);
      --amber: #f59e0b;
      --amber-dim: rgba(245, 158, 11, 0.15);
      --red: #ef4444;
      --red-dim: rgba(239, 68, 68, 0.15);
      --green: #22c55e;
      --green-dim: rgba(34, 197, 94, 0.15);
      --purple: #a78bfa;
      --text-primary: #e2e8f0;
      --text-secondary: #94a3b8;
      --text-dim: #475569;
      --font-display: 'Rajdhani', sans-serif;
      --font-mono: 'DM Mono', monospace;
      --font-body: 'Inter', sans-serif;
    }

    html { background: var(--bg-void); }
    body { font-family: var(--font-body); color: var(--text-primary); background: var(--bg-void); overflow-x: hidden; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg-deep); }
    ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }

    @keyframes pulse-cyan { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes slide-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
    @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes alert-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }

    .animate-slide { animation: slide-in 0.4s ease both; }
    .animate-fade { animation: fade-in 0.3s ease both; }
    .animate-pulse-cyan { animation: pulse-cyan 2s infinite; }
    .animate-spin { animation: spin 1s linear infinite; }
    .animate-alert { animation: alert-pulse 1.5s infinite; }

    button { cursor: pointer; border: none; outline: none; }
    input, select, textarea { outline: none; }
  `}</style>
);

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_STUDENTS = [
  { id: "S001", name: "Priya Sharma", prn: "72253299H", dept: "Computer Engineering", year: "4th", guardian: "Rajesh Sharma", phone: "+91-9876543210", email: "rajesh@gmail.com", status: "present", enrolled: true, division: "A" },
  { id: "S002", name: "Arjun Mehta", prn: "72208990C", dept: "Computer Engineering", year: "4th", guardian: "Sunita Mehta", phone: "+91-9876543211", email: "sunita@gmail.com", status: "absent", enrolled: true, division: "A" },
  { id: "S003", name: "Kavya Reddy", prn: "72253298K", dept: "Computer Engineering", year: "4th", guardian: "Venkat Reddy", phone: "+91-9876543212", email: "venkat@gmail.com", status: "truancy", enrolled: true, division: "B" },
  { id: "S004", name: "Rohan Desai", prn: "72253277G", dept: "Computer Engineering", year: "4th", guardian: "Meena Desai", phone: "+91-9876543213", email: "meena@gmail.com", status: "present", enrolled: true, division: "A" },
  { id: "S005", name: "Ananya Joshi", prn: "72253301J", dept: "Computer Engineering", year: "4th", guardian: "Suresh Joshi", phone: "+91-9876543214", email: "suresh@gmail.com", status: "present", enrolled: true, division: "B" },
  { id: "S006", name: "Vikas Kumar", prn: "72253302K", dept: "Computer Engineering", year: "4th", guardian: "Rekha Kumar", phone: "+91-9876543215", email: "rekha@gmail.com", status: "absent", enrolled: false, division: "A" },
];

const MOCK_TIMETABLE = [
  { id: "L001", subject: "Operating Systems", faculty: "Dr. Shah", room: "CR-301", day: "Monday", start: "09:00", end: "10:00", dept: "Computer Engineering", year: "4th", division: "A" },
  { id: "L002", subject: "Machine Learning", faculty: "Dr. Patel", room: "CR-302", day: "Monday", start: "10:00", end: "11:00", dept: "Computer Engineering", year: "4th", division: "A" },
  { id: "L003", subject: "Computer Networks", faculty: "Dr. Gupta", room: "CR-303", day: "Monday", start: "11:00", end: "12:00", dept: "Computer Engineering", year: "4th", division: "B" },
  { id: "L004", subject: "Database Systems", faculty: "Dr. Sonwane", room: "CR-301", day: "Monday", start: "14:00", end: "15:00", dept: "Computer Engineering", year: "4th", division: "A" },
  { id: "L005", subject: "Software Engineering", faculty: "Dr. Bhandari", room: "CR-302", day: "Monday", start: "15:00", end: "16:00", dept: "Computer Engineering", year: "4th", division: "B" },
];

const MOCK_ATTENDANCE_LOGS = [
  { id: "A001", studentId: "S001", studentName: "Priya Sharma", room: "CR-301", subject: "Operating Systems", time: "09:03", date: "2026-04-27", status: "PRESENT", confidence: 0.94 },
  { id: "A002", studentId: "S004", studentName: "Rohan Desai", room: "CR-301", subject: "Operating Systems", time: "09:05", date: "2026-04-27", status: "PRESENT", confidence: 0.91 },
  { id: "A003", studentId: "S005", studentName: "Ananya Joshi", room: "CR-302", subject: "Machine Learning", time: "10:02", date: "2026-04-27", status: "PRESENT", confidence: 0.97 },
  { id: "A004", studentId: "S002", studentName: "Arjun Mehta", room: "CR-301", subject: "Operating Systems", time: "09:00", date: "2026-04-27", status: "ABSENT", confidence: 0 },
];

const MOCK_TRUANCY_EVENTS = [
  { id: "T001", studentId: "S003", studentName: "Kavya Reddy", location: "Canteen", scheduledSubject: "Computer Networks", time: "11:14", date: "2026-04-27", alertSent: true, confidence: 0.89 },
  { id: "T002", studentId: "S002", studentName: "Arjun Mehta", location: "Canteen", scheduledSubject: "Operating Systems", time: "09:22", date: "2026-04-27", alertSent: true, confidence: 0.92 },
];

const MOCK_ALERTS = [
  { id: "N001", studentName: "Kavya Reddy", guardian: "Venkat Reddy", message: "Kavya Reddy was detected in Canteen during Computer Networks lecture (11:14)", channels: ["SMS", "Email", "WhatsApp"], time: "11:14", status: "delivered" },
  { id: "N002", studentName: "Arjun Mehta", guardian: "Sunita Mehta", message: "Arjun Mehta was detected in Canteen during Operating Systems lecture (09:22)", channels: ["SMS", "Email"], time: "09:22", status: "delivered" },
  { id: "N003", studentName: "Arjun Mehta", guardian: "Sunita Mehta", message: "Arjun Mehta was ABSENT from Operating Systems lecture today", channels: ["Email"], time: "10:15", status: "pending" },
];

// ============================================================
// UTILITY COMPONENTS
// ============================================================

const Badge = ({ color = "cyan", children, size = "sm" }) => {
  const colors = {
    cyan: { bg: "var(--cyan-dim)", border: "rgba(56,189,248,0.3)", text: "var(--cyan)" },
    amber: { bg: "var(--amber-dim)", border: "rgba(245,158,11,0.3)", text: "var(--amber)" },
    red: { bg: "var(--red-dim)", border: "rgba(239,68,68,0.3)", text: "var(--red)" },
    green: { bg: "var(--green-dim)", border: "rgba(34,197,94,0.3)", text: "var(--green)" },
    purple: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", text: "var(--purple)" },
  };
  const c = colors[color] || colors.cyan;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: 4, padding: size === "sm" ? "2px 8px" : "4px 12px",
      fontFamily: "var(--font-mono)", fontSize: size === "sm" ? 10 : 12, fontWeight: 500,
      letterSpacing: "0.05em", textTransform: "uppercase",
    }}>{children}</span>
  );
};

const StatCard = ({ icon, label, value, sub, color = "cyan", delay = 0 }) => (
  <div className="animate-slide" style={{
    animationDelay: `${delay}ms`,
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "20px 24px", position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `var(--${color})`, opacity: 0.6 }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: `var(--${color})`, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: "var(--text-dim)", fontSize: 11, marginTop: 6 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 28, opacity: 0.4 }}>{icon}</div>
    </div>
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-primary)" }}>{children}</h2>
    {sub && <p style={{ color: "var(--text-dim)", fontSize: 12, marginTop: 4 }}>{sub}</p>}
  </div>
);

const Spinner = () => (
  <div style={{ width: 16, height: 16, border: "2px solid rgba(56,189,248,0.2)", borderTopColor: "var(--cyan)", borderRadius: "50%", display: "inline-block" }} className="animate-spin" />
);

// ============================================================
// LIVE CAMERA FEED SIMULATOR
// ============================================================

const LiveFeed = ({ label, zone, onDetect }) => {
  const canvasRef = useRef(null);
  const [detected, setDetected] = useState(null);
  const [scanning, setScanning] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const names = ["Priya Sharma", "Rohan Desai", "Unknown", "Kavya Reddy"];
    let detectionTimer = null;

    const draw = () => {
      frameRef.current++;
      const w = canvas.width, h = canvas.height;
      
      // Dark background with subtle noise
      ctx.fillStyle = "#050a0f";
      ctx.fillRect(0, 0, w, h);

      // Grid overlay
      ctx.strokeStyle = "rgba(56,189,248,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // Simulated person silhouette
      const t = frameRef.current * 0.02;
      const cx = w / 2 + Math.sin(t * 0.3) * 15;
      const cy = h / 2;

      // Body
      ctx.fillStyle = "rgba(30,45,65,0.8)";
      ctx.beginPath(); ctx.ellipse(cx, cy + 30, 35, 55, 0, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.fillStyle = "rgba(45,65,85,0.9)";
      ctx.beginPath(); ctx.arc(cx, cy - 30, 25, 0, Math.PI * 2); ctx.fill();

      // Scan line
      if (scanning) {
        const scanY = ((frameRef.current * 3) % h);
        const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 5);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, "rgba(56,189,248,0.4)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 20, w, 25);
      }

      // Detection box
      if (detected) {
        const bx = cx - 35, by = cy - 60, bw = 70, bh = 90;
        const confidence = detected.confidence;
        const color = confidence > 0.85 ? "#22c55e" : "#f59e0b";
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);
        // Corner accents
        const cs = 10;
        ctx.lineWidth = 3;
        [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([px,py]) => {
          ctx.strokeStyle = color;
          ctx.beginPath(); ctx.moveTo(px, py + (py===by?cs:-cs)); ctx.lineTo(px, py); ctx.lineTo(px + (px===bx?cs:-cs), py); ctx.stroke();
        });
        // Name label
        ctx.fillStyle = color + "cc";
        ctx.fillRect(bx, by - 22, bw + 40, 20);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'DM Mono'";
        ctx.fillText(detected.name.split(" ")[0], bx + 4, by - 8);
        // Confidence bar
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(bx, by + bh + 2, bw, 6);
        ctx.fillStyle = color;
        ctx.fillRect(bx, by + bh + 2, bw * confidence, 6);
      }

      // HUD elements
      ctx.fillStyle = "rgba(56,189,248,0.7)";
      ctx.font = "10px 'DM Mono'";
      ctx.fillText(`ZONE: ${zone.toUpperCase()}`, 8, 16);
      ctx.fillText(`FPS: ${20 + Math.floor(Math.sin(t)*2)}`, w - 55, 16);
      
      // Blinking REC
      if (Math.floor(frameRef.current / 30) % 2 === 0) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(w - 12, 32, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(239,68,68,0.7)";
        ctx.fillText("REC", w - 40, 36);
      }

      // Timestamp
      const now = new Date();
      ctx.fillStyle = "rgba(56,189,248,0.5)";
      ctx.fillText(now.toLocaleTimeString(), 8, h - 8);

      raf = requestAnimationFrame(draw);
    };
    draw();

    // Simulate periodic detections
    const triggerDetection = () => {
      setScanning(true);
      setTimeout(() => {
        const randomStudent = MOCK_STUDENTS[Math.floor(Math.random() * 4)];
        const conf = 0.75 + Math.random() * 0.22;
        const det = { name: randomStudent.name, id: randomStudent.id, confidence: conf };
        setDetected(det);
        setScanning(false);
        onDetect && onDetect({ ...randomStudent, confidence: conf, zone, time: new Date().toLocaleTimeString() });
        setTimeout(() => setDetected(null), 4000);
      }, 1500);
    };

    detectionTimer = setInterval(triggerDetection, 8000);
    setTimeout(triggerDetection, 1000);

    return () => { cancelAnimationFrame(raf); clearInterval(detectionTimer); };
  }, [zone, scanning]);

  return (
    <div style={{ background: "var(--bg-void)", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
      <div style={{ background: "var(--bg-raised)", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--cyan)" }}>📷 {label}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {scanning && <><Spinner /><span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--amber)" }}>SCANNING</span></>}
          {detected && !scanning && <Badge color="green">MATCH</Badge>}
          {!scanning && !detected && <Badge color="cyan">LIVE</Badge>}
        </div>
      </div>
      <canvas ref={canvasRef} width={280} height={200} style={{ display: "block", width: "100%", height: "auto" }} />
    </div>
  );
};

// ============================================================
// FACE RECOGNITION VISUALIZER
// ============================================================

const EmbeddingVisualizer = ({ studentName }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    // Generate fake 128-d embedding bars
    ctx.fillStyle = "#050a0f";
    ctx.fillRect(0, 0, w, h);
    const bars = 64;
    const bw = w / bars;
    for (let i = 0; i < bars; i++) {
      const v = Math.random();
      const bh = v * (h - 10);
      const alpha = 0.4 + v * 0.6;
      ctx.fillStyle = `rgba(56,189,248,${alpha})`;
      ctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
    }
    // Label
    ctx.fillStyle = "rgba(56,189,248,0.5)";
    ctx.font = "9px 'DM Mono'";
    ctx.fillText("128-D FACENET EMBEDDING", 4, 10);
  }, [studentName]);
  return <canvas ref={canvasRef} width={300} height={60} style={{ display: "block", width: "100%", borderRadius: 4 }} />;
};

// ============================================================
// PAGE COMPONENTS
// ============================================================

// --- LIVE DASHBOARD ---
const DashboardPage = () => {
  const [liveEvents, setLiveEvents] = useState([]);
  const [tick, setTick] = useState(0);
  const statsRef = useRef({ present: 4, absent: 2, truancy: 1, alerts: 3 });

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDetection = useCallback((data) => {
    const event = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      name: data.name,
      zone: data.zone,
      status: data.zone === "canteen" ? "TRUANCY_CHECK" : "DETECTED",
      confidence: (data.confidence * 100).toFixed(1),
    };
    setLiveEvents(prev => [event, ...prev.slice(0, 9)]);
  }, []);

  const stats = statsRef.current;

  return (
    <div className="animate-fade">
      {/* Ticker */}
      <div style={{ background: "var(--bg-raised)", borderBottom: "1px solid var(--border)", padding: "6px 0", overflow: "hidden", marginBottom: 24, marginLeft: -24, marginRight: -24, marginTop: -24 }}>
        <div style={{ display: "flex", gap: 40, animation: "ticker 20s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, ri) =>
            [...MOCK_ATTENDANCE_LOGS, ...MOCK_TRUANCY_EVENTS].map((ev, i) => (
              <span key={`${ri}-${i}`} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
                <span style={{ color: "var(--cyan)" }}>◆</span>{" "}
                {"studentName" in ev ? ev.studentName : "Event"} — {ev.status || "TRUANCY"} @ {ev.time}
                <span style={{ margin: "0 20px", opacity: 0.3 }}>|</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard icon="✓" label="Present Today" value={stats.present} sub="of 6 students" color="green" delay={0} />
        <StatCard icon="✗" label="Absent" value={stats.absent} sub="notifications sent" color="red" delay={80} />
        <StatCard icon="⚠" label="Truancy Events" value={stats.truancy} sub="alerts dispatched" color="amber" delay={160} />
        <StatCard icon="◈" label="Total Alerts" value={stats.alerts} sub="via SMS/Email/WA" color="purple" delay={240} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Live Camera Feeds */}
        <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16 }}>
          <SectionTitle sub="Real-time ESP32-CAM streams">Live Camera Feeds</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <LiveFeed label="Classroom CR-301" zone="classroom" onDetect={handleDetection} />
            <LiveFeed label="Canteen Entry" zone="canteen" onDetect={handleDetection} />
          </div>
        </div>

        {/* Active Lectures & Live Event Log */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16, flex: 1 }}>
            <SectionTitle sub="Current lecture slots">Active Lectures</SectionTitle>
            {MOCK_TIMETABLE.slice(0, 3).map(lec => (
              <div key={lec.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{lec.subject}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: 11 }}>{lec.room} · {lec.faculty}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cyan)" }}>{lec.start}–{lec.end}</div>
                  <Badge color={lec.start === "09:00" ? "green" : "amber"}>{lec.start === "09:00" ? "LIVE" : "UPCOMING"}</Badge>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16, flex: 1 }}>
            <SectionTitle sub="Detection stream">Live Event Log</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflow: "auto" }}>
              {[...liveEvents, ...MOCK_ATTENDANCE_LOGS.slice(0, 4)].slice(0, 8).map((ev, i) => (
                <div key={ev.id || i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 10px", borderRadius: 4,
                  background: ev.status === "TRUANCY_CHECK" ? "var(--red-dim)" : "var(--bg-raised)",
                  border: `1px solid ${ev.status === "TRUANCY_CHECK" ? "rgba(239,68,68,0.2)" : "var(--border)"}`,
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>
                    {ev.studentName || ev.name}
                  </span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Badge color={ev.status === "PRESENT" || ev.status === "DETECTED" ? "green" : ev.status === "ABSENT" ? "red" : "amber"}>
                      {ev.status}
                    </Badge>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>{ev.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Truancy Events */}
      <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.25)", padding: 16 }}>
        <SectionTitle sub="Spatial-temporal conflicts detected">⚠ Truancy Events — Today</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Student", "Detected At", "Scheduled Lecture", "Time", "Confidence", "Alert Status"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_TRUANCY_EVENTS.map(ev => (
              <tr key={ev.id} style={{ borderBottom: "1px solid var(--border)" }} className="animate-alert">
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{ev.studentName}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: 11 }}>ID: {ev.studentId}</div>
                </td>
                <td style={{ padding: "10px 12px" }}><Badge color="red">{ev.location}</Badge></td>
                <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--amber)" }}>{ev.scheduledSubject}</td>
                <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 12 }}>{ev.time}</td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 4, background: "var(--bg-raised)", borderRadius: 2, minWidth: 60 }}>
                      <div style={{ height: "100%", width: `${ev.confidence * 100}%`, background: "var(--green)", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{(ev.confidence * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}><Badge color={ev.alertSent ? "green" : "amber"}>{ev.alertSent ? "SENT" : "PENDING"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- STUDENT REGISTRATION ---
const RegistrationPage = () => {
  const [formData, setFormData] = useState({ name: "", prn: "", dept: "Computer Engineering", year: "4th", division: "A", guardian: "", phone: "", email: "" });
  const [step, setStep] = useState(1);
  const [capturing, setCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const handleCapture = () => {
    setCapturing(true);
    const interval = setInterval(() => {
      setCaptureCount(c => {
        if (c >= 10) {
          clearInterval(interval);
          setCapturing(false);
          return c;
        }
        return c + 1;
      });
    }, 300);
  };

  const handleEnroll = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setEnrolled(true);
      const newStudent = { id: `S00${students.length + 1}`, ...formData, status: "pending", enrolled: true };
      setStudents(prev => [...prev, newStudent]);
      setTimeout(() => { setEnrolled(false); setStep(1); setFormData({ name: "", prn: "", dept: "Computer Engineering", year: "4th", division: "A", guardian: "", phone: "", email: "" }); setCaptureCount(0); }, 2500);
    }, 2000);
  };

  const inputStyle = { width: "100%", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: 13, transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 };

  return (
    <div className="animate-fade">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
        {/* Form */}
        <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 24 }}>
          <SectionTitle sub="Biometric identity enrollment">Student Registration</SectionTitle>

          {/* Steps */}
          <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)" }}>
            {["Student Details", "Face Capture", "Enrollment"].map((s, i) => (
              <div key={s} onClick={() => captureCount === 0 && i === 0 ? setStep(1) : null} style={{
                flex: 1, padding: "10px 0", textAlign: "center",
                background: step === i + 1 ? "var(--cyan)" : "var(--bg-raised)",
                color: step === i + 1 ? "var(--bg-void)" : "var(--text-dim)",
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
                fontWeight: step === i + 1 ? 700 : 400, transition: "all 0.2s",
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
              }}>{i + 1}. {s}</div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["name", "Full Name"], ["prn", "PRN Number"], ["guardian", "Guardian Name"], ["phone", "Guardian Phone"], ["email", "Guardian Email"]].map(([key, lbl]) => (
                <div key={key} style={{ gridColumn: key === "email" ? "1/-1" : "auto" }}>
                  <label style={labelStyle}>{lbl}</label>
                  <input style={inputStyle} value={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} placeholder={`Enter ${lbl}`} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Year</label>
                <select style={inputStyle} value={formData.year} onChange={e => setFormData(p => ({ ...p, year: e.target.value }))}>
                  {["1st", "2nd", "3rd", "4th"].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Division</label>
                <select style={inputStyle} value={formData.division} onChange={e => setFormData(p => ({ ...p, division: e.target.value }))}>
                  {["A", "B", "C"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <button onClick={() => formData.name && formData.prn && setStep(2)} style={{ width: "100%", background: "var(--cyan)", color: "var(--bg-void)", border: "none", borderRadius: 6, padding: "12px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Continue to Face Capture →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 200, height: 200, margin: "0 auto 16px", borderRadius: 8, overflow: "hidden", border: `2px solid ${captureCount >= 10 ? "var(--green)" : "var(--cyan)"}`, position: "relative", background: "var(--bg-void)" }}>
                <LiveFeed label="Registration Cam" zone="registration" />
                {captureCount > 0 && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.7)", padding: "6px 0" }}>
                    <div style={{ height: 4, background: "var(--bg-raised)", margin: "0 8px 4px" }}>
                      <div style={{ height: "100%", width: `${(captureCount / 10) * 100}%`, background: captureCount >= 10 ? "var(--green)" : "var(--cyan)", borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cyan)" }}>{captureCount}/10 FRAMES</div>
                  </div>
                )}
              </div>
              <p style={{ color: "var(--text-dim)", fontSize: 12, marginBottom: 16 }}>Position your face in the frame. System captures 10 images in varied poses.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleCapture} disabled={capturing || captureCount >= 10} style={{ flex: 1, background: captureCount >= 10 ? "var(--green-dim)" : "var(--cyan)", color: captureCount >= 10 ? "var(--green)" : "var(--bg-void)", border: captureCount >= 10 ? "1px solid var(--green)" : "none", borderRadius: 6, padding: "12px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>
                  {captureCount >= 10 ? "✓ Captured" : capturing ? "Capturing..." : "📷 Capture Faces"}
                </button>
                <button onClick={() => captureCount >= 10 && setStep(3)} disabled={captureCount < 10} style={{ flex: 1, background: captureCount >= 10 ? "var(--cyan)" : "var(--bg-raised)", color: captureCount >= 10 ? "var(--bg-void)" : "var(--text-dim)", border: "none", borderRadius: 6, padding: "12px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>
                  Generate Embeddings →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center" }}>
              {!enrolled ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{formData.name || "Student"}</div>
                    <div style={{ color: "var(--text-dim)", fontSize: 12, marginBottom: 12 }}>FaceNet 128-D embedding preview:</div>
                    <EmbeddingVisualizer studentName={formData.name} />
                  </div>
                  <div style={{ background: "var(--bg-raised)", borderRadius: 6, padding: 12, marginBottom: 16, textAlign: "left" }}>
                    {[["PRN", formData.prn], ["Department", formData.dept], ["Year / Div", `${formData.year} / ${formData.division}`], ["Guardian", formData.guardian], ["Contact", formData.phone]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase" }}>{k}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-primary)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleEnroll} style={{ width: "100%", background: processing ? "var(--bg-raised)" : "var(--green)", color: processing ? "var(--text-dim)" : "var(--bg-void)", border: "none", borderRadius: 6, padding: "14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {processing ? <><Spinner />Processing Enrollment...</> : "✓ Confirm & Enroll Student"}
                  </button>
                </>
              ) : (
                <div style={{ padding: 24 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--green)", marginBottom: 8 }}>Enrollment Successful</div>
                  <div style={{ color: "var(--text-dim)", fontSize: 13 }}>{formData.name} has been enrolled with biometric identity linked to MongoDB.</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Student List */}
        <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 24 }}>
          <SectionTitle sub={`${students.length} enrolled`}>Enrolled Students</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 580, overflow: "auto" }}>
            {students.map(s => (
              <div key={s.id} style={{ background: "var(--bg-raised)", borderRadius: 6, padding: "10px 14px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{s.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>{s.prn} · Div {s.division}</div>
                  </div>
                  <Badge color={s.enrolled ? "green" : "amber"}>{s.enrolled ? "ACTIVE" : "PENDING"}</Badge>
                </div>
                <div style={{ marginTop: 6 }}>
                  <EmbeddingVisualizer studentName={s.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ATTENDANCE MONITORING ---
const AttendancePage = () => {
  const [selectedLecture, setSelectedLecture] = useState(MOCK_TIMETABLE[0]);
  const [logs, setLogs] = useState(MOCK_ATTENDANCE_LOGS);
  const [simRunning, setSimRunning] = useState(false);

  const presentCount = logs.filter(l => l.status === "PRESENT").length;
  const absentCount = MOCK_STUDENTS.length - presentCount;
  const pct = Math.round((presentCount / MOCK_STUDENTS.length) * 100);

  const handleDetection = (data) => {
    const existing = logs.find(l => l.studentId === data.id);
    if (!existing) {
      const newLog = {
        id: `A${Date.now()}`, studentId: data.id, studentName: data.name,
        room: selectedLecture.room, subject: selectedLecture.subject,
        time: new Date().toLocaleTimeString(), date: "2026-04-27",
        status: "PRESENT", confidence: data.confidence,
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        {/* Sidebar: Lecture Selector */}
        <div>
          <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16, marginBottom: 16 }}>
            <SectionTitle sub="Select active lecture">Timetable</SectionTitle>
            {MOCK_TIMETABLE.map(lec => (
              <div key={lec.id} onClick={() => setSelectedLecture(lec)} style={{
                padding: "12px 14px", borderRadius: 6, marginBottom: 6, cursor: "pointer",
                border: `1px solid ${selectedLecture.id === lec.id ? "var(--cyan)" : "var(--border)"}`,
                background: selectedLecture.id === lec.id ? "var(--cyan-dim)" : "var(--bg-raised)",
                transition: "all 0.2s",
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: selectedLecture.id === lec.id ? "var(--cyan)" : "var(--text-primary)" }}>{lec.subject}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginTop: 3 }}>{lec.room} · {lec.start}–{lec.end}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>Div {lec.division}</div>
              </div>
            ))}
          </div>

          {/* Attendance Pie */}
          <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16 }}>
            <SectionTitle>Attendance Rate</SectionTitle>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 12px" }}>
              <svg viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg-raised)" strokeWidth="12" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--green)" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 48 * (pct / 100)} ${2 * Math.PI * 48}`} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--green)" }}>{pct}%</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)" }}>PRESENT</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--green)" }}>{presentCount}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>PRESENT</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--red)" }}>{absentCount}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>ABSENT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Active Lecture Header */}
          <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--cyan)", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--cyan)" }}>{selectedLecture.subject}</div>
                <div style={{ color: "var(--text-dim)", fontSize: 12, marginTop: 4 }}>{selectedLecture.faculty} · {selectedLecture.room} · {selectedLecture.start}–{selectedLecture.end} · Division {selectedLecture.division}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div className="animate-pulse-cyan" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
                <Badge color="green" size="lg">MONITORING ACTIVE</Badge>
              </div>
            </div>
          </div>

          {/* Live Camera */}
          <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16 }}>
            <SectionTitle sub="Real-time face detection stream">Classroom Feed</SectionTitle>
            <div style={{ maxWidth: 320 }}>
              <LiveFeed label={`${selectedLecture.room} Camera`} zone="classroom" onDetect={handleDetection} />
            </div>
          </div>

          {/* Attendance Roster */}
          <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16 }}>
            <SectionTitle sub="Auto-updated by facial recognition">Attendance Roster</SectionTitle>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["#", "Student Name", "PRN", "Detection Time", "Confidence", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.filter(s => s.division === selectedLecture.division || selectedLecture.division === "A").map((student, i) => {
                  const log = logs.find(l => l.studentId === student.id);
                  return (
                    <tr key={student.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 500 }}>{student.name}</td>
                      <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{student.prn}</td>
                      <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 11 }}>{log ? log.time : "—"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {log ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 50, height: 3, background: "var(--bg-raised)", borderRadius: 2 }}>
                              <div style={{ height: "100%", width: `${log.confidence * 100}%`, background: "var(--green)", borderRadius: 2 }} />
                            </div>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{(log.confidence * 100).toFixed(0)}%</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <Badge color={log?.status === "PRESENT" ? "green" : "red"}>{log?.status || "ABSENT"}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TRUANCY DETECTION ---
const TruancyPage = () => {
  const [events, setEvents] = useState(MOCK_TRUANCY_EVENTS);
  const [simulateActive, setSimulateActive] = useState(false);
  const [newAlert, setNewAlert] = useState(null);

  const simulateTruancy = () => {
    setSimulateActive(true);
    setTimeout(() => {
      const student = MOCK_STUDENTS[Math.floor(Math.random() * MOCK_STUDENTS.length)];
      const lecture = MOCK_TIMETABLE[Math.floor(Math.random() * MOCK_TIMETABLE.length)];
      const ev = {
        id: `T${Date.now()}`, studentId: student.id, studentName: student.name,
        location: "Canteen", scheduledSubject: lecture.subject,
        time: new Date().toLocaleTimeString(), date: "2026-04-27",
        alertSent: false, confidence: 0.78 + Math.random() * 0.2,
      };
      setEvents(prev => [ev, ...prev]);
      setNewAlert(ev);
      setTimeout(() => {
        setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, alertSent: true } : e));
        setTimeout(() => setNewAlert(null), 3000);
      }, 2000);
      setSimulateActive(false);
    }, 1500);
  };

  return (
    <div className="animate-fade">
      {/* Alert Toast */}
      {newAlert && (
        <div className="animate-alert" style={{
          position: "fixed", top: 24, right: 24, background: "var(--bg-card)", border: "1px solid var(--red)",
          borderRadius: 8, padding: 16, zIndex: 999, width: 320, boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>TRUANCY DETECTED</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{newAlert.studentName} detected in {newAlert.location} during {newAlert.scheduledSubject}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginTop: 6 }}>Dispatching guardian alert via SMS + Email + WhatsApp...</div>
            </div>
          </div>
        </div>
      )}

      {/* Logic Engine Diagram */}
      <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 20, marginBottom: 20 }}>
        <SectionTitle sub="Spatial-temporal timetable cross-referencing">Truancy Detection Logic Engine</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", padding: "8px 0" }}>
          {[
            { icon: "📷", label: "Canteen Camera", sub: "ESP32-CAM" },
            { icon: "→", label: "", sub: "", arrow: true },
            { icon: "🧠", label: "Face Recognition", sub: "FaceNet + Cosine Sim" },
            { icon: "→", label: "", sub: "", arrow: true },
            { icon: "📅", label: "Timetable Query", sub: "MongoDB lookup" },
            { icon: "→", label: "", sub: "", arrow: true },
            { icon: "⚖", label: "Logic Evaluation", sub: "Conflict detection" },
            { icon: "→", label: "", sub: "", arrow: true },
            { icon: "🔔", label: "Alert Dispatch", sub: "RabbitMQ → Twilio" },
          ].map((step, i) => (
            step.arrow ? (
              <div key={i} style={{ padding: "0 8px", color: "var(--cyan)", fontSize: 18 }}>→</div>
            ) : (
              <div key={i} style={{ flex: "0 0 auto", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{step.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12 }}>{step.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)" }}>{step.sub}</div>
              </div>
            )
          ))}
        </div>
        
        {/* Logic Pseudocode */}
        <div style={{ background: "var(--bg-void)", borderRadius: 6, padding: 16, marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.8 }}>
          <div style={{ color: "var(--text-dim)", marginBottom: 4 }}>// Truancy Detection Algorithm</div>
          <div><span style={{ color: "var(--purple)" }}>IF</span> <span style={{ color: "var(--cyan)" }}>detected_location</span> == <span style={{ color: "var(--amber)" }}>"CANTEEN"</span></div>
          <div style={{ paddingLeft: 20 }}><span style={{ color: "var(--purple)" }}>AND</span> <span style={{ color: "var(--cyan)" }}>timetable.hasActiveLecture</span>(<span style={{ color: "var(--amber)" }}>student.id, current_time</span>)</div>
          <div><span style={{ color: "var(--purple)" }}>THEN</span></div>
          <div style={{ paddingLeft: 20 }}><span style={{ color: "var(--green)" }}>flag</span>(<span style={{ color: "var(--amber)" }}>TRUANCY_VIOLATION</span>)</div>
          <div style={{ paddingLeft: 20 }}><span style={{ color: "var(--green)" }}>publish</span>(rabbitMQ, alertPayload)</div>
          <div style={{ paddingLeft: 20 }}><span style={{ color: "var(--green)" }}>notify</span>(guardian, [<span style={{ color: "var(--amber)" }}>"SMS", "Email", "WhatsApp"</span>])</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Events Table */}
        <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <SectionTitle sub="All detected violations">Truancy Log</SectionTitle>
            <button onClick={simulateTruancy} disabled={simulateActive} style={{
              background: "var(--red-dim)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--red)",
              borderRadius: 6, padding: "8px 16px", fontFamily: "var(--font-mono)", fontSize: 11,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {simulateActive ? <><Spinner />Simulating...</> : "⚡ Simulate Truancy"}
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Student", "Detected Zone", "Scheduled Lecture", "Detection Time", "Confidence", "Alert"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} style={{ borderBottom: "1px solid var(--border)", background: ev.id === newAlert?.id ? "var(--red-dim)" : "transparent" }}>
                  <td style={{ padding: "10px 12px" }}><div style={{ fontWeight: 500, fontSize: 13 }}>{ev.studentName}</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>{ev.studentId}</div></td>
                  <td style={{ padding: "10px 12px" }}><Badge color="red">{ev.location}</Badge></td>
                  <td style={{ padding: "10px 12px", color: "var(--amber)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{ev.scheduledSubject}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 12 }}>{ev.time}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 12 }}>{(ev.confidence * 100).toFixed(0)}%</td>
                  <td style={{ padding: "10px 12px" }}><Badge color={ev.alertSent ? "green" : "amber"}>{ev.alertSent ? "✓ SENT" : "PENDING"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Canteen Feed */}
        <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 16 }}>
          <SectionTitle sub="Canteen surveillance">Canteen Monitor</SectionTitle>
          <LiveFeed label="Canteen Entry Gate" zone="canteen" />
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 6 }}>System Status</div>
            {[
              { label: "FaceNet Model", status: "LOADED", color: "green" },
              { label: "Timetable DB", status: "SYNCED", color: "green" },
              { label: "RabbitMQ", status: "CONNECTED", color: "green" },
              { label: "Twilio API", status: "ACTIVE", color: "green" },
              { label: "Anti-Spoofing", status: "ENABLED", color: "cyan" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{item.label}</span>
                <Badge color={item.color}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NOTIFICATIONS ---
const NotificationsPage = () => {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [sending, setSending] = useState(null);

  const resend = (id) => {
    setSending(id);
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "delivered" } : a));
      setSending(null);
    }, 1500);
  };

  return (
    <div className="animate-fade">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard icon="📨" label="Total Alerts Sent" value="47" sub="Today" color="cyan" />
        <StatCard icon="✓" label="Delivered" value="44" sub="93.6% delivery rate" color="green" />
        <StatCard icon="⏳" label="Pending" value="3" sub="Retry in progress" color="amber" />
      </div>

      {/* Channel Architecture */}
      <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 20, marginBottom: 20 }}>
        <SectionTitle sub="Multi-channel dispatch architecture">Notification Pipeline</SectionTitle>
        <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {[
            { icon: "⚡", label: "Truancy Event", desc: "Logic Service detects violation", color: "red" },
            { icon: "→", arrow: true },
            { icon: "🐰", label: "RabbitMQ", desc: "Async message broker", color: "amber" },
            { icon: "→", arrow: true },
            { icon: "📡", label: "Notification Service", desc: "Python consumer", color: "cyan" },
            { icon: "→", arrow: true },
            { icon: "📱", label: "Twilio SMS", desc: "+91-XXXXXXXXXX", color: "green" },
            { icon: "📧", label: "SendGrid Email", desc: "guardian@email.com", color: "purple" },
            { icon: "💬", label: "WhatsApp API", desc: "Instant messaging", color: "green" },
          ].map((item, i) => (
            item.arrow ? (
              <div key={i} style={{ display: "flex", alignItems: "center", color: "var(--cyan)", fontSize: 20, padding: "0 4px" }}>→</div>
            ) : (
              <div key={i} style={{
                flex: "0 0 auto", background: "var(--bg-raised)", border: `1px solid var(--${item.color}-dim, var(--border))`,
                borderRadius: 8, padding: "14px 16px", textAlign: "center", minWidth: 120,
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, color: `var(--${item.color})` }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", marginTop: 4 }}>{item.desc}</div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Alert Log */}
      <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 20 }}>
        <SectionTitle sub="Guardian notification history">Alert Dispatch Log</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              background: "var(--bg-raised)", borderRadius: 8, padding: 16,
              border: `1px solid ${alert.status === "delivered" ? "var(--border)" : "rgba(245,158,11,0.3)"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>{alert.studentName}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: 12 }}>Guardian: {alert.guardian}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>{alert.time}</span>
                  <Badge color={alert.status === "delivered" ? "green" : "amber"}>{alert.status.toUpperCase()}</Badge>
                </div>
              </div>
              <div style={{ background: "var(--bg-void)", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginBottom: 10, lineHeight: 1.5 }}>
                {alert.message}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {alert.channels.map(ch => (
                    <Badge key={ch} color={ch === "SMS" ? "cyan" : ch === "Email" ? "purple" : "green"}>{ch}</Badge>
                  ))}
                </div>
                {alert.status !== "delivered" && (
                  <button onClick={() => resend(alert.id)} style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.3)", color: "var(--amber)", borderRadius: 6, padding: "6px 12px", fontFamily: "var(--font-mono)", fontSize: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    {sending === alert.id ? <><Spinner />Sending...</> : "↺ Resend"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ANALYTICS ---
const AnalyticsPage = () => {
  const weekData = [
    { day: "Mon", present: 45, absent: 8, truancy: 3 },
    { day: "Tue", present: 48, absent: 5, truancy: 1 },
    { day: "Wed", present: 42, absent: 11, truancy: 5 },
    { day: "Thu", present: 50, absent: 3, truancy: 2 },
    { day: "Fri", present: 38, absent: 15, truancy: 7 },
  ];
  const maxPresent = Math.max(...weekData.map(d => d.present));

  return (
    <div className="animate-fade">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard icon="📊" label="Avg Attendance" value="88%" sub="This week" color="cyan" />
        <StatCard icon="⚠" label="Truancy Rate" value="3.6%" sub="Below threshold" color="amber" />
        <StatCard icon="🎯" label="Recognition Acc" value="94%" sub="Across conditions" color="green" />
        <StatCard icon="⚡" label="Alert Latency" value="18s" sub="Avg dispatch time" color="purple" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        {/* Weekly Bar Chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 20 }}>
          <SectionTitle sub="Weekly attendance breakdown">Attendance Trends</SectionTitle>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 180, marginBottom: 8 }}>
            {weekData.map(d => (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, justifyContent: "flex-end", height: 160 }}>
                  <div title={`Truancy: ${d.truancy}`} style={{ width: "100%", height: `${(d.truancy / maxPresent) * 100}%`, background: "var(--red)", borderRadius: "3px 3px 0 0", minHeight: 4 }} />
                  <div title={`Absent: ${d.absent}`} style={{ width: "100%", height: `${(d.absent / maxPresent) * 100}%`, background: "var(--amber)", minHeight: 4 }} />
                  <div title={`Present: ${d.present}`} style={{ width: "100%", height: `${(d.present / maxPresent) * 100}%`, background: "var(--green)", borderRadius: "0 0 3px 3px", minHeight: 20 }} />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            {[["var(--green)", "Present"], ["var(--amber)", "Absent"], ["var(--red)", "Truancy"]].map(([color, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Table */}
        <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 20 }}>
          <SectionTitle sub="Recognition system metrics">Performance Metrics</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "6px 10px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>CONDITION</th>
                <th style={{ padding: "6px 10px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>ACC</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Good light, frontal", 97, "green"],
                ["Mixed light, angled", 91, "green"],
                ["Poor light / shadows", 78, "amber"],
                ["Occlusion (mask)", 63, "red"],
                ["Canteen (moving)", 88, "green"],
                ["Anti-spoofing", 100, "cyan"],
              ].map(([cond, acc, color]) => (
                <tr key={cond} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 10px", fontSize: 12 }}>{cond}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <div style={{ width: 60, height: 4, background: "var(--bg-raised)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${acc}%`, background: `var(--${color})`, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: `var(--${color})` }}>{acc}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 16, background: "var(--bg-raised)", borderRadius: 6, padding: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginBottom: 8, textTransform: "uppercase" }}>System Health</div>
            {[
              ["Frame Processing Latency", "287ms", "< 500ms ✓"],
              ["Alert Dispatch Time", "18.3s", "< 30s ✓"],
              ["System Uptime (48hr)", "99.8%", "> 99.5% ✓"],
              ["Unit Test Coverage", "88.3%", "> 85% ✓"],
            ].map(([label, val, target]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)", fontSize: 11 }}>
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--green)" }}>{val} <span style={{ color: "var(--text-dim)" }}>{target}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div style={{ background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)", padding: 20, marginTop: 20 }}>
        <SectionTitle sub="Production microservices deployment">System Architecture</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, alignItems: "start" }}>
          {[
            { tier: "Edge Layer", items: ["ESP32-CAM (CR-301)", "ESP32-CAM (CR-302)", "Raspberry Pi (Canteen)"], color: "purple" },
            { tier: "Recognition Service", items: ["MTCNN Face Detection", "Anti-Spoofing Model", "FaceNet Embeddings", "Cosine Similarity Match"], color: "cyan" },
            { tier: "Logic Service", items: ["Timetable Query", "Attendance Logger", "Truancy Detector", "Alert Publisher"], color: "amber" },
            { tier: "Message Broker", items: ["RabbitMQ", "Detection Queue", "Alert Queue", "Dead-letter Exchange"], color: "green" },
            { tier: "Notification Service", items: ["Twilio SMS", "SendGrid Email", "WhatsApp API", "Audit Logger"], color: "red" },
          ].map((tier, i) => (
            <div key={i} style={{ background: "var(--bg-raised)", borderRadius: 8, border: `1px solid var(--${tier.color}-dim, var(--border))`, padding: 12 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: `var(--${tier.color})`, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tier.tier}</div>
              {tier.items.map(item => (
                <div key={item} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", padding: "4px 6px", background: "var(--bg-void)", borderRadius: 4, marginBottom: 4 }}>◆ {item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APPLICATION
// ============================================================

const PAGES = [
  { id: "dashboard", label: "Live Dashboard", icon: "◈" },
  { id: "registration", label: "Registration", icon: "⊕" },
  { id: "attendance", label: "Attendance", icon: "✓" },
  { id: "truancy", label: "Truancy Detection", icon: "⚠" },
  { id: "notifications", label: "Notifications", icon: "◎" },
  { id: "analytics", label: "Analytics", icon: "▤" },
];

export default function CampusTrack() {
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pageComponents = { dashboard: DashboardPage, registration: RegistrationPage, attendance: AttendancePage, truancy: TruancyPage, notifications: NotificationsPage, analytics: AnalyticsPage };
  const PageComponent = pageComponents[activePage];

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-void)" }}>
        {/* Sidebar */}
        <aside style={{
          width: collapsed ? 60 : 220, background: "var(--bg-deep)", borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.3s ease", position: "relative", zIndex: 10,
        }}>
          {/* Logo */}
          <div style={{ padding: collapsed ? "20px 0" : "20px 16px", borderBottom: "1px solid var(--border)", textAlign: collapsed ? "center" : "left" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: collapsed ? 18 : 22, fontWeight: 700, color: "var(--cyan)", letterSpacing: "0.08em" }}>
              {collapsed ? "CT" : "CAMPUS"}
            </div>
            {!collapsed && <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.08em", marginTop: -6 }}>TRACK</div>}
            {!collapsed && <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.12em", marginTop: 4 }}>AI SURVEILLANCE SYSTEM</div>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 8px" }}>
            {PAGES.map(page => {
              const active = activePage === page.id;
              return (
                <button key={page.id} onClick={() => setActivePage(page.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: collapsed ? "10px 0" : "10px 12px", justifyContent: collapsed ? "center" : "flex-start",
                  background: active ? "var(--cyan-dim)" : "transparent",
                  border: `1px solid ${active ? "var(--border-bright)" : "transparent"}`,
                  borderRadius: 6, marginBottom: 4, color: active ? "var(--cyan)" : "var(--text-dim)",
                  fontFamily: "var(--font-display)", fontWeight: active ? 700 : 500, fontSize: 13,
                  letterSpacing: "0.04em", textTransform: "uppercase", transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{page.icon}</span>
                  {!collapsed && page.label}
                </button>
              );
            })}
          </nav>

          {/* System Status */}
          {!collapsed && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8 }}>SYSTEM STATUS</div>
              {[["Recognition", "green"], ["RabbitMQ", "green"], ["MongoDB", "green"]].map(([s, c]) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: `var(--${c})` }} className="animate-pulse-cyan" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Collapse Toggle */}
          <button onClick={() => setCollapsed(c => !c)} style={{ padding: "10px", borderTop: "1px solid var(--border)", background: "transparent", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            {collapsed ? "»" : "« Collapse"}
          </button>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top Bar */}
          <header style={{ background: "var(--bg-deep)", borderBottom: "1px solid var(--border)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {PAGES.find(p => p.id === activePage)?.label}
              </h1>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>
                JSPM's BSIOTR · Computer Engineering · AY 2025-26
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--cyan)" }}>{time.toLocaleTimeString()}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>Mon, 27 Apr 2026</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} className="animate-pulse-cyan" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)" }}>LIVE</span>
              </div>
              <div style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 14px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--cyan)" }}>ADMIN</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)" }}>Dr. Vijay Sonwane</div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
            <PageComponent key={activePage} />
          </main>
        </div>
      </div>
    </>
  );
}
