import React, { useState, useRef } from "react";
import NavbarWelcome from "../components/navbar_welcome";
import Footer from "../components/footer";
import { TestTube2 } from "lucide-react";
import { predictBloodCell9k, predictBloodCell4kr } from "../services/predict.js";

const STAINS = [
  {
    key: "wright",
    label: "Wright",
    desc: "General blood staining reveals the main structural features of cells.",
    image: "/src/assets/Wright.png",
  },
  {
    key: "giemsa",
    label: "Giemsa",
    desc: "Provides detailed visualization of cellular structures and enables clear identification of parasites.",
    image: "/src/assets/Gimsa.png",
  },
];

const CELLS = [
  {
    title: "Basophil",
    image: "/src/assets/Exame.png",
    stain: "Giemsa",
    features: [
      "เป็นเม็ดเลือดขาวที่พบน้อยที่สุด",
      "มี <span class='italic text-[#1a3c6e]'>granules</span> สีม่วงเข้มหรือสีดำจำนวนมาก",
    ],
  },
  {
    title: "Eosinophil",
    image: "/src/assets/Exame.png",
    stain: "Giemsa",
    features: [
      "มี <span class='italic text-[#1a3c6e]'>granules</span> ขนาดใหญ่",
      "ย้อมติดสีส้ม-ชมพูสดใส",
      "นิวเคลียส 2 พู",
    ],
  },
  {
    title: "Heterophil",
    image: "/src/assets/Exame.png",
    stain: "Giemsa",
    features: [
      "เป็นเม็ดเลือดขาวที่พบมากที่สุดในไก่",
      "มี <span class='italic text-[#1a3c6e]'>granules</span> สีส้มถึงแดงน้ำตาล",
    ],
  },
  {
    title: "Lymphocyte",
    image: "/src/assets/Exame.png",
    stain: "Giemsa",
    features: [
      "มีนิวเคลียสขนาดใหญ่เกือบเต็มเซลล์",
      "ไซโทพลาสซึมน้อย",
      "เกี่ยวข้องกับระบบภูมิคุ้มกัน",
    ],
  },
  {
    title: "Monocyte",
    image: "/src/assets/Exame.png",
    stain: "Giemsa",
    features: [
      "มีขนาดใหญ่ที่สุดในกลุ่ม WBC",
      "นิวเคลียสรูปถั่วหรือรูปไต",
      "ทำหน้าที่กินเชื้อโรค (phagocytosis)",
    ],
  },
  {
    title: "Thrombocyte",
    image: "/src/assets/Exame.png",
    stain: "Giemsa",
    features: [
      "เกี่ยวข้องกับการแข็งตัวของเลือด",
      "มีนิวเคลียส (ต่างจาก platelet ในคน)",
      "รูปร่างยาวหรือรี",
    ],
  },

  {
    title: "Basophil",
    image: "/src/assets/Exame.png",
    stain: "Wright",
    features: [
      "เป็นเม็ดเลือดขาวที่พบน้อยที่สุด",
      "มี <span class='italic text-[#1a3c6e]'>granules</span> สีม่วงเข้มหรือสีดำจำนวนมาก",
    ],
  },
  {
    title: "Eosinophil",
    image: "/src/assets/Exame.png",
    stain: "Wright",
    features: [
      "มี <span class='italic text-[#1a3c6e]'>granules</span> ขนาดใหญ่",
      "ย้อมติดสีส้ม-ชมพูสดใส",
      "นิวเคลียส 2 พู",
    ],
  },
  {
    title: "Heterophil",
    image: "/src/assets/Exame.png",
    stain: "Wright",
    features: [
      "เป็นเม็ดเลือดขาวที่พบมากที่สุดในไก่",
      "มี <span class='italic text-[#1a3c6e]'>granules</span> สีส้มถึงแดงน้ำตาล",
    ],
  },
  {
    title: "Lymphocyte",
    image: "/src/assets/Exame.png",
    stain: "Wright",
    features: [
      "มีนิวเคลียสขนาดใหญ่เกือบเต็มเซลล์",
      "ไซโทพลาสซึมน้อย",
      "เกี่ยวข้องกับระบบภูมิคุ้มกัน",
    ],
  },
  {
    title: "Monocyte",
    image: "/src/assets/Exame.png",
    stain: "Wright",
    features: [
      "มีขนาดใหญ่ที่สุดในกลุ่ม WBC",
      "นิวเคลียสรูปถั่วหรือรูปไต",
      "ทำหน้าที่กินเชื้อโรค (phagocytosis)",
    ],
  },
  {
    title: "Thrombocyte",
    image: "/src/assets/Exame.png",
    stain: "Wright",
    features: [
      "เกี่ยวข้องกับการแข็งตัวของเลือด",
      "มีนิวเคลียส (ต่างจาก platelet ในคน)",
      "รูปร่างยาวหรือรี",
    ],
  },
];

