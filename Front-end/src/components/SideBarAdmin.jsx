import { NavLink } from "react-router-dom";
import { Database, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
const ADMIN_SIDEBAR_OPTIONS = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Verify User",
    path: "/admin/verify-users",
    icon: ShieldCheck,
  },
  {
    label: "User Management",
    path: "/admin/users-management",
    icon: Users,
  },
  {
    label: "Data Management",
    path: "/admin/data-management",
    icon: Database,
  },
];

const SideBarAdmin = ({ options = ADMIN_SIDEBAR_OPTIONS }) => {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">
            Admin Panel
          </p>
          <p className="truncate text-xs text-slate-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {options.map(({ label, path, icon }) => {
          const SidebarIcon = icon;

          return (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                ].join(" ")
              }
            >
              <SidebarIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-6 py-4">
        <p className="text-xs font-medium text-slate-500">Administrator</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          Chicken Blood Cell
        </p>
      </div>
    </aside>
  );
};

export default SideBarAdmin;
