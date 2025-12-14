"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Home() {
  /* Cursor glow */
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const glow = cursorRef.current;
    if (!glow) return;

    const move = (e: MouseEvent) => {
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* Scroll + parallax */
  const { scrollY } = useScroll();

  const heroScale = useTransform(scrollY, [0, 300], [1, 0.72]);
  const heroY = useTransform(scrollY, [0, 300], [0, -140]);
  const heroGlow = useTransform(scrollY, [0, 300], [1, 0.4]);

  const bgY = useTransform(scrollY, [0, 800], [0, 220]);
  const fogY = useTransform(scrollY, [0, 800], [0, 140]);
  const textY = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <main className="relative min-h-screen px-6 md:px-24 overflow-hidden">
      {/* Background layers */}
      <motion.div className="tech-grid" style={{ y: bgY }} />
      <motion.div className="hero-fog" style={{ y: fogY }} />
      <div className="hero-glow" />

      {/* Cursor glow */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px]
                   rounded-full bg-[rgba(0,255,106,0.15)]
                   blur-[120px] z-[-1]"
      />

      {/* HERO */}
      <section className="h-[160vh] relative">
        <motion.div
          style={{ scale: heroScale, y: heroY }}
          className="sticky top-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-[#00ff6a] font-mono mb-6"
          >
            {"> INITIALIZING SYSTEM"}
          </motion.p>

          <motion.h1
            style={{ opacity: heroGlow }}
            className="
              text-[clamp(4rem,10vw,9rem)]
              font-extrabold tracking-widest
              bg-gradient-to-b from-white via-white to-[#00ff6a]/80
              bg-clip-text text-transparent
              relative
              drop-shadow-[0_0_50px_rgba(0,255,106,0.9)]
              after:content-['']
              after:absolute after:inset-0
              after:blur-[140px]
              after:bg-[rgba(0,255,106,0.25)]
              after:-z-10
            "
          >
            ISHIKA SAIJWAL
          </motion.h1>

          <motion.p
            style={{ y: textY }}
            className="mt-10 text-2xl text-gray-400 max-w-3xl"
          >
            Robotics Engineer · Embedded Systems · Autonomous Machines
          </motion.p>

          <motion.p
            style={{ y: textY }}
            className="mt-8 max-w-3xl text-gray-300 text-lg leading-relaxed"
          >
            I design and build intelligent machines where software meets physics —
            focusing on embedded control, real-time systems, and autonomous robotics.
          </motion.p>

          <div className="mt-14 flex gap-8">
            <a
              href="#projects"
              className="border border-[#00ff6a] px-10 py-5 text-[#00ff6a]
                         hover:bg-[#00ff6a] hover:text-black transition
                         shadow-[0_0_50px_rgba(0,255,106,0.6)]"
            >
              VIEW PROJECTS
            </a>

            <a
              href="https://github.com/ishika3011"
              target="_blank"
              className="border border-gray-600 px-10 py-5 text-gray-300
                         hover:border-[#00ff6a] hover:text-[#00ff6a] transition"
            >
              GITHUB
            </a>
          </div>
        </motion.div>
      </section>

      {/* STATEMENT MOMENT */}
      <section className="py-80 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white">
            I don’t just write code.
          </h2>
          <p className="mt-8 text-3xl text-[#00ff6a]">
            I engineer systems that interact with the real world.
          </p>
        </motion.div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-80 overflow-visible">
        <motion.h2
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-7xl text-[#00ff6a] mb-32 tracking-wider"
        >
          ACTIVE BUILDS
        </motion.h2>

        <div className="overflow-visible">
          <motion.div
            whileHover={{ scale: 1.06 }}
            style={{ transformOrigin: "center" }}
            className="relative border border-[#00ff6a] p-12 max-w-xl
                       hover:shadow-[0_0_80px_#00ff6a]
                       transition"
          >
            <h3 className="text-3xl text-[#00ff6a] mb-6">
              WALL-E INSPIRED AUTONOMOUS ROBOT
            </h3>
            <p className="text-gray-400 text-lg">
              Designed and built an autonomous robot capable of obstacle detection
              and navigation using embedded control logic and sensor fusion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 border-t border-green-900 text-gray-400">
        <p className="text-[#00ff6a] font-mono mb-4">{"> CONTACT"}</p>
        <p>Email: Ishika.saijwal01@gmail.com</p>
        <p>
          GitHub:{" "}
          <a className="text-[#00ff6a]" href="https://github.com/ishika3011">
            github.com/ishika3011
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a
            className="text-[#00ff6a]"
            href="https://linkedin.com/in/ishika-saijwal"
          >
            linkedin.com/in/ishika-saijwal
          </a>
        </p>
      </footer>
    </main>
  );
}
