import { motion } from "framer-motion";

interface AboutProps {
  title?: string;
  subtitle?: string;
  data?: {
    bio?: string;
    skills?: string[];
  };
}

const tagColors = ["#FFC7D6", "#B8E6C9", "#D6C9F5", "#FFD873"];

export default function About({ title, subtitle, data }: AboutProps) {
  return (
    <section
      id="about"
      className="py-20 border-b-4"
      style={{ borderColor: "#4A3B52" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-3">
          <span
            className="inline-block text-[10px] px-2 py-1 border-3"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: "#4A3B52",
              background: "#FFD873",
              border: "3px solid #4A3B52",
              boxShadow: "3px 3px 0 0 #4A3B52",
            }}
          >
            Background
          </span>
          <h2
            className="text-2xl tracking-tight"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: "#4A3B52",
              fontSize: "20px",
              lineHeight: 1.6,
            }}
          >
            {title || "About Me"}
          </h2>
          <p className="text-sm" style={{ color: "#8A7A93" }}>
            {subtitle}
          </p>
        </div>

        <div className="md:col-span-8 space-y-8">
          <p
            className="text-base leading-relaxed whitespace-pre-line font-normal"
            style={{ color: "#4A3B52" }}
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
                  color: "#8A7A93",
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
                      color: "#4A3B52",
                      background: tagColors[index % tagColors.length],
                      border: "3px solid #4A3B52",
                      boxShadow: "2px 2px 0 0 #4A3B52",
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
