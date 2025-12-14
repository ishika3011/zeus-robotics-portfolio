"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
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

/* -------------------- UTILS -------------------- */

const WordReveal = ({ text }: { text: string }) => (
  <span className="inline-block">
    {text.split(" ").map((w, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.06 }}
        className="inline-block mr-2"
      >
        {w}
      </motion.span>
    ))}
  </span>
);

/* -------------------- COMPONENT -------------------- */

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [activeProject, setActiveProject] = useState<any>(null);

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

  /* ---------- Scroll Particles ---------- */
  const particleY = useTransform(scrollY, [0, 2000], [0, -400]);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00ff6a]
                   pointer-events-none z-50 mix-blend-difference transition-transform"
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
      <section className="min-h-screen flex items-center justify-center px-8">
        <div className="max-w-5xl">
          <p className="text-[#00ff6a] font-mono mb-6">
            {"> INITIALIZING SYSTEM"}
          </p>

          <h1 className="text-7xl md:text-9xl font-black mb-8">
            <WordReveal text="ISHIKA SAIJWAL" />
          </h1>

          <p className="text-2xl text-[#00ff6a] mb-8">
            <WordReveal text="Robotics Engineer · Embedded Systems · Autonomous Machines" />
          </p>

          {/* Magnetic Buttons */}
          <div className="flex gap-6">
            {["VIEW PROJECTS", "GITHUB"].map((label, i) => (
              <motion.a
                key={i}
                href={i === 0 ? "#projects" : "https://github.com/ishika3011"}
                target={i === 1 ? "_blank" : undefined}
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="px-10 py-4 border-2 border-[#00ff6a] text-[#00ff6a]
                           font-bold hover:bg-[#00ff6a] hover:text-black"
              >
                {label}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-40 overflow-x-hidden">
        <h2 className="text-6xl text-[#00ff6a] font-black mb-16 px-24">
          ACTIVE BUILDS
        </h2>

        {/* Horizontal Scroll */}
        <div className="flex gap-12 px-24 overflow-x-auto">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -10 }}
              className="min-w-[420px] border-2 border-[#00ff6a] p-8
                         bg-black/40 backdrop-blur cursor-pointer"
              onClick={() => setActiveProject(p)}
            >
              <div className="h-40 mb-6 bg-gradient-to-br from-[#00ff6a]/20 to-black" />
              <h3 className="text-2xl text-[#00ff6a] font-bold mb-4">
                {p.title}
              </h3>
              <p className="text-gray-300 mb-4">{p.desc}</p>

              <div className="flex flex-wrap gap-2">
                {p.tech.map((t: string) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-sm border border-[#00ff6a]
                               hover:bg-[#00ff6a] hover:text-black transition"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black border-2 border-[#00ff6a] p-10 max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl text-[#00ff6a] mb-4">
                {activeProject.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {activeProject.desc}
              </p>
              <button
                onClick={() => setActiveProject(null)}
                className="border border-[#00ff6a] px-6 py-2 text-[#00ff6a]
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