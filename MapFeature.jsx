import { useState, useEffect, useRef } from "react";

const transportStations = [
  { id: 1, name: "Debourg", line: "Metro Line B", score: 70, lat: 45.7328, lng: 4.8316, elevator: "WORKING", escalator: "OUT_OF_SERVICE", stepFreeExit: "LIMITED", reports: 9, updatedMin: 8 },
  { id: 2, name: "Stade de Gerland", line: "Metro Line B", score: 81, lat: 45.7265, lng: 4.8257, elevator: "WORKING", escalator: "WORKING", stepFreeExit: "AVAILABLE", reports: 14, updatedMin: 22 },
  { id: 3, name: "Jean Macé", line: "Metro Line B & D", score: 94, lat: 45.7434, lng: 4.8466, elevator: "WORKING", escalator: "WORKING", stepFreeExit: "AVAILABLE", reports: 31, updatedMin: 5 },
  { id: 4, name: "Bellecour", line: "Metro Line A & D", score: 88, lat: 45.7579, lng: 4.8323, elevator: "WORKING", escalator: "WORKING", stepFreeExit: "AVAILABLE", reports: 47, updatedMin: 3 },
  { id: 5, name: "Part-Dieu", line: "Metro Line B & D", score: 64, lat: 45.7605, lng: 4.8596, elevator: "OUT_OF_SERVICE", escalator: "WORKING", stepFreeExit: "LIMITED", reports: 22, updatedMin: 15 },
  { id: 6, name: "Perrache", line: "Metro Line A", score: 77, lat: 45.7495, lng: 4.8267, elevator: "WORKING", escalator: "LIMITED", stepFreeExit: "AVAILABLE", reports: 18, updatedMin: 9 },
];

const restaurants = [
  { id: 1, name: "Le Saint Laurent", type: "Pizza Restaurant", score: 91, stars: 3, lat: 45.7620, lng: 4.8220, ramp: true, toilet: { status: "ok", note: "Accessible Toilets" }, img: "🍕" },
  { id: 2, name: "Sipres", type: "French Cuisine · 1 Michelin Star", score: 100, stars: 3.5, lat: 45.7580, lng: 4.8380, ramp: true, toilet: { status: "ok", note: "Accessible Toilets" }, img: "🍽️" },
  { id: 3, name: "Tram 33", type: "Cocktail Bar", score: 58, stars: 1.5, lat: 45.7555, lng: 4.8340, ramp: true, toilet: { status: "warn", note: "Toilet on 2nd floor" }, img: "🍸" },
  { id: 4, name: "La Table d'Ambre", type: "French Cuisine", score: 77, stars: 3.5, lat: 45.7540, lng: 4.8420, ramp: false, toilet: { status: "ok", note: "Accessible Toilets" }, img: "🥗" },
  { id: 5, name: "Anahera", type: "Coffee Shop", score: 64, stars: 4, lat: 45.7600, lng: 4.8450, ramp: true, toilet: { status: "warn", note: "3 steps to enter toilet" }, img: "☕" },
];

function getScoreColor(score) {
  if (score >= 85) return { bg: "#16a34a" };
  if (score >= 65) return { bg: "#d97706" };
  return { bg: "#dc2626" };
}

function Stars({ count }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 11 }}>
      {"★".repeat(Math.floor(count))}
      {"☆".repeat(5 - Math.floor(count))}
    </span>
  );
}

function ScoreBadge({ score, size = 38 }) {
  const { bg } = getScoreColor(score);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: Math.round(size * 0.34), flexShrink: 0, border: "2px solid rgba(255,255,255,0.5)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
      {score}
    </div>
  );
}

function StatusRow({ icon, label, status }) {
  const styles = {
    WORKING:  { color: "#16a34a", text: "WORKING", sym: "✓" },
    AVAILABLE: { color: "#16a34a", text: "AVAILABLE", sym: "✓" },
    OUT_OF_SERVICE: { color: "#dc2626", text: "OUT OF SERVICE", sym: "✗" },
    LIMITED: { color: "#d97706", text: "LIMITED", sym: "⚠" },
  };
  const s = styles[status] || styles.LIMITED;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>{label}
      </span>
      <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.sym} {s.text}</span>
    </div>
  );
}

