import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("CRITICAL: JWT_SECRET belum dikonfigurasi di server!");
      return res.status(500).json({ error: "Konfigurasi otentikasi internal belum lengkap" });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    // Simpan di HTTP-only cookie untuk keamanan
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    return res.status(200).json({
      message: "Login berhasil",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Kesalahan saat proses login:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server saat login" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("admin_token");
  return res.status(200).json({ message: "Logout berhasil" });
};

export const checkAuthStatus = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized: Sesi tidak valid" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", req.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Kesalahan saat cek status auth:", err);
    return res.status(500).json({ error: "Gagal memverifikasi status login" });
  }
};
