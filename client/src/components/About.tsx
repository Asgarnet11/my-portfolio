import { motion } from "framer-motion";

interface AboutProps {
  title?: string;
  subtitle?: string;
  data?: {
    bio?: string;
    skills?: string[];
  };
}

const INK = "#4A3B52";
const MUTED = "#504159"; // Warna kontras tinggi untuk teks sekunder (lulus uji WCAG AA)
const tagColors = ["#FFC7D6", "#B8E6C9", "#D6C9F5", "#FFD873"];

export default function About({ title, subtitle, data }: AboutProps) {
  return (
    <section
      id="about"
      className="py-20 border-b-4"
      style={{ borderColor: INK }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-3">
          <span
            className="inline-block text-[10px] px-2 py-1 border-3"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: INK,
              background: "#FFD873",
              border: `3px solid ${INK}`,
              boxShadow: `3px 3px 0 0 ${INK}`,
            }}
          >
            Background
          </span>
          <h2
            className="text-2xl tracking-tight"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: INK,
              fontSize: "20px",
              lineHeight: 1.6,
            }}
          >
            {title || "About Me"}
          </h2>
          {subtitle && (
            <p className="text-sm" style={{ color: MUTED }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="md:col-span-8 space-y-8">
          <p
            className="text-base leading-relaxed whitespace-pre-line font-normal"
            style={{ color: INK }}
          >
            {data?.bio ||
              "Building reliable digital solutions with intentional craftsmanship."}
          </p>

          {data?.skills && data.skills.length > 0 && (
            <div className="space-y-3">
              <span
                className="block text-[10px] tracking-wider"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: MUTED,
                }}
              >
                Core Technologies
              </span>
              <div className="flex flex-wrap gap-3">
                {data.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, ease: "easeInOut" }}
                    className="px-3 py-1 text-xs"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "9px",
                      color: INK,
                      background: tagColors[index % tagColors.length],
                      border: `3px solid ${INK}`,
                      boxShadow: `2px 2px 0 0 ${INK}`,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
