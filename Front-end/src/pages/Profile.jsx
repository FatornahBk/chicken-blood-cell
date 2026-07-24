import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadClient, getImageUrl } from "../services/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import SearchBar from "../components/SearchBar";
import BloodCellCard from "../components/BloodCellCard";
import BloodCellDetailModal from "../components/BloodCellDetailModal";

// ─── Skeleton Components (สำหรับโหลดรอข้อมูลแบบสมูทๆ) ───────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm animate-pulse flex flex-col gap-3">
      {/* ส่วนจำลองรูปภาพ (อัตราส่วน 1:1) */}
      <div className="w-full aspect-square bg-gray-200 rounded-xl" />
      {/* ส่วนจำลองข้อความหัวข้อ */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="h-3.5 bg-gray-200 rounded-md w-3/4" />
        <div className="h-3 bg-gray-100 rounded-md w-1/2" />
      </div>
      {/* ส่วนจำลองข้อมูลคนอัปโหลดด้านล่าง */}
      <div className="flex items-center gap-2 mt-1 px-1 pt-2 border-t border-gray-50">
        <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-2.5 bg-gray-200 rounded w-20" />
          <div className="h-2 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPredicted = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2d6a9f"
    strokeWidth="2"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconUnpredicted = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2d6a9f"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Profile Banner (แสดงผล + แก้ไข ในตัวเดียว) ────────────────────────────────
function ProfileBanner({ user, onSave, saving }) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const maxLen = 50;

  // sync ค่าทุกครั้งที่ user data เปลี่ยน (เช่น fetch เสร็จทีหลัง)
  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAvatarPreview(user.avatarUrl || null);
  }, [user.firstName, user.lastName, user.avatarUrl]);

  const startEdit = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAvatarPreview(user.avatarUrl || null);
    setAvatarFile(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAvatarPreview(user.avatarUrl || null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) return;
    await onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      avatarFile,
    });
    setIsEditing(false);
  };

  return (
    <div
      className="relative rounded-xl mb-6"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.10)" }}
    >
      {/* ส่วนบน: ฟ้า */}
      <div
        className="rounded-t-xl flex items-end justify-between px-6 py-4"
        style={{
          background:
            "linear-gradient(to right, #deeaf5 0%, #b8d4ec 40%, #5a8fbf 75%, #3a7aad 100%)",
          paddingLeft: "116px",
          paddingBottom: "2px",
          minHeight: "92px",
        }}
      >
        {isEditing ? (
          <div className="flex-1 max-w-md flex gap-2">
            <div className="flex-1">
              <label
                className="text-[13px] font-semibold tracking-wide"
                style={{ color: "#1a2f45" }}
              >
                First name
              </label>
              <input
                type="text"
                value={firstName}
                maxLength={maxLen}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-sm font-medium rounded-md px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First name"
                style={{ color: "#1a2f45" }}
              />
            </div>
            <div className="flex-1">
              <label
                className="text-[13px] font-semibold tracking-wide"
                style={{ color: "#1a2f45" }}
              >
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                maxLength={maxLen}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-sm font-medium rounded-md px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last name"
                style={{ color: "#1a2f45" }}
              />
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-semibold" style={{ color: "#1a2f45" }}>
            {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.email}
          </h2>
        )}
      </div>

      {/* ส่วนล่าง: ขาว */}
      <div
        className="rounded-b-xl bg-white py-3 px-6"
        style={{ paddingLeft: "116px", minHeight: "72px" }}
      >
        {!isEditing && (
          <p className="text-sm mb-2 -mt-2" style={{ color: "#6b8ca8" }}>
            {user.email}
          </p>
        )}
        <div
          className={`flex gap-2 items-center ${isEditing ? "" : "justify-between"}`}
          style={{ minHeight: isEditing ? "72px" : "auto" }}
        >
          {isEditing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !firstName.trim()}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white disabled:opacity-50"
                style={{ background: "#1a2f45" }}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-2 items-center">
                {user.role === "admin" && (
                  <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-400 text-gray-700">
                    Admin
                  </button>
                )}
                <button
                  onClick={startEdit}
                  className="px-4 py-1.5 rounded-full text-xs font-medium text-white"
                  style={{ background: "#1a2f45" }}
                >
                  Edit Profile
                </button>
              </div>

              <div className="flex gap-6 text-center">
                <div>
                  <div
                    className="text-xl font-semibold leading-tight"
                    style={{ color: "#e8a020" }}
                  >
                    {user.totalCompletedBatches}
                  </div>
                  <div
                    className="text-sm font-medium mt-0.5"
                    style={{ color: "#6b8ca8" }}
                  >
                    Completed
                  </div>
                </div>
                <div>
                  <div
                    className="text-xl font-semibold leading-tight"
                    style={{ color: "#6b8ca8" }}
                  >
                    {user.totalPendingBatches}
                  </div>
                  <div
                    className="text-sm font-medium mt-0.5"
                    style={{ color: "#6b8ca8" }}
                  >
                    Pending
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Avatar + วงกลมขาว คาบรอยต่อ */}
      <div
        className="absolute rounded-full bg-white flex items-center justify-center"
        style={{
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "80px",
          height: "80px",
          zIndex: 10,
        }}
      >
        {isEditing ? (
          <label className="relative w-[66px] h-[66px] rounded-full cursor-pointer group">
            <div
              className="w-[66px] h-[66px] rounded-full overflow-hidden flex items-center justify-center"
              style={{ border: "2px solid #3b9ee5" }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-lg font-semibold"
                  style={{ background: "#b8d4e8", color: "#1a3a5c" }}
                >
                  {(firstName[0] || "") + (lastName[0] || "")}
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition">
              <span
                className="opacity-0 group-hover:opacity-100 transition text-white"
                style={{ fontSize: "9px" }}
              >
                Edit
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        ) : user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
            className="rounded-full object-cover"
            style={{ width: "66px", height: "66px" }}
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center text-xl font-semibold"
            style={{
              width: "66px",
              height: "66px",
              background: "#b8d4e8",
              color: "#1a3a5c",
            }}
          >
            {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
      {icon}
      {title}
    </div>
  );
}

const CELL_LABELS = [
  "Heterophil",
  "Eosinophil",
  "Basophil",
  "Lymphocyte",
  "Monocyte",
  "Thrombocyte",
];

const transformPrediction = (prediction) => {
  if (!prediction) return null;
  const cell_counts = {
    Heterophil: prediction.numOfHeterophils ?? 0,
    Eosinophil: prediction.numOfEosinophils ?? 0,
    Basophil: prediction.numOfBasophils ?? 0,
    Lymphocyte: prediction.numOfLymphocytes ?? 0,
    Monocyte: prediction.numOfMonocytes ?? 0,
    Thrombocyte: prediction.numOfThrombocytes ?? 0,
  };
  const total = Object.values(cell_counts).reduce((sum, c) => sum + c, 0);
  const cell_percentages = {};
  CELL_LABELS.forEach((label) => {
    cell_percentages[label] =
      total > 0 ? (cell_counts[label] / total) * 100 : 0;
  });
  const detections = (prediction.detections ?? []).map((d) => ({
    bbox: {
      x1: d.x1,
      y1: d.y1,
      x2: d.x2,
      y2: d.y2,
      width: d.width,
      height: d.height,
    },
    class_name: d.class_name,
    confidence: d.confidence,
  }));
  return { cell_counts, cell_percentages, detections };
};

const mapBatchToCard = (batch) => {
  const images = batch.images ?? [];
  return {
    id: batch.batch_id,
    smearId: batch.smear_id,
    images: images.map((img) => getImageUrl(img.image_path)),
    imageDetails: images.map((img) => ({
      url: getImageUrl(img.image_path),
      prediction: transformPrediction(img.prediction),
    })),
    description: batch.description ?? "",
    status: batch.status ?? "",
    chickenType: batch.chicken_type ?? "",
    province: batch.province ?? "",
    age: batch.age ?? "",
    stainType: batch.stain_type ?? "",
    predictedAt: batch.predicted_at ?? "",
    uploaderName: batch.owner
      ? `${batch.owner.first_name ?? ""} ${batch.owner.last_name ?? ""}`.trim()
      : "",
    avatarUrl: batch.owner?.profile_image
      ? getImageUrl(batch.owner.profile_image)
      : null,
  };
};

// ─── Profile Page ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (!stored) return {};
      return {
        firstName: stored.first_name || stored.name?.split(" ")[0] || "",
        lastName: stored.last_name || stored.name?.split(" ")[1] || "",
        email: stored.email || "",
        role: stored.role || "",
        totalCompletedBatches: "-", // ใส่ขีดรอตัวเลขจริงจาก API
        totalPendingBatches: "-",
        avatarUrl:
          stored.profileImage || stored.profile_image
            ? getImageUrl(stored.profileImage || stored.profile_image)
            : null,
      };
    } catch (e) {
      return {};
    }
  });
  const [predicted, setPredicted] = useState([]);
  const [unpredicted, setUnpredicted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);

  const handleCardClick = (batch, idx = 0) => {
    setSelectedCard(mapBatchToCard(batch));
    setSelectedThumbIndex(idx);
  };

  const [query, setQuery] = useState("");
  const [chickenType, setChickenType] = useState(null);
  const [stainType, setStainType] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const STAIN_TYPE_MAP = { "wright stain": "wright", "giemsa stain": "giemsa" };
  const normalizeStainType = (val) => {
    if (!val || val === "Stain Type") return null;
    return STAIN_TYPE_MAP[val.trim().toLowerCase()] ?? null;
  };

  const buildParams = useCallback(() => {
    const params = { page: 1, limit: 10 };
    if (query) params.smear_id = query;
    if (chickenType) params.chicken_type = chickenType;
    const stain = normalizeStainType(stainType);
    if (stain) params.stain_type = stain;
    if (dateRange?.start) {
      const start = new Date(dateRange.start);
      const end = dateRange.end ? new Date(dateRange.end) : start;
      params.startDate = start.toISOString().slice(0, 10);
      params.endDate = end.toISOString().slice(0, 10);
    }
    return params;
  }, [query, chickenType, stainType, dateRange]);

  const fetchProfileAndBatches = useCallback(async () => {
    setLoading(true);
    try {
      const [apiResponse] = await Promise.all([
        uploadClient.get("/profile/me", { params: buildParams() }),
        new Promise((resolve) => setTimeout(resolve, 300)),
      ]);

      const { data: res } = apiResponse;

      const { profile, data } = res;

      setUser({
        firstName: profile?.first_name ?? "",
        lastName: profile?.last_name ?? "",
        email: profile?.email ?? "",
        role: profile?.role ?? "",
        totalCompletedBatches: profile?.total_completed_batches ?? 0,
        totalPendingBatches: profile?.total_pending_batches ?? 0,
        avatarUrl: profile?.profile_image
          ? getImageUrl(profile.profile_image)
          : null,
      });

      setPredicted(data?.completed_batches?.items ?? []);
      setUnpredicted(data?.pending_batches?.items ?? []);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchProfileAndBatches();
  }, [fetchProfileAndBatches]);

  const handleSaveProfile = async ({ firstName, lastName, avatarFile }) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      if (avatarFile) formData.append("profile_image", avatarFile);

      const { data: result } = await uploadClient.patch(
        "/profile/me",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const newFirstName = result.profile?.first_name ?? firstName;
      const newLastName = result.profile?.last_name ?? lastName;
      const newAvatarPath = result.profile?.profile_image ?? null;
      const newAvatarUrl = newAvatarPath ? getImageUrl(newAvatarPath) : null;

      // อัปเดตแบนเนอร์ด้านบน
      setUser((prev) => ({
        ...prev,
        firstName: newFirstName,
        lastName: newLastName,
        avatarUrl: newAvatarUrl ?? prev.avatarUrl,
      }));

      // ── อัปเดตเฉพาะ owner.* ของแต่ละ batch ในเครื่อง ไม่ refetch ทั้งลิสต์ ──
      const patchOwner = (batch) =>
        batch.owner
          ? {
              ...batch,
              owner: {
                ...batch.owner,
                first_name: newFirstName,
                last_name: newLastName,
                profile_image: newAvatarPath ?? batch.owner.profile_image,
              },
            }
          : batch;

      setPredicted((prev) => prev.map(patchOwner));
      setUnpredicted((prev) => prev.map(patchOwner));

      // sync localStorage เหมือนเดิม
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          name: `${newFirstName} ${newLastName}`.trim(),
          profileImage: newAvatarPath ?? storedUser.profileImage,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("user-updated"));
      }

      // ❌ ลบบรรทัดนี้ทิ้ง — ตัวการที่ทำให้ทั้ง section กระพริบ
      // await fetchProfileAndBatches();
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      await uploadClient.delete(`/profile/batches/${batchId}`);

      const wasInPredicted = predicted.some((b) => b.batch_id === batchId);
      const wasInUnpredicted = unpredicted.some((b) => b.batch_id === batchId);

      setPredicted((prev) => prev.filter((b) => b.batch_id !== batchId));
      setUnpredicted((prev) => prev.filter((b) => b.batch_id !== batchId));

      setUser((prev) => ({
        ...prev,
        totalCompletedBatches: wasInPredicted
          ? Math.max(0, (prev.totalCompletedBatches || 0) - 1)
          : prev.totalCompletedBatches,
        totalPendingBatches: wasInUnpredicted
          ? Math.max(0, (prev.totalPendingBatches || 0) - 1)
          : prev.totalPendingBatches,
      }));
    } catch (err) {
      console.error("Failed to delete batch:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <ProfileBanner user={user} saving={saving} onSave={handleSaveProfile} />

        <SearchBar
          variant="profile"
          onSearch={({ query, chickenType, stainType, dateRange }) => {
            setQuery(query);
            setChickenType(chickenType);
            setStainType(stainType);
            setDateRange(dateRange?.start ? dateRange : null);
          }}
          onFilterChickenType={(val) =>
            setChickenType(
              val === "Chicken type" || val === "All types" ? null : val,
            )
          }
          onSortChange={(range) => setDateRange(range)}
        />

        {/* Predicted Items */}
        <section className="mb-8 mt-6">
          <SectionHeader icon={IconPredicted} title="Predicted Items" />
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : predicted.length === 0 ? (
            <p className="text-sm text-gray-400">No predicted items found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {predicted.map((batch) => (
                <BloodCellCard
                  key={batch.batch_id}
                  images={(batch.images ?? []).map((img) =>
                    getImageUrl(img.image_path),
                  )}
                  title={batch.description}
                  status={batch.status}
                  issueId={batch.smear_id}
                  chickenType={batch.chicken_type}
                  province={batch.province}
                  age={batch.age}
                  stainType={batch.stain_type}
                  uploaderName={`${batch.owner?.first_name ?? ""} ${batch.owner?.last_name ?? ""}`.trim()}
                  uploaderDate={new Date(batch.created_at).toLocaleDateString(
                    "th-TH",
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                  avatarUrl={
                    batch.owner?.profile_image
                      ? getImageUrl(batch.owner.profile_image)
                      : null
                  }
                  onClick={(idx) => handleCardClick(batch, idx)}
                  onDelete={() => handleDeleteBatch(batch.batch_id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Unpredicted Items */}
        <section>
          <SectionHeader icon={IconUnpredicted} title="Unpredicted Items" />
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : unpredicted.length === 0 ? (
            <p className="text-sm text-gray-400">No unpredicted items found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {unpredicted.map((batch) => (
                <BloodCellCard
                  key={batch.batch_id}
                  images={(batch.images ?? []).map((img) =>
                    getImageUrl(img.image_path),
                  )}
                  title={batch.description}
                  status={batch.status}
                  issueId={batch.smear_id}
                  chickenType={batch.chicken_type}
                  province={batch.province}
                  age={batch.age}
                  stainType={batch.stain_type}
                  uploaderName={`${batch.owner?.first_name ?? ""} ${batch.owner?.last_name ?? ""}`.trim()}
                  uploaderDate={new Date(batch.created_at).toLocaleDateString(
                    "th-TH",
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                  avatarUrl={
                    batch.owner?.profile_image
                      ? getImageUrl(batch.owner.profile_image)
                      : null
                  }
                  onClick={(idx) => handleCardClick(batch, idx)}
                  onDelete={() => handleDeleteBatch(batch.batch_id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      {selectedCard && (
        <BloodCellDetailModal
          data={selectedCard}
          initialThumbIndex={selectedThumbIndex}
          onClose={() => setSelectedCard(null)}
          onProfileClick={() => {}}
        />
      )}

      <Footer />
    </div>
  );
}
