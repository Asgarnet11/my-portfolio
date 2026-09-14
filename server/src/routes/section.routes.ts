import { Router } from "express";
import {
  getPublicSections,
  getAllSectionsAdmin,
  updateSection,
} from "../controllers/section.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/public", getPublicSections);

// Protected Admin
router.get("/admin", requireAuth, getAllSectionsAdmin);
router.put("/admin/:key", requireAuth, updateSection);

export default router;
