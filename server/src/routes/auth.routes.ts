import { Router } from "express";
import { login, logout, checkAuthStatus } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, checkAuthStatus);

export default router;
