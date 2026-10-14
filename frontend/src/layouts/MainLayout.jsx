
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MainLayout.css";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isAdminRoute) {
    return (
      <div className="dfm-admin-layout">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="dfm-layout-root">
      <Navbar />
      <main className="dfm-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
