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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format email tidak valid." });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name,
      email,
      subject: subject || "No Subject",
      message,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ message: "Pesan berhasil dikirim.", data });
};

// Admin: Ambil semua pesan masuk
export const getMessagesAdmin = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ data });
};

// Admin: Tandai pesan sudah dibaca
export const markMessageRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_read } = req.body;

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: "Status pesan diperbarui.", data });
};

// Admin: Hapus pesan
export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: "Pesan berhasil dihapus." });
};
