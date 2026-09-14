import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/admin/customizer");
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Login gagal, periksa email/password.",
      );
    }
  };

  const inputClasses =
    "w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF6EC] border-2 border-[#3A2E3D] focus:outline-none focus:shadow-[3px_3px_0_#3A2E3D] transition-shadow";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF6EC] font-pixel text-[#3A2E3D] p-4">
      <div className="w-full max-w-sm">
        {/* Decorative pixel dots */}
        <div className="flex gap-2 mb-4 justify-center">
          <div className="w-3 h-3 bg-[#FFD866] border-2 border-[#3A2E3D]" />
          <div className="w-3 h-3 bg-[#FFB4C6] border-2 border-[#3A2E3D]" />
          <div className="w-3 h-3 bg-[#B8E6D5] border-2 border-[#3A2E3D]" />
          <div className="w-3 h-3 bg-[#C9B8FF] border-2 border-[#3A2E3D]" />
        </div>

        <div className="p-6 sm:p-8 border-4 border-[#3A2E3D] bg-white shadow-[8px_8px_0_#3A2E3D]">
          <h1 className="text-base sm:text-lg font-bold tracking-tight mb-6 text-center">
            Admin Authentication
          </h1>

          {error && (
            <div className="p-3 mb-4 text-[10px] sm:text-xs bg-[#FFB4C6] border-2 border-[#3A2E3D]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] sm:text-xs uppercase tracking-wider mb-1 opacity-70">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs uppercase tracking-wider mb-1 opacity-70">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs sm:text-sm bg-[#FFD866] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] active:translate-y-[3px] active:shadow-none transition-transform"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
