import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Chicken-CBC.png";

// ── สร้างตัวย่อจากชื่อที่สมัคร ──────────────────────────────
// "Somchai Jaidee" → "SJ" | "Dr.strang" → "DS" | "Alice" → "AL"
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const clean = name.replace(/[^a-zA-Zก-๙]/g, "");
  return clean.slice(0, 2).toUpperCase();
}

// ── Avatar: ถ้าไม่มีรูปจะแสดงตัวย่อชื่อแทน ──────────────────
function Avatar({ name, profileImage }) {
  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-semibold select-none">
      {getInitials(name)}
    </div>
  );
}

// ── Globe Icon ───────────────────────────────────────────────
const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
  </svg>
);

// ── Nav links + route ────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home",       path: "/home"       },
  { label: "Upload",     path: "/upload"     },
  { label: "Prediction", path: "/prediction" },
];

// ── Navbar Component ─────────────────────────────────────────
const Navbar = ({ activePage = "Home" }) => {
  const [active, setActive] = useState(activePage);
  const navigate = useNavigate();

  // ดึง user จาก localStorage ที่ Login/Register save ไว้
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleNav = (label, path) => {
    setActive(label);    // เปลี่ยนสี active
    navigate(path);      // เปลี่ยนหน้า
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-8 relative">

        {/* ── ซ้าย: Logo + Brand ── */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="CBC Medical Logo"
            className="w-16 h-16 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-gray-900 tracking-wide">
              CBC - MEDICAL
            </span>
            <span className="text-[10px] text-gray-400 tracking-wide">
              Chicken Blood Cell Classification
            </span>
          </div>
        </div>

        {/* ── กลาง: Nav Links ── */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10">
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => handleNav(label, path)}
              className={`text-sm font-medium transition-colors duration-150 ${
                active === label
                  ? "text-blue-500"
                  : "text-gray-600 hover:text-blue-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── ขวา: Globe + User ── */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-blue-400 transition-colors">
            <GlobeIcon />
          </button>
          <div className="w-px h-8 bg-gray-200" />

          {user ? (
            <div className="flex items-center gap-2">
              <Avatar
                name={user.name}
                profileImage={user.profileImage ?? null}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-gray-800">
                  {user.name}
                </span>
                <span className="text-[10px] text-gray-400">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Not logged in</span>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;