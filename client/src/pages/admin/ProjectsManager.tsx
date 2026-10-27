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

  const inputStyle = {
    backgroundColor: "var(--bg-surface-elevated)",
    borderColor: "var(--border-color)",
    color: "var(--color-ink)",
  };

  const inputClasses =
    "w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border transition-all focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

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
            Projects Manager
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            Kelola daftar portofolio karya, thumbnail, tech stack, dan tautan publikasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProjects()}
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
            <span>{isFormOpen ? "Tutup Form" : "Tambah Proyek"}</span>
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
          className="p-5 sm:p-7 rounded-2xl border space-y-5 shadow-xs"
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
              {editingId ? "Edit Data Proyek" : "Tambah Proyek Baru"}
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
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Slug URL
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className={inputClasses}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-mono mb-1.5"
              style={{ color: "var(--color-muted)" }}
            >
              Ringkasan Singkat / Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={2}
              className={inputClasses}
              style={inputStyle}
            />
          </div>

          {/* Upload & Cover Image Section */}
          <div className="space-y-2">
            <label
              className="block text-xs font-mono"
              style={{ color: "var(--color-muted)" }}
            >
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
                className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-xl border cursor-pointer transition-all shrink-0 font-medium ${
                  uploading ? "opacity-50 pointer-events-none" : "hover:opacity-90"
                }`}
                style={{
                  backgroundColor: "var(--badge-bg)",
                  borderColor: "var(--badge-border)",
                  color: "var(--color-accent)",
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? "Mengunggah..." : "Upload File Gambar"}</span>
              </label>

              <span
                className="text-xs font-mono"
                style={{ color: "var(--color-muted)" }}
              >
                atau URL:
              </span>

              <input
                type="text"
                placeholder="https://... atau paste link gambar"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className={`flex-1 ${inputClasses}`}
                style={inputStyle}
              />

              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80 shrink-0"
                  style={{
                    backgroundColor: "var(--bg-surface-elevated)",
                    borderColor: "var(--border-color)",
                    color: "var(--color-muted)",
                  }}
                  title="Hapus gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {coverImage && (
              <div
                className="relative w-44 sm:w-52 h-28 sm:h-32 rounded-xl border overflow-hidden mt-2 shadow-xs"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface-elevated)",
                }}
              >
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
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Tech Stack (pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="React, TypeScript, Laravel"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className={inputClasses}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Live Demo URL (opsional)
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className={inputClasses}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-xs font-mono mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Repo URL (GitHub)
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className={inputClasses}
                style={inputStyle}
              />
            </div>
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
              <span>Publikasikan ke Halaman Publik</span>
            </label>
            <button
              type="submit"
              disabled={uploading}
              className="ml-auto px-5 py-2.5 text-xs rounded-xl transition-all cursor-pointer font-medium shadow-xs hover:opacity-95 disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--on-accent)",
              }}
            >
              {editingId ? "Perbarui Proyek" : "Simpan Proyek"}
            </button>
          </div>
        </form>
      )}

      {/* Project List */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[var(--color-accent)] shadow-xs"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center gap-4 min-w-0">
              {proj.cover_image ? (
                <img
                  src={proj.cover_image}
                  alt={proj.title}
                  className="w-16 h-12 object-cover rounded-xl border shrink-0"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-surface-elevated)",
                  }}
                />
              ) : (
                <div
                  className="w-16 h-12 rounded-xl border flex items-center justify-center shrink-0"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-surface-elevated)",
                    color: "var(--color-muted)",
                  }}
                >
                  <ImageIcon className="w-5 h-5 opacity-60" />
                </div>
              )}

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-xs sm:text-sm font-semibold break-words"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {proj.title}
                  </span>
                  {!proj.is_published && (
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
                <p
                  className="text-xs max-w-xl line-clamp-1"
                  style={{ color: "var(--color-muted)" }}
                >
                  {proj.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {proj.tech_stack?.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: "var(--bg-surface-elevated)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--color-muted)",
                      }}
                    >
                      {t}
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
                  className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: "var(--bg-surface-elevated)",
                    borderColor: "var(--border-color)",
                    color: "var(--color-ink)",
                  }}
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
                  className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: "var(--bg-surface-elevated)",
                    borderColor: "var(--border-color)",
                    color: "var(--color-ink)",
                  }}
                  aria-label="Repository"
                  title="Buka GitHub"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => handleEdit(proj)}
                className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: "var(--badge-bg)",
                  borderColor: "var(--badge-border)",
                  color: "var(--color-accent)",
                }}
                aria-label="Edit"
                title="Edit Proyek"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(proj.id)}
                className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: "var(--error-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--error-text)",
                }}
                aria-label="Hapus"
                title="Hapus Proyek"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {!loading && projects.length === 0 && (
          <div
            className="p-8 text-center border border-dashed rounded-2xl text-xs"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--color-muted)",
            }}
          >
            Belum ada proyek. Klik tombol &quot;Tambah Proyek&quot; di atas untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
}
