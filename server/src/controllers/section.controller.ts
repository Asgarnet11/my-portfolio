import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Public: Dapatkan semua section untuk landing page
export const getPublicSections = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("site_sections")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ data });
};

// Admin: Dapatkan semua section (termasuk yang inactive)
export const getAllSectionsAdmin = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("site_sections")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ data });
};

// Admin: Update konfigurasi per section (Hero, About, dll)
export const updateSection = async (req: Request, res: Response) => {
  const { key } = req.params;
  const { title, subtitle, data, display_order, is_active } = req.body;

  const { data: updated, error } = await supabase
    .from("site_sections")
    .update({
      title,
      subtitle,
      data,
      display_order,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res
    .status(200)
    .json({ message: "Section berhasil diperbarui", data: updated });
};
