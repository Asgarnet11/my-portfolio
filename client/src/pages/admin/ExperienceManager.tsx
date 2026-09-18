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

  const inputClasses =
    "w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF6EC] border-2 border-[#3A2E3D] focus:outline-none focus:shadow-[3px_3px_0_#3A2E3D] transition-shadow disabled:opacity-30";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-[#3A2E3D] bg-[#C9B8FF] px-4 sm:px-6 py-4 shadow-[6px_6px_0_#3A2E3D]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            Experience Manager
          </h1>
          <p className="text-[10px] sm:text-xs mt-1 opacity-80">
            Kelola jejak karier, peran profesional, perusahaan, dan kontribusi teknis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchExperiences()}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFF6EC] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] text-[10px] sm:text-xs hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] active:translate-y-[3px] active:shadow-none transition-transform shrink-0"
            title="Muat ulang"
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
            className="flex items-center gap-2 px-3.5 py-2 bg-[#FFD866] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] text-[10px] sm:text-xs hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] active:translate-y-[3px] active:shadow-none transition-transform shrink-0 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isFormOpen ? "Tutup Form" : "Tambah Experience"}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="p-3 bg-[#B8E6D5] border-4 border-[#3A2E3D] text-[#3A2E3D] text-[10px] sm:text-xs shadow-[4px_4px_0_#3A2E3D] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#2C6B47]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 border-4 border-[#3A2E3D] bg-white shadow-[6px_6px_0_#3A2E3D] space-y-4"
        >
          <div className="flex justify-between items-center border-b-2 border-[#3A2E3D] pb-3">
            <h2 className="text-xs sm:text-sm uppercase tracking-wide font-bold">
              {editingId ? "Edit Data Experience" : "Tambah Experience Baru"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-[10px] px-2 py-1 bg-[#FFB4C6] border-2 border-[#3A2E3D]"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Posisi / Role
              </label>
              <input
                type="text"
                placeholder="Full-Stack Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Perusahaan / Organisasi
              </label>
              <input
                type="text"
                placeholder="PT Technology Indonesia"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Lokasi (Opsional)
              </label>
              <input
                type="text"
                placeholder="Jakarta, Indonesia (Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Tanggal Selesai
              </label>
              <input
                type="date"
                disabled={isCurrent}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClasses}
              />
              <label className="flex items-center gap-1.5 text-[10px] mt-2 cursor-pointer opacity-80">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#3A2E3D]"
                />
                <span>Masih bekerja di sini (Present)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
              Deskripsi Pekerjaan / Kontribusi Teknis
            </label>
            <textarea
              rows={4}
              placeholder="Rancang sistem backend, optimasi database, implementasi UI..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={inputClasses}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <label className="flex items-center gap-2 text-[10px] sm:text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-[#3A2E3D]"
              />
              <span>Tampilkan di Landing Page</span>
            </label>
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 text-[10px] sm:text-xs bg-[#B8E6D5] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] active:translate-y-[3px] active:shadow-none transition-transform font-bold"
            >
              {editingId ? "Perbarui Experience" : "Simpan Experience"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-4 border-4 border-[#3A2E3D] bg-white shadow-[4px_4px_0_#3A2E3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-bold break-words">
                  {exp.role}
                </span>
                <span className="text-[10px] sm:text-xs opacity-70">
                  @ {exp.company}
                </span>
                {!exp.is_published && (
                  <span className="text-[9px] sm:text-[10px] px-2 py-0.5 bg-[#FFB4C6] border-2 border-[#3A2E3D]">
                    Draft
                  </span>
                )}
              </div>
              <div className="text-[10px] sm:text-xs opacity-60">
                {exp.start_date?.split("T")[0]} —{" "}
                {exp.end_date ? exp.end_date.split("T")[0] : "Present"}
                {exp.location && ` · ${exp.location}`}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(exp)}
                className="p-2 bg-[#FFD866] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                aria-label="Edit"
                title="Edit Experience"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 bg-[#FFB4C6] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                aria-label="Hapus"
                title="Hapus Experience"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {!loading && experiences.length === 0 && (
          <div className="p-8 text-center border-4 border-dashed border-[#3A2E3D] bg-white text-[10px] sm:text-xs">
            Belum ada riwayat pengalaman. Klik &quot;Tambah Experience&quot; untuk menambahkan.
          </div>
        )}
      </div>
    </div>
  );
}
