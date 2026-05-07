import { useState } from "react";

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 6H13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5 1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10 1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CHICKEN_TYPES = ["All Types", "Broiler", "Layer", "Breeder", "Native"];
const STAIN_TYPES = ["All Stains", "H&E", "Gram", "Giemsa", "PAS", "AFB"];

export default function SearchNavbar() {
  const [query, setQuery] = useState("");
  const [chickenType, setChickenType] = useState("Chicken type");
  const [stainType, setStainType] = useState("Stain Type");
  const [showChickenMenu, setShowChickenMenu] = useState(false);
  const [showStainMenu, setShowStainMenu] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);

  const handleSearch = () => {
    console.log({ query, chickenType, stainType, sortByDate });
  };

  const closeAll = () => {
    setShowChickenMenu(false);
    setShowStainMenu(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .snb-root {
          font-family: 'DM Sans', sans-serif;
          background: #e8e8ec;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          width: 100%;
          max-width: 680px;
          box-sizing: border-box;
          position: relative;
        }

        /* Search field */
        .snb-search-wrap {
          display: flex;
          align-items: center;
          flex: 1;
          background: #f2f2f5;
          border-radius: 7px;
          padding: 0 10px;
          gap: 7px;
          height: 36px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.07);
        }
        .snb-search-wrap .snb-search-icon {
          color: #a0a0a8;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .snb-search-input {
          border: none;
          background: transparent;
          outline: none;
          font-family: inherit;
          font-size: 13px;
          color: #333;
          flex: 1;
          min-width: 0;
        }
        .snb-search-input::placeholder {
          color: #aaaaaf;
        }

        /* Search button */
        .snb-btn-search {
          background: #5b8ef0;
          color: white;
          border: none;
          border-radius: 7px;
          padding: 0 18px;
          height: 36px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.01em;
          flex-shrink: 0;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 2px 6px rgba(91,142,240,0.28);
        }
        .snb-btn-search:hover { background: #4a7de8; }
        .snb-btn-search:active { transform: scale(0.97); }

        /* Dropdown trigger buttons */
        .snb-dropdown {
          position: relative;
        }
        .snb-dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #f2f2f5;
          border: none;
          border-radius: 7px;
          padding: 0 11px;
          height: 36px;
          font-family: inherit;
          font-size: 12.5px;
          color: #444;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.13s;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
        }
        .snb-dropdown-trigger:hover { background: #eaeaee; }
        .snb-dropdown-trigger .snb-chevron {
          color: #888;
          display: flex;
          align-items: center;
          transition: transform 0.18s;
        }
        .snb-dropdown-trigger.open .snb-chevron {
          transform: rotate(180deg);
        }

        /* Dropdown menu */
        .snb-dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06);
          min-width: 130px;
          z-index: 100;
          overflow: hidden;
          animation: snb-fade-in 0.13s ease;
        }
        @keyframes snb-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .snb-dropdown-item {
          padding: 9px 14px;
          font-size: 12.5px;
          color: #333;
          cursor: pointer;
          transition: background 0.1s;
        }
        .snb-dropdown-item:hover { background: #f0f4ff; color: #5b8ef0; }
        .snb-dropdown-item.selected { color: #5b8ef0; font-weight: 600; }

        /* Sort by Date button */
        .snb-btn-sort {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #f2f2f5;
          border: none;
          border-radius: 7px;
          padding: 0 11px;
          height: 36px;
          font-family: inherit;
          font-size: 12.5px;
          color: #444;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.13s;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
          flex-shrink: 0;
        }
        .snb-btn-sort:hover { background: #eaeaee; }
        .snb-btn-sort.active {
          background: #e8f0fe;
          color: #5b8ef0;
        }
        .snb-btn-sort .snb-sort-icon {
          display: flex;
          align-items: center;
          color: #888;
        }
        .snb-btn-sort.active .snb-sort-icon { color: #5b8ef0; }

        /* Overlay to close menus */
        .snb-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
        }
      `}</style>

      {(showChickenMenu || showStainMenu) && (
        <div className="snb-overlay" onClick={closeAll} />
      )}

      <div className="snb-root">
        {/* Search Input */}
        <div className="snb-search-wrap">
          <span className="snb-search-icon"><SearchIcon /></span>
          <input
            className="snb-search-input"
            placeholder="Search for smear ID."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Search Button */}
        <button className="snb-btn-search" onClick={handleSearch}>
          Search
        </button>

        {/* Chicken Type Dropdown */}
        <div className="snb-dropdown">
          <button
            className={`snb-dropdown-trigger${showChickenMenu ? " open" : ""}`}
            onClick={() => { setShowChickenMenu(v => !v); setShowStainMenu(false); }}
          >
            {chickenType}
            <span className="snb-chevron"><ChevronIcon /></span>
          </button>
          {showChickenMenu && (
            <div className="snb-dropdown-menu">
              {CHICKEN_TYPES.map(t => (
                <div
                  key={t}
                  className={`snb-dropdown-item${chickenType === t ? " selected" : ""}`}
                  onClick={() => { setChickenType(t); setShowChickenMenu(false); }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stain Type Dropdown */}
        <div className="snb-dropdown">
          <button
            className={`snb-dropdown-trigger${showStainMenu ? " open" : ""}`}
            onClick={() => { setShowStainMenu(v => !v); setShowChickenMenu(false); }}
          >
            {stainType}
            <span className="snb-chevron"><ChevronIcon /></span>
          </button>
          {showStainMenu && (
            <div className="snb-dropdown-menu">
              {STAIN_TYPES.map(t => (
                <div
                  key={t}
                  className={`snb-dropdown-item${stainType === t ? " selected" : ""}`}
                  onClick={() => { setStainType(t); setShowStainMenu(false); }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort by Date */}
        <button
          className={`snb-btn-sort${sortByDate ? " active" : ""}`}
          onClick={() => setSortByDate(v => !v)}
        >
          <span className="snb-sort-icon"><CalendarIcon /></span>
          Sort by Date
        </button>
      </div>
    </>
  );
}