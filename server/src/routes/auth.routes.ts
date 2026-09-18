import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, checkAuthStatus } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,
  message: {
    error: "Terlalu banyak percobaan login yang gagal. Silakan coba lagi setelah 15 menit.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/me", requireAuth, checkAuthStatus);

export default router;
