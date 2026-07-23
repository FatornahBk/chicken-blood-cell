import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ImageOff,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDatasetById } from "../../services/admin/DataManagement";
import { formatAdminDate } from "../../utils/adminDate";

const API_ORIGIN = "http://localhost";

const firstValue = (object, keys, fallback = "-") => {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null && object[key] !== "") {
      return object[key];
    }
  }
  return fallback;
};

const toImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
};

const normalizeImages = (dataset) => {
  const candidates = [
    dataset?.images,
    dataset?.image_data,
    dataset?.files,
    dataset?.batch_images,
    dataset?.data?.images,
  ];
  const images = candidates.find(Array.isArray) ?? [];

  return images.map((image, index) => {
    if (typeof image === "string") {
      return { id: index, name: `Image ${index + 1}`, originalUrl: toImageUrl(image), boxes: [] };
    }

    const predictions =
      image.predictions ?? image.detections ?? image.bounding_boxes ?? image.boxes ?? [];

    return {
      ...image,
      id: image.image_id ?? image.id ?? index,
      name: firstValue(image, ["file_name", "filename", "name", "image_name"], `Image ${index + 1}`),
      originalUrl: toImageUrl(firstValue(image, ["image_url", "original_url", "url", "path"], "")),
      predictedUrl: toImageUrl(firstValue(image, ["predicted_image_url", "result_image_url", "annotated_url", "prediction_url"], "")),
      boxes: Array.isArray(predictions) ? predictions : [],
    };
  });
};

function PredictionBox({ box }) {
  const x = Number(firstValue(box, ["x", "left", "x_min", "xmin"], 0));
  const y = Number(firstValue(box, ["y", "top", "y_min", "ymin"], 0));
  const width = Number(firstValue(box, ["width", "w"], 0)) ||
    Number(firstValue(box, ["x_max", "xmax"], x)) - x;
  const height = Number(firstValue(box, ["height", "h"], 0)) ||
    Number(firstValue(box, ["y_max", "ymax"], y)) - y;
  const imageWidth = Number(firstValue(box, ["image_width", "source_width"], 0));
  const imageHeight = Number(firstValue(box, ["image_height", "source_height"], 0));
  const isRatio = [x, y, width, height].every((value) => value >= 0 && value <= 1);

  if ((!imageWidth || !imageHeight) && !isRatio) return null;

  const style = {
    left: `${(isRatio ? x : x / imageWidth) * 100}%`,
    top: `${(isRatio ? y : y / imageHeight) * 100}%`,
    width: `${(isRatio ? width : width / imageWidth) * 100}%`,
    height: `${(isRatio ? height : height / imageHeight) * 100}%`,
  };
  const label = firstValue(box, ["class_name", "label", "class", "cell_type"], "");
  const confidence = Number(firstValue(box, ["confidence", "score", "probability"], NaN));

  return (
    <span className="absolute border-2 border-rose-500" style={style}>
      {(label || Number.isFinite(confidence)) && (
        <span className="absolute -top-6 left-[-2px] whitespace-nowrap bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {label}{Number.isFinite(confidence) ? ` ${(confidence * (confidence <= 1 ? 100 : 1)).toFixed(0)}%` : ""}
        </span>
      )}
    </span>
  );
}

function AdminDataManagementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDetail = async () => {
    setLoading(true);
    setError("");
    try {
      setResponse(await getDatasetById(id));
    } catch (err) {
      setError(err.response?.data?.message ?? "ไม่สามารถดึงรายละเอียดชุดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    // id is the only value that should trigger a new request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const dataset = useMemo(
    () => response?.batch ?? response?.dataset ?? response?.data ?? response ?? {},
    [response],
  );
  const images = useMemo(() => normalizeImages(dataset), [dataset]);
  const title = firstValue(dataset, ["batch_name", "dataset_name", "title", "name"], `Dataset #${id}`);
  const status = String(firstValue(dataset, ["status", "prediction_status", "predict_status"], "pending"));
  const isPredicted = ["complete", "completed", "predicted", "success"].includes(status.toLowerCase());

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <LoaderCircle className="mr-2 h-6 w-6 animate-spin text-blue-600" />
        Loading dataset...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/admin/data-management")}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Data Management
      </button>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p>{error}</p>
          <button type="button" onClick={loadDetail} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      ) : (
        <>
          <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Dataset detail</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-950">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">
                  {firstValue(dataset, ["email", "user_email", "uploader_email"])}
                </p>
              </div>
              <span className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${isPredicted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {status}
              </span>
            </div>
            <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ["Batch ID", firstValue(dataset, ["batch_id", "dataset_id", "id"], id)],
                ["Stain", firstValue(dataset, ["stain_type", "stainType", "stain"])],
                ["Chicken type", firstValue(dataset, ["chicken_type", "chickenType"])],
                ["Province", firstValue(dataset, ["province"])],
                ["Created at", formatAdminDate(firstValue(dataset, ["created_at", "createdAt", "uploaded_at"], null))],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase text-slate-400">{label}</dt>
                  <dd className="mt-1 capitalize text-sm font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950">Images</h2>
              <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
                {images.length} Images
              </span>
            </div>

            {images.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400">
                <ImageOff className="mb-3 h-10 w-10" />
                ไม่พบรูปภาพในชุดข้อมูลนี้
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {images.map((image) => {
                  const displayUrl = isPredicted && image.predictedUrl ? image.predictedUrl : image.originalUrl;
                  return (
                    <article key={image.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="relative aspect-square overflow-hidden bg-slate-100">
                        {displayUrl ? (
                          <>
                            <img src={displayUrl} alt={image.name} className="h-full w-full object-contain" />
                            {isPredicted && !image.predictedUrl && image.boxes.map((box, index) => (
                              <PredictionBox key={box.id ?? index} box={box} />
                            ))}
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400"><ImageOff className="h-9 w-9" /></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-slate-800">{image.name}</p>
                        {isPredicted && (
                          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            Predicted
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default AdminDataManagementDetail;
