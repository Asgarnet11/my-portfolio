/// <reference types="multer" />
import { Router, Request, Response } from "express";
import multer from "multer";
import { supabase } from "../config/supabase";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/",
  requireAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "File gambar wajib diunggah." });
      }

      const ext = file.originalname.split(".").pop();
      const fileName = `projects/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

      const { error } = await supabase.storage
        .from("portfolio-assets")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(fileName);

      return res.status(200).json({
        message: "Upload berhasil",
        url: publicUrlData.publicUrl,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: err.message || "Gagal memproses gambar." });
    }
  },
);

export default router;
