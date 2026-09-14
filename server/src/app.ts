import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import sectionRoutes from "./routes/section.routes";
import projectRoutes from "./routes/project.routes";
import contactRoutes from "./routes/contact.routes";
import experienceRoutes from "./routes/experience.routes";
import uploadRoutes from "./routes/upload.routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sections", sectionRoutes);

app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/experiences", experienceRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Health check
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
