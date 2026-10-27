import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../../lib/api";
import { compressImageToWebP } from "../../lib/imageCompressor";
import { Upload, X, User, FileText, Share2, Sliders, Check, RefreshCw } from "lucide-react";

interface SectionData {
  statusBadge?: string;
  avatarUrl?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  bio?: string;
  skills?: string[] | string;
  email?: string;
  github?: string;
  linkedin?: string;
  [key: string]: unknown;
}

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  data: SectionData;
  is_active: boolean;
}

const getSectionIcon = (key: string) => {
  switch (key) {
    case "hero":
      return <User className="w-3.5 h-3.5" />;
    case "about":
      return <FileText className="w-3.5 h-3.5" />;
    case "socials":
      return <Share2 className="w-3.5 h-3.5" />;
    default:
      return <Sliders className="w-3.5 h-3.5" />;
  }
};

function SkillsManagerInput({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (newSkills: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setInputValue("");
      return;
    }
    onChange([...skills, trimmed]);
    setInputValue("");
  };

  const handleRemove = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd(inputValue);
    } else if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      handleRemove(skills.length - 1);
    }
  };

  const suggestions = [
    "TypeScript",
    "React",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Supabase",
    "TailwindCSS",
    "PHP",
    "Laravel",
    "MySQL",
    "Docker",
    "Next.js",
  ].filter((s) => !skills.includes(s));

  return (
    <div className="space-y-2">
      {/* Active Skills Badges */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-xl border min-h-[48px] items-center"
        style={{
          background: "var(--bg-surface-elevated)",
          borderColor: "var(--border-color)",
        }}
      >
        {skills.map((skill, idx) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border shadow-xs"
            style={{
              background: "var(--badge-bg)",
              borderColor: "var(--badge-border)",
              color: "var(--color-accent)",
            }}
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="hover:opacity-75 font-bold ml-0.5 cursor-pointer leading-none"
              title={`Hapus ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => handleAdd(inputValue)}
          placeholder={skills.length === 0 ? "Ketik skill lalu tekan Enter..." : "+ Tambah skill..."}
          className="flex-1 min-w-[140px] text-xs bg-transparent outline-none py-1"
          style={{ color: "var(--color-ink)" }}
        />
      </div>

      {/* Suggested Quick Add Chips */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono" style={{ color: "var(--color-muted)" }}>
            Saran cepat:
          </span>
          {suggestions.slice(0, 6).map((sugg) => (
            <button
              key={sugg}
              type="button"
              onClick={() => handleAdd(sugg)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer"
              style={{
                background: "var(--bg-surface-elevated)",
                borderColor: "var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              + {sugg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Customizer() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await api.get("/sections/admin");
      setSections(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get("/sections/admin");
        if (isMounted) setSections(res.data.data || []);
      } catch (err) {
        console.error("Gagal memuat sections:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFieldChange = (
    key: string,
    field: "title" | "subtitle",
    val: string,
  ) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: val } : s)),
    );
  };

  const handleDataChange = (
    key: string,
    field: string,
    val: unknown,
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key === key) {
          return {
            ...s,
            data: {
              ...s.data,
              [field]: val,
            },
          };
        }
        return s;
      }),
    );
  };

  const handleAvatarUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const optimizedFile = await compressImageToWebP(file, 800, 0.82);
      const formData = new FormData();
      formData.append("file", optimizedFile);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleDataChange(key, "avatarUrl", res.data.url);
      setToast("Foto berhasil diunggah dan dioptimasi ke WebP!");
      setTimeout(() => setToast(null), 3000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      alert(axiosErr.response?.data?.error || "Gagal mengunggah foto");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleUpdate = async (key: string, payload: Section) => {
    setSavingKey(key);
    try {
      await api.put(`/sections/admin/${key}`, payload);
      setToast(`Section "${key.toUpperCase()}" berhasil diperbarui!`);
      setTimeout(() => setToast(null), 3000);
      fetchSections();
    } catch {
      alert("Gagal memperbarui section.");
    } finally {
      setSavingKey(null);
    }
  };

  const inputClasses =
    "w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-all";
  const inputStyle = {
    backgroundColor: "var(--bg-surface-elevated)",
    borderColor: "var(--border-color)",
    color: "var(--color-ink)",
  };

  if (loading && sections.length === 0) {
    return (
      <div className="p-8 text-xs flex items-center justify-center">
        <div
          className="border rounded-2xl px-6 py-4 shadow-md flex items-center gap-2.5"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ background: "var(--color-accent)" }}
          />
          <span>Memuat editor customizer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-2xl p-5 sm:p-6 shadow-sm"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: "var(--color-ink)" }}>
            Site Customizer
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            Atur headline, avatar, tombol CTA, dan konten landing page secara real-time.
          </p>
        </div>

        <button
          onClick={() => fetchSections()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl border transition-all cursor-pointer shrink-0 font-medium"
          style={{
            backgroundColor: "var(--bg-surface-elevated)",
            borderColor: "var(--border-color)",
            color: "var(--color-ink)",
          }}
          title="Segarkan konten"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className="p-4 rounded-xl border text-xs shadow-md flex items-center gap-2.5"
          style={{
            backgroundColor: "var(--bg-surface-elevated)",
            borderColor: "var(--color-accent)",
            color: "var(--color-ink)",
          }}
        >
          <Check className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Section Cards */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.key}
            className="p-5 sm:p-7 border rounded-2xl space-y-6 shadow-sm"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="flex flex-wrap justify-between items-center gap-3 border-b pb-4"
              style={{ borderColor: "var(--border-color)" }}
            >
              <span
                className="inline-flex items-center gap-2 text-xs uppercase px-3 py-1 rounded-full font-mono font-medium border"
                style={{
                  background: "var(--badge-bg)",
                  borderColor: "var(--badge-border)",
                  color: "var(--color-accent)",
                }}
              >
                {getSectionIcon(section.key)}
                <span>{section.key} SECTION</span>
              </span>
              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer" style={{ color: "var(--color-muted)" }}>
                <input
                  type="checkbox"
                  checked={section.is_active}
                  onChange={(e) => {
                    const updated = {
                      ...section,
                      is_active: e.target.checked,
                    };
                    setSections((prev) =>
                      prev.map((s) => (s.key === section.key ? updated : s)),
                    );
                  }}
                  className="w-4 h-4 rounded"
                />
                <span>Aktif di Beranda Publik</span>
              </label>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                  Judul / Headline
                </label>
                <input
                  type="text"
                  value={section.title || ""}
                  onChange={(e) =>
                    handleFieldChange(section.key, "title", e.target.value)
                  }
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                  Sub-judul / Deskripsi Singkat
                </label>
                <input
                  type="text"
                  value={section.subtitle || ""}
                  onChange={(e) =>
                    handleFieldChange(section.key, "subtitle", e.target.value)
                  }
                  className={inputClasses}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Dynamic Fields Berdasarkan Key */}
            <div className="border-t pt-5 space-y-5" style={{ borderColor: "var(--border-color)" }}>
              {/* 1. HERO SECTION */}
              {section.key === "hero" && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                      Status Badge (Ketersediaan Kerja)
                    </label>
                    <input
                      type="text"
                      placeholder="Available for new opportunities"
                      value={section.data?.statusBadge || ""}
                      onChange={(e) =>
                        handleDataChange(
                          section.key,
                          "statusBadge",
                          e.target.value,
                        )
                      }
                      className={inputClasses}
                      style={inputStyle}
                    />
                  </div>

                  {/* Foto Profil / Avatar */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                      Foto Profil / Avatar
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAvatarUpload(section.key, file);
                        }}
                        className="hidden"
                        id={`avatar-upload-${section.key}`}
                      />
                      <label
                        htmlFor={`avatar-upload-${section.key}`}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs cursor-pointer transition-transform font-medium shrink-0 ${
                          uploadingKey === section.key
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                        style={{
                          background: "var(--badge-bg)",
                          borderColor: "var(--badge-border)",
                          color: "var(--color-accent)",
                        }}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingKey === section.key
                          ? "Mengunggah..."
                          : "Upload Foto Baru"}
                      </label>

                      <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                        atau URL:
                      </span>

                      <input
                        type="text"
                        placeholder="https://... / URL gambar avatar"
                        value={section.data?.avatarUrl || ""}
                        onChange={(e) =>
                          handleDataChange(
                            section.key,
                            "avatarUrl",
                            e.target.value,
                          )
                        }
                        className={`flex-1 ${inputClasses}`}
                        style={inputStyle}
                      />

                      {section.data?.avatarUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDataChange(section.key, "avatarUrl", "")
                          }
                          className="p-2.5 rounded-xl border cursor-pointer hover:opacity-75 transition-opacity shrink-0"
                          style={{
                            background: "var(--bg-surface-elevated)",
                            borderColor: "var(--border-color)",
                            color: "var(--error-text)",
                          }}
                          title="Hapus foto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {section.data?.avatarUrl && (
                      <div
                        className="w-20 h-20 rounded-xl border overflow-hidden mt-2 shadow-sm"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <img
                          src={section.data.avatarUrl}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                        Teks Tombol Utama (CTA 1)
                      </label>
                      <input
                        type="text"
                        value={section.data?.ctaPrimaryText || ""}
                        onChange={(e) =>
                          handleDataChange(
                            section.key,
                            "ctaPrimaryText",
                            e.target.value,
                          )
                        }
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                        Tautan Tombol Utama (Link 1)
                      </label>
                      <input
                        type="text"
                        value={section.data?.ctaPrimaryLink || ""}
                        onChange={(e) =>
                          handleDataChange(
                            section.key,
                            "ctaPrimaryLink",
                            e.target.value,
                          )
                        }
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                        Teks Tombol Kedua (CTA 2)
                      </label>
                      <input
                        type="text"
                        value={section.data?.ctaSecondaryText || ""}
                        onChange={(e) =>
                          handleDataChange(
                            section.key,
                            "ctaSecondaryText",
                            e.target.value,
                          )
                        }
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                        Tautan Tombol Kedua (Link 2)
                      </label>
                      <input
                        type="text"
                        value={section.data?.ctaSecondaryLink || ""}
                        onChange={(e) =>
                          handleDataChange(
                            section.key,
                            "ctaSecondaryLink",
                            e.target.value,
                          )
                        }
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ABOUT SECTION */}
              {section.key === "about" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                      Biografi Lengkap / Narasi Profil
                    </label>
                    <textarea
                      rows={5}
                      value={section.data?.bio || ""}
                      onChange={(e) =>
                        handleDataChange(section.key, "bio", e.target.value)
                      }
                      className={inputClasses}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                      Tech Stack / Skills
                    </label>
                    <SkillsManagerInput
                      skills={
                        Array.isArray(section.data?.skills)
                          ? section.data.skills
                          : typeof section.data?.skills === "string" && section.data.skills
                          ? (section.data.skills as string)
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          : []
                      }
                      onChange={(newSkills) =>
                        handleDataChange(section.key, "skills", newSkills)
                      }
                    />
                  </div>
                </div>
              )}

              {/* 3. SOCIALS SECTION */}
              {section.key === "socials" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                      Email Kontak
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={section.data?.email || ""}
                      onChange={(e) =>
                        handleDataChange(section.key, "email", e.target.value)
                      }
                      className={inputClasses}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                      URL GitHub
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={section.data?.github || ""}
                      onChange={(e) =>
                        handleDataChange(
                          section.key,
                          "github",
                          e.target.value,
                        )
                      }
                      className={inputClasses}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                      URL LinkedIn
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={section.data?.linkedin || ""}
                      onChange={(e) =>
                        handleDataChange(
                          section.key,
                          "linkedin",
                          e.target.value,
                        )
                      }
                      className={inputClasses}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* 4. FALLBACK SECTION */}
              {!["hero", "about", "socials"].includes(section.key) && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                    Konten Tambahan (JSON Data)
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={JSON.stringify(section.data, null, 2)}
                    onBlur={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setSections((prev) =>
                          prev.map((s) =>
                            s.key === section.key
                              ? { ...s, data: parsed }
                              : s,
                          ),
                        );
                      } catch {
                        alert("Format JSON tidak valid");
                      }
                    }}
                    className={`${inputClasses} font-mono`}
                    style={inputStyle}
                  />
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleUpdate(section.key, section)}
                disabled={savingKey === section.key}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all disabled:opacity-50 shadow-md"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--on-accent)",
                }}
              >
                {savingKey === section.key
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div
            className="p-8 text-center rounded-2xl border text-xs"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              color: "var(--color-muted)",
            }}
          >
            Tidak ada data section ditemukan. Pastikan seeder database sudah dijalankan.
          </div>
        )}
      </div>
    </div>
  );
}
