import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
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
  ShieldCheck,
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
      label: "Inbox Messages",
      to: "/admin/messages",
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-heading, 'Inter', sans-serif)",
      }}
    >
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 shrink-0 border-r z-50 transform transition-transform duration-200 ease-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Header */}
        <div
          className="h-16 flex items-center justify-between px-5 border-b shrink-0"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{
                background: "var(--badge-bg)",
                border: "1px solid var(--badge-border)",
                color: "var(--color-accent)",
              }}
            >
              AF
            </div>
            <div className="leading-tight">
              <span className="text-xs font-semibold block tracking-tight">
                ADMIN CONTROL
              </span>
              <span className="text-[10px] font-mono" style={{ color: "var(--color-muted)" }}>
                PORTFOLIO v2.0
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:opacity-70 cursor-pointer"
            aria-label="Tutup menu"
            style={{ color: "var(--color-muted)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div
          className="px-4 py-3.5 border-b flex items-center gap-2.5"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-surface-elevated)",
          }}
        >
          <div
            className="p-1.5 rounded-lg border"
            style={{
              background: "var(--badge-bg)",
              borderColor: "var(--badge-border)",
              color: "var(--color-accent)",
            }}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: "var(--color-ink)" }}>
              {user?.name || "Administrator"}
            </div>
            <div className="text-[10px] font-mono truncate" style={{ color: "var(--color-muted)" }}>
              {user?.email || "afatwahyudi@gmail.com"}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl font-medium transition-all ${
                    isActive ? "font-semibold shadow-xs" : "hover:opacity-90"
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "var(--bg-surface-elevated)" : "transparent",
                  color: isActive ? "var(--color-accent)" : "var(--color-muted)",
                  border: isActive ? "1px solid var(--border-color)" : "1px solid transparent",
                })}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className="px-2 py-0.5 text-[10px] font-mono rounded-full font-bold"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--on-accent)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div
          className="p-3.5 border-t flex flex-col gap-2 shrink-0"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-colors border"
            style={{
              backgroundColor: "var(--bg-surface-elevated)",
              borderColor: "var(--border-color)",
              color: "var(--color-muted)",
            }}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Kunjungi Situs Publik</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-colors border cursor-pointer"
            style={{
              backgroundColor: "var(--bg-surface-elevated)",
              borderColor: "var(--border-color)",
              color: "var(--error-text)",
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header
          className="h-14 border-b flex items-center justify-between px-4 md:hidden sticky top-0 z-30"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border cursor-pointer"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--color-ink)",
              }}
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold">ADMIN PANEL</span>
          </div>
          <Link
            to="/"
            className="text-[11px] font-mono px-2.5 py-1 rounded-full border"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--color-muted)",
            }}
          >
            Lihat Web
          </Link>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
