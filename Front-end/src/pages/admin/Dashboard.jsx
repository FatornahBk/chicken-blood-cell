import { createElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Clock3,
  Database,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getDashboardUsers } from "../../services/admin/Dashboard";
import { formatAdminDate } from "../../utils/adminDate";

const submittedAt = (user) =>
  user.created_at ?? user.createdAt ?? user.submitted_at ?? user.submittedAt;

const nameOf = (user) =>
  `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
  user.name ||
  user.email ||
  "-";

const statCards = [
  ["Total Users", "totalUsers", Users, "text-blue-600", "bg-blue-50"],
  [
    "Pending Verification",
    "pendingVerification",
    ShieldCheck,
    "text-amber-600",
    "bg-amber-50",
  ],
  [
    "Prediction Jobs",
    "predictionJobs",
    Activity,
    "text-emerald-600",
    "bg-emerald-50",
  ],
  [
    "Dataset Images",
    "datasetImages",
    Database,
    "text-violet-600",
    "bg-violet-50",
  ],
];

function PredictionStatusChart({ completed, pending }) {
  const completedPercent = Math.min(Math.max(Number(completed) || 0, 0), 100);
  const pendingPercent = Math.min(
    Math.max(Number(pending) || 0, 0),
    100 - completedPercent,
  );
  const totalPercent = completedPercent + pendingPercent;
  const completedShare =
    totalPercent > 0 ? (completedPercent / totalPercent) * 100 : 0;
  const chartBackground =
    totalPercent > 0
      ? `conic-gradient(
          #4ade80 0% ${completedShare}%,
          #fb923c ${completedShare}% 100%
        )`
      : "#e2e8f0";

  return (
    <div
      className="mt-6 grid min-h-64 grid-cols-[minmax(4.75rem,0.7fr)_minmax(9rem,1.5fr)_minmax(4.75rem,0.7fr)] items-center gap-2 sm:gap-4"
      aria-label={`Prediction status: completed ${completedPercent} percent, pending ${pendingPercent} percent`}
    >
      <div className="text-center text-sm font-semibold text-slate-700">
        <p>Completed</p>
        <p>{completedPercent}%</p>
      </div>

      <div
        className="relative mx-auto aspect-square w-full max-w-64 rounded-full"
        style={{
          background: chartBackground,
        }}
        role="img"
      >
        <div className="absolute inset-[26%] rounded-full bg-white" />
      </div>

      <div className="self-start pt-10 text-center text-sm font-semibold text-slate-700 sm:pt-8">
        <p>Pending</p>
        <p>{pendingPercent}%</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerification: 0,
    predictionJobs: 0,
    datasetImages: 0,
  });
  const [predictionStatuses, setPredictionStatuses] = useState({
    completed: 0,
    pending: 0,
  });
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getDashboardUsers({ page: 1, limit: 3 });
        const pendingUsers = data.pending_users_table?.data ?? [];
        if (!mounted) return;
        setStats({
          totalUsers: Number(data.total_users ?? 0),
          pendingVerification: Number(data.pending_verification ?? 0),
          predictionJobs: Number(data.prediction_jobs ?? 0),
          datasetImages: Number(data.dataset_images ?? 0),
        });
        setPredictionStatuses({
          completed: Number(
            data.prediction_status?.completed_percentage ?? 0,
          ),
          pending: Number(data.prediction_status?.pending_percentage ?? 0),
        });
        setQueue(
          pendingUsers
            .filter((user) => Number(user.is_verified) === 0)
            .sort((a, b) => new Date(submittedAt(b)) - new Date(submittedAt(a)))
            .slice(0, 3),
        );
      } catch (err) {
        if (mounted)
          setError(
            err.response?.data?.message ?? "ไม่สามารถดึงข้อมูล Dashboard ได้",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[96rem] min-w-0 space-y-4 sm:space-y-6">
      <div>
        <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor users, verification requests, predictions, and dataset
          activity.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
        {statCards.map(([label, key, StatIcon, color, bg]) => (
          <article
            key={key}
            className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-medium text-slate-500">{label}</p>
                <p className={`mt-3 text-3xl font-bold ${color}`}>
                  {loading ? "..." : stats[key]}
                </p>
              </div>
              <span className={`rounded-lg p-2.5 ${bg} ${color}`}>
                {createElement(StatIcon, { className: "h-5 w-5" })}
              </span>
            </div>
          </article>
        ))}
      </div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Verification Queue
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                New accounts waiting for administrator approval.
              </p>
            </div>
            <Link
              to="/admin/verify-users"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-[42rem] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">License</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-10 text-center text-rose-500"
                    >
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && queue.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      ไม่มีผู้ใช้ที่รออนุมัติ
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  queue.map((user) => (
                    <tr
                      key={user.user_id ?? user.email}
                      className="text-slate-700"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-950">
                          {nameOf(user)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {user.veterinary_license ?? user.license ?? "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {formatAdminDate(submittedAt(user))}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                          <Clock3 className="h-3.5 w-3.5" />
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-950">
            Prediction Status
          </h2>
          <PredictionStatusChart
            completed={predictionStatuses.completed}
            pending={predictionStatuses.pending}
          />
        </section>
      </div>
    </section>
  );
}

export default AdminDashboard;
