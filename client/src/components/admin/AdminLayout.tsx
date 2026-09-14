import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Sliders,
  FolderKanban,
  Briefcase,
  Mail,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Site Customizer", to: "/admin/customizer", icon: Sliders },
    { label: "Projects", to: "/admin/projects", icon: FolderKanban },
    { label: "Experience", to: "/admin/experience", icon: Briefcase },
    { label: "Inbox", to: "/admin/messages", icon: Mail },
  ];

  const sidebarClasses = [
    "fixed md:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white border-r-4 border-[#3A2E3D] z-50 transform transition-transform duration-200 ease-out flex flex-col",
    sidebarOpen ? "translate-x-0" : "-translate-x-full",
    "md:translate-x-0",
  ].join(" ");

  return (
    <div className="min-h-screen bg-[#FFF6EC] text-[#3A2E3D] font-pixel flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="h-16 flex items-center justify-between px-5 border-b-4 border-[#3A2E3D] bg-[#C9B8FF] shrink-0">
          <span className="text-xs uppercase tracking-widest">
            Admin<span className="opacity-60">.Panel</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden hover:opacity-70"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 text-[10px] sm:text-xs border-2 transition-transform ${
                    isActive
                      ? "bg-[#FFD866] border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D]"
                      : "border-transparent hover:border-[#3A2E3D] hover:bg-[#FFF6EC]"
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t-4 border-[#3A2E3D] flex flex-col gap-2 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 text-[10px] sm:text-xs px-3 py-2 border-2 border-transparent hover:border-[#3A2E3D] hover:bg-[#B8E6D5] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Preview Web</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 text-[10px] sm:text-xs px-3 py-2 border-2 border-[#3A2E3D] hover:bg-[#FFB4C6] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden border-b-4 border-[#3A2E3D] bg-white sticky top-0 z-30 h-14 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="hover:opacity-70"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-xs uppercase tracking-widest">
            Admin<span className="opacity-60">.Panel</span>
          </span>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
