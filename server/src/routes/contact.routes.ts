import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  sendMessage,
  getMessagesAdmin,
  markMessageRead,
  deleteMessage,
} from "../controllers/contact.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Terlalu banyak permintaan kontak. Silakan coba 15 menit lagi.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public
router.post("/send", contactLimiter, sendMessage);

// Admin
router.get("/admin", requireAuth, getMessagesAdmin);
router.patch("/admin/:id/read", requireAuth, markMessageRead);
router.delete("/admin/:id", requireAuth, deleteMessage);

export default router;
