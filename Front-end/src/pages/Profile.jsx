import { useState, useMemo } from "react";
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

// ─── Profile Banner ───────────────────────────────────────────────────────────
function ProfileBanner({ name, email, postCount, avatarUrl }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden mb-6 flex items-center justify-between px-6 py-5"
      style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)" }}
    >
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-16 h-16 rounded-full border-2 border-white/40 object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-blue-200 flex items-center justify-center text-2xl font-semibold text-blue-900">
            {name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-sm text-white/70 mb-2">{email}</p>
          <div className="flex gap-2">
            <button className="px-4 py-1 rounded-full text-xs font-medium border border-white/40 text-white">
              Admin
            </button>
            <button className="px-4 py-1 rounded-full text-xs font-medium bg-white text-blue-900">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold text-amber-400">{postCount}</p>
        <p className="text-xs text-white/70">Posts</p>
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
export default function ProfilePage({ user = {}, smears = [] }) {
  const [query, setQuery]               = useState("");
  const [chickenType, setChickenType]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortAsc, setSortAsc]           = useState(false);

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