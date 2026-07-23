import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BloodCellCard from "../components/BloodCellCard";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import logo from "../assets/Chicken-CBC.png";
import BloodCellDetailModal from "../components/BloodCellDetailModal";
import { uploadClient, getImageUrl } from "../services/api";

const mapCardFromApi = (item) => {
  const images = item.images ?? [];

  return {
    id: item.batch_id,
    smearId: item.smear_id,
    images: images.map((img) => getImageUrl(img.image_path)),
    imageDetails: images.map((img) => ({
      url: getImageUrl(img.image_path),
      totalCells: img.total_cells_in_image ?? null,
      prediction: img.prediction ?? null,
    })),
    title: item.description ?? "",
    status: item.status ?? "",
    chickenType: item.chicken_type ?? "",
    province: item.province ?? "",
    age: item.age ?? "",
    stainType: item.stain_type ?? "",
    description: item.description ?? "",
    predictedAt: item.predicted_at ?? "",
    uploaderName: item.owner
      ? `${item.owner.first_name ?? ""} ${item.owner.last_name ?? ""}`.trim()
      : "",
    uploaderAvatar: item.owner?.profile_image
      ? getImageUrl(item.owner.profile_image)
      : null,
    uploaderId: item.owner?.id ?? item.owner?.user_id ?? null,
  };
};

// ─── HeroSection ─────────────────────────────────────────────────────────────
const HeroSection = ({ onSearch, onFilterChickenType, onSortChange }) => (
  <section className="flex flex-col items-center justify-center pt-4 pb-24 px-4 bg-gradient-to-b from-sky-100 to-white">
    <div className="w-full flex justify-end mb-4">
      <SearchBar
        variant="home"
        onSearch={onSearch}
        onFilterChickenType={onFilterChickenType}
        onSortChange={onSortChange}
      />
    </div>

    {/* Logo */}
    <div className="mb-5 mt-8">
      <img
        src={logo}
        alt="CBC Medical Logo"
        className="w-28 h-28 object-contain"
      />
    </div>

    {/* Hero Text */}
    <h1 className="text-xl font-bold text-gray-800 mb-3 text-center">
      We bring intelligence to poultry diagnostics.
    </h1>
    <p className="text-sm text-gray-500 text-center max-w-lg leading-relaxed">
      Detect abnormalities in seconds and enhance flock health with advanced
      deep-learning analysis of chicken blood cells.
    </p>
  </section>
);

// ─── CardGrid ────────────────────────────────────────────────────────────────
const CardGrid = ({ cards, loading, error, onCardClick }) => {
  if (loading) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-sm">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-red-400">
        <p className="text-sm">เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-sm">No records found</p>
      </div>
    );
  }

  return (
    //  Responsive grid: 1 col on mobile, 2 on tablet, 4 on desktop
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <BloodCellCard
          key={card.id}
          images={card.images}
          title={card.title}
          status={card.status}
          issueId={card.smearId}
          chickenType={card.chickenType}
          province={card.province}
          age={card.age}
          stainType={card.stainType}
          uploaderName={card.uploaderName}
          uploaderDate={
            card.predictedAt
              ? new Date(card.predictedAt).toLocaleDateString("th-TH")
              : ""
          }
          avatarUrl={card.uploaderAvatar}
          onClick={(idx) => onCardClick?.(card, idx)}
        />
      ))}
    </div>
  );
};

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.total_pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(meta.current_page - 1)}
        disabled={meta.current_page <= 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
      >
        ก่อนหน้า
      </button>
      <span className="text-sm text-gray-600">
        หน้า {meta.current_page} / {meta.total_pages}
      </span>
      <button
        onClick={() => onPageChange(meta.current_page + 1)}
        disabled={meta.current_page >= meta.total_pages}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
      >
        ถัดไป
      </button>
    </div>
  );
};

// ─── HomePage ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);

  const [cards, setCards] = useState([]);
  const [meta, setMeta] = useState({
    total_items: 0,
    current_page: 1,
    per_page: 20,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    province: null,
    chickenType: "All types",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20,
  });
  const debounceRef = useRef(null);

  const fetchCards = useCallback(async (f) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: f.page, limit: f.limit };
      if (f.search) params.search = f.search;
      if (f.province) params.province = f.province;
      if (f.chickenType && f.chickenType !== "All types") {
        params.chicken_type = f.chickenType;
      }
      if (f.startDate) params.startDate = f.startDate;
      if (f.endDate) params.endDate = f.endDate;

      const res = await uploadClient.get("/home/cards", { params });
      const json = res.data;
      const mapped = (json.data ?? []).map(mapCardFromApi);

      setCards(mapped);
      setMeta(
        json.meta ?? {
          total_items: mapped.length,
          current_page: f.page,
          per_page: f.limit,
          total_pages: 1,
        },
      );
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "ไม่สามารถดึงข้อมูลได้",
      );
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCards(filters);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchCards]);

  const handleSearch = ({ query, province, chickenType }) => {
    setFilters((prev) => ({
      ...prev,
      search: query,
      province: province ?? null,
      chickenType: chickenType ?? prev.chickenType,
      page: 1,
    }));
  };

  const handleFilterChickenType = (type) => {
    setFilters((prev) => ({ ...prev, chickenType: type, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (sort) => {
    setCards((prev) => {
      const sorted = [...prev];
      if (sort === "Sort by Status") {
        const order = ["pending", "completed"];
        sorted.sort(
          (a, b) => order.indexOf(a.status) - order.indexOf(b.status),
        );
      } else if (sort === "Sort by Province") {
        sorted.sort((a, b) => a.province.localeCompare(b.province));
      }
      return sorted;
    });
  };

  const handleCardClick = (card, idx = 0) => {
    setSelectedCard(card);
    setSelectedThumbIndex(idx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar activePage="Home" />

      <main className="flex-1">
        <HeroSection
          onSearch={handleSearch}
          onFilterChickenType={handleFilterChickenType}
          onSortChange={handleSortChange}
        />
        {/* ความกว้างสูงสุด 1400px, centered, padding รอบ */}
        <section className="w-full px-4 pb-16 max-w-[1400px] mx-auto">
          <CardGrid
            cards={cards}
            loading={loading}
            error={error}
            onCardClick={handleCardClick}
          />
          <Pagination meta={meta} onPageChange={handlePageChange} />
        </section>
      </main>

      <Footer />

      {selectedCard && (
        <BloodCellDetailModal
          data={selectedCard}
          initialThumbIndex={selectedThumbIndex}
          onClose={() => setSelectedCard(null)}
          onProfileClick={(doctorId) => navigate(`/profile/${doctorId}`)}
        />
      )}
    </div>
  );
};

export default HomePage;
