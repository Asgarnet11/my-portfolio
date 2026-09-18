import { Request, Response } from "express";
import { supabase } from "../config/supabase";

const isSafeUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("#") || trimmed.startsWith("/");
};

// Public: Ambil daftar proyek aktif
export const getPublicProjects = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Gagal mengambil proyek publik:", error);
      return res.status(500).json({ error: "Gagal memuat data proyek" });
    }
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Error internal getPublicProjects:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Admin: Ambil semua proyek
export const getAllProjectsAdmin = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Gagal mengambil proyek admin:", error);
      return res.status(500).json({ error: "Gagal memuat data proyek" });
    }
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Error internal getAllProjectsAdmin:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
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

  if (!isSafeUrl(live_url) || !isSafeUrl(repo_url) || !isSafeUrl(cover_image)) {
    return res.status(400).json({ error: "Tautan URL tidak valid atau menggunakan protokol berbahaya" });
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        title,
        slug,
        summary,
        cover_image: cover_image || null,
        tech_stack: tech_stack || [],
        live_url: live_url || null,
        repo_url: repo_url || null,
        case_study: case_study || null,
        display_order: display_order || 0,
        is_featured: is_featured || false,
        is_published: is_published ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Gagal membuat proyek:", error);
      return res.status(500).json({ error: "Gagal menyimpan proyek baru" });
    }
    return res.status(201).json({ message: "Proyek berhasil dibuat", data });
  } catch (err) {
    console.error("Error internal createProject:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Admin: Update proyek
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { live_url, repo_url, cover_image } = req.body;

  if (!isSafeUrl(live_url) || !isSafeUrl(repo_url) || !isSafeUrl(cover_image)) {
    return res.status(400).json({ error: "Tautan URL tidak valid atau menggunakan protokol berbahaya" });
  }

  try {
    const updateData = { ...req.body, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Gagal memperbarui proyek:", error);
      return res.status(500).json({ error: "Gagal memperbarui proyek" });
    }
    return res.status(200).json({ message: "Proyek berhasil diperbarui", data });
  } catch (err) {
    console.error("Error internal updateProject:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Admin: Hapus proyek
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Gagal menghapus proyek:", error);
      return res.status(500).json({ error: "Gagal menghapus proyek" });
    }
    return res.status(200).json({ message: "Proyek berhasil dihapus" });
  } catch (err) {
    console.error("Error internal deleteProject:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
