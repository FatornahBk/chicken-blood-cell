// BloodCellCard.jsx
// Reusable card component for blood cell analysis results
// Used in: HomePage, UploadPage, PredictionPage, SearchResults

import React from "react";
import { Globe } from "lucide-react";
const STATUS_STYLES = {
  Normal: "bg-green-100 text-green-700",
  Mild: "bg-yellow-100 text-yellow-700",
  Moderate: "bg-orange-100 text-orange-700",
  Severe: "bg-red-100 text-red-700",
  Preview: "bg-blue-100 text-blue-700",
  Predicted: "bg-purple-100 text-purple-700",
};

/**
 * BloodCellCard
 *
 * Props:
 * - images: string[]          — array of image URLs (shows up to 4, +N badge if more)
 * - title: string             — card title (Thai or English)
 * - status: "Normal" | "Mild" | "Moderate" | "Severe" | "Preview"
 * - issueId: string           — e.g. "AV-9025"
 * - chickenType: string       — e.g. "Laying hen"
 * - province: string          — e.g. "Nakhon Si Thammarat"
 * - age: string               — e.g. "30 week"
 * - stainType: string         — e.g. "Wright stain"
 * - uploaderName: string      — e.g. "Dr.Strange"
 * - uploaderRole: string      — e.g. "veterinary"
 * - avatarUrl?: string        — optional avatar image URL
 * - onClick?: () => void      — optional click handler
 * - className?: string        — additional Tailwind classes
 */
const BloodCellCard = ({
  images = [],
  title = "",
  status = "Normal",
  issueId = "",
  chickenType = "",
  province = "",
  age = "",
  stainType = "",
  uploaderName = "",
  uploaderRole = "",
  uploaderDate = "",
  avatarUrl = null,
  onClick = null,
  className = "",
}) => {
  const displayImages = images.slice(0, 4);
  const extraCount = images.length > 4 ? images.length - 4 : 0;
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES["Normal"];

  const initials = uploaderName
    ? uploaderName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "DR";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 ${className}`}
      onClick={onClick}
    >
      {/* Image Grid */}
      <div className="relative grid grid-cols-2 gap-0.5 bg-gray-100">
        {displayImages.map((src, idx) => (
          <div key={idx} className="relative aspect-square overflow-hidden">
            <img
              src={src}
              alt={`cell-${idx}`}
              className="w-full h-full object-cover"
            />
            {/* +N overlay on last image */}
            {idx === 3 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  +{extraCount}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Placeholder if fewer than 4 images */}
        {displayImages.length < 4 &&
          Array.from({ length: 4 - displayImages.length }).map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="aspect-square bg-gray-200"
            />
          ))}
      </div>

      {/* Card Content */}
      <div className="p-3">
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 flex-1">
            {title}
          </p>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle}`}
          >
            {status}
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
          <MetaItem label="Smear ID" value={issueId} />
          <MetaItem label="Chicken type" value={chickenType} />
          <MetaItem label="Province" value={province} />
          <MetaItem label="Age" value={age} />
          <MetaItem label="Stain type" value={stainType} />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-2" />

        {/* Uploader Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={uploaderName}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                {initials}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-700 leading-none">
                {uploaderName}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5">
  {uploaderDate}
  <Globe size={10} className="text-gray-400" />
</p>
            </div>
          </div>

          {/* More options */}
          <button
            className="text-gray-400 hover:text-gray-600 px-1"
            onClick={(e) => e.stopPropagation()}
            aria-label="More options"
          >
            <span className="text-lg leading-none">···</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* Small helper for metadata rows */
const MetaItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
    <p className="text-xs text-gray-700 font-medium truncate">{value || "-"}</p>
  </div>
);

export default BloodCellCard;