import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "13px",
  background: "var(--bg-primary, #FFF6E9)",
  border: "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
  borderRadius: "var(--border-radius, 0px)",
  outline: "none",
  color: "var(--color-ink, #4A3B52)",
  fontFamily: "var(--font-body, monospace)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-heading, monospace)",
  fontSize: "9px",
  color: "var(--color-muted, #504159)",
  marginBottom: "8px",
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
      className="py-14 sm:py-20 border-b-4 transition-colors duration-300"
      style={{ borderColor: "var(--color-ink, #4A3B52)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
        <div className="md:col-span-5 space-y-3 min-w-0">
          {/* bg-accent is a light/dark neutral in every theme, safe with
              --color-ink text on top — unlike --bg-secondary below. */}
          <span
            className="inline-block text-[9px] sm:text-[10px] px-2 py-1"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              background: "var(--bg-accent, #D6C9F5)",
              border:
                "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
              boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
              borderRadius: "var(--border-radius, 0px)",
            }}
          >
            Inquiry
          </span>
          <h2
            className="break-words"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              fontSize: "clamp(16px, 4vw, 20px)",
              lineHeight: 1.6,
            }}
          >
            Let&apos;s Connect
          </h2>
          <p
            className="text-sm leading-relaxed font-normal"
            style={{
              fontFamily: "var(--font-body, monospace)",
              color: "var(--color-muted, #504159)",
            }}
          >
            Punya ide proyek, tawaran kolaborasi, atau sekadar ingin menyapa?
            Kirimkan pesan melalui form ini.
          </p>
        </div>

        <div className="md:col-span-7 min-w-0">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: "easeOut" }}
              className="p-5 sm:p-6 space-y-3"
              style={{
                background: "var(--badge-bg, #E3F5E9)",
                border:
                  "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                boxShadow: "var(--box-shadow-lg, 4px 4px 0 0 #4A3B52)",
                borderRadius: "var(--border-radius, 0px)",
              }}
            >
              <div
                className="flex items-center gap-2 text-sm"
                style={{
                  color: "var(--badge-dot, #2C6B47)",
                  fontFamily: "var(--font-heading, monospace)",
                  fontSize: "11px",
                }}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Pesan terkirim dengan aman!
              </div>
              <p
                className="text-xs"
                style={{
                  fontFamily: "var(--font-body, monospace)",
                  color: "var(--color-muted, #504159)",
                }}
              >
                Terima kasih sudah menghubungi. Saya akan merespons sesegera
                mungkin.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs pt-2"
                style={{
                  fontFamily: "var(--font-heading, monospace)",
                  fontSize: "9px",
                  color: "var(--badge-dot, #2C6B47)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Kirim pesan lain
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  className="p-3 text-xs break-words"
                  style={{
                    color: "var(--error-text, #8E2B3D)",
                    background: "var(--error-bg, #FBE4E8)",
                    border:
                      "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                    borderRadius: "var(--border-radius, 0px)",
                    fontFamily: "var(--font-body, monospace)",
                  }}
                >
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>
                    Nama
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" style={labelStyle}>
                  Subjek (Opsional)
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label htmlFor="contact-message" style={labelStyle}>
                  Pesan
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              {/* Same --bg-secondary fill as the Hero primary button and
                  the About "Background" badge — text must use --on-accent
                  so it stays readable in the terminal theme (neon-on-neon
                  otherwise). */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs disabled:opacity-50 transition-all"
                style={{
                  fontFamily: "var(--font-heading, monospace)",
                  fontSize: "10px",
                  color: "var(--on-accent, #4A3B52)",
                  background: "var(--bg-secondary, #FFD873)",
                  border:
                    "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                  boxShadow: loading
                    ? "none"
                    : "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
                  transform: loading ? "translate(2px,2px)" : "translate(0,0)",
                  borderRadius: "var(--border-radius, 0px)",
                  cursor: loading ? "default" : "pointer",
                }}
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
