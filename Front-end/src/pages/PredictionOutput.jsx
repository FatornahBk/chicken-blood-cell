import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const CELL_COLOR_MAP = {
  Basophil: "#9b5de5",
  Eosinophil: "#f15bb5",
  Heterophil: "#00bbf9",
  Lymphocyte: "#06b6a2",
  Monocyte: "#ca8a04",
  Thrombocyte: "#fb5607",
};

function ImagePlaceholder({ size = "sm" }) {
  const cls = size === "sm" ? "w-10 h-10" : "w-full h-full";
  return (
    <div
      className={`${cls} bg-blue-100 rounded-lg flex items-center justify-center`}
    >
      <svg
        className="text-blue-300 w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M21 15l-5-5L5 21"
        />
      </svg>
    </div>
  );
}

function ImageCard({ item, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-2 flex items-center gap-3 transition-all duration-200 border-2 ${
        selected
          ? "border-blue-400 bg-blue-50 shadow-md"
          : "border-transparent bg-white hover:border-blue-200 hover:bg-blue-50/50"
      }`}
    >
      <ImagePlaceholder size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-blue-700 truncate">
          {item.id}
        </p>
        <p className="text-xs text-gray-500 truncate">
          Chicken type: {item.chickenType}
        </p>
        <p className="text-xs text-gray-500 truncate">
          Province: {item.province}
        </p>
        <p className="text-xs text-gray-500">Age: {item.age}</p>
        <p className="text-xs text-gray-500">Stain type: {item.stain}</p>
      </div>
      {selected && (
        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
      )}
    </button>
  );
}

function CellBar({ label, percent, colorClass }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${colorClass.dot}`} />
          <span className="text-sm text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-800">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${colorClass.bar}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PredictionLogsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { smear, selectedImages, predictionResult } = state || {};
  const imageList = predictionResult?.data ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedData = imageList[selectedIndex];
  const cellCounts = selectedData?.classes ?? {};
  const grandTotal = Object.values(cellCounts).reduce(
    (sum, v) => sum + v.count,
    0,
  );

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const drawBoundingBoxes = (classes) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    const container = containerRef.current;
    if (!canvas || !img || !container) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext("2d");

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;
    let drawW, drawH, drawX, drawY;
    if (imgAspect > canvasAspect) {
      drawW = canvas.width;
      drawH = canvas.width / imgAspect;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgAspect;
    }
    drawX = (canvas.width - drawW) / 2;
    drawY = (canvas.height - drawH) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const scaleX = drawW / img.naturalWidth;
    const scaleY = drawH / img.naturalHeight;

    Object.entries(classes).forEach(([className, classData]) => {
      const color = CELL_COLOR_MAP[className] || "#999999";
      classData.detections.forEach(({ confidence, bbox }) => {
        const { x1, y1, width, height } = bbox;
        const rx = drawX + x1 * scaleX;
        const ry = drawY + y1 * scaleY;
        const rw = width * scaleX;
        const rh = height * scaleY;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(rx, ry, rw, rh);

        const label = `${className} ${(confidence * 100).toFixed(1)}%`;
        ctx.font = "bold 11px sans-serif";
        const textW = ctx.measureText(label).width;
        ctx.fillStyle = color;
        ctx.fillRect(rx, ry - 16, textW + 6, 16);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, rx + 3, ry - 3);
      });
    });
  };

  useEffect(() => {
    if (!selectedData) return;
    setTimeout(() => drawBoundingBoxes(selectedData.classes), 100);
  }, [selectedIndex, selectedData]);

  const colorPalette = [
    { bar: "bg-gray-700", dot: "bg-gray-700" },
    { bar: "bg-orange-400", dot: "bg-orange-400" },
    { bar: "bg-purple-400", dot: "bg-purple-400" },
    { bar: "bg-blue-400", dot: "bg-blue-400" },
    { bar: "bg-green-400", dot: "bg-green-400" },
    { bar: "bg-red-400", dot: "bg-red-400" },
  ];
  const [editingDesc, setEditingDesc] = useState(false);
  const [description, setDescription] = useState(
    "ตรวจหาเม็ดเลือดขาวของที่ฟักเลี้ยงเองกับมือ",
  );

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-slate-100 to-blue-50 p-4">
        {/* ── Top bar ── */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-lg font-bold text-gray-700 tracking-wide">
            Prediction Logs
          </h1>
          <div className="w-8 h-8 rounded-lg bg-blue-200 border-2 border-blue-400" />
        </div>

        {/* ── Three-column layout ── */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
          {/* ── Column 1: Image list ── */}
          <div className="col-span-4 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-blue-100 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50">
              <h2 className="font-bold text-gray-700">Image</h2>
              <button className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors font-medium">
                Edit
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {imageList.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-full text-left rounded-xl p-2 flex items-center gap-3 border-2 transition-all ${
                    selectedIndex === i
                      ? "border-blue-400 bg-blue-50"
                      : "border-transparent bg-white hover:bg-blue-50/50"
                  }`}
                >
                  <ImagePlaceholder size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-700 truncate">
                      {item.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      Detections: {item.total_detections}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Classes: {item.classes_found.join(", ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {/* Scroll indicator */}
            <div className="flex justify-center py-2">
              <svg
                className="w-4 h-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

          {/* ── Column 2: Example / Preview ── */}
          <div className="col-span-5 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-blue-100 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50">
              <h2 className="font-bold text-gray-700">
                Example
                {selectedData && (
                  <span className="ml-2 text-blue-500 font-normal text-sm">
                    — {selectedData.filename}
                  </span>
                )}
              </h2>
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 11l6.071-6.071a2 2 0 012.828 2.828L11.828 13.83A4 4 0 019 15H8v-1a4 4 0 011-2.586z"
                  />
                </svg>
              </button>
            </div>

            {/* Main preview */}
            <div className="flex items-center justify-center gap-3 px-4 py-4 flex-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-500 transition-colors shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div
                ref={containerRef}
                className="w-[430px] h-80 bg-gray-200 rounded-2xl overflow-hidden relative flex items-center justify-center"
              >
                {selectedImages?.[selectedIndex] ? (
                  <>
                    <img
                      ref={imageRef}
                      src={`https://television-cooperative-belief-like.trycloudflare.com/api/${selectedImages[selectedIndex].replace(/\\/g, "/")}`}
                      crossOrigin="anonymous"
                      style={{ display: "none" }}
                      onLoad={() =>
                        drawBoundingBoxes(selectedData?.classes ?? {})
                      }
                    />
                    <canvas
                      ref={canvasRef}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </>
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      strokeWidth="1"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M21 15l-5-5L5 21"
                    />
                  </svg>
                )}
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-500 transition-colors shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="pb-4 flex justify-center gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
              {selectedImages?.map((path, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-24 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedIndex === i
                      ? "border-blue-400"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={`https://television-cooperative-belief-like.trycloudflare.com/api/${path.replace(/\\/g, "/")}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Column 3: Detail panel ── */}
          <div className="col-span-3 flex flex-col gap-3 overflow-y-auto">
            {/* Description card */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-blue-500 rounded-t-2xl">
                <h3 className="font-bold text-white text-sm">Description</h3>
                <button
                  onClick={() => setEditingDesc(!editingDesc)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 11l6.071-6.071a2 2 0 012.828 2.828L11.828 13.83A4 4 0 019 15H8v-1a4 4 0 011-2.586z"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-3">
                {editingDesc ? (
                  <div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-sm text-gray-700 bg-blue-50 rounded-lg p-2 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => setEditingDesc(false)}
                      className="mt-2 w-full text-xs py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-2 leading-relaxed min-h-[60px]">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Cell Distribution card */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex-1">
              <div className="flex items-center justify-between px-4 py-2 bg-blue-500 rounded-t-2xl">
                <h3 className="font-bold text-white text-sm">
                  Cell Distribution
                </h3>
              </div>
              <div className="p-4">
                {Object.entries(cellCounts).map(([cls, val], i) => (
                  <CellBar
                    key={cls}
                    label={cls}
                    percent={
                      grandTotal > 0
                        ? Math.round((val.count / grandTotal) * 100)
                        : 0
                    }
                    colorClass={colorPalette[i % colorPalette.length]}
                  />
                ))}
              </div>

              {/* Total */}
              <div className="mx-4 mb-4 flex items-center justify-between bg-blue-500 rounded-xl px-4 py-2">
                <span className="text-white font-semibold text-sm">Total</span>
                <span className="text-white font-bold text-lg">
                  {grandTotal}
                </span>
              </div>

              {/* Save button */}
              <div className="px-4 pb-4">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  บันทึกข้อมูลลงฐานข้อมูล
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
