import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";

const PIXEL_FONT = "'Press Start 2P', monospace";
const INK = "#4A3B52";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "13px",
  background: "#FFF6E9",
  border: `3px solid ${INK}`,
  outline: "none",
  color: INK,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: PIXEL_FONT,
  fontSize: "9px",
  color: "#8A7A93",
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
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact-form"
      className="py-20 border-b-4"
      style={{ borderColor: INK }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-3">
          <span
            className="inline-block text-[10px] px-2 py-1"
            style={{
              fontFamily: PIXEL_FONT,
              color: INK,
              background: "#D6C9F5",
              border: `3px solid ${INK}`,
              boxShadow: `3px 3px 0 0 ${INK}`,
            }}
          >
            Inquiry
          </span>
          <h2
            style={{
              fontFamily: PIXEL_FONT,
              color: INK,
              fontSize: "20px",
              lineHeight: 1.6,
            }}
          >
            Let&apos;s Connect
          </h2>
          <p
            className="text-sm leading-relaxed font-normal"
            style={{ color: "#8A7A93" }}
          >
            Punya ide proyek, tawaran kolaborasi, atau sekadar ingin menyapa?
            Kirimkan pesan melalui form ini.
          </p>
        </div>

        <div className="md:col-span-7">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: "easeOut" }}
              className="p-6 space-y-3"
              style={{
                background: "#E3F5E9",
                border: `3px solid ${INK}`,
                boxShadow: `4px 4px 0 0 ${INK}`,
              }}
            >
              <div
                className="flex items-center gap-2 text-sm"
                style={{
                  color: "#3B8A5C",
                  fontFamily: PIXEL_FONT,
                  fontSize: "11px",
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Pesan terkirim dengan aman!
              </div>
              <p className="text-xs" style={{ color: "#8A7A93" }}>
                Terima kasih sudah menghubungi. Saya akan merespons sesegera
                mungkin.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs pt-2"
                style={{
                  fontFamily: PIXEL_FONT,
                  fontSize: "9px",
                  color: "#3B8A5C",
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
                  className="p-3 text-xs"
                  style={{
                    color: "#B24B5E",
                    background: "#FBE4E8",
                    border: `3px solid ${INK}`,
                  }}
                >
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Nama</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Subjek (Opsional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Pesan</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs disabled:opacity-50"
                style={{
                  fontFamily: PIXEL_FONT,
                  fontSize: "10px",
                  color: INK,
                  background: "#FFD873",
                  border: `3px solid ${INK}`,
                  boxShadow: loading ? "none" : `3px 3px 0 0 ${INK}`,
                  transform: loading ? "translate(3px,3px)" : "translate(0,0)",
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
