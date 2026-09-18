import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// Public: Dapatkan semua section untuk landing page
export const getPublicSections = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("site_sections")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Gagal mengambil section publik:", error);
      return res.status(500).json({ error: "Gagal memuat konten situs." });
    }
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Error internal getPublicSections:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Dapatkan semua section (termasuk yang inactive)
export const getAllSectionsAdmin = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("site_sections")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Gagal mengambil section admin:", error);
      return res.status(500).json({ error: "Gagal memuat konten situs." });
    }
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Error internal getAllSectionsAdmin:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// Admin: Update konfigurasi per section (Hero, About, dll)
export const updateSection = async (req: Request, res: Response) => {
  const { key } = req.params;
  const { title, subtitle, data, display_order, is_active } = req.body;

  try {
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

    if (error) {
      console.error("Gagal memperbarui section:", error);
      return res.status(500).json({ error: "Gagal memperbarui pengaturan section." });
    }
    return res
      .status(200)
      .json({ message: "Section berhasil diperbarui", data: updated });
  } catch (err) {
    console.error("Error internal updateSection:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};