const CELL_COLOR_MAP = {
  Basophil:    "#9b5de5",
  Eosinophil:  "#f15bb5",
  Heterophil:  "#00bbf9",
  Lymphocyte:  "#06b6a2",
  Monocyte:    "#ca8a04",
  Thrombocyte: "#fb5607",
};

const CellCard = ({ title, image, features, isCenter, stain }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="p-2">
      <div className="w-full h-42 overflow-hidden rounded-xl border-2 border-gray-200 shadow-inner">
        <img src={image} alt={title} className="w-full h-full object-cover " />
      </div>
    </div>
    <div className="px-4 py-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-5 rounded-full bg-blue-500 flex-shrink-0" />
        <h3 className="font-playfair text-[15px] font-bold text-blue-500">
          {title}
        </h3>
      </div>
      <p className="text-[11px] text-gray-400 ml-3 mb-1">{stain}</p>
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1 ml-3">
        ลักษณะเด่น
      </p>
      <ul className="list-disc list-inside space-y-1 mb-3 ml-3">
        {features.map((f, i) => (
          <li
            key={i}
            className="text-[11px] text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: f }}
          />
        ))}
      </ul>
    </div>
  </div>
);

const MIN_SCALE = 1;
const MAX_SCALE = 5;

const clampOffset = (newOffset, newScale, containerW, containerH) => {
  const maxX = (containerW * (newScale - 1)) / 2;
  const maxY = (containerH * (newScale - 1)) / 2;
  return {
    x: Math.min(maxX, Math.max(-maxX, newOffset.x)),
    y: Math.min(maxY, Math.max(-maxY, newOffset.y)),
  };
};

const Welcome = () => {
  const [stainType, setStainType] = useState("wright");
  const [cardIndex, setCardIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [predictionResults, setPredictionResults] = useState([]);
  const [isPredicted, setIsPredicted] = useState(false);
  const [predictURL, setPredictURL] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedStain, setSelectedStain] = useState(null);
  const fileInputRef = useRef();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const filteredCells = selectedStain
    ? CELLS.filter((c) => c.stain === selectedStain)
    : CELLS;

  const visibleCards = [
    filteredCells[
      (cardIndex + filteredCells.length - 1) % filteredCells.length
    ],
    filteredCells[cardIndex % filteredCells.length],
    filteredCells[(cardIndex + 1) % filteredCells.length],
    filteredCells[(cardIndex + 2) % filteredCells.length],
    filteredCells[(cardIndex + 3) % filteredCells.length],
    filteredCells[(cardIndex + 4) % filteredCells.length],
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const drawBoundingBoxes = (response) => {
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

    

    Object.entries(response.classes).forEach(([className, classData]) => {
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

  const handlePredict = async () => {
    if (!uploadedFile) return;
    try {
      const response =
        stainType === "wright"
          ? await predictBloodCell9k(uploadedFile, stainType)
          : await predictBloodCell4kr(uploadedFile, stainType);

      const CELL_TYPES = [
        "Basophil",
        "Eosinophil",
        "Heterophil",
        "Lymphocyte",
        "Monocyte",
        "Thrombocyte",
      ];

      const results = CELL_TYPES.map((type, i) => {
        const data = response.classes[type];
        return {
          type,
          count: data ? data.count : 0,
          confidence: data ? (data.avg_confidence * 100).toFixed(1) : null,
          color: CELL_COLOR_MAP[type] || "#999999",
        };
      });
      setPredictURL(previewURL);
      setPredictionResults(results);
      setIsPredicted(true);
      setPreviewURL(null);
      setUploadedFile(null);
      setTimeout(() => drawBoundingBoxes(response), 100);
    } catch (err) {
      console.error(err);
      alert("An error has occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <NavbarWelcome />

      <section
        className="text-center px-6 pt-16 pb-16 bg-cover bg-center relative min-h-[400px] flex flex-col justify-center"
        style={{ backgroundImage: "url('/src/assets/Back01.jpg')" }}
      >
        <h1 className="font-playfair text-5xl font-extrabold mb-5 tracking-tight">
          <span className="text-black">Avian</span>{" "}
          <span className="text-blue-500">Blood</span>
        </h1>

        <p className="text-[16px] text-gray-500 max-w-3xl mx-auto leading-relaxed">
          We bring intelligence to poultry diagnostics. Detect abnormalities in
          seconds and enhance flock health with advanced deep-learning analysis
          of chicken blood cells.
        </p>

        <div className="absolute left-0 right-0 bottom-0 translate-y-1/2 flex justify-center">
          <div
            className="flex gap-20 bg-[#e0e6f0] px-8 py-4 justify-center mx-auto items-center"
            style={{ width: "960px", height: "88px" }}
          >
            {STAINS.map(({ key, label, desc, image }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-[72px] h-[72px] rounded-full flex-shrink-0 border-2 border-[#a8c4e8] overflow-hidden bg-white">
                  <img
                    src={image}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1a3c6e] flex items-center gap-1.5 mb-0.5">
                    {label}
                    <TestTube2 size={18} color="#8fa8c8" />
                  </p>
                  <p className="text-[12px] text-[#8a9ab5] text-left">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 pb-16 pt-28 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Blood cell</h2>
          <div className="flex gap-1">
            {["Wright", "Giemsa"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSelectedStain(selectedStain === s ? null : s);
                  setCardIndex(0);
                }}
                className={`px-3 h-7 rounded text-sm cursor-pointer transition-colors
      ${
        selectedStain === s
          ? "bg-blue-500 text-white"
          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
      }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-16 ">
          {visibleCards.map((cell, i) => (
            <CellCard key={`${cell.title}-${i}`} {...cell} />
          ))}
        </div>
      </section>

      <div
        className="w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/VerifyUsers.png')" }}
      >
        <section className="flex gap-20 px-8 pt-28 pb-32 max-w-5xl mx-auto items-stretch">
          <div className="flex-1 bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3">
            <p className="text-[18px] font-semibold text-gray-700 tracking-wide">
              Select Stain Type
            </p>
            <div className="flex gap-3 mb-3">
              {[
                { key: "wright", label: "Wright Stain", color: "#3b9eff" },
                { key: "giemsa", label: "Giemsa Stain", color: "#c678b8" },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setStainType(key)}
                  className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-[15px] font-semibold transition-all duration-150 cursor-pointer
                  ${stainType === key ? "border-[#3b9eff] bg-blue-50 text-[#1a3c6e]" : "border-gray-200 bg-white text-gray-500 hover:border-blue-200"}`}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2 C10 2 4 9 4 13 a6 6 0 0 0 12 0 C16 9 10 2 10 2Z"
                      fill={color}
                    />
                  </svg>
                  {label}
                </button>
              ))}
            </div>

            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 h-[340px] mb-4 overflow-hidden
    ${dragOver ? "border-[#3b9eff] bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-[#3b9eff] hover:bg-blue-50"}`}
            >
              {previewURL && !isPredicted ? (
                <>
                  {!isPredicted && (
                    <img
                      src={previewURL}
                      alt="preview"
                      className="w-full object-cover rounded-t-xl"
                    />
                  )}
                  <p className="text-sm font-semibold text-gray-700 text-center break-all px-2 pt-2">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-400 pb-3">
                    แตะเพื่อเปลี่ยนภาพ
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 16V8M8 12l4-4 4 4"
                        stroke="#3b9eff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Upload Image
                  </p>
                  <p className="text-xs text-gray-400">
                    Support: .jpg, .png (max 1 MB)
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              onClick={handlePredict}
              className={`w-full py-4 text-white font-bold text-lg rounded-xl tracking-widest transition-colors duration-200 cursor-pointer
    ${uploadedFile ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 hover:bg-gray-500"}`}
            >
              Predict
            </button>
          </div>

          <div className="flex-[1.4] bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-playfair text-lg font-bold text-gray-900">
                  Prediction results
                </h3>
                {predictionResults.length > 0 && (
                  <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full border border-blue-200">
                    {stainType === "wright" ? "Wright Stain" : "Giemsa Stain"}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setUploadedFile(null);
                  setPreviewURL(null);
                  setPredictionResults([]);
                  setIsPredicted(false);
                  setScale(1);
                  setOffset({ x: 0, y: 0 });
                }}
                className="flex items-center gap-0.5 bg-[#3b9eff] hover:bg-[#1a80e0] text-white text-[11px] font-semibold px-1 py-1 rounded-full transition-colors duration-200 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="white"
                    fillOpacity="0.3"
                  />
                  <polygon points="10,8 10,16 17,12" fill="white" />
                </svg>
                New Analysis
              </button>
            </div>

            {/* Image area */}
            <div
              ref={containerRef}
              className="w-full rounded-xl bg-gray-100 relative"
              style={{ height: "250px", overflow: "hidden" }}
              onWheel={(e) => {
                e.preventDefault();
                const newScale = Math.min(
                  Math.max(scale - e.deltaY * 0.001, MIN_SCALE),
                  MAX_SCALE,
                );
                const container = containerRef.current;
                if (!container) return;
                const clamped = clampOffset(
                  offset,
                  newScale,
                  container.offsetWidth,
                  container.offsetHeight,
                );
                setScale(newScale);
                setOffset(clamped);
              }}
              onMouseDown={(e) => {
                setDragging(true);
                setDragStart({
                  x: e.clientX - offset.x,
                  y: e.clientY - offset.y,
                });
              }}
              onMouseMove={(e) => {
                if (!dragging) return;
                const container = containerRef.current;
                if (!container) return;
                const newOffset = {
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y,
                };
                const clamped = clampOffset(
                  newOffset,
                  scale,
                  container.offsetWidth,
                  container.offsetHeight,
                );
                setOffset(clamped);
              }}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
            >
              {predictionResults.length > 0 && predictURL ? (
                <>
                  <img
                    ref={imageRef}
                    src={predictURL}
                    alt="hidden"
                    style={{ display: "none" }}
                  />
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: "center center",
                        cursor: dragging ? "grabbing" : "grab",
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 16l5-5 4 4 3-3 6 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              {predictionResults.length > 0 && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    onClick={() => {
                      const newScale = Math.min(scale + 0.2, MAX_SCALE);
                      const container = containerRef.current;
                      if (!container) return;
                      const clamped = clampOffset(
                        offset,
                        newScale,
                        container.offsetWidth,
                        container.offsetHeight,
                      );
                      setScale(newScale);
                      setOffset(clamped);
                    }}
                    className="bg-white/80 rounded px-2 py-1 text-xs font-bold shadow cursor-pointer flex items-center"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const newScale = Math.max(scale - 0.2, MIN_SCALE);
                      const container = containerRef.current;
                      if (!container) return;
                      const clamped = clampOffset(
                        offset,
                        newScale,
                        container.offsetWidth,
                        container.offsetHeight,
                      );
                      setScale(newScale);
                      setOffset(clamped);
                    }}
                    className="bg-white/80 rounded px-2 py-1 text-xs font-bold shadow cursor-pointer flex items-center"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setScale(1);
                      setOffset({ x: 0, y: 0 });
                    }}
                    className="bg-white/80 rounded px-2 py-1 text-xs font-bold shadow cursor-pointer"
                  >
                    ↺
                  </button>
                </div>
              )}
            </div>
            {/* Empty state */}
            {predictionResults.length === 0 && (
              <div className="flex-1 min-h-[250px] flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-gray-400 text-sm font-medium">
                  There are currently no prediction results.
                </p>
              </div>
            )}

            {/* Table */}
            {predictionResults.length > 0 && (
              <>
                <table className="w-5/6 text-sm table-fixed mx-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider w-1/3">
                        Cell Type
                      </th>
                      <th className="text-center py-2 px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider w-1/3">
                        Count
                      </th>
                      <th className="text-left py-2 px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider w-1/3">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                </table>
                <div>
                  <table className="w-5/6  text-sm table-fixed mx-auto">
                    <tbody>
                      {predictionResults.map((row) => (
                        <tr
                          key={row.type}
                          className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors"
                        >
                          <td
                            className="py-1.5 px-3 font-semibold text-[13px] w-1/3"
                            style={{ color: row.color }}
                          >
                            {row.type}
                          </td>
                          <td className="py-1.5 px-3 text-gray-600 text-[13px] w-1/3 text-center">
                            {row.count}
                          </td>
                          <td className="py-1.5 px-3 font-semibold text-[13px] text-green-500 w-1/3 text-center">
                            {row.confidence ? `${row.confidence}%` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Welcome;
