import { motion } from "framer-motion";

interface AboutProps {
  title?: string;
  subtitle?: string;
  data?: {
    bio?: string;
    skills?: string[];
  };
}

const tagColors = [
  "var(--card-accent-1, #FFC7D6)",
  "var(--card-accent-2, #B8E6C9)",
  "var(--card-accent-3, #D6C9F5)",
  "var(--card-accent-4, #FFD873)",
];

// Container drives the stagger so tags pop in one-by-one instead of
// each tag re-deriving its own delay — reads as one deliberate motion
// instead of "everything fades up the same amount, generically".
const skillContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const skillItem = {
  hidden: { opacity: 0, y: 12, scale: 0.85, rotate: -4 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 420, damping: 22 },
  },
};

export default function About({ title, subtitle, data }: AboutProps) {
  return (
    <section
      id="about"
      className="py-14 sm:py-20 border-b-4 transition-colors duration-300"
      style={{ borderColor: "var(--color-ink, #4A3B52)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
        <div className="md:col-span-4 space-y-3 min-w-0">
          {/* Same class of bug as the Hero primary button: this badge
              fills with --bg-secondary, so its text must use --on-accent,
              not --color-ink — in the terminal theme both --color-ink and
              --bg-secondary are neon green, which makes the label vanish. */}
          <motion.span
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            className="inline-block text-[9px] sm:text-[10px] px-2 py-1"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--on-accent, #4A3B52)",
              background: "var(--bg-secondary, #FFD873)",
              border:
                "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
              boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
              borderRadius: "var(--border-radius, 0px)",
            }}
          >
            Background
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
              delay: 0.05,
            }}
            className="tracking-tight break-words"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              fontSize: "clamp(16px, 4vw, 20px)",
              lineHeight: 1.6,
            }}
          >
            {title || "About Me"}
          </motion.h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.3 }}
              className="text-sm"
              style={{
                fontFamily: "var(--font-body, monospace)",
                color: "var(--color-muted, #504159)",
              }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <div className="md:col-span-8 space-y-8 min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-base leading-relaxed whitespace-pre-line font-normal break-words"
            style={{
              fontFamily: "var(--font-body, monospace)",
              color: "var(--color-ink, #4A3B52)",
            }}
          >
            {data?.bio ||
              "Building reliable digital solutions with intentional craftsmanship."}
          </motion.p>

          {data?.skills && data.skills.length > 0 && (
            <div className="space-y-3">
              <span
                className="block text-[9px] sm:text-[10px] tracking-wider"
                style={{
                  fontFamily: "var(--font-heading, monospace)",
                  color: "var(--color-muted, #504159)",
                }}
              >
                Core Technologies
              </span>

              <motion.div
                className="flex flex-wrap gap-2 sm:gap-3"
                variants={skillContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {data.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    variants={skillItem}
                    whileHover={{
                      y: -3,
                      rotate: index % 2 === 0 ? -2 : 2,
                      boxShadow: "var(--box-shadow-hover, 4px 4px 0 0 #4A3B52)",
                    }}
                    whileTap={{ y: 1, boxShadow: "none" }}
                    className="px-2.5 sm:px-3 py-1 text-xs cursor-default"
                    style={{
                      fontFamily: "var(--font-heading, monospace)",
                      fontSize: "9px",
                      color: "var(--color-ink, #4A3B52)",
                      background: tagColors[index % tagColors.length],
                      border:
                        "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                      boxShadow: "var(--box-shadow, 2px 2px 0 0 #4A3B52)",
                      borderRadius: "var(--border-radius, 0px)",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
