import { useState } from "react";


const cellData = {
  doctorName: "Dr. Strange",
  doctorDate: "10 มี.ค. 2569",
  doctorAvatar: "https://i.pravatar.cc/40?img=12",
  smearId: "AV-99215",
  chickenType: "Laying hen",
  province: "Nakhon Si Thammarat",
  age: "20 week",
  stainType: "Wrigth stain",
  distribution: [
    { label: "Monocyte", percent: 35, color: "#60a5fa" },
    { label: "Lymphocyte", percent: 48, color: "#fb923c" },
    { label: "Basophil", percent: 76, color: "#c084fc" },
  ],
  total: 20,
  mainImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat_03.jpg/1200px-Cat_03.jpg",
};

export default function BloodCellDetailModal({ data = cellData, onClose }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  const info = data || cellData;
  const smearId = info.smearId || info.issueId;
const doctorName = info.doctorName || info.uploaderName;
const thumbnails = info.thumbnails || info.images || [];

  const handlePrevThumb = () => {
    setThumbStart((prev) => Math.max(0, prev - 1));
  };

  const handleNextThumb = () => {
  setThumbStart((prev) => Math.min(thumbnails.length - 3, prev + 1));
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden"
        style={{ fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#64748b"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2 className="text-base font-semibold text-slate-700 tracking-wide">
            ตรวจหาเม็ดเลือดขาวของไก่ที่ผมเลี้ยงกับมือ
          </h2>
        </div>

        {/* Body */}
        <div className="flex gap-5 p-5">
          {/* Left: image section */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 aspect-[4/3] w-full">
              <img
                src={thumbnails[activeThumb] || info.mainImage}
                alt="blood smear"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x300/f3e8ff/a855f7?text=Blood+Smear";
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevThumb}
                disabled={thumbStart === 0}
                className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="#64748b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex gap-2 flex-1 overflow-hidden">
                {thumbnails.slice(thumbStart, thumbStart + 4).map((src, i) => (
                  <button
                    key={i + thumbStart}
                    onClick={() => setActiveThumb(i + thumbStart)}
                    className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                      activeThumb === i + thumbStart
                        ? "border-blue-400 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      className="w-full h-14 object-cover"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/100x60/f3e8ff/a855f7?text=${i + 1}`;
                      }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextThumb}
                disabled={thumbStart >= mockThumbnails.length - 4}
                className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="#64748b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: info section */}
          <div className="flex flex-col gap-4 w-56 flex-shrink-0">
            {/* Doctor info */}
            <div className="flex items-center gap-3">
              <img
                src={info.doctorAvatar}
                alt="doctor"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                onError={(e) => {
                  e.target.src = "https://placehold.co/40x40/dbeafe/3b82f6?text=Dr";
                }}
              />
              <div>
                <p className="text-sm font-bold text-slate-800">{info.doctorName}</p>
                <p className="text-xs text-slate-400">{info.doctorDate}</p>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-col gap-1.5 text-sm text-slate-600">
              {[
                ["Smear ID", smearId],
                ["Chicken type", info.chickenType],
                ["Province", info.province],
                ["Age", info.age],
                ["Stain type", info.stainType],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-2">
                  <span className="text-slate-400 text-xs whitespace-nowrap">{label} :</span>
                  <span className="text-slate-700 text-xs text-right font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Cell Distribution */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}
            >
              <div className="px-4 py-2.5">
                <p className="text-white text-xs font-semibold tracking-wide mb-3">
                  Cell Distribution
                </p>
                <div className="flex flex-col gap-2.5">
                  {info.distribution.map((cell) => (
                    <div key={cell.label} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cell.color }}
                          />
                          <span className="text-white/90 text-xs">{cell.label}</span>
                        </div>
                        <span className="text-white text-xs font-bold">{cell.percent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${cell.percent}%`,
                            backgroundColor: cell.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center px-4 py-2 bg-blue-800/40 mt-1">
                <span className="text-white/80 text-xs font-medium">Total</span>
                <span className="text-white text-sm font-bold">{info.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}