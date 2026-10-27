import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Copy, Check, Mail, MessageSquare } from "lucide-react";
import { api } from "../lib/api";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("afatwahyudi@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/contact/send", { name, email, subject, message });
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || "Gagal mengirim pesan.");
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
    <section
      id="contact-form"
      className="py-16 sm:py-20 relative"
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      {/* Bento Container */}
      <div
        className="rounded-[20px] p-6 sm:p-10 transition-all duration-300 relative overflow-hidden border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--box-shadow)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Header Column */}
          <div className="md:col-span-5 space-y-4 min-w-0">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
              style={{
                background: "var(--badge-bg)",
                border: "1px solid var(--badge-border)",
                color: "var(--color-accent)",
              }}
            >
              <MessageSquare className="w-3 h-3" />
              INQUIRY & COLLABORATION
            </div>
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                color: "var(--color-ink)",
              }}
            >
              Let&apos;s Connect
            </h2>
            <p
              className="text-sm font-normal leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              Tertarik mendiskusikan peluang kerja sama proyek, konsultasi digitalisasi sistem, atau rekayasa aplikasi web? Kirimkan pesan melalui formulir ini.
            </p>

            {/* Direct Email Card */}
            <div className="pt-4 space-y-2">
              <span
                className="block text-xs font-mono uppercase tracking-wider"
                style={{ color: "var(--color-muted)" }}
              >
                Direct Channel
              </span>
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 cursor-pointer border active:scale-[0.99]"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                  color: "var(--color-ink)",
                }}
                title="Klik untuk menyalin alamat email"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                  <span className="truncate text-xs sm:text-sm font-mono font-medium">
                    afatwahyudi@gmail.com
                  </span>
                </div>
                <span
                  className="flex items-center gap-1 text-[11px] font-mono shrink-0 font-medium px-2.5 py-1 rounded-md transition-all border"
                  style={{
                    background: copied ? "var(--color-accent)" : "transparent",
                    borderColor: "var(--border-color)",
                    color: copied ? "var(--on-accent)" : "var(--color-muted)",
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Salin
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 min-w-0">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 min-h-[320px] border"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div
                  className="p-3 rounded-full"
                  style={{
                    background: "var(--badge-bg)",
                    color: "var(--color-accent)",
                  }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-ink)" }}
                >
                  Pesan Berhasil Terkirim!
                </h3>
                <p
                  className="text-sm max-w-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Terima kasih telah menghubungi saya. Pesan Anda telah tersimpan dan akan segera saya tanggapi.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-5 py-2 rounded-xl text-xs font-mono font-semibold transition-all border cursor-pointer"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                    color: "var(--color-ink)",
                  }}
                >
                  Kirim Pesan Lain
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div
                    className="p-3.5 rounded-xl text-xs border"
                    style={{
                      background: "var(--error-bg)",
                      borderColor: "var(--error-text)",
                      color: "var(--error-text)",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all"
                      style={inputStyle}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Alamat Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-mono"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Subjek Diskusi
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Peluang Kolaborasi / Proyek Website"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all"
                    style={inputStyle}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Isi Pesan
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pesan atau detail kebutuhan Anda..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all resize-y"
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 shadow-md"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--on-accent)",
                  }}
                >
                  {loading ? (
                    <span>Mengirimkan pesan...</span>
                  ) : (
                    <>
                      <span>Kirim Pesan Sekarang</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
