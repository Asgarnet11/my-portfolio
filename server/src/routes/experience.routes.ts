import { Router } from "express";
import {
  getPublicExperiences,
  getAllExperiencesAdmin,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/public", getPublicExperiences);

// Protected Admin
router.get("/admin", requireAuth, getAllExperiencesAdmin);
router.post("/admin", requireAuth, createExperience);
router.put("/admin/:id", requireAuth, updateExperience);
router.delete("/admin/:id", requireAuth, deleteExperience);

export default router;
