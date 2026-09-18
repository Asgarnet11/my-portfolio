import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/public/Home";
import AdminLayout from "./components/admin/AdminLayout";

// Code splitting / dynamic import for admin panel chunks
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Customizer = lazy(() => import("./pages/admin/Customizer"));
const ProjectsManager = lazy(() => import("./pages/admin/ProjectsManager"));
const ExperienceManager = lazy(() => import("./pages/admin/ExperienceManager"));
const MessagesInbox = lazy(() => import("./pages/admin/MessagesInbox"));

const AdminLoadingFallback = () => (
  <div
    className="min-h-[50vh] flex items-center justify-center text-xs p-6"
    style={{
      backgroundColor: "var(--bg-primary, #FFF6EC)",
      color: "var(--color-ink, #3A2E3D)",
      fontFamily: "var(--font-heading, monospace)",
    }}
  >
    <div
      className="px-6 py-4 flex items-center gap-3"
      style={{
        border: "var(--border-width, 3px) solid var(--color-ink, #3A2E3D)",
        backgroundColor: "var(--bg-secondary, #FFD866)",
        boxShadow: "var(--box-shadow, 4px 4px 0 var(--color-ink, #3A2E3D))",
        borderRadius: "var(--border-radius, 0px)",
      }}
    >
      <div className="w-2.5 h-2.5 bg-[#3A2E3D] animate-ping" />
      <span>Memuat modul admin...</span>
    </div>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-xs"
        style={{
          backgroundColor: "var(--bg-primary, #FFF6EC)",
          color: "var(--color-ink, #3A2E3D)",
          fontFamily: "var(--font-heading, monospace)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{
            border: "var(--border-width, 4px) solid var(--color-ink, #3A2E3D)",
            backgroundColor: "var(--bg-secondary, #FFD866)",
            boxShadow: "var(--box-shadow, 6px 6px 0 var(--color-ink, #3A2E3D))",
            borderRadius: "var(--border-radius, 0px)",
          }}
        >
          <div className="w-2 h-2 bg-[#3A2E3D] animate-pulse" />
          <span>Memeriksa sesi admin...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Suspense fallback={<AdminLoadingFallback />}>{children}</Suspense>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Admin Auth Route */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminLoadingFallback />}>
                  <AdminLogin />
                </Suspense>
              }
            />

            {/* Admin root redirect */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/customizer" replace />}
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/customizer"
              element={
                <ProtectedRoute>
                  <Customizer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <ProjectsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/experience"
              element={
                <ProtectedRoute>
                  <ExperienceManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <MessagesInbox />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
