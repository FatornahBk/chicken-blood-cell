// SearchBar.jsx
import React, { useState } from "react";

const CHICKEN_TYPES = [
  "All types",
  "Laying hen",
  "Native chicken",
];

const STATUS_OPTIONS = ["All status", "Pending", "Approved", "Rejected"];
const SearchBar = ({
  onSearch,
  onFilterChickenType,
  onSortChange,
  onStatusChange,
  showStatusFilter = false,
  placeholder = "Search by province name and uploader name.",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [chickenType, setChickenType] = useState("All types");
  const [status, setStatus] = useState("All status");

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleChickenTypeChange = (e) => {
    setChickenType(e.target.value);
    onFilterChickenType?.(e.target.value);
  };

  const handleSortChange = (e) => {
    onSortChange?.(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onStatusChange?.(e.target.value);
  };

  return (
      <div className={`flex flex-col sm:flex-row items-center gap-3 w-full max-w-4xl ${className}`}
    >
      {/* Search Input */}
      <div className="flex flex-1 w-full items-center gap-2">
        <div className="flex flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="flex items-center pl-4 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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
      <div className="relative">
        <select
          value={chickenType}
          onChange={handleChickenTypeChange}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-2 py-2.5 pr-6 text-sm text-gray-600 shadow-sm cursor-pointer outline-none hover:border-gray-300 focus:border-blue-400 transition-colors text-center"
        >
          {CHICKEN_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Status Filter — เฉพาะหน้าที่ส่ง showStatusFilter={true} */}
      {showStatusFilter && (
        <div className="relative">
          <select
            value={status}
            onChange={handleStatusChange}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-8 text-sm text-gray-600 shadow-sm cursor-pointer outline-none hover:border-gray-300 focus:border-blue-400 transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Date Picker */}
      <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-2.5 shadow-sm">
        <input
          type="date"
          onChange={(e) => onSortChange?.(e.target.value)}
          className="appearance-none bg-transparent text-sm text-gray-600 cursor-pointer outline-none text-center w-full"
        />
      </div>
    </div>
  );
};

export default SearchBar;
