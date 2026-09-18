/// <reference types="multer" />
import { Router, Request, Response } from "express";
import multer from "multer";
import { supabase } from "../config/supabase";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung. Harap unggah gambar JPG, PNG, WEBP, atau GIF."));
    }
  },
});

router.post(
  "/",
  requireAuth,
  (req: Request, res: Response, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "Ukuran file terlalu besar. Maksimal 5MB." });
        }
        return res.status(400).json({ error: `Gagal upload: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "File gambar wajib diunggah." });
      }

      const safeExt = ALLOWED_MIME_TYPES[file.mimetype] || "png";
      const fileName = `projects/${Date.now()}-${Math.round(Math.random() * 1e9)}.${safeExt}`;

      const { error } = await supabase.storage
        .from("portfolio-assets")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error("Gagal upload aset ke Supabase Storage:", error);
        return res.status(500).json({ error: "Gagal menyimpan berkas ke cloud storage." });
      }

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(fileName);

      return res.status(200).json({
        message: "Upload berhasil",
        url: publicUrlData.publicUrl,
      });
    } catch (err) {
      console.error("Kesalahan saat memproses upload:", err);
      return res.status(500).json({ error: "Gagal memproses gambar." });
    }
  },
);

export default router;
