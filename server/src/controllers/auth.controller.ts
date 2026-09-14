import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

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

  const secret = process.env.JWT_SECRET || "fallback_secret";
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
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("admin_token");
  return res.status(200).json({ message: "Logout berhasil" });
};

export const checkAuthStatus = async (req: any, res: Response) => {
  const { data: user } = await supabase
    .from("users")
    .select("id, email, name")
    .eq("id", req.userId)
    .single();

  if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
  return res.status(200).json({ user });
};
