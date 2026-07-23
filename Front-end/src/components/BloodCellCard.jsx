// BloodCellCard.jsx
// Reusable card component for blood cell analysis results
// Used in: HomePage, UploadPage, PredictionPage, SearchResults

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const BloodCellCard = ({
  images = [],
  title = "",
  status = "completed",
  issueId = "",
  chickenType = "",
  province = "",
  age = "",
  stainType = "",
  uploaderName = "",
  uploaderRole = "",
  uploaderDate = "",
  uploaderId = "",
  avatarUrl = null,
  onClick = null,
  onDelete = null,
  className = "",
}) => {
  const navigate = useNavigate();
  const statusStyle = STATUS_STYLES[status] || "bg-gray-100 text-gray-700";
  const initials = uploaderName
    ? uploaderName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "DR";

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    setConfirmOpen(false);
    if (onDelete) onDelete(issueId);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmOpen(false);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${uploaderId}`);
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {images.length === 0 && <div className="w-full h-full bg-gray-200" />}

        {images.length === 1 && (
          <img
            src={images[0]}
            alt="cell-0"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onClick(0)}
          />
        )}

        {images.length === 2 && (
          <div className="grid grid-rows-2 gap-px h-full">
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`cell-${idx}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onClick(idx)}
              />
            ))}
          </div>
        )}

        {images.length === 3 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-px h-full">
            <img
              src={images[0]}
              alt="cell-0"
              className="row-span-2 w-full h-full object-cover cursor-pointer"
              onClick={() => onClick(0)}
            />
            <img
              src={images[1]}
              alt="cell-1"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onClick(1)}
            />
            <img
              src={images[2]}
              alt="cell-2"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onClick(2)}
            />
          </div>
        )}

        {images.length >= 4 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-px h-full">
            {images.slice(0, 4).map((src, idx) => (
              <div
                key={idx}
                className="relative w-full h-full overflow-hidden cursor-pointer"
                onClick={() => onClick(idx)}
              >
                <img
                  src={src}
                  alt={`cell-${idx}`}
                  className="w-full h-full object-cover"
                />
                {idx === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="pt-3 pb-3 pr-3 pl-6">
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {title && title !== "-" && (
            <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2 flex-1">
              {title}
            </p>
          )}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle} ${
              !title || title === "-" ? "ml-auto" : ""
            }`}
          >
            {status}
          </span>
        </div>
        <div className="border-t border-gray-100 my-2" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 ml-6">
          <MetaItem label="Smear ID" value={issueId} />
          <MetaItem label="Chicken type" value={chickenType} />
          <MetaItem label="Province" value={province} />
          <MetaItem label="Age" value={age ? `${age} weeks` : ""} />
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
                className="w-7 h-7 rounded-full object-cover ring-blue-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600 ring-blue-200">
                {initials}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-700 leading-none">
                {uploaderName}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                {uploaderDate}
              </p>
            </div>
          </div>

          {/* More options */}
          <div className="relative" ref={menuRef}>
            <button
              className="text-gray-400 hover:text-gray-600 px-1"
              onClick={handleMoreClick}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="More options"
            >
              <span className="text-lg leading-none">···</span>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 bottom-full mb-1 w-32 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full text-left text-xs text-red-600 hover:bg-red-50 px-3 py-2"
                  onClick={handleDeleteClick}
                >
                  ลบโพส
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {confirmOpen && (
        <div
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-lg w-64 p-4">
            <p className="text-xs font-semibold text-gray-800 mb-1">
              คุณต้องการลบโพสต์นี้หรือไม่?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="text-xs font-medium px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={handleCancelDelete}
              >
                ยกเลิก
              </button>
              <button
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetaItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 font-semibold leading-none mb-0.5">
      {label}
    </p>
    <p className="text-[10px] text-gray-700 font-normal truncate">
      {value || "-"}
    </p>
  </div>
);

export default BloodCellCard;