function useLeaflet() {
  const [ready, setReady] = useState(typeof window !== "undefined" && !!window.L);
  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

function LeafletMap({ mode, items, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const buildHtml = (item, isSelected) => {
    const { bg } = getScoreColor(item.score);
    if (mode === "transport") {
      return `<div style="background:${bg};color:#fff;padding:3px 8px;border-radius:5px;font-weight:800;font-size:14px;white-space:nowrap;border:2.5px solid rgba(255,255,255,0.7);box-shadow:0 2px 8px rgba(0,0,0,0.28);transition:transform 0.1s;${isSelected ? "transform:scale(1.2);" : ""}">${item.score}</div>`;
    }
    return `<div style="background:${bg};color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:2.5px solid rgba(255,255,255,0.7);box-shadow:0 2px 8px rgba(0,0,0,0.28);${isSelected ? "transform:scale(1.2);" : ""}">${item.score}</div>`;
  };

  useEffect(() => {
    if (!containerRef.current || !window.L) return;
    const L = window.L;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    markersRef.current = [];

    const map = L.map(containerRef.current, {
      center: [45.7484, 4.8467],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

    items.forEach((item) => {
      const icon = L.divIcon({ html: buildHtml(item, item.id === selectedId), className: "", iconAnchor: [17, 17] });
      const marker = L.marker([item.lat, item.lng], { icon }).addTo(map);
      marker.on("click", () => onSelect(item));
      markersRef.current.push({ marker, item });
    });

    return () => { map.remove(); mapRef.current = null; markersRef.current = []; };
  }, [mode]);

  useEffect(() => {
    if (!window.L || markersRef.current.length === 0) return;
    const L = window.L;
    markersRef.current.forEach(({ marker, item }) => {
      const icon = L.divIcon({ html: buildHtml(item, item.id === selectedId), className: "", iconAnchor: [17, 17] });
      marker.setIcon(icon);
    });
  }, [selectedId]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

function TransportDetail({ station, onConfirm, confirmed }) {
  const { bg } = getScoreColor(station.score);
  const label = station.score >= 85 ? "Excellent Reliability" : station.score >= 65 ? "Good Reliability" : "Poor Reliability";
  return (
    <div style={{ padding: "12px 16px 8px", overflowY: "auto", flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 8 }}>
        {station.name} – {station.line}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Reliability Score:</span>
        <span style={{ fontWeight: 800, fontSize: 20, color: bg }}>{station.score}</span>
        <span style={{ fontSize: 12, color: bg, fontWeight: 500 }}>({label})</span>
      </div>
      <StatusRow icon="🛗" label="Elevator" status={station.elevator} />
      <StatusRow icon="🪜" label="Escalator" status={station.escalator} />
      <StatusRow icon="♿" label="Step-free exit" status={station.stepFreeExit} />
      <div style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 10px" }}>
        Based on <b style={{ color: "#6b7280" }}>{station.reports} verified user reports</b> · Updated {station.updatedMin}m ago
      </div>
      {confirmed ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 8 }}>
          ✓ Status confirmed — thank you!
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={onConfirm} style={{ flex: 1, background: "#2563eb", color: "#fff", border: "none", borderRadius: 20, padding: "9px 0", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            Confirm Status
          </button>
          <button style={{ flex: 1, background: "#fff", color: "#374151", border: "1.5px solid #d1d5db", borderRadius: 20, padding: "9px 0", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
            Report an Issue
          </button>
        </div>
      )}
      <button style={{ width: "100%", background: "#fff", color: "#374151", border: "1.5px solid #d1d5db", borderRadius: 20, padding: "8px 0", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
        See verified user reports
      </button>
    </div>
  );
}

function RestaurantList({ items, selectedId, onSelect }) {
  const tabs = ["Nearby", "Restaurants", "Venues", "Sightseeing"];
  const [tab, setTab] = useState("Restaurants");
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "#fff", flexShrink: 0 }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: "none", border: "none", padding: "9px 0", fontSize: 11, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#111" : "#9ca3af", borderBottom: tab === t ? "2px solid #111" : "2px solid transparent", cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>
      {items.map((r) => (
        <div key={r.id} onClick={() => onSelect(r)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: selectedId === r.id ? "#eff6ff" : "#fff", borderLeft: selectedId === r.id ? "3px solid #2563eb" : "3px solid transparent", borderBottom: "1px solid #f9fafb" }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {r.img}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{r.name}</span>
              <Stars count={r.stars} />
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>{r.type}</div>
            <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
              <span style={{ color: r.ramp ? "#16a34a" : "#dc2626" }}>{r.ramp ? "✓" : "✗"} Ramp</span>
              <span style={{ color: r.toilet.status === "ok" ? "#16a34a" : "#d97706" }}>
                {r.toilet.status === "ok" ? "✓" : "⚠"} {r.toilet.note}
              </span>
            </div>
          </div>
          <ScoreBadge score={r.score} size={36} />
        </div>
      ))}
    </div>
  );
}

export default function MapFeature() {
  const leafletReady = useLeaflet();
  const [mode, setMode] = useState("transport");
  const [selected, setSelected] = useState(transportStations[0]);
  const [confirmed, setConfirmed] = useState(false);

  const items = mode === "transport" ? transportStations : restaurants;

  const handleMode = (m) => {
    setMode(m);
    setSelected(m === "transport" ? transportStations[0] : restaurants[0]);
    setConfirmed(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #e8eeff 0%, #f5f3ff 100%)", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <div style={{ width: 375, height: 800, background: "#1a1a1a", borderRadius: 46, padding: "10px 6px", boxShadow: "0 40px 90px rgba(0,0,0,0.45), 0 0 0 1px #444", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Notch */}
        <div style={{ width: 130, height: 32, background: "#1a1a1a", borderRadius: "0 0 22px 22px", position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 10 }} />

        {/* Screen */}
        <div style={{ flex: 1, background: "#fff", borderRadius: 38, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Status bar */}
          <div style={{ height: 44, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 20px 4px", flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>9:41</span>
            <div style={{ fontSize: 11, color: "#111" }}>●●● ✦ 🔋</div>
          </div>

          {/* Header */}
          <div style={{ padding: "4px 14px 8px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👤</div>
              <div style={{ background: "#2563eb", borderRadius: 7, padding: "3px 14px", color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 2 }}>vera</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f3f4f6", borderRadius: 20, padding: "7px 12px", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>🔍</span>
              <span style={{ flex: 1, fontSize: 12, color: "#9ca3af" }}>Fully accessible coffee shop near me</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>🎙️</span>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
              {[
                { key: "transport", label: "🚌 Public Transport" },
                { key: "restaurants", label: "🍽️ Restaurants & Venues" },
                { key: "nearby", label: "📍 Nearby" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => key !== "nearby" && handleMode(key)} style={{ padding: "5px 10px", borderRadius: 16, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", background: mode === key ? "#2563eb" : "#f3f4f6", color: mode === key ? "#fff" : "#374151", border: mode === key ? "none" : "1.5px solid #e5e7eb" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div style={{ height: 220, flexShrink: 0 }}>
            {leafletReady ? (
              <LeafletMap mode={mode} items={items} selectedId={selected?.id} onSelect={setSelected} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#e8e4de", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 13 }}>Loading Lyon map…</div>
            )}
          </div>

          {/* Detail panel */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {mode === "transport" && selected ? (
              <TransportDetail station={selected} onConfirm={() => setConfirmed(true)} confirmed={confirmed} />
            ) : mode === "restaurants" ? (
              <RestaurantList items={restaurants} selectedId={selected?.id} onSelect={setSelected} />
            ) : null}
          </div>

          {/* Bottom nav */}
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 20px 14px", borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
            <button style={{ background: "#2563eb", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", fontSize: 18 }}>🗺️</button>
            <button style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", fontSize: 18 }}>👥</button>
            <button style={{ background: "#fee2e2", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 800, fontSize: 13, color: "#dc2626", cursor: "pointer" }}>SOS</button>
          </div>
        </div>
      </div>
    </div>
  );
}
