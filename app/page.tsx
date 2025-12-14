"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export default function Home() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 300], [1, 0.7]);
  const y = useTransform(scrollY, [0, 300], [0, -120]);
  const glowOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);


  useEffect(() => {
    const glow = cursorRef.current;
    if (!glow) return;

    const move = (e: MouseEvent) => {
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative min-h-screen px-6 md:px-24 overflow-hidden">
      {/* Background layers */}
      <div className="tech-grid" />
      <div className="hero-fog" />
      <div className="hero-glow" />

      {/* Cursor glow (build-safe) */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px]
                   rounded-full bg-[rgba(0,255,106,0.15)]
                   blur-[120px] z-[-1]"
      />

      {/* HERO */}
      <section className="h-[140vh] relative">
        <motion.div
          style={{ scale, y }}
          className="sticky top-32"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-[#00ff6a] font-mono mb-4"
          >
            {"> INITIALIZING SYSTEM"}
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            style={{ opacity: glowOpacity }}
            className="text-6xl md:text-8xl font-extrabold tracking-widest
                      text-white relative
                      drop-shadow-[0_0_40px_rgba(0,255,106,0.9)]
                      after:content-['']
                      after:absolute after:inset-0
                      after:blur-[120px]
                      after:bg-[rgba(0,255,106,0.25)]
                      after:-z-10"
          >
            ISHIKA SAIJWAL
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mt-6 text-xl text-gray-400 max-w-2xl"
          >
            Robotics Engineer · Embedded Systems · Autonomous Machines
          </motion.p>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mt-6 max-w-2xl text-gray-300 leading-relaxed"
          >
            I design and build intelligent machines where software meets physics —
            focusing on embedded control, real-time systems, and autonomous robotics.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mt-10 flex gap-6"
          >
            <a
              href="#projects"
              className="border border-[#00ff6a] px-8 py-4 text-[#00ff6a]
                        hover:bg-[#00ff6a] hover:text-black transition
                        shadow-[0_0_40px_rgba(0,255,106,0.6)]"
            >
              VIEW PROJECTS
            </a>

            <a
              href="https://github.com/ishika3011"
              target="_blank"
              className="border border-gray-600 px-8 py-4 text-gray-300
                        hover:border-[#00ff6a] hover:text-[#00ff6a] transition"
            >
              GITHUB
            </a>
          </motion.div>
        </motion.div>
      </section>
      
      <section className="py-64 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            I don’t just write code.
          </h2>

          <p className="mt-6 text-2xl text-[#00ff6a]">
            I engineer systems that interact with the real world.
          </p>
        </motion.div>
      </section>



      {/* PROJECTS */}
      <section id="projects" className="py-40">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-5xl text-[#00ff6a] mb-16 tracking-wider"
        >
          ACTIVE BUILDS
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.07 }}
          className="border border-[#00ff6a] p-10 max-w-xl
                    hover:shadow-[0_0_60px_#00ff6a]
                    transition"
        >
          <h3 className="text-2xl text-[#00ff6a] mb-4">
            WALL-E INSPIRED AUTONOMOUS ROBOT
          </h3>
          <p className="text-gray-400">
            Designed and built an autonomous robot capable of obstacle detection
            and navigation using embedded control logic and sensor fusion.
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 border-t border-green-900 text-gray-400">
        <p className="text-[#00ff6a] font-mono mb-3">{"> CONTACT"}</p>
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
