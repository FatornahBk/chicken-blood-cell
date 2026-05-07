import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const mockSamples = [
  // ── Wright Stain ──
  {
    id: "EW-2541",
    stainType: "wright",
    chickenType: "Laying hen",
    age: "6 months",
    province: "Nakhon Si Thammarat",
    images: Array(20).fill(null).map((_, i) => ({
      id: i, name: `name of img.png`, selected: true, url: null,
    })),
  },
  {
    id: "EW-2874",
    stainType: "wright",
    chickenType: "Broiler",
    age: "3 months",
    province: "Nakhon Si Thammarat",
    images: Array(20).fill(null).map((_, i) => ({
      id: i, name: `name of img.png`, selected: true, url: null,
    })),
  },

  // ── Giemsa Stain ──
  {
    id: "EG-3001",
    stainType: "giemsa",
    chickenType: "Broiler",
    age: "4 months",
    province: "Chiang Mai",
    images: Array(15).fill(null).map((_, i) => ({
      id: i, name: `name of img.png`, selected: true, url: null,
    })),
  },
  {
    id: "EG-3002",
    stainType: "giemsa",
    chickenType: "Laying hen",
    age: "8 months",
    province: "Bangkok",
    images: Array(18).fill(null).map((_, i) => ({
      id: i, name: `name of img.png`, selected: true, url: null,
    })),
  },
];

// ---- ImageCard ----
function ImageCard({ image, onToggle }) {
  return (
    <div
      className="relative flex-shrink-0 cursor-pointer"
      style={{ width: 105, height: 118 }}
      onClick={() => onToggle(image.id)}
    >
      <div
        className={`w-full rounded-2xl overflow-hidden transition-opacity duration-200 ${
          image.selected ? "opacity-100" : "opacity-35"
        }`}
        style={{ height: 98 }}
      >
        {image.url ? (
          <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-orange-300 rounded-2xl" />
        )}
      </div>
      {image.selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <p className="text-center text-gray-400 mt-1 truncate px-1" style={{ fontSize: 10 }}>
        {image.name}
      </p>
    </div>
  );
}

// ---- SampleCard ----
function SampleCard({ sample, onToggleImage, onSelectAll }) {
  const allSelected = sample.images.every((img) => img.selected);
  const selectedCount = sample.images.filter((img) => img.selected).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="flex" style={{ minHeight: 300, maxHeight: 320 }}>

        {/* ── Left grey info panel ── */}
        <div className="flex-shrink-0 bg-gray-100 p-4" style={{ width: 220 }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-800 text-sm">{sample.id}</span>
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(sample.id, !allSelected)}
                className="w-3.5 h-3.5 accent-sky-500"
              />
              <span className="text-xs text-gray-500 font-medium">SELECT ALL</span>
            </label>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Chicken type :</span>{" "}
              <span className="text-gray-500">{sample.chickenType}</span>
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Age :</span>{" "}
              <span className="text-gray-500">{sample.age}</span>
            </p>
            <p className="text-xs text-gray-400 pt-2">Province : {sample.province}</p>
          </div>
        </div>

        {/* ── Right image area ── */}
        <div className="flex-1 bg-white flex flex-col min-w-0">

          {/* Badge top-right */}
          <div className="flex justify-end px-3 pt-2 pb-0 flex-shrink-0">
            <span className="bg-gray-500 text-white text-xs font-medium px-3 py-0.5 rounded-full">
              {selectedCount} Images
            </span>
          </div>

          {/* Grid หลายแถว + vertical scroll */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}
          >
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))" }}
            >
              {sample.images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onToggle={(imgId) => onToggleImage(sample.id, imgId)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ---- Prediction Page ----
const Prediction = () => {
  const [activeTab, setActiveTab] = useState("wright");
  const [samples, setSamples] = useState(mockSamples);
  const [isPredicting, setIsPredicting] = useState(false);

  const totalSelected = samples
  .filter((s) => s.stainType === activeTab) 
  .reduce((acc, s) => acc + s.images.filter((img) => img.selected).length, 0);

  const handleToggleImage = (sampleId, imageId) => {
    setSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? {
              ...s,
              images: s.images.map((img) =>
                img.id === imageId ? { ...img, selected: !img.selected } : img
              ),
            }
          : s
      )
    );
  };

  const handleSelectAll = (sampleId, val) => {
    setSamples((prev) =>
      prev.map((s) =>
        s.id === sampleId
          ? { ...s, images: s.images.map((img) => ({ ...img, selected: val })) }
          : s
      )
    );
  };

  const handlePredictAll = async () => {
    setIsPredicting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsPredicting(false);
    alert(`Prediction complete for ${totalSelected} images!`);
  };

  return (
    <>
      <Navbar activePage="Prediction" />

      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Prediction</h1>
            <p className="text-gray-500 text-sm font-medium">
              Upload a blood smear image to analyze chicken blood cells
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-5">
            <div className="inline-flex bg-white rounded-xl border border-gray-200 p-1 gap-1">
              {[
                { key: "wright", label: "Wright Stain" },
                { key: "giemsa", label: "Giemsa Stain" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-2.5 text-sm font-semibold transition-colors duration-150 relative ${
                    activeTab === tab.key
                      ? "text-gray-800 bg-white"
                      : "text-gray-400 bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-700 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Cards */}
          <div>
  {samples
    .filter((s) => s.stainType === activeTab)   
    .map((sample) => (
      <SampleCard
        key={sample.id}
        sample={sample}
        onToggleImage={handleToggleImage}
        onSelectAll={handleSelectAll}
      />
    ))}
</div>

          {/* Predict All Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handlePredictAll}
              disabled={totalSelected === 0 || isPredicting}
              className={`flex items-center gap-2 px-12 py-4 rounded-2xl text-white font-semibold text-base shadow-lg transition-all duration-200 ${
                totalSelected > 0 && !isPredicting
                  ? "bg-gray-600 hover:bg-gray-700 hover:shadow-xl active:scale-95"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isPredicting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Predicting...
                </>
              ) : (
                <>
                  <span className="text-yellow-300 text-lg leading-none">✦</span>
                  Predict All ({totalSelected})
                </>
              )}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Prediction;