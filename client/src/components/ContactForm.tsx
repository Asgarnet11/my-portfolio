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
    navigator.clipboard.writeText("asgarfatwahyudi@gmail.com");
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
        className="rounded-[20px] p-6 sm:p-10 transition-all duration-300 relative overflow-hidden"
        style={{
          background: "var(--color-surface, #1A1B1E)",
          border: "1px solid var(--color-border, #27272A)",
          boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.7)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Header Column */}
          <div className="md:col-span-5 space-y-4 min-w-0">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
              style={{
                background: "rgba(0, 229, 89, 0.1)",
                border: "1px solid rgba(0, 229, 89, 0.3)",
                color: "var(--color-primary, #00E559)",
              }}
            >
              <MessageSquare className="w-3 h-3 text-[#00E559]" />
              INQUIRY
            </div>
            <h2
              className="text-2xl sm:text-3xl font-medium tracking-tight text-white"
              style={{
                fontFamily: "var(--font-heading, 'Inter', sans-serif)",
              }}
            >
              Let&apos;s Connect
            </h2>
            <p className="text-sm text-zinc-300 font-normal leading-relaxed">
              Tertarik berdiskusi mengenai proyek kolaborasi, rekayasa infrastruktur, arsitektur WebGL/3D, atau peluang baru? Kirimkan pesan melalui form ini.
            </p>

            {/* Direct Email Card */}
            <div className="pt-4 space-y-2">
              <span className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Direct Channel
              </span>
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 cursor-pointer hover:border-zinc-700 active:scale-[0.99]"
                style={{
                  background: "#09090B",
                  border: "1px solid var(--color-border, #27272A)",
                  color: "#FFFFFF",
                }}
                title="Klik untuk menyalin alamat email"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span className="truncate text-xs sm:text-sm font-mono text-zinc-300">
                    asgarfatwahyudi@gmail.com
                  </span>
                </div>
                <span
                  className="flex items-center gap-1 text-[11px] font-mono shrink-0 font-medium px-2 py-0.5 rounded-md transition-all"
                  style={{
                    background: copied ? "#00E559" : "rgba(255, 255, 255, 0.08)",
                    color: copied ? "#09090B" : "#D4D4D8",
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
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl space-y-3 bg-[#00E559]/10 border border-[#00E559]/30"
              >
                <div className="flex items-center gap-2 text-sm text-[#00E559] font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  Pesan Anda berhasil dikirim!
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  Terima kasih sudah menghubungi. Saya akan meninjau dan merespons pesan Anda secepatnya.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs text-[#00E559] underline underline-offset-4 hover:opacity-80 pt-2 cursor-pointer font-medium"
                >
                  Kirim pesan lain
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl text-xs bg-red-950/60 border border-red-800 text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-zinc-400">
                      Nama
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 text-white placeholder-zinc-600 focus:border-[#00E559]"
                      style={{
                        background: "#09090B",
                        border: "1px solid var(--color-border, #27272A)",
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-zinc-400">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 text-white placeholder-zinc-600 focus:border-[#00E559]"
                      style={{
                        background: "#09090B",
                        border: "1px solid var(--color-border, #27272A)",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-zinc-400">
                    Subjek
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Topik pembahasan atau penawaran"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 text-white placeholder-zinc-600 focus:border-[#00E559]"
                    style={{
                      background: "#09090B",
                      border: "1px solid var(--color-border, #27272A)",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-zinc-400">
                    Pesan
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan pesan Anda secara detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 text-white placeholder-zinc-600 focus:border-[#00E559] resize-none"
                    style={{
                      background: "#09090B",
                      border: "1px solid var(--color-border, #27272A)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-5 rounded-[20px] text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
                  style={{
                    background: "var(--color-primary, #00E559)",
                    color: "#09090B",
                    boxShadow: "0 0 20px rgba(0, 229, 89, 0.25)",
                  }}
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Mengirim..." : "Kirim Pesan"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
