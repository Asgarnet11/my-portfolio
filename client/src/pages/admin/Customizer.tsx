import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Upload, X, User, FileText, Share2, Sliders } from "lucide-react";

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  data: any;
  is_active: boolean;
}

const getSectionIcon = (key: string) => {
  switch (key) {
    case "hero":
      return <User className="w-3 h-3" />;
    case "about":
      return <FileText className="w-3 h-3" />;
    case "socials":
      return <Share2 className="w-3 h-3" />;
    default:
      return <Sliders className="w-3 h-3" />;
  }
};

export default function Customizer() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { logout } = useAuth();

  const fetchSections = async () => {
    try {
      const res = await api.get("/sections/admin");
      setSections(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
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

  const handleDataChange = (key: string, dataKey: string, val: any) => {
    setSections((prev) =>
      prev.map((s) =>
        s.key === key
          ? {
              ...s,
              data: {
                ...(s.data || {}),
                [dataKey]: val,
              },
            }
          : s,
      ),
    );
  };

  const handleAvatarUpload = async (key: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploadingKey(key);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleDataChange(key, "avatarUrl", res.data.url);
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal mengunggah foto profil");
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
    "w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF6EC] border-2 border-[#3A2E3D] focus:outline-none focus:shadow-[3px_3px_0_#3A2E3D] transition-shadow";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF6EC] text-[#3A2E3D] p-8 font-pixel text-xs flex items-center justify-center">
        <div className="border-4 border-[#3A2E3D] bg-[#FFD866] px-6 py-4 shadow-[6px_6px_0_#3A2E3D]">
          Memuat editor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6EC] font-pixel text-[#3A2E3D] p-4 sm:p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-[#3A2E3D] bg-[#C9B8FF] px-4 sm:px-6 py-4 shadow-[6px_6px_0_#3A2E3D]">
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              Site Customizer
            </h1>
            <p className="text-[10px] sm:text-xs mt-1 opacity-80">
              Atur semua teks dan elemen tampilan landing page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/admin/projects"
              className="text-[10px] sm:text-xs px-2.5 py-1.5 bg-[#FFF6EC] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] transition-transform"
            >
              Projects
            </Link>
            <Link
              to="/admin/messages"
              className="text-[10px] sm:text-xs px-2.5 py-1.5 bg-[#FFF6EC] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] transition-transform"
            >
              Inbox
            </Link>
            <button
              onClick={logout}
              className="text-[10px] sm:text-xs px-2.5 py-1.5 bg-[#FFB4C6] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] transition-transform"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Toast */}
        {toast && (
          <div className="p-3 bg-[#B8E6D5] border-4 border-[#3A2E3D] text-[#3A2E3D] text-[10px] sm:text-xs shadow-[4px_4px_0_#3A2E3D]">
            {toast}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-5 md:space-y-6">
          {sections.map((section) => (
            <div
              key={section.key}
              className="p-4 sm:p-6 border-4 border-[#3A2E3D] bg-white space-y-5 shadow-[6px_6px_0_#3A2E3D]"
            >
              <div className="flex flex-wrap justify-between items-center gap-3 border-b-2 border-[#3A2E3D] pb-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase px-2.5 py-1 bg-[#FFD866] border-2 border-[#3A2E3D] font-bold shadow-[2px_2px_0_#3A2E3D]">
                  {getSectionIcon(section.key)}
                  <span>{section.key}</span>
                </span>
                <label className="flex items-center gap-2 text-[10px] sm:text-xs cursor-pointer">
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
                    className="w-4 h-4 accent-[#3A2E3D]"
                  />
                  Tampilkan di Public
                </label>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                    Title / Headline
                  </label>
                  <input
                    type="text"
                    value={section.title || ""}
                    onChange={(e) =>
                      handleFieldChange(section.key, "title", e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={section.subtitle || ""}
                    onChange={(e) =>
                      handleFieldChange(section.key, "subtitle", e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Dynamic Field Forms Berdasarkan Key */}
              <div className="border-t-4 border-[#3A2E3D] pt-4 space-y-4">
                {/* 1. HERO SECTION */}
                {section.key === "hero" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                        Status Badge
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
                      />
                    </div>

                    {/* Foto Profil / Avatar */}
                    <div className="space-y-2">
                      <label className="block text-[10px] sm:text-xs opacity-70">
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
                          className={`flex items-center gap-2 px-3 py-2 bg-[#B8E6D5] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] text-[10px] sm:text-xs cursor-pointer hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] transition-transform shrink-0 ${
                            uploadingKey === section.key
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {uploadingKey === section.key
                            ? "Mengunggah..."
                            : "Upload Foto"}
                        </label>

                        <span className="text-[10px] sm:text-xs opacity-60">
                          atau URL:
                        </span>

                        <input
                          type="text"
                          placeholder="https://... / link gambar avatar"
                          value={section.data?.avatarUrl || ""}
                          onChange={(e) =>
                            handleDataChange(
                              section.key,
                              "avatarUrl",
                              e.target.value,
                            )
                          }
                          className={`flex-1 ${inputClasses}`}
                        />

                        {section.data?.avatarUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDataChange(section.key, "avatarUrl", "")
                            }
                            className="p-2 bg-[#FFB4C6] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform shrink-0"
                            title="Hapus foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {section.data?.avatarUrl && (
                        <div className="w-20 h-20 border-2 border-[#3A2E3D] bg-[#FFF6EC] overflow-hidden mt-2 shadow-[3px_3px_0_#3A2E3D]">
                          <img
                            src={section.data.avatarUrl}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ABOUT SECTION */}
                {section.key === "about" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                        Biografi Lengkap / Narasi
                      </label>
                      <textarea
                        rows={4}
                        value={section.data?.bio || ""}
                        onChange={(e) =>
                          handleDataChange(section.key, "bio", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
                        Tech Stack / Skills (pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        placeholder="TypeScript, Express.js, PostgreSQL, React, Tailwind CSS"
                        value={
                          Array.isArray(section.data?.skills)
                            ? section.data.skills.join(", ")
                            : section.data?.skills || ""
                        }
                        onChange={(e) => {
                          const arr = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          handleDataChange(section.key, "skills", arr);
                        }}
                        className={inputClasses}
                      />
                    </div>
                  </div>
                )}

                {/* 3. SOCIALS SECTION */}
                {section.key === "socials" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                      />
                    </div>
                  </div>
                )}

                {/* 4. FALLBACK SECTION */}
                {!["hero", "about", "socials"].includes(section.key) && (
                  <div>
                    <label className="block text-[10px] sm:text-xs mb-1 opacity-70">
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
                  className="px-4 py-2 text-[10px] sm:text-xs bg-[#B8E6D5] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_#3A2E3D] transition-transform font-bold"
                >
                  {savingKey === section.key
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="p-8 text-center border-4 border-dashed border-[#3A2E3D] text-[#3A2E3D] text-[10px] sm:text-xs bg-white">
              Tidak ada data section ditemukan. Pastikan seeder database sudah
              dijalankan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
