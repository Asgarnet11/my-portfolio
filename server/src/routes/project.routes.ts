import { Router } from "express";
import {
  getPublicProjects,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/public", getPublicProjects);

// Protected Admin
router.get("/admin", requireAuth, getAllProjectsAdmin);
router.post("/admin", requireAuth, createProject);
router.put("/admin/:id", requireAuth, updateProject);
router.delete("/admin/:id", requireAuth, deleteProject);

export default router;
