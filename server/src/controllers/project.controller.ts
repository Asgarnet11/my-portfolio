import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Public: Ambil daftar proyek aktif
export const getPublicProjects = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ data });
};

// Admin: Ambil semua proyek
export const getAllProjectsAdmin = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ data });
};

// Admin: Tambah proyek baru
export const createProject = async (req: Request, res: Response) => {
  const {
    title,
    slug,
    summary,
    cover_image,
    tech_stack,
    live_url,
    repo_url,
    case_study,
    display_order,
    is_featured,
    is_published,
  } = req.body;

  if (!title || !slug || !summary) {
    return res
      .status(400)
      .json({ error: "Title, slug, dan summary wajib diisi" });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title,
      slug,
      summary,
      cover_image,
      tech_stack: tech_stack || [],
      live_url,
      repo_url,
      case_study,
      display_order: display_order || 0,
      is_featured: is_featured || false,
      is_published: is_published ?? true,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ message: "Proyek berhasil dibuat", data });
};

// Admin: Update proyek
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: "Proyek berhasil diperbarui", data });
};

// Admin: Hapus proyek
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: "Proyek berhasil dihapus" });
};
