import { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { Trash2, Mail, MailOpen, Check, RefreshCw } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [toast, setToast] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get("/contact/admin");
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil pesan:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await api.get("/contact/admin");
        if (isMounted) setMessages(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil pesan:", err);
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

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/contact/admin/${id}/read`, { is_read: !currentStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentStatus } : m)),
      );
      showToast(currentStatus ? "Pesan ditandai belum dibaca" : "Pesan ditandai sudah dibaca");
    } catch {
      alert("Gagal mengubah status pesan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini secara permanen?")) return;
    try {
      await api.delete(`/contact/admin/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Pesan berhasil dihapus");
    } catch {
      alert("Gagal menghapus pesan.");
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
            Messages Inbox
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            Daftar pesan masuk dari formulir kontak publik landing page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchMessages()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl border transition-all cursor-pointer font-medium hover:opacity-80 shrink-0"
            style={{
              backgroundColor: "var(--bg-surface-elevated)",
              borderColor: "var(--border-color)",
              color: "var(--color-ink)",
            }}
            title="Muat ulang pesan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border shrink-0"
            style={{
              backgroundColor: unreadCount > 0 ? "var(--badge-bg)" : "var(--bg-surface-elevated)",
              borderColor: unreadCount > 0 ? "var(--badge-border)" : "var(--border-color)",
              color: unreadCount > 0 ? "var(--color-accent)" : "var(--color-muted)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: unreadCount > 0 ? "var(--badge-dot)" : "var(--color-muted)",
              }}
            />
            {unreadCount} Baru
          </span>
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className="px-3.5 py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-medium"
          style={{
            backgroundColor: filter === "all" ? "var(--color-primary)" : "var(--bg-surface)",
            borderColor: filter === "all" ? "var(--color-primary)" : "var(--border-color)",
            color: filter === "all" ? "var(--on-accent)" : "var(--color-muted)",
          }}
        >
          Semua ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className="px-3.5 py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-medium"
          style={{
            backgroundColor: filter === "unread" ? "var(--color-primary)" : "var(--bg-surface)",
            borderColor: filter === "unread" ? "var(--color-primary)" : "var(--border-color)",
            color: filter === "unread" ? "var(--on-accent)" : "var(--color-muted)",
          }}
        >
          Belum Dibaca ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          className="px-3.5 py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-medium"
          style={{
            backgroundColor: filter === "read" ? "var(--color-primary)" : "var(--bg-surface)",
            borderColor: filter === "read" ? "var(--color-primary)" : "var(--border-color)",
            color: filter === "read" ? "var(--on-accent)" : "var(--color-muted)",
          }}
        >
          Sudah Dibaca ({messages.length - unreadCount})
        </button>
      </div>

      {/* Messages List */}
      {loading && messages.length === 0 ? (
        <div
          className="p-8 text-center rounded-2xl border text-xs"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--color-muted)",
          }}
        >
          Memuat pesan masuk...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 sm:p-6 rounded-2xl border transition-all shadow-xs"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: msg.is_read ? "var(--border-color)" : "var(--badge-border)",
                boxShadow: msg.is_read ? "none" : "0 0 0 1px var(--badge-border)",
              }}
            >
              <div
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b pb-3.5"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-xs sm:text-sm font-semibold break-words"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {msg.name}
                    </span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs font-mono transition-opacity opacity-75 hover:opacity-100"
                      style={{ color: "var(--color-accent)" }}
                    >
                      &lt;{msg.email}&gt;
                    </a>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-medium"
                      style={{
                        backgroundColor: msg.is_read
                          ? "var(--bg-surface-elevated)"
                          : "var(--badge-bg)",
                        borderColor: msg.is_read
                          ? "var(--border-color)"
                          : "var(--badge-border)",
                        color: msg.is_read ? "var(--color-muted)" : "var(--color-accent)",
                      }}
                    >
                      {msg.is_read ? "SUDAH DIBACA" : "PESAN BARU"}
                    </span>
                  </div>
                  <div
                    className="text-xs font-mono"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {new Date(msg.created_at).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleReadStatus(msg.id, msg.is_read)}
                    title={msg.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                    className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                    style={{
                      backgroundColor: "var(--bg-surface-elevated)",
                      borderColor: "var(--border-color)",
                      color: "var(--color-ink)",
                    }}
                  >
                    {msg.is_read ? (
                      <MailOpen className="w-3.5 h-3.5" />
                    ) : (
                      <Mail className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    title="Hapus pesan"
                    className="p-2 rounded-xl border transition-all cursor-pointer hover:opacity-80"
                    style={{
                      backgroundColor: "var(--error-bg)",
                      borderColor: "var(--border-color)",
                      color: "var(--error-text)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-3.5 space-y-2">
                <div
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-accent)" }}
                >
                  Subjek: {msg.subject}
                </div>
                <p
                  className="text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap break-words p-4 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-surface-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--color-ink)",
                  }}
                >
                  {msg.message}
                </p>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div
              className="p-8 text-center border border-dashed rounded-2xl text-xs"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--color-muted)",
              }}
            >
              Tidak ada pesan masuk pada kategori ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
