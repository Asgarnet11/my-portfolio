import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Public: Dapatkan riwayat karier yang dipublikasikan
export const getPublicExperiences = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_published", true)
    .order("start_date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ data });
};

// Admin: Dapatkan semua riwayat karier
export const getAllExperiencesAdmin = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ data });
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

  if (error) return res.status(500).json({ error: error.message });
  return res
    .status(201)
    .json({ message: "Pengalaman berhasil ditambahkan.", data });
};

// Admin: Update data
export const updateExperience = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from("experiences")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res
    .status(200)
    .json({ message: "Pengalaman berhasil diperbarui.", data });
};

// Admin: Hapus data
export const deleteExperience = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: "Pengalaman berhasil dihapus." });
};
