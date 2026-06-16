import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Searchbar from "../components/Searchbar_profile";
import BloodCellCard from "../components/BloodCellCard";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPredicted = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a9f" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconUnpredicted = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a9f" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function ProfileBanner({ name, email, postCount, avatarUrl }) {
  return (
    <div className="relative rounded-xl mb-6" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.10)" }}>

      {/* ส่วนบน: ฟ้า */}
      <div
        className="rounded-t-xl flex items-center justify-between px-6 py-4"
        style={{
          background: "linear-gradient(to right, #deeaf5 0%, #b8d4ec 40%, #5a8fbf 75%, #3a7aad 100%)",
          paddingLeft: "116px",
          minHeight: "56px",
        }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "#1a2f45" }}>{name}</h2>
        <div className="text-right">
          <span className="text-2xl font-semibold" style={{ color: "#e8a020" }}>{postCount}</span>
          <span className="text-sm ml-1" style={{ color: "#4a6a85" }}>Posts</span>
          <div style={{ height: "2px", background: "#e8a020", marginTop: "2px" }} />
        </div>
      </div>

      {/* ส่วนล่าง: ขาว */}
      <div
        className="rounded-b-xl bg-white py-3 px-6"
        style={{ paddingLeft: "116px", minHeight: "72px" }}
      >
        <p className="text-sm mb-2" style={{ color: "#6b8ca8" }}>{email}</p>
        <div className="flex gap-2">
          <button className="px-4 py-1 rounded-full text-xs font-medium bg-white border border-gray-400 text-gray-700">
            Admin
          </button>
          <button className="px-4 py-1 rounded-full text-xs font-medium text-white" style={{ background: "#1a2f45" }}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Avatar + วงกลมขาว คาบรอยต่อ */}
      <div
        className="absolute rounded-full bg-white flex items-center justify-center"
        style={{ left: "20px", top: "50%", transform: "translateY(-50%)", width: "80px", height: "80px", zIndex: 10 }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="rounded-full object-cover" style={{ width: "66px", height: "66px" }} />
        ) : (
          <div
            className="rounded-full flex items-center justify-center text-xl font-semibold"
            style={{ width: "66px", height: "66px", background: "#b8d4e8", color: "#1a3a5c" }}
          >
            {name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
      {icon}
      {title}
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
/**
 * Props:
 * - user: { name, email, postCount, avatarUrl }
 * - smears: array of smear objects from API
 *
 * Each smear object should have:
 * { images, title, status, issueId, chickenType, province, age, stainType,
 *   uploaderName, uploaderRole, uploaderDate, avatarUrl, isPredicted }
 */
export default function ProfilePage({ smears = [] }) {
  const [user, setUser]                 = useState({});
  const [query, setQuery]               = useState("");
  const [chickenType, setChickenType]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortAsc, setSortAsc]           = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          name:      data.name      ?? data.username ?? "",
          email:     data.email     ?? "",
          postCount: data.postCount ?? data.total_posts ?? 0,
          avatarUrl: data.avatarUrl ?? data.avatar_url ?? null,
        });
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  const filtered = useMemo(() => {
    let data = [...smears];
    if (query)        data = data.filter(s => s.issueId?.toLowerCase().includes(query.toLowerCase()));
    if (chickenType)  data = data.filter(s => s.chickenType === chickenType);
    if (statusFilter) data = data.filter(s => s.status === statusFilter);
    if (sortAsc !== null) {
      data.sort((a, b) =>
        sortAsc
          ? new Date(a.uploaderDate) - new Date(b.uploaderDate)
          : new Date(b.uploaderDate) - new Date(a.uploaderDate)
      );
    }
    return data;
  }, [smears, query, chickenType, statusFilter, sortAsc]);

  const predicted   = filtered.filter(s => s.isPredicted);
  const unpredicted = filtered.filter(s => !s.isPredicted);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <ProfileBanner
          name={user.name}
          email={user.email}
          postCount={user.postCount}
          avatarUrl={user.avatarUrl}
        />

        <Searchbar
          value={query}
          onChange={setQuery}
          chickenType={chickenType}
          onChickenChange={setChickenType}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onSort={() => setSortAsc(v => !v)}
        />

        {/* Predicted Items */}
        <section className="mb-8">
          <SectionHeader icon={IconPredicted} title="Predicted Items" />
          {predicted.length === 0 ? (
            <p className="text-sm text-gray-400">No predicted items found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {predicted.map((smear) => (
                <BloodCellCard
                  key={smear.issueId}
                  images={smear.images}
                  title={smear.title}
                  status={smear.status}
                  issueId={smear.issueId}
                  chickenType={smear.chickenType}
                  province={smear.province}
                  age={smear.age}
                  stainType={smear.stainType}
                  uploaderName={smear.uploaderName}
                  uploaderRole={smear.uploaderRole}
                  uploaderDate={smear.uploaderDate}
                  avatarUrl={smear.avatarUrl}
                  onClick={() => console.log("open", smear.issueId)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Unpredicted Items */}
        <section>
          <SectionHeader icon={IconUnpredicted} title="Unpredicted Items" />
          {unpredicted.length === 0 ? (
            <p className="text-sm text-gray-400">No unpredicted items found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {unpredicted.map((smear) => (
                <BloodCellCard
                  key={smear.issueId}
                  images={smear.images}
                  title={smear.title}
                  status={smear.status}
                  issueId={smear.issueId}
                  chickenType={smear.chickenType}
                  province={smear.province}
                  age={smear.age}
                  stainType={smear.stainType}
                  uploaderName={smear.uploaderName}
                  uploaderRole={smear.uploaderRole}
                  uploaderDate={smear.uploaderDate}
                  avatarUrl={smear.avatarUrl}
                  onClick={() => console.log("open", smear.issueId)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}