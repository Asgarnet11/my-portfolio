import { useEffect, useState, lazy, Suspense } from "react";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import About from "../../components/About";
import { ArrowUpRight, ShieldCheck, Mail, Building2 } from "lucide-react";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Experience = lazy(() => import("../../components/Experience"));
const Projects = lazy(() => import("../../components/Projects"));
const ContactForm = lazy(() => import("../../components/ContactForm"));

interface SectionData {
  statusBadge?: string;
  avatarUrl?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  email?: string;
  [key: string]: unknown;
}

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  data: SectionData;
  is_active: boolean;
}

const DEFAULT_SECTIONS: Record<string, Section> = {
  hero: {
    id: "default-hero",
    key: "hero",
    title: "Hi, saya Muh Asgar Fatwahyudi",
    subtitle: "Membangun arsitektur backend andal & antarmuka web responsif.",
    data: {
      avatarUrl:
        "https://relxttjsqsvhesreewha.supabase.co/storage/v1/object/public/portfolio-assets/projects/1789713386781-953399969.webp",
      statusBadge: "Pranata Komputer BPVP Kendari • Kemnaker RI",
      ctaPrimaryLink: "#projects",
      ctaPrimaryText: "Lihat Proyek & Karya",
      ctaSecondaryLink: "#contact-form",
      ctaSecondaryText: "Hubungi Saya",
    },
    is_active: true,
  },
  about: {
    id: "default-about",
    key: "about",
    title: "Mewujudkan Sistem Informasi yang Terstruktur & Andal",
    subtitle: "Dedikasi rekayasa perangkat lunak untuk digitalisasi layanan vokasi.",
    data: {
      bio: "Saya adalah lulusan Sistem Informasi yang berfokus pada Web Development, Arsitektur Sistem, dan Pengelolaan Database. Saat ini saya bertugas sebagai Pranata Komputer di BPVP Kendari (Kementerian Ketenagakerjaan Republik Indonesia), merancang dan memelihara aplikasi web, dashboard monitoring, serta integrasi API guna mendukung efisiensi operasional dan digitalisasi proses kerja.\n\nSaya memiliki keahlian teknis dalam PHP, Laravel, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, MySQL, dan Tailwind CSS. Pengalaman lintas sektor memperkuat dedikasi saya dalam ketelitian kode, keandalan sistem, dan pemecahan masalah yang berorientasi pada kemudahan pengguna.",
      skills: [
        "TypeScript",
        "React",
        "PHP",
        "Laravel",
        "PostgreSQL",
        "MySQL",
        "Node.js",
        "Tailwind CSS",
        "REST API",
        "Git",
      ],
    },
    is_active: true,
  },
  socials: {
    id: "default-socials",
    key: "socials",
    title: "Connect",
    subtitle: "Find me on the web",
    data: {
      email: "afatwahyudi@gmail.com",
      github: "https://github.com/Asgarnet11",
      linkedin: "https://www.linkedin.com/in/muh-asgar-fatwahyudi/",
    },
    is_active: true,
  },
};

export default function Home() {
  const [sections, setSections] =
    useState<Record<string, Section>>(DEFAULT_SECTIONS);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      try {
        const res = await api.get("/sections/public");
        const mapping: Record<string, Section> = {};
        res.data.data.forEach((item: Section) => {
          mapping[item.key] = item;
        });
        if (isMounted) setSections(mapping);
      } catch (err) {
        console.error("Gagal memuat konten publik:", err);
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const heroSec = sections["hero"];
  const aboutSec = sections["about"];
  const socialsSec = sections["socials"];

  return (
    <div
      className="min-h-screen overflow-x-clip transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-primary, #f2f0eb)",
        color: "var(--color-ink, #292827)",
      }}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {heroSec?.is_active && (
          <Hero
            title={heroSec.title}
            subtitle={heroSec.subtitle}
            data={heroSec.data}
          />
        )}

        {aboutSec?.is_active && (
          <About
            title={aboutSec.title}
            subtitle={aboutSec.subtitle}
            data={aboutSec.data}
          />
        )}

        <Suspense fallback={null}>
          <Experience />
        </Suspense>

        <Suspense fallback={null}>
          <Projects />
        </Suspense>

        {/* Dark Feature Band: Deep Lagoon (#0c4243) — Tema-utama.MD Signature */}
        <section className="py-14 sm:py-20">
          <div
            className="rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white shadow-md"
            style={{
              backgroundColor: "var(--color-deep-lagoon, #0c4243)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-[460] bg-white/10 text-white/90 border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Komitmen Teknis & Pelayanan ASN</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-[460] tracking-[-0.025em] leading-tight text-white">
                  Menghadirkan Solusi Digital yang Bersih, Andal, dan Berdampak Nyata.
                </h3>
                <p className="text-sm sm:text-base text-white/80 max-w-2xl font-normal leading-relaxed">
                  Menggabungkan standar rekayasa perangkat lunak modern dengan akuntabilitas pelayanan publik di Balai Pelatihan Vokasi dan Produktivitas Kendari.
                </p>
              </div>
              <div className="md:col-span-4 flex md:justify-end">
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-[460] transition-all duration-200 cursor-pointer border border-white/40 hover:bg-white hover:text-[#0c4243] text-white shadow-sm"
                >
                  <span>Mulai Diskusi</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </main>

      {/* Footer: Full-bleed Midnight Wine (#421d24) — Tema-utama.MD Signature */}
      <footer
        className="mt-20 border-t transition-colors duration-300"
        style={{
          backgroundColor: "var(--color-primary, #421d24)",
          color: "var(--on-accent, #ffffff)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Kolom 1: Profil */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
                  AF
                </div>
                <span className="font-semibold text-base tracking-tight text-white">
                  Muh Asgar Fatwahyudi
                </span>
              </div>
              <p className="text-xs text-white/70 max-w-sm leading-relaxed">
                Pranata Komputer Ahli Pertama di BPVP Kendari, Kementerian Ketenagakerjaan RI. Fokus pada Web Development, Database Architecture, dan Digital Transformation.
              </p>
              <div className="text-[11px] text-white/50 font-mono pt-1">
                3°58&apos;43.8&quot;S 122°31&apos;40.9&quot;E • KENDARI, INDONESIA
              </div>
            </div>

            {/* Kolom 2: Tautan Navigasi */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Navigasi
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    Tentang & Institusi
                  </a>
                </li>
                <li>
                  <a href="#experience" className="hover:text-white transition-colors">
                    Pengalaman Kerja
                  </a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-white transition-colors">
                    Proyek Terpilih
                  </a>
                </li>
                <li>
                  <a href="#contact-form" className="hover:text-white transition-colors">
                    Kontak & Diskusi
                  </a>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Tautan Institusi & Jejaring */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Jejaring & Komunikasi
              </h4>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-white/50" />
                  <span>BPVP Kendari — Kemnaker RI</span>
                </div>
                {socialsSec?.data?.github && (
                  <a
                    href={socialsSec.data.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub: Asgarnet11</span>
                  </a>
                )}
                {socialsSec?.data?.linkedin && (
                  <a
                    href={socialsSec.data.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn: Muh Asgar Fatwahyudi</span>
                  </a>
                )}
                {socialsSec?.data?.email && (
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(socialsSec.data.email as string)}
                    className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{copiedEmail ? "✓ afatwahyudi@gmail.com Tersalin!" : "afatwahyudi@gmail.com"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-mono">
            <div>
              © {new Date().getFullYear()} Muh Asgar Fatwahyudi. Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistem Operasional Aktif</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
