import bcrypt from "bcrypt";
import { supabase } from "../config/supabase";

interface SectionSeed {
  key: string;
  title: string;
  subtitle: string;
  data: Record<string, unknown>;
  display_order: number;
  is_active: boolean;
}

async function seed() {
  console.log("Seeding initial data...");

  // 1. Seed Akun Admin
  const adminEmail = "admin@example.com";
  const rawPassword = "adminpassword123"; // Ganti sesuai kebutuhan
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", adminEmail)
    .single();

  if (!existingUser) {
    const { error: userError } = await supabase.from("users").insert({
      email: adminEmail,
      password_hash: passwordHash,
      name: "Site Administrator",
    });

    if (userError) console.error("Gagal seed user:", userError.message);
    else
      console.log(
        `Admin user dibuat -> Email: ${adminEmail} | Password: ${rawPassword}`,
      );
  }

  // 2. Seed Default Sections (diberi tipe SectionSeed[])
  const defaultSections: SectionSeed[] = [
    {
      key: "hero",
      title: "Hi, I am a Developer",
      subtitle: "Building clean backends and responsive user interfaces.",
      data: {
        statusBadge: "Available for new opportunities",
        ctaPrimaryText: "View Projects",
        ctaPrimaryLink: "#projects",
        ctaSecondaryText: "Contact Me",
        ctaSecondaryLink: "#contact",
      },
      display_order: 1,
      is_active: true,
    },
    {
      key: "about",
      title: "About Me",
      subtitle: "Crafting software with care and intentionality.",
      data: {
        bio: "Focused on creating modern web systems with solid architecture, performant databases, and reliable APIs.",
        skills: [
          "TypeScript",
          "Express.js",
          "PostgreSQL",
          "React",
          "Tailwind CSS",
        ],
      },
      display_order: 2,
      is_active: true,
    },
    {
      key: "socials",
      title: "Connect",
      subtitle: "Find me on the web",
      data: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "your-email@example.com",
      },
      display_order: 3,
      is_active: true,
    },
  ];

  for (const sec of defaultSections) {
    const { error } = await supabase
      .from("site_sections")
      .upsert(sec as any, { onConflict: "key" });

    if (error) console.error(`Gagal seed section ${sec.key}:`, error.message);
  }

  console.log("Seeding selesai!");
}

seed();
