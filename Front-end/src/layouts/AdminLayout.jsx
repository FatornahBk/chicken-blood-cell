import { Outlet } from "react-router-dom";
import SideBarAdmin from "../components/SideBarAdmin";
import Navbar from "../components/navbar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[url('/src/assets/Background.png')] bg-cover">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <SideBarAdmin />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
