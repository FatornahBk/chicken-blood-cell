import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getPendingBatches } from "../services/prediction";

function SampleCard({ sample, onClick }) {
  const firstImage = sample.images?.[0];
  const imageUrl = firstImage
    ? `http://localhost/api/${firstImage.image_path.replace(/\\/g, "/")}`
    : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all duration-150 overflow-hidden mb-3 cursor-pointer"
    >
      <div className="flex items-center gap-6 px-3 py-3">
        <div className="flex-shrink-0 w-34 h-28 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={firstImage.image_name} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm mb-1">{sample.smear_id}</p>
          <p className="text-sm text-gray-600">Chicken type : {sample.chicken_type}</p>
          <p className="text-sm text-gray-600">Age : {sample.age} weeks</p>
          <p className="text-xs text-gray-400 mt-0.5">Province : {sample.province}</p>
        </div>
        <div className="flex-shrink-0">
          <span className="bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            {sample.images.length} Images
          </span>
        </div>
      </div>
    </div>
  );
}

const Prediction = () => {
  const [activeTab, setActiveTab] = useState("Wright");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const result = await getPendingBatches(activeTab, currentPage);
        setBatches(result.data);
        setTotalPages(result.meta.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, [activeTab, currentPage]);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <>
      <Navbar activePage="Prediction" />
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: "url('/src/assets/VerifyUsers.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-4xl mx-auto px-2 py-10 flex-1 w-full">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Prediction</h1>
            <p className="text-gray-500 text-sm font-medium">
              Upload a blood smear image to analyze chicken blood cells
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-5">
            <div className="inline-flex bg-white rounded-xl border border-gray-200 p-1 gap-1">
              {[
                { key: "Wright", label: "Wright Stain" },
                { key: "Giemsa", label: "Giemsa Stain" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
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

          {/* Cards */}
          {loading ? (
            <p className="text-center text-gray-400 text-sm">Loading...</p>
          ) : batches.length === 0 ? null : (
            batches.map((sample) => (
              <SampleCard
                key={sample.batch_id}
                sample={sample}
                onClick={() => navigate(`/prediction/${sample.batch_id}`, { state: { smear: sample } })}
              />
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-2xl"
              >
                ‹
              </button>
              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`dot-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors duration-150 ${
                      currentPage === page
                        ? "bg-gray-700 text-white border-gray-700"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-2xl"
              >
                ›
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Prediction;