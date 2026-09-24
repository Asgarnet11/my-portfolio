import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { supabase } from "../config/supabase";

async function seedAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL || "afatwahyudi@gmail.com";
  const password = args[1] || process.env.ADMIN_PASSWORD;
  const name = args[2] || process.env.ADMIN_NAME || "Muh Asgar Fatwahyudi";

  if (!password) {
    console.error("Error: Password admin wajib ditentukan!");
    console.log(
      "Format: npm run seed:admin -- <email> <password> [name]",
    );
    console.log("Contoh: npm run seed:admin -- afatwahyudi@gmail.com mySecurePass123");
    process.exit(1);
  }

  console.log(`Memproses akun admin (${email})...`);
  const passwordHash = await bcrypt.hash(password, 10);

  const { data: existingUser } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", email)
    .single();

  if (existingUser) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: passwordHash,
        name,
      })
      .eq("id", existingUser.id);

    if (updateError) {
      console.error("Gagal mengupdate akun admin:", updateError.message);
      process.exit(1);
    }
    console.log(`Sukses: Password & profil akun admin (${email}) berhasil diperbarui!`);
  } else {
    const { error: insertError } = await supabase.from("users").insert({
      email,
      password_hash: passwordHash,
      name,
    });

    if (insertError) {
      console.error("Gagal membuat user admin:", insertError.message);
      process.exit(1);
    }
    console.log(`Sukses: Akun admin baru (${email}) berhasil didaftarkan!`);
  }
}

seedAdmin();
