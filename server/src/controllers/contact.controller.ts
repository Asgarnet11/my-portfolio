import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Public: Kirim pesan baru
export const sendMessage = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Nama, email, dan pesan wajib diisi." });
  }

  if (typeof name !== "string" || name.trim().length > 100) {
    return res.status(400).json({ error: "Nama terlalu panjang (maksimal 100 karakter)." });
  }

  if (typeof email !== "string" || email.length > 150) {
    return res.status(400).json({ error: "Email tidak valid atau terlalu panjang." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Format email tidak valid." });
  }

  if (subject && (typeof subject !== "string" || subject.length > 200)) {
    return res.status(400).json({ error: "Subjek terlalu panjang (maksimal 200 karakter)." });
  }

  if (typeof message !== "string" || message.trim().length > 3000) {
    return res.status(400).json({ error: "Pesan terlalu panjang (maksimal 3000 karakter)." });
  }

  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: (subject ? subject.trim() : "No Subject"),
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Gagal menyimpan pesan kontak:", error);
      return res.status(500).json({ error: "Gagal mengirim pesan, silakan coba lagi." });
    }
    return res.status(201).json({ message: "Pesan berhasil dikirim.", data });
  } catch (err) {
    console.error("Error internal sendMessage:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server saat mengirim pesan." });
  }
};

// Admin: Ambil semua pesan masuk
export const getMessagesAdmin = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil pesan admin:", error);
      return res.status(500).json({ error: "Gagal memuat daftar pesan." });
    }
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Error internal getMessagesAdmin:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Tandai pesan sudah dibaca
export const markMessageRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_read } = req.body;

  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: Boolean(is_read) })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Gagal update status baca pesan:", error);
      return res.status(500).json({ error: "Gagal memperbarui status pesan." });
    }
    return res.status(200).json({ message: "Status pesan diperbarui.", data });
  } catch (err) {
    console.error("Error internal markMessageRead:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Hapus pesan
export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Gagal menghapus pesan:", error);
      return res.status(500).json({ error: "Gagal menghapus pesan." });
    }
    return res.status(200).json({ message: "Pesan berhasil dihapus." });
  } catch (err) {
    console.error("Error internal deleteMessage:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};
