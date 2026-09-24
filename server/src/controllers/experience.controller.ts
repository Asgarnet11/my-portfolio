import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Public: Dapatkan riwayat karier yang dipublikasikan
export const getPublicExperiences = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("is_published", true)
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Gagal mengambil pengalaman publik:", error);
      return res.status(500).json({ error: "Gagal memuat data pengalaman kerja." });
    }
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Error internal getPublicExperiences:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Dapatkan semua riwayat karier
export const getAllExperiencesAdmin = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Gagal mengambil pengalaman admin:", error);
      return res.status(500).json({ error: "Gagal memuat data pengalaman kerja." });
    }
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Error internal getAllExperiencesAdmin:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Tambah data baru
export const createExperience = async (req: Request, res: Response) => {
  const {
    role,
    company,
    location,
    start_date,
    end_date,
    description,
    display_order,
    is_published,
  } = req.body;

  if (!role || !company || !start_date || !description) {
    return res
      .status(400)
      .json({ error: "Role, company, start date, dan deskripsi wajib diisi." });
  }

  if (end_date && new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({ error: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai." });
  }

  try {
    const { data, error } = await supabase
      .from("experiences")
      .insert({
        role,
        company,
        location: location || null,
        start_date,
        end_date: end_date || null,
        description,
        display_order: display_order || 0,
        is_published: is_published ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Gagal membuat pengalaman:", error);
      return res.status(500).json({ error: "Gagal menambahkan data pengalaman." });
    }
    return res
      .status(201)
      .json({ message: "Pengalaman berhasil ditambahkan.", data });
  } catch (err) {
    console.error("Error internal createExperience:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Update data
export const updateExperience = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { start_date, end_date } = req.body;

  if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({ error: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai." });
  }

  try {
    const updateData = { ...req.body, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from("experiences")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Gagal update pengalaman:", error);
      return res.status(500).json({ error: "Gagal memperbarui data pengalaman." });
    }
    return res
      .status(200)
      .json({ message: "Pengalaman berhasil diperbarui.", data });
  } catch (err) {
    console.error("Error internal updateExperience:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Hapus data
export const deleteExperience = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("experiences").delete().eq("id", id);

    if (error) {
      console.error("Gagal menghapus pengalaman:", error);
      return res.status(500).json({ error: "Gagal menghapus data pengalaman." });
    }
    return res.status(200).json({ message: "Pengalaman berhasil dihapus." });
  } catch (err) {
    console.error("Error internal deleteExperience:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};
