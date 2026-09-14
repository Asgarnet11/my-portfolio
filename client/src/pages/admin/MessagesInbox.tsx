import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Trash2, Mail, MailOpen } from "lucide-react";

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

  const fetchMessages = async () => {
    try {
      const res = await api.get("/contact/admin");
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil pesan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/contact/admin/${id}/read`, { is_read: !currentStatus });
      fetchMessages();
    } catch {
      alert("Gagal mengubah status pesan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    try {
      await api.delete(`/contact/admin/${id}`);
      fetchMessages();
    } catch {
      alert("Gagal menghapus pesan.");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages Inbox</h1>
          <div className="flex gap-4 text-xs text-zinc-400 mt-1">
            <Link to="/admin/customizer" className="hover:text-zinc-200">
              ← Site Customizer
            </Link>
            <Link to="/admin/projects" className="hover:text-zinc-200">
              Projects Manager
            </Link>
          </div>
        </div>
        <span className="font-mono text-xs text-zinc-500">
          Total: {messages.length} Pesan
        </span>
      </header>

      {loading ? (
        <div className="text-zinc-500 font-mono text-xs">Memuat inbox...</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border transition-all ${
                msg.is_read
                  ? "border-zinc-900 bg-zinc-900/20 text-zinc-400"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-100"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-sm">{msg.name}</span>{" "}
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-mono text-zinc-400 hover:underline"
                  >
                    &lt;{msg.email}&gt;
                  </a>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    {new Date(msg.created_at).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReadStatus(msg.id, msg.is_read)}
                    title={
                      msg.is_read
                        ? "Tandai belum dibaca"
                        : "Tandai sudah dibaca"
                    }
                    className="p-1.5 hover:text-white text-zinc-400 transition-colors"
                  >
                    {msg.is_read ? (
                      <MailOpen className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 hover:text-rose-400 text-zinc-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="font-mono text-xs text-zinc-300 mb-2 font-medium">
                Subjek: {msg.subject}
              </div>

              <p className="text-sm font-normal whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-xs font-mono">
              Inbox masih kosong. Belum ada pesan masuk.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
