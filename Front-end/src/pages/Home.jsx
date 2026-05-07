// HomePage.jsx
// Main home page for CBC - Medical: Chicken Blood Cell Classification
// Composed from reusable components: SearchBar, BloodCellCard
// Navbar and Footer are assumed to already exist and wrap this component

import React, { useState } from "react";
import SearchBar from "../components/SearchBar_home";
import BloodCellCard from "../components/BloodCellCard";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import logo from "../assets/Chicken-CBC.png";

// ─── Mock Data ──────────────────────────────────────────────────────────────
// Replace with real API calls (e.g. useEffect + fetch / React Query)

const MOCK_CARDS = [
  {
    id: 1,
    images: [
      "https://placehold.co/300x300/f8d7e3/c0527a?text=CBC",
      "https://placehold.co/300x300/f3c4d3/b04470?text=CBC",
      "https://placehold.co/300x300/f0b8cb/a03d67?text=CBC",
      "https://placehold.co/300x300/eaaec2/903560?text=CBC",
    ],
    extraImages: 1,
    title: "ตรวจคณิตเลือดของลูกเจ้กที่เริ่มเลี้ยงคืนมือ",
    status: "Predicted",
    issueId: "AV-9025",
    chickenType: "Laying hen",
    province: "Nakhon Si Thammarat",
    age: "30 week",
    stainType: "Wright stain",
    uploaderName: "Dr.Strange",
    uploaderRole: "veterinary",
  },
  {
    id: 2,
    images: [
      "https://placehold.co/300x300/f8d7e3/c0527a?text=CBC",
      "https://placehold.co/300x300/f3c4d3/b04470?text=CBC",
      "https://placehold.co/300x300/f0b8cb/a03d67?text=CBC",
      "https://placehold.co/300x300/eaaec2/903560?text=CBC",
    ],
    extraImages: 6,
    title: "ตรวจคณิตเลือดของลูกเจ้กที่เริ่มเลี้ยงคืนมือ",
    status: "Predicted",
    issueId: "MK-0675",
    chickenType: "Laying hen",
    province: "Nakhon Si Thammarat",
    age: "26 week",
    stainType: "Wright stain",
    uploaderName: "Dr.Strange",
    uploaderRole: "veterinary",
  },
  {
    id: 3,
    images: [
      "https://placehold.co/300x300/f8d7e3/c0527a?text=CBC",
      "https://placehold.co/300x300/f3c4d3/b04470?text=CBC",
      "https://placehold.co/300x300/f0b8cb/a03d67?text=CBC",
      "https://placehold.co/300x300/eaaec2/903560?text=CBC",
    ],
    extraImages: 4,
    title: "ตรวจคณิตเลือดของลูกเจ้กที่เริ่มเลี้ยงคืนมือ",
    status: "Predicted",
    issueId: "AV-8301",
    chickenType: "Laying hen",
    province: "Nakhon Si Thammarat",
    age: "20 week",
    stainType: "Wright stain",
    uploaderName: "Dr.Strange",
    uploaderRole: "veterinary",
  },
  {
    id: 4,
    images: [
      "https://placehold.co/300x300/f8d7e3/c0527a?text=CBC",
      "https://placehold.co/300x300/f3c4d3/b04470?text=CBC",
      "https://placehold.co/300x300/f0b8cb/a03d67?text=CBC",
      "https://placehold.co/300x300/eaaec2/903560?text=CBC",
    ],
    extraImages: 0,
    title: "ตรวจคณิตเลือดของลูกเจ้กที่เริ่มเลี้ยงคืนมือ",
    status: "Predicted",
    issueId: "PT-1140",
    chickenType: "Broiler",
    province: "Surat Thani",
    age: "6 week",
    stainType: "Giemsa stain",
    uploaderName: "Dr.Strange",
    uploaderRole: "veterinary",
  },
  {
    id: 5,
    images: [
      "https://placehold.co/300x300/f8d7e3/c0527a?text=CBC",
      "https://placehold.co/300x300/f3c4d3/b04470?text=CBC",
      "https://placehold.co/300x300/f0b8cb/a03d67?text=CBC",
      "https://placehold.co/300x300/eaaec2/903560?text=CBC",
    ],
    extraImages: 2,
    title: "ตรวจคณิตเลือดของลูกเจ้กที่เริ่มเลี้ยงคืนมือ",
    status: "Predicted",
    issueId: "CH-0022",
    chickenType: "Native chicken",
    province: "Chiang Mai",
    age: "52 week",
    stainType: "Wright stain",
    uploaderName: "Dr.Strange",
    uploaderRole: "veterinary",
  },
  {
    id: 6,
    images: [
      "https://placehold.co/300x300/f8d7e3/c0527a?text=CBC",
      "https://placehold.co/300x300/f3c4d3/b04470?text=CBC",
      "https://placehold.co/300x300/f0b8cb/a03d67?text=CBC",
      "https://placehold.co/300x300/eaaec2/903560?text=CBC",
    ],
    extraImages: 3,
    title: "ตรวจคณิตเลือดของลูกเจ้กที่เริ่มเลี้ยงคืนมือ",
    status: "Predicted",
    issueId: "BK-5501",
    chickenType: "Breeder",
    province: "Bangkok",
    age: "40 week",
    stainType: "Wright stain",
    uploaderName: "Dr.Strange",
    uploaderRole: "veterinary",
  },
];

// ─── HeroSection ─────────────────────────────────────────────────────────────
const HeroSection = ({ onSearch, onFilterChickenType, onSortChange }) => (
  <section className="flex flex-col items-center justify-center pt-4 pb-24 px-4 bg-gradient-to-b from-sky-100 to-white">
  <div className="w-full flex justify-end mb-4">
      <SearchBar
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
const CardGrid = ({ cards, onCardClick }) => {
  if (cards.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-3 opacity-30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm">No records found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card) => (
        <BloodCellCard
          key={card.id}
          images={card.images}
          title={card.title}
          status={card.status}
          issueId={card.issueId}
          chickenType={card.chickenType}
          province={card.province}
          age={card.age}
          stainType={card.stainType}
          uploaderName={card.uploaderName}
          uploaderRole={card.uploaderRole}
          onClick={() => onCardClick?.(card)}
        />
      ))}
    </div>
  );
};

// ─── HomePage ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [filteredCards, setFilteredCards] = useState(MOCK_CARDS);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredCards(MOCK_CARDS);
      return;
    }
    const q = query.toLowerCase();
    setFilteredCards(
      MOCK_CARDS.filter(
        (c) =>
          c.province.toLowerCase().includes(q) ||
          c.uploaderName.toLowerCase().includes(q),
      ),
    );
  };

  const handleFilterChickenType = (type) => {
    if (type === "All types") {
      setFilteredCards(MOCK_CARDS);
    } else {
      setFilteredCards(MOCK_CARDS.filter((c) => c.chickenType === type));
    }
  };

  const handleSortChange = (sort) => {
    const sorted = [...filteredCards];
    if (sort === "Sort by Status") {
      const order = ["Severe", "Moderate", "Mild", "Normal", "Preview"];
      sorted.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    } else if (sort === "Sort by Province") {
      sorted.sort((a, b) => a.province.localeCompare(b.province));
    }
    // "Sort by Date" would sort by date field (add `createdAt` to mock data)
    setFilteredCards(sorted);
  };

  const handleCardClick = (card) => {
    console.log("Navigate to card detail:", card.id);
    // e.g. navigate(`/prediction/${card.id}`)
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

        <section className="px-4 pb-16 max-w-5xl mx-auto">
          <CardGrid cards={filteredCards} onCardClick={handleCardClick} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
