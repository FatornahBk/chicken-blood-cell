import { useState, useRef, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronIcon = () => (
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
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
const CHICKEN_TYPES = ["All Types", "Broiler", "Layer", "Breeder", "Native"];
const STAIN_TYPES   = ["All Stains", "H&E", "Gram", "Giemsa", "PAS", "AFB"];
const DAY_LABELS    = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES   = [
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

// ─── Calendar Picker ──────────────────────────────────────────────────────────
function CalendarPicker({ startDate, endDate, onChange, onApply }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovered,   setHovered]   = useState(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
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

  const fmtLabel = d =>
    d ? `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` : null;

  return (
    <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="flex items-center justify-center p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeftIcon />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="flex items-center justify-center p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10.5px] font-semibold text-gray-300 pb-1.5">
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
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => setHovered(day)}
              onMouseLeave={() => setHovered(null)}
              className={[
                "aspect-square flex items-center justify-center text-xs font-medium rounded-lg border-none cursor-pointer transition-colors",
                isStart || isEnd
                  ? "bg-blue-500 text-white font-semibold rounded-lg"
                  : inRange
                  ? "bg-blue-100 text-blue-700 rounded-none"
                  : isToday
                  ? "text-blue-500 font-bold hover:bg-blue-50"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-500",
              ].join(" ")}
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
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ start: null, end: null })}
            className="flex-1 h-8 border border-gray-200 bg-transparent rounded-lg text-xs text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onApply}
            disabled={!startDate}
            className="flex-1 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function Dropdown({ label, options, value, onChange }) {
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 h-[38px] text-[12.5px] text-gray-600 font-medium cursor-pointer whitespace-nowrap hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
      >
        {value}
        <span className={`text-gray-400 flex items-center transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+5px)] left-0 bg-white rounded-xl min-w-[130px] shadow-lg border border-gray-100 z-50 overflow-hidden animate-[fadeDown_0.12s_ease]">
          {options.map(t => (
            <div
              key={t}
              onClick={() => { onChange(t); setOpen(false); }}
              className={`px-3.5 py-2.5 text-[12.5px] cursor-pointer transition-colors ${
                value === t
                  ? "text-blue-500 font-semibold bg-blue-50"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Searchbar() {
  const [query,        setQuery]        = useState("");
  const [chickenType,  setChickenType]  = useState("Chicken type");
  const [stainType,    setStainType]    = useState("Stain Type");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange,    setDateRange]    = useState({ start: null, end: null });

  const calRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fmtShort = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  const hasDate  = !!dateRange.start;
  const dateBtnLabel = hasDate
    ? `${fmtShort(dateRange.start)}${dateRange.end ? ` – ${fmtShort(dateRange.end)}` : ""}`
    : "Sort by Date";

  const handleSearch = () => {
    console.log({ query, chickenType, stainType, dateRange });
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-3xl ml-auto">

      {/* Search Input */}
      <div className="flex flex-1 items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 shadow-sm">
        <span className="text-gray-400 flex items-center shrink-0"><SearchIcon /></span>
        <input
          className="flex-1 min-w-0 bg-transparent border-none outline-none py-2.5 text-[13px] text-gray-700 placeholder-gray-400"
          placeholder="Search for smear ID."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold shrink-0 transition-all shadow-sm shadow-blue-200"
      >
        Search
      </button>

      {/* Chicken Type */}
      <Dropdown
        value={chickenType}
        options={CHICKEN_TYPES}
        onChange={setChickenType}
      />

      {/* Stain Type */}
      <Dropdown
        value={stainType}
        options={STAIN_TYPES}
        onChange={setStainType}
      />

      {/* Sort by Date */}
      <div className="relative shrink-0" ref={calRef}>
        <button
          onClick={() => setShowCalendar(v => !v)}
          className={`flex items-center gap-1.5 border rounded-lg px-3 h-[38px] text-[12.5px] font-medium whitespace-nowrap cursor-pointer transition-colors shadow-sm ${
            hasDate
              ? "bg-blue-50 border-blue-300 text-blue-600"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <span className={`flex items-center ${hasDate ? "text-blue-500" : "text-gray-400"}`}>
            <CalendarIcon />
          </span>
          {dateBtnLabel}
          {hasDate && (
            <span
              onClick={e => {
                e.stopPropagation();
                setDateRange({ start: null, end: null });
                setShowCalendar(false);
              }}
              className="flex items-center ml-0.5 p-0.5 rounded text-gray-400 hover:text-red-400 transition-colors"
            >
              <XSmallIcon />
            </span>
          )}
        </button>

        {showCalendar && (
          <CalendarPicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={({ start, end }) => setDateRange({ start, end })}
            onApply={() => setShowCalendar(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Searchbar;