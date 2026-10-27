import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { Plus, Trash2, Edit2, Check, RefreshCw } from "lucide-react";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  is_published: boolean;
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const fetchExperiences = useCallback(async () => {
    try {
      const res = await api.get("/experiences/admin");
      setExperiences(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data pengalaman:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get("/experiences/admin");
        if (isMounted) setExperiences(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data pengalaman:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setRole("");
    setCompany("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
    setIsPublished(true);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (exp: ExperienceItem) => {
    setEditingId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setLocation(exp.location || "");
    setStartDate(exp.start_date ? exp.start_date.split("T")[0] : "");
    setEndDate(exp.end_date ? exp.end_date.split("T")[0] : "");
    setIsCurrent(!exp.end_date);
    setDescription(exp.description);
    setIsPublished(exp.is_published);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      role,
      company,
      location: location || null,
      start_date: startDate,
      end_date: isCurrent ? null : endDate || null,
      description,
      is_published: isPublished,
    };

    try {
      if (editingId) {
        await api.put(`/experiences/admin/${editingId}`, payload);
        showToast("Riwayat pengalaman berhasil diperbarui!");
      } else {
        await api.post("/experiences/admin", payload);
        showToast("Pengalaman baru berhasil ditambahkan!");
      }
      resetForm();
      fetchExperiences();
    } catch {
      alert("Gagal menyimpan riwayat pengalaman.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus riwayat pengalaman ini?")) return;
    try {
      await api.delete(`/experiences/admin/${id}`);
      showToast("Riwayat pengalaman berhasil dihapus.");
      fetchExperiences();
    } catch {
      alert("Gagal menghapus riwayat.");
    }
  };

  const inputStyle = {
    backgroundColor: "var(--bg-surface-elevated)",
    borderColor: "var(--border-color)",
    color: "var(--color-ink)",
  };

  const inputClasses =
    "w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-40";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border shadow-xs"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div>
          <h1
            className="text-xl sm:text-2xl font-semibold tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Experience Manager
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            Kelola jejak karier, peran profesional, institusi, dan kontribusi teknis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchExperiences()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl border transition-all cursor-pointer font-medium hover:opacity-80 shrink-0"
            style={{
              backgroundColor: "var(--bg-surface-elevated)",
              borderColor: "var(--border-color)",
              color: "var(--color-ink)",
            }}
            title="Muat ulang data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              if (isFormOpen) {
                resetForm();
              } else {
                setIsFormOpen(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl transition-all cursor-pointer font-medium shadow-xs hover:opacity-95 shrink-0"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--on-accent)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isFormOpen ? "Tutup Form" : "Tambah Experience"}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className="p-4 rounded-xl border text-xs shadow-xs flex items-center gap-2.5 animate-fadeIn"
          style={{
            backgroundColor: "var(--bg-surface-elevated)",
            borderColor: "var(--color-accent)",
            color: "var(--color-ink)",
          }}
        >
          <Check className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Form Tambah/Edit */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-7 rounded-2xl border space-y-4 shadow-xs"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className="flex justify-between items-center border-b pb-3"
            style={{ borderColor: "var(--border-color)" }}
          >
            <h2
              className="text-sm font-semibold tracking-tight"
              style={{ color: "var(--color-ink)" }}
            >
              {editingId ? "Edit Data Experience" : "Tambah Experience Baru"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs px-3 py-1 rounded-lg border cursor-pointer transition-colors"
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                borderColor: "var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Posisi / Role
              </label>
              <input
                type="text"
                placeholder="Pranata Komputer (Magang Hub)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className={inputClasses}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Institusi / Perusahaan
              </label>
              <input
                type="text"
                placeholder="BPVP Kendari"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className={inputClasses}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Lokasi (Opsional)
              </label>
              <input
                type="text"
                placeholder="Kendari, Sulawesi Tenggara"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClasses}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className={inputClasses}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Tanggal Selesai
              </label>
              <input
                type="date"
                disabled={isCurrent}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClasses}
                style={inputStyle}
              />
              <label
                className="flex items-center gap-2 text-xs font-mono mt-2 cursor-pointer"
                style={{ color: "var(--color-muted)" }}
              >
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--color-accent)]"
                />
                <span>Masih aktif / bertugas (Present)</span>
              </label>
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-mono mb-1.5"
              style={{ color: "var(--color-muted)" }}
            >
              Deskripsi Pekerjaan / Kontribusi Teknis
            </label>
            <textarea
              rows={4}
              placeholder="Rancang dan kembangkan sistem aplikasi, digitalisasi layanan publik, pengelolaan infrastruktur data..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={inputClasses}
              style={inputStyle}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <label
              className="flex items-center gap-2 text-xs font-mono cursor-pointer"
              style={{ color: "var(--color-muted)" }}
            >
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--color-accent)]"
              />
              <span>Tampilkan di Landing Page</span>
            </label>
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 text-xs rounded-xl transition-all cursor-pointer font-medium shadow-xs hover:opacity-95"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--on-accent)",
              }}
            >
              {editingId ? "Perbarui Experience" : "Simpan Experience"}
            </button>
          </div>
        </form>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[var(--color-accent)] shadow-xs"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs sm:text-sm font-semibold break-words"
                  style={{ color: "var(--color-ink)" }}
                >
                  {exp.role}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-accent)" }}
                >
                  @ {exp.company}
                </span>
                {!exp.is_published && (
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: "var(--bg-surface-elevated)",
                      borderColor: "var(--border-color)",
                      color: "var(--color-muted)",
                    }}
                  >
                    Draft
                  </span>
                )}
              </div>
              <div
                className="text-xs font-mono"
                style={{ color: "var(--color-muted)" }}
              >
                {exp.start_date?.split("T")[0]} —{" "}
                {exp.end_date ? exp.end_date.split("T")[0] : "Present"}
                {exp.location && ` · ${exp.location}`}
              </div>
              <p
                className="text-xs pt-1 line-clamp-2"
                style={{ color: "var(--color-muted)" }}
              >
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(exp)}
                className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: "var(--badge-bg)",
                  borderColor: "var(--badge-border)",
                  color: "var(--color-accent)",
                }}
                aria-label="Edit"
                title="Edit Experience"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: "var(--error-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--error-text)",
                }}
                aria-label="Hapus"
                title="Hapus Experience"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {!loading && experiences.length === 0 && (
          <div
            className="p-8 text-center border border-dashed rounded-2xl text-xs"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--color-muted)",
            }}
          >
            Belum ada riwayat pengalaman. Klik &quot;Tambah Experience&quot; untuk menambahkan.
          </div>
        )}
      </div>
    </div>
  );
}
