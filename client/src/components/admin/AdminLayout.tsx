import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import {
  Sliders,
  FolderKanban,
  Briefcase,
  Mail,
  LogOut,
  Globe,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get("/contact/admin");
        const messages: Array<{ is_read: boolean }> = res.data?.data || [];
        const unread = messages.filter((m) => !m.is_read).length;
        setUnreadCount(unread);
      } catch {
        // silent fail on count check
      }
    };
    fetchUnread();
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Site Customizer", to: "/admin/customizer", icon: Sliders },
    { label: "Projects", to: "/admin/projects", icon: FolderKanban },
    { label: "Experience", to: "/admin/experience", icon: Briefcase },
    {
      label: "Inbox",
      to: "/admin/messages",
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
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

      {/* Sidebar Navigation */}
      <aside className={sidebarClasses}>
        <div className="h-16 flex items-center justify-between px-5 border-b-4 border-[#3A2E3D] bg-[#C9B8FF] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FFD866] border-2 border-[#3A2E3D]" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Admin<span className="opacity-70">.Panel</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden hover:opacity-70 p-1"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 bg-[#FFF6EC] border-b-2 border-[#3A2E3D] flex items-center gap-2.5">
          <div className="p-1.5 bg-[#FFD866] border-2 border-[#3A2E3D]">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold truncate">
              {user?.name || "Administrator"}
            </div>
            <div className="text-[8px] opacity-60 truncate">
              {user?.email || "admin@portfolio"}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 text-[10px] sm:text-xs border-2 transition-transform ${
                    isActive
                      ? "bg-[#FFD866] border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] translate-x-1"
                      : "border-transparent hover:border-[#3A2E3D] hover:bg-[#FFF6EC]"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[8px] bg-[#FFB4C6] border border-[#3A2E3D] font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t-4 border-[#3A2E3D] flex flex-col gap-2 shrink-0 bg-white">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 text-[10px] sm:text-xs px-3 py-2 border-2 border-[#3A2E3D] bg-[#B8E6D5] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 text-[10px] sm:text-xs px-3 py-2 border-2 border-[#3A2E3D] bg-[#FFB4C6] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header Bar */}
        <header className="md:hidden border-b-4 border-[#3A2E3D] bg-white sticky top-0 z-30 h-14 flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hover:opacity-70 p-1 mr-2"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase tracking-widest font-bold">
              Admin<span className="opacity-60">.Panel</span>
            </span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 bg-[#B8E6D5] border-2 border-[#3A2E3D]"
            title="Lihat Website"
          >
            <Globe className="w-4 h-4" />
          </a>
        </header>

        {/* Page Inner Container */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
