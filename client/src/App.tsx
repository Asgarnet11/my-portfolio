import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/public/Home";
import AdminLayout from "./components/admin/AdminLayout";
import LoadingScreen from "./components/LoadingScreen";

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
      backgroundColor: "var(--bg-primary)",
      color: "var(--color-ink)",
      fontFamily: "var(--font-heading, 'Inter', sans-serif)",
    }}
  >
    <div
      className="px-6 py-4 flex items-center gap-3 rounded-2xl border shadow-lg"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full animate-ping"
        style={{ background: "var(--color-accent)" }}
      />
      <span className="font-medium">Memuat modul admin...</span>
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
          backgroundColor: "var(--bg-primary)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-heading, 'Inter', sans-serif)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center gap-3 rounded-2xl border shadow-lg"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: "var(--color-accent)" }}
          />
          <span className="font-medium">Memeriksa sesi autentikasi...</span>
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
        <LoadingScreen />
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
