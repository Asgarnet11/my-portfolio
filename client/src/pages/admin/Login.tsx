import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield, ArrowRight, Lock, Mail, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/customizer");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(
        axiosErr.response?.data?.error || "Login gagal, periksa email dan password Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--bg-surface-elevated)",
    borderColor: "var(--border-color)",
    color: "var(--color-ink)",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-heading, 'Inter', sans-serif)",
      }}
    >
      {/* Ambient Glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-20 -z-10"
        style={{ background: "var(--card-glow)" }}
      />

      <div className="w-full max-w-sm space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-100"
          style={{ color: "var(--color-muted)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            boxShadow: "var(--box-shadow)",
          }}
        >
          {/* Header */}
          <div className="space-y-2 text-center">
            <div
              className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center border"
              style={{
                background: "var(--badge-bg)",
                borderColor: "var(--badge-border)",
                color: "var(--color-accent)",
              }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <h1
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--color-ink)" }}
            >
              Autentikasi Administrator
            </h1>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>
              Kelola konten, data proyek, dan konfigurasi situs
            </p>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs border"
              style={{
                background: "var(--error-bg)",
                borderColor: "var(--error-text)",
                color: "var(--error-text)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-mono"
                style={{ color: "var(--color-muted)" }}
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-all"
                  style={inputStyle}
                />
                <Mail
                  className="w-4 h-4 absolute left-3 top-3"
                  style={{ color: "var(--color-muted)" }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono"
                style={{ color: "var(--color-muted)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-all"
                  style={inputStyle}
                />
                <Lock
                  className="w-4 h-4 absolute left-3 top-3"
                  style={{ color: "var(--color-muted)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 shadow-md"
              style={{
                background: "var(--color-primary)",
                color: "var(--on-accent)",
              }}
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
