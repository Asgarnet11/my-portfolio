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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-[#3A2E3D] bg-[#C9B8FF] px-4 sm:px-6 py-4 shadow-[6px_6px_0_#3A2E3D]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            Messages Inbox
          </h1>
          <p className="text-[10px] sm:text-xs mt-1 opacity-80">
            Daftar pesan masuk dari formulir kontak publik landing page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMessages()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs bg-[#FFF6EC] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#3A2E3D] active:translate-y-[3px] active:shadow-none transition-transform"
            title="Muat ulang"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <span className="text-[10px] sm:text-xs px-2.5 py-1.5 bg-[#FFD866] border-2 border-[#3A2E3D] shadow-[3px_3px_0_#3A2E3D] font-bold">
            {unreadCount} Baru
          </span>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="p-3 bg-[#B8E6D5] border-4 border-[#3A2E3D] text-[#3A2E3D] text-[10px] sm:text-xs shadow-[4px_4px_0_#3A2E3D] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#2C6B47]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-[10px] sm:text-xs border-2 border-[#3A2E3D] transition-transform ${
            filter === "all"
              ? "bg-[#FFD866] shadow-[3px_3px_0_#3A2E3D]"
              : "bg-white hover:bg-[#FFF6EC]"
          }`}
        >
          Semua ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 text-[10px] sm:text-xs border-2 border-[#3A2E3D] transition-transform ${
            filter === "unread"
              ? "bg-[#FFB4C6] shadow-[3px_3px_0_#3A2E3D]"
              : "bg-white hover:bg-[#FFF6EC]"
          }`}
        >
          Belum Dibaca ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-3 py-1.5 text-[10px] sm:text-xs border-2 border-[#3A2E3D] transition-transform ${
            filter === "read"
              ? "bg-[#B8E6D5] shadow-[3px_3px_0_#3A2E3D]"
              : "bg-white hover:bg-[#FFF6EC]"
          }`}
        >
          Sudah Dibaca ({messages.length - unreadCount})
        </button>
      </div>

      {/* Messages List */}
      {loading && messages.length === 0 ? (
        <div className="p-8 text-center border-4 border-[#3A2E3D] bg-white text-[10px] sm:text-xs shadow-[4px_4px_0_#3A2E3D]">
          Memuat pesan masuk...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 sm:p-5 border-4 border-[#3A2E3D] bg-white transition-shadow ${
                msg.is_read
                  ? "shadow-[3px_3px_0_#3A2E3D] opacity-80"
                  : "shadow-[6px_6px_0_#3A2E3D] ring-2 ring-[#FFD866]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-[#3A2E3D] pb-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold break-words">
                      {msg.name}
                    </span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-[10px] sm:text-xs underline opacity-80 hover:opacity-100"
                    >
                      &lt;{msg.email}&gt;
                    </a>
                    <span
                      className={`text-[9px] px-2 py-0.5 border-2 border-[#3A2E3D] font-bold ${
                        msg.is_read
                          ? "bg-[#FFF6EC] opacity-70"
                          : "bg-[#FFB4C6] animate-pulse"
                      }`}
                    >
                      {msg.is_read ? "SUDAH DIBACA" : "PESAN BARU"}
                    </span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] opacity-60">
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
                    className="p-2 bg-[#FFF6EC] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                  >
                    {msg.is_read ? (
                      <MailOpen className="w-3.5 h-3.5 text-[#3A2E3D]" />
                    ) : (
                      <Mail className="w-3.5 h-3.5 text-[#2C6B47]" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    title="Hapus pesan"
                    className="p-2 bg-[#FFB4C6] border-2 border-[#3A2E3D] shadow-[2px_2px_0_#3A2E3D] hover:translate-y-[1px] hover:shadow-none transition-transform"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#3A2E3D]" />
                  </button>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <div className="text-[11px] sm:text-xs font-bold text-[#74489D]">
                  Subjek: {msg.subject}
                </div>
                <p className="text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap break-words text-[#4A3B52] bg-[#FFF6EC] p-3 border-2 border-[#3A2E3D]">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="p-8 text-center border-4 border-dashed border-[#3A2E3D] bg-white text-[10px] sm:text-xs">
              Tidak ada pesan masuk pada kategori ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
