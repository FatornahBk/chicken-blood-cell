import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate, useLocation } from "react-router-dom";

function PredictionDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const smear = state?.smear;
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!smear) return <div>Not found</div>;

  const images = smear.images || [];

  const toggleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((img) => img.image_path));
    }
  };

  const toggleImage = (path) => {
    setSelectedImages((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const handlePredict = async () => {
    if (selectedImages.length === 0) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("mode", smear.stain_type ?? "wright");

      await Promise.all(
        selectedImages.map(async (path) => {
          const url = `http://localhost/ai/${path.replace(/\\/g, "/")}`;
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          const blob = await res.blob();
          formData.append("images", blob, path.split(/[\\/]/).pop());
        }),
      );

      const res = await fetch(
        "http://localhost/api/predict-batch",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      const predictionResult = await res.json();

      navigate("/prediction/output", {
        state: { smear, selectedImages, predictionResult },
      });
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
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
        <div className="max-w-5xl mx-auto px-2 py-10 flex-1 w-full">
          {/* Header */}
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Prediction
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Upload a blood smear image to analyze chicken blood cells
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <span className="bg-gray-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                {images.length} Images
              </span>
            </div>

            <div className="flex gap-6">
              {/* Left: Info panel */}
              <div className="bg-gray-100 rounded-lg p-4 pt-8 min-w-[260px] w-[260px]">
                <div className="flex justify-end items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    checked={
                      selectedImages.length === images.length &&
                      images.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    SELECT ALL
                  </span>
                </div>
                <p className="font-bold text-sm mb-1">{smear.smear_id}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Chicken type : {smear.chicken_type}
                </p>
                <p className="text-sm text-gray-600 mt-1">Age : {smear.age}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Province : {smear.province}
                </p>
              </div>

              {/* Right: Images grid */}

              <div className="flex-1">
                <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                  {images.map((img) => {
                    const url = `http://localhost/api/${img.image_path.replace(/\\/g, "/")}`;
                    const isSelected = selectedImages.includes(img.image_path);
                    return (
                      <div
                        key={img.image_path}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => toggleImage(img.image_path)}
                      >
                        <div className="w-[186px] h-[146px] rounded-lg bg-gray-100 relative overflow-hidden">
                          <img
                            src={url}
                            alt={img.image_name}
                            className="w-full h-full object-contain"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 text-gray-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 max-w-[140px] truncate">
                          {img.image_name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Predict button */}
          <button
            onClick={handlePredict}
            disabled={isLoading || selectedImages.length === 0}
            className="block mx-auto mt-6 bg-gray-600 hover:bg-gray-700
             disabled:opacity-50 text-white font-semibold
             py-3 px-16 rounded-xl text-base transition-colors"
          >
            {isLoading
              ? "กำลังทำนาย..."
              : `Predict All (${selectedImages.length})`}
          </button>
        </div>

        <Footer />
      </div>
    </>
  );
}
export default PredictionDetail;
