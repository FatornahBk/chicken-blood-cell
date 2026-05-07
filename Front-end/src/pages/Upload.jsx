import { useState, useRef } from "react";        // 👈 เพิ่ม
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";   // 👈 เพิ่ม
import Footer from "../components/footer";

// ── วางตรงนี้ (ก่อน const Upload) ──────────────

const MOCK_IMAGES = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: "name of img.png",
  selected: false,
}));

function StainButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer w-full justify-center
        ${active
          ? "border-blue-500 bg-white text-gray-800 shadow-sm"
          : "border-gray-200 bg-white text-gray-500 hover:border-blue-300"
        }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function ImageThumbnail({ image, onRemove, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(image.id)}
      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-150 group
        ${selected ? "border-blue-500" : "border-transparent"}`}
    >
      <div className="w-full aspect-square bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center">
        <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(image.id); }}
        className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow text-gray-400 hover:text-red-500 text-[10px] font-bold leading-none"
      >
        ×
      </button>
      <div className="bg-white text-[9px] text-gray-500 text-center truncate px-1 py-0.5 leading-tight">
        {image.name}
      </div>
    </div>
  );
}

// ── ส่วน Upload Page ────────────────────────────

const Upload = () => {
  const navigate = useNavigate();                 // 👈 เพิ่ม
  const fileInputRef = useRef(null);
  const [stain, setStain] = useState("wright");
  const [images, setImages] = useState(MOCK_IMAGES);
  const [dragging, setDragging] = useState(false);

  const selectedIds = images.filter((i) => i.selected).map((i) => i.id);
  const handleRemove = (id) => setImages((p) => p.filter((img) => img.id !== id));
  const handleSelect = (id) =>
    setImages((p) => p.map((img) => img.id === id ? { ...img, selected: !img.selected } : img));
  const handleDeleteSelected = () => setImages((p) => p.filter((img) => !img.selected));
  const addFiles = (files) => {
    const newImgs = Array.from(files)
      .slice(0, 100 - images.length)
      .map((f, idx) => ({ id: Date.now() + idx, name: f.name, selected: false }));
    setImages((p) => [...p, ...newImgs]);
  };

  return (
    <>
      <Navbar activePage="Upload" />

      {/* 👇 แทนที่ <div>Upload Page</div> ด้วยโค้ดนี้ทั้งหมด */}
      <div className="bg-gradient-to-b from-sky-200 via-blue-100 to-sky-200 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 flex flex-col items-center px-4 py-10">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">
            Blood Smear Image Save
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Used for uploading and storing blood smear images of chicken blood.
          </p>
          <div className="w-full max-w-5xl flex gap-5 items-stretch relative">
            <button
              onClick={() => navigate("/")}
              className="absolute -top-2 right-0 text-gray-400 hover:text-gray-600 text-xl leading-none z-10"
            >
              ✕
            </button>

            {/* LEFT PANEL */}
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              <div className="bg-white/60 backdrop-blur rounded-2xl p-5 shadow-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Smear ID</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">AV-99215</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Chicken type</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">Laying hen</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Province</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">Nakhon Si Thammarat</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Age</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">20 week</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-white/60 backdrop-blur rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Select Stain Type</p>
                  <div className="flex gap-3">
                    <StainButton icon="🔵" label="Wright Stain" active={stain === "wright"} onClick={() => setStain("wright")} />
                    <StainButton icon="🟣" label="Giemsa Stain" active={stain === "giemsa"} onClick={() => setStain("giemsa")} />
                  </div>
                </div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 py-8 cursor-pointer transition-all duration-200
                    ${dragging ? "border-blue-500 bg-blue-100" : "border-blue-300 hover:bg-blue-50"}`}
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-300 mb-1">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Upload Image</p>
                  <p className="text-xs text-gray-400">Support: .jpg, .png (max 1 MB)</p>
                  <p className="text-xs text-gray-400">Max 100 images</p>
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col bg-white/60 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                <span className="text-sm font-bold text-gray-700">Uploaded Results</span>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className="text-[11px] bg-gray-600 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2.5 py-1 rounded-lg font-semibold transition-colors duration-150"
                >
                  Delete selected
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-2 min-h-0">
                {images.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-xs">No images</div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {images.map((img) => (
                      <ImageThumbnail key={img.id} image={img} onRemove={handleRemove} onSelect={handleSelect} selected={img.selected} />
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 mx-3 shrink-0" />
              <div className="flex gap-2 px-3 py-3 shrink-0">
                <button onClick={() => navigate("/")} className="flex-1 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold transition-colors duration-150">
                  cancel
                </button>
                <button className="flex-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-900 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  save
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Upload;