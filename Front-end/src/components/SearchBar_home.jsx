// SearchBar.jsx
import React, { useState, useRef, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 6H13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5 1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10 1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const XSmallIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const CHICKEN_TYPES  = ["All types", "Laying hen", "Native chicken"];
const STATUS_OPTIONS = ["All status", "Pending", "Approved", "Rejected"];
const DAY_LABELS     = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES    = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 h-[38px] text-[12.5px] text-gray-600 font-medium cursor-pointer whitespace-nowrap hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
      >
        {value}
        <span className={`text-gray-400 flex items-center transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+5px)] left-0 bg-white rounded-xl min-w-[140px] shadow-lg border border-gray-100 z-50 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`px-3.5 py-2.5 text-[12.5px] cursor-pointer transition-colors ${
                value === opt
                  ? "text-blue-500 font-semibold bg-blue-50"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Calendar Picker ──────────────────────────────────────────────────────────
function CalendarPicker({ startDate, endDate, onChange, onApply }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovered,   setHovered]   = useState(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (!startDate || (startDate && endDate)) {
      onChange({ start: clicked, end: null });
    } else {
      if (clicked < startDate) onChange({ start: clicked, end: startDate });
      else onChange({ start: startDate, end: clicked });
    }
  };

  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysCount = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysCount; d++) cells.push(d);

  const fmtLabel = (d) =>
    d ? `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` : null;

  return (
    <div className="absolute top-[calc(100%+8px)] right-0 z-[300] w-[272px] bg-white rounded-2xl border border-gray-100 p-4 pb-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.13),0_1px_6px_rgba(0,0,0,0.06)] animate-[calFadeIn_0.14s_ease]">
      <style>{`@keyframes calFadeIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-2.5">
        <button
          className="flex items-center text-gray-500 bg-transparent border-none cursor-pointer p-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={prevMonth}
        >
          <ChevronLeftIcon />
        </button>
        <span className="text-[13.5px] font-semibold text-gray-900">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          className="flex items-center text-gray-500 bg-transparent border-none cursor-pointer p-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={nextMonth}
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10.5px] font-semibold text-gray-300 pb-1.5 pt-0.5">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`emp-${i}`} />;
          const date    = new Date(viewYear, viewMonth, day);
          const isStart = isSameDay(date, startDate);
          const isEnd   = isSameDay(date, endDate);
          const isToday = isSameDay(date, today);
          const hovDate  = hovered ? new Date(viewYear, viewMonth, hovered) : null;
          const rangeEnd = endDate || hovDate;
          const lo = startDate && rangeEnd ? (startDate < rangeEnd ? startDate : rangeEnd) : null;
          const hi = startDate && rangeEnd ? (startDate < rangeEnd ? rangeEnd : startDate) : null;
          const inRange = lo && hi && date > lo && date < hi;

          return (
            <button
              key={`${viewYear}-${viewMonth}-${day}`}
              className={[
                "aspect-square flex items-center justify-center text-[12px] font-medium border-none cursor-pointer transition-colors duration-100",
                isStart || isEnd
                  ? "bg-blue-500 text-white font-semibold rounded-lg"
                  : inRange
                    ? "bg-blue-100 text-blue-700 rounded-none"
                    : isToday
                      ? "text-blue-500 font-bold bg-transparent rounded-lg hover:bg-blue-50"
                      : "text-gray-700 bg-transparent rounded-lg hover:bg-blue-50 hover:text-blue-500",
              ].filter(Boolean).join(" ")}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => setHovered(day)}
              onMouseLeave={() => setHovered(null)}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="block text-center text-[11px] text-gray-400 mb-2.5 tracking-wide">
          {fmtLabel(startDate) || "Start date"} → {fmtLabel(endDate) || "End date"}
        </span>
        <div className="flex gap-1.5">
          <button
            className="flex-1 h-8 border border-gray-200 bg-transparent rounded-lg font-[inherit] text-xs text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onChange({ start: null, end: null })}
          >
            Clear
          </button>
          <button
            className="flex-1 h-8 bg-blue-500 border-none rounded-lg font-[inherit] text-xs font-semibold text-white cursor-pointer hover:bg-blue-600 transition-colors disabled:bg-blue-200 disabled:cursor-default"
            onClick={onApply}
            disabled={!startDate}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main SearchBar ───────────────────────────────────────────────────────────
const SearchBar = ({
  onSearch,
  onFilterChickenType,
  onSortChange,
  onStatusChange,
  showStatusFilter = false,
  placeholder = "Search by province name and uploader name.",
  className = "",
}) => {
  const [query,       setQuery]       = useState("");
  const [chickenType, setChickenType] = useState("All types");
  const [status,      setStatus]      = useState("All status");
  const [showCal,     setShowCal]     = useState(false);
  const [dateRange,   setDateRange]   = useState({ start: null, end: null });

  const calRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) setShowCal(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => onSearch?.(query);
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const fmtShort = (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  const hasDate  = !!dateRange.start;
  const dateBtnLabel = hasDate
    ? `${fmtShort(dateRange.start)}${dateRange.end ? ` – ${fmtShort(dateRange.end)}` : ""}`
    : "Sort by Date";

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 w-full max-w-4xl ${className}`}>

      {/* Search Input + Button */}
      <div className="flex flex-1 w-full items-center gap-2">
        <div className="flex flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="flex items-center pl-4 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 shrink-0"
        >
          Search
        </button>
      </div>

      {/* Chicken Type Filter */}
      <Dropdown
        options={CHICKEN_TYPES}
        value={chickenType}
        onChange={(val) => { setChickenType(val); onFilterChickenType?.(val); }}
      />

      {/* Status Filter */}
      {showStatusFilter && (
        <Dropdown
          options={STATUS_OPTIONS}
          value={status}
          onChange={(val) => { setStatus(val); onStatusChange?.(val); }}
        />
      )}

      {/* Date Picker — Calendar Popup */}
      <div className="relative flex-shrink-0" ref={calRef}>
        <button
          className={[
            "flex items-center gap-1.5 border rounded-lg px-3 h-[38px] font-[inherit] text-[13.5px] font-medium cursor-pointer whitespace-nowrap transition-colors duration-[130ms] shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
            hasDate
              ? "bg-blue-50 border-blue-300 text-blue-600"
              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
          ].join(" ")}
          onClick={() => setShowCal((v) => !v)}
        >
          <span className={`flex items-center ${hasDate ? "text-blue-400" : "text-gray-400"}`}>
            <CalendarIcon />
          </span>
          {dateBtnLabel}
          {hasDate && (
            <span
              className="flex items-center p-0.5 ml-0.5 rounded text-gray-400 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDateRange({ start: null, end: null });
                onSortChange?.(null);
                setShowCal(false);
              }}
            >
              <XSmallIcon />
            </span>
          )}
        </button>

        {showCal && (
          <CalendarPicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={({ start, end }) => {
              setDateRange({ start, end });
              onSortChange?.({ start, end });
            }}
            onApply={() => setShowCal(false)}
          />
        )}
      </div>

    </div>
  );
};

export default SearchBar;