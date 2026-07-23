import { useCallback, useEffect, useState } from "react";
import {
  Database,
  Eye,
  LoaderCircle,
  Search,
  Trash2,
} from "lucide-react";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import {
  deleteDatasetById,
  getAllDatasets,
} from "../../services/admin/DataManagement";
import { formatAdminDate } from "../../utils/adminDate";

const emptyStatistics = {
  total_images: 0,
  total_batches: 0,
  total_wright: 0,
  total_giemsa: 0,
};

const getId = (item) =>
  item.batch_id ?? item.dataset_id ?? item.id ?? item.data_id;

const getName = (item) =>
  item.batch_name ??
  item.dataset_name ??
  item.title ??
  item.name ??
  `Dataset #${getId(item) ?? "-"}`;

const getEmail = (item) =>
  item.email ?? item.user_email ?? item.uploader_email ?? "-";

const getStain = (item) =>
  item.stain_type ?? item.stainType ?? item.stain ?? "-";

const getImageCount = (item) =>
  item.total_images ??
  item.image_count ??
  item.images_count ??
  item.number_of_images ??
  (Array.isArray(item.images) ? item.images.length : 0);

const getStatus = (item) =>
  item.status ?? item.prediction_status ?? item.predict_status ?? "pending";

const getCreatedAt = (item) =>
  item.created_at ?? item.createdAt ?? item.uploaded_at ?? item.date;

const statusStyle = (status) => {
  const normalized = String(status).toLowerCase();
  return ["complete", "completed", "predicted", "success"].includes(normalized)
    ? "bg-emerald-50 text-emerald-700"
    : "bg-amber-50 text-amber-700";
};

function AdminDataManagement() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [statistics, setStatistics] = useState(emptyStatistics);
  const [meta, setMeta] = useState({
    total_items: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadDatasets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllDatasets({
        page,
        limit: 10,
        email: search,
      });
      setDatasets(Array.isArray(data?.table_data) ? data.table_data : []);
      setStatistics({ ...emptyStatistics, ...data?.statistics });
      setMeta((current) => ({ ...current, ...data?.meta }));
    } catch (err) {
      setError(err.response?.data?.message ?? "ไม่สามารถดึงข้อมูลชุดข้อมูลได้");
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadDatasets, 300);
    return () => window.clearTimeout(timeoutId);
  }, [loadDatasets]);

  const handleDelete = async (item) => {
    const id = getId(item);
    if (id === undefined || id === null) {
      setError("ไม่พบ ID ของชุดข้อมูล");
      return;
    }

    if (!window.confirm(`Delete "${getName(item)}"?`)) return;

    setDeletingId(id);
    setError("");
    try {
      await deleteDatasetById(id);
      if (datasets.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadDatasets();
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "ไม่สามารถลบชุดข้อมูลได้");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Number(meta.total_pages) || 0;
  const currentPage = Number(meta.current_page) || page;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">
          Data Management
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Organize uploaded datasets and inspect prediction results.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Images", statistics.total_images, "text-slate-950"],
          ["Datasets", statistics.total_batches, "text-blue-600"],
          ["Wright Stain", statistics.total_wright, "text-amber-600"],
          ["Giemsa Stain", statistics.total_giemsa, "text-violet-600"],
        ].map(([label, value, color]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-lg font-medium text-slate-500">{label}</p>
            <p className={`mt-3 text-3xl font-bold ${color}`}>
              {Number(value || 0).toLocaleString()}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-950">Datasets</h2>
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Dataset</th>
                <th className="px-6 py-3 font-semibold">Stain</th>
                <th className="px-6 py-3 font-semibold">Images</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Created at</th>
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <LoaderCircle className="mx-auto mb-2 h-6 w-6 animate-spin text-blue-600" />
                    Loading datasets...
                  </td>
                </tr>
              )}
              {!loading && datasets.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    ไม่พบข้อมูล dataset
                  </td>
                </tr>
              )}
              {!loading && datasets.map((item, index) => {
                const id = getId(item);
                const status = getStatus(item);
                return (
                  <tr key={id ?? `${getName(item)}-${index}`} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-950">{getName(item)}</p>
                      <p className="text-slate-500">{getEmail(item)}</p>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-700">{getStain(item)}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {Number(getImageCount(item) || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatAdminDate(getCreatedAt(item))}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/data-management/${id}`)}
                          disabled={id === undefined || id === null}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`View ${getName(item)}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === id}
                          className="rounded-lg border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-50"
                          aria-label={`Delete ${getName(item)}`}
                        >
                          {deletingId === id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && Number(meta.total_items) > 0 && (
          <div className="flex justify-center border-t border-slate-100 px-6 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(totalPages, 1)}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>
    </section>
  );
}

export default AdminDataManagement;
