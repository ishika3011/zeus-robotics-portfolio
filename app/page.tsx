"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* -------------------- DATA -------------------- */

const PROJECTS = [
  {
    title: "Traversable-area-from-Point-Cloud",
    desc: "Terrain understanding from 3D point clouds for autonomous navigation.",
    tech: ["ROS", "PCL", "C++", "SLAM"],
  },
  {
    title: "humbot_ws",
    desc: "Humanoid robot workspace with perception and motion control.",
    tech: ["ROS2", "C++", "Gazebo"],
  },
  {
    title: "AiuBot (Help Robot)",
    desc: "Assistive robot designed for indoor human interaction.",
    tech: ["Embedded", "Sensors", "Control"],
  },
  {
    title: "Underwater_robotics",
    desc: "Autonomous underwater robotics and control experiments.",
    tech: ["Robotics", "Control", "Simulation"],
  },
];

/* -------------------- COMPONENT -------------------- */

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [activeProject, setActiveProject] = useState<any>(null);

  /* ---------- PARALLAX LAYERS ---------- */
  const bgY = useTransform(scrollY, [0, 1200], [0, 260]);
  const fogY = useTransform(scrollY, [0, 1200], [0, 160]);
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.88]);

  /* ---------- Scroll Particles ---------- */
  const particleY = useTransform(scrollY, [0, 2000], [0, -500]);

  /* ---------- Custom Cursor ---------- */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate(${e.clientX - 15}px, ${
        e.clientY - 15
      }px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Hide horizontal scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00ff6a]
                   pointer-events-none z-50 mix-blend-difference transition-transform"
      />

      {/* PARALLAX BACKGROUND GLOW */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00ff6a15,transparent_60%)]"
      />

      {/* PARALLAX FOG */}
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"
      />

      {/* Scroll circuit traces */}
      <motion.div
        style={{ y: particleY }}
        className="fixed inset-0 pointer-events-none opacity-20"
      >
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-24 bg-[#00ff6a]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-12">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl py-40"
        >
          <p className="text-[#00ff6a] font-mono mb-10 tracking-widest">
            {"> INITIALIZING SYSTEM"}
          </p>

          <h1 className="text-[clamp(4rem,10vw,9rem)] font-black leading-none mb-12
                         bg-gradient-to-r from-[#00ff6a] to-white bg-clip-text text-transparent">
            ISHIKA
            <br />
            SAIJWAL
          </h1>

          <p className="text-3xl text-[#00ff6a] mb-16 max-w-3xl">
            Robotics Engineer · Embedded Systems · Autonomous Machines
          </p>

          <div className="flex gap-8">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="px-12 py-5 border-2 border-[#00ff6a] text-[#00ff6a]
                         font-bold hover:bg-[#00ff6a] hover:text-black"
            >
              VIEW PROJECTS
            </motion.a>

            <motion.a
              href="https://github.com/ishika3011"
              target="_blank"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="px-12 py-5 border-2 border-[#00ff6a] text-[#00ff6a]
                         font-bold hover:bg-[#00ff6a] hover:text-black"
            >
              GITHUB
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* PROJECTS */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="py-56"
      >
        <h2
          className="text-7xl font-black mb-24 px-24
                     bg-gradient-to-r from-[#00ff6a] to-white bg-clip-text text-transparent"
        >
          ACTIVE BUILDS
        </h2>

        <div className="flex gap-16 px-24 overflow-x-auto hide-scrollbar">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="min-w-[440px] border-2 border-[#00ff6a]
                         bg-black/40 backdrop-blur overflow-visible"
              onClick={() => setActiveProject(p)}
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="p-10 cursor-pointer"
              >
                <div className="h-44 mb-8 bg-gradient-to-br from-[#00ff6a]/25 to-black" />

                <h3 className="text-3xl text-[#00ff6a] font-bold mb-6">
                  {p.title}
                </h3>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {p.desc}
                </p>

                <div className="flex flex-wrap gap-3">
                  {p.tech.map((t: string) => (
                    <span
                      key={t}
                      className="px-4 py-1.5 text-sm border border-[#00ff6a]
                                 hover:bg-[#00ff6a] hover:text-black transition"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* MODAL */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-black border-2 border-[#00ff6a] p-12 max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-4xl text-[#00ff6a] mb-6">
                {activeProject.title}
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {activeProject.desc}
              </p>
              <button
                onClick={() => setActiveProject(null)}
                className="border border-[#00ff6a] px-8 py-3 text-[#00ff6a]
                           hover:bg-[#00ff6a] hover:text-black"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
