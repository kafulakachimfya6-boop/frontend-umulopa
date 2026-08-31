import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import LoadingSkeleton from "./ui/LoadingSkeleton";

const ContentFallback = () => (
  <div className="space-y-4 p-2">
    <LoadingSkeleton lines={1} className="max-w-xs" />
    <LoadingSkeleton lines={3} />
    <LoadingSkeleton lines={3} />
  </div>
);

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell flex min-h-screen min-w-0 bg-[#F8F9FA] text-gray-900">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar onMobileMenuToggle={() => setMobileOpen((s) => !s)} />
        <main className="app-content min-w-0 flex-1 overflow-x-hidden p-3 pb-20 sm:p-4 md:p-8 md:pb-8">
          <Suspense fallback={<ContentFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
