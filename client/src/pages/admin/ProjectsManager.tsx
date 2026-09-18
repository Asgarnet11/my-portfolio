import React, { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../../lib/api";
import { compressImageToWebP } from "../../lib/imageCompressor";
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  X,
  Check,
  RefreshCw,
} from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image?: string;
  tech_stack: string[];
  live_url?: string;
  repo_url?: string;
  display_order: number;
  is_published: boolean;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [techStack, setTechStack] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get("/projects/admin");
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data proyek:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get("/projects/admin");
        if (isMounted) setProjects(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data proyek:", err);
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
    setTitle("");
    setSlug("");
    setSummary("");
    setCoverImage("");
    setTechStack("");
    setLiveUrl("");
    setRepoUrl("");
    setDisplayOrder(0);
    setIsPublished(true);
    setEditingId(null);
    setIsFormOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setSlug(proj.slug);
    setSummary(proj.summary);
    setCoverImage(proj.cover_image || "");
    setTechStack(proj.tech_stack?.join(", ") || "");
    setLiveUrl(proj.live_url || "");
    setRepoUrl(proj.repo_url || "");
    setDisplayOrder(proj.display_order);
    setIsPublished(proj.is_published);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const optimizedFile = await compressImageToWebP(file, 1000, 0.82);
      const formData = new FormData();
      formData.append("file", optimizedFile);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCoverImage(res.data.url);
      showToast("Gambar berhasil diunggah!");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      alert(axiosErr.response?.data?.error || "Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug,
      summary,
      cover_image: coverImage || null,
      tech_stack: techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      live_url: liveUrl || null,
      repo_url: repoUrl || null,
      display_order: Number(displayOrder),
      is_published: isPublished,
    };

    try {
      if (editingId) {
        await api.put(`/projects/admin/${editingId}`, payload);
        showToast("Proyek berhasil diperbarui!");
      } else {
        await api.post("/projects/admin", payload);
        showToast("Proyek baru berhasil dibuat!");
      }
      resetForm();
      fetchProjects();
    } catch {
      alert("Gagal menyimpan data proyek.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus proyek ini secara permanen?")) return;
    try {
      await api.delete(`/projects/admin/${id}`);
      showToast("Proyek berhasil dihapus.");
      fetchProjects();
    } catch {
      alert("Gagal menghapus proyek.");
    }
  };

  const inputClasses =
    "w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF6EC] border-2 border-[#3A2E3D] focus:outline-none focus:shadow-[3px_3px_0_#3A2E3D] transition-shadow";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-[#3A2E3D] bg-[#C9B8FF] px-4 sm:px-6 py-4 shadow-[6px_6px_0_#3A2E3D]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            Projects Manager
          </h1>
          <p className="text-[10px] sm:text-xs mt-1 opacity-80">
            Kelola daftar portofolio karya, thumbnail, tech stack, dan tautan publikasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProjects()}
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
            <span>{isFormOpen ? "Tutup Form" : "Tambah Proyek"}</span>
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

      {/* Form Tambah/Edit */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 border-4 border-[#3A2E3D] bg-white shadow-[6px_6px_0_#3A2E3D] space-y-5"
        >
          <div className="flex justify-between items-center border-b-2 border-[#3A2E3D] pb-3">
            <h2 className="text-xs sm:text-sm uppercase tracking-wide font-bold">
              {editingId ? "Edit Data Proyek" : "Tambah Proyek Baru"}
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
                Judul Proyek
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-"),
                    );
                  }
                }}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Slug URL
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
              Ringkasan Singkat / Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={2}
              className={inputClasses}
            />
          </div>

          {/* Upload & Cover Image Section */}
          <div className="space-y-2">
            <label className="block text-[10px] sm:text-xs opacity-70">
              Cover Image / Thumbnail Proyek
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="project-cover-file"
              />
              <label
                htmlFor="project-cover-file"
                className={`flex items-center gap-2 px-3 py-2 bg-[#B8E6D5] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] text-[10px] sm:text-xs cursor-pointer hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] transition-transform shrink-0 ${
                  uploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? "Mengunggah..." : "Upload File Gambar"}</span>
              </label>

              <span className="text-[10px] sm:text-xs opacity-60">
                atau URL:
              </span>

              <input
                type="text"
                placeholder="https://... / gambar dari internet"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className={`flex-1 ${inputClasses}`}
              />

              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="p-2 bg-[#FFB4C6] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform shrink-0"
                  title="Hapus gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {coverImage && (
              <div className="relative w-40 sm:w-48 h-24 sm:h-28 border-2 border-[#3A2E3D] bg-[#FFF6EC] overflow-hidden mt-2 shadow-[2px_2px_0_#3A2E3D]">
                <img
                  src={coverImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Tech Stack (pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="React, Express, PostgreSQL"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Live Demo URL (https://...)
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                Repo URL (GitHub)
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <label className="flex items-center gap-2 text-[10px] sm:text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-[#3A2E3D]"
              />
              <span>Publikasikan ke Halaman Publik</span>
            </label>
            <button
              type="submit"
              disabled={uploading}
              className="ml-auto px-5 py-2.5 text-[10px] sm:text-xs bg-[#B8E6D5] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] active:translate-y-[3px] active:shadow-none disabled:opacity-50 transition-transform font-bold"
            >
              {editingId ? "Perbarui Proyek" : "Simpan Proyek"}
            </button>
          </div>
        </form>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 border-4 border-[#3A2E3D] bg-white shadow-[4px_4px_0_#3A2E3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              {proj.cover_image ? (
                <img
                  src={proj.cover_image}
                  alt={proj.title}
                  className="w-16 h-12 object-cover border-2 border-[#3A2E3D] bg-[#FFF6EC] shrink-0"
                />
              ) : (
                <div className="w-16 h-12 border-2 border-[#3A2E3D] bg-[#FFF6EC] flex items-center justify-center opacity-40 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold break-words">
                    {proj.title}
                  </span>
                  {!proj.is_published && (
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 bg-[#FFB4C6] border-2 border-[#3A2E3D]">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs opacity-70 max-w-xl line-clamp-1">
                  {proj.summary}
                </p>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {proj.tech_stack?.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] sm:text-[10px] opacity-60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {proj.live_url && (
                <a
                  href={proj.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#B8E6D5] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                  aria-label="Live Demo"
                  title="Buka Demo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {proj.repo_url && (
                <a
                  href={proj.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#C9B8FF] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                  aria-label="Repository"
                  title="Buka GitHub"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => handleEdit(proj)}
                className="p-2 bg-[#FFD866] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                aria-label="Edit"
                title="Edit Proyek"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(proj.id)}
                className="p-2 bg-[#FFB4C6] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                aria-label="Hapus"
                title="Hapus Proyek"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {!loading && projects.length === 0 && (
          <div className="p-8 text-center border-4 border-dashed border-[#3A2E3D] bg-white text-[10px] sm:text-xs">
            Belum ada proyek. Klik tombol &quot;Tambah Proyek&quot; di atas untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
}
