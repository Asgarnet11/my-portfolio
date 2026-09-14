import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/public/Home";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Customizer from "./pages/admin/Customizer";
import ProjectsManager from "./pages/admin/ProjectsManager";
import ExperienceManager from "./pages/admin/ExperienceManager";
import MessagesInbox from "./pages/admin/MessagesInbox";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-xs"
        style={{
          backgroundColor: "var(--bg-primary, #FFF6EC)",
          color: "var(--color-ink, #3A2E3D)",
          fontFamily: "var(--font-body, monospace)",
        }}
      >
        <div
          className="px-6 py-4"
          style={{
            border: "var(--border-width, 4px) solid var(--color-ink, #3A2E3D)",
            backgroundColor: "var(--bg-secondary, #FFD866)",
            boxShadow: "var(--box-shadow, 6px 6px 0 var(--color-ink, #3A2E3D))",
            borderRadius: "var(--border-radius, 0px)",
          }}
        >
          Memeriksa sesi admin...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
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
            <Route path="/admin/login" element={<AdminLogin />} />

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
