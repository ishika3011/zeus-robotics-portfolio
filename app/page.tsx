"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
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
const SKILLS = [
  { name: "ROS / ROS2", level: 95, icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Robot_Operating_System_logo.svg" },
  { name: "C++", level: 90, icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" },
  { name: "Python", level: 85, icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
  { name: "PCL", level: 80, icon: "https://pointclouds.org/assets/images/pcl.png" },
  { name: "Gazebo", level: 85, icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Gazebo_logo.svg" },
  { name: "Embedded Systems", level: 90, icon: "https://img.icons8.com/ios-filled/100/00ff6a/microcontroller.png" },
  { name: "SLAM", level: 85, icon: "https://img.icons8.com/ios/100/00ff6a/map.png" },
  { name: "OpenCV", level: 80, icon: "https://opencv.org/wp-content/uploads/2020/07/OpenCV_logo_black.png" },
];
/* -------------------- COMPONENT -------------------- */
export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [activeProject, setActiveProject] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  // Drag rotation for carousel
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { stiffness: 100, damping: 30 });
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
      cursorRef.current.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  /* ---------- Sleek Loading Animation ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);
  const numProjects = PROJECTS.length;
  const angleStep = 360 / numProjects;
  const radius = 650;
  return (
    <main className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Preload critical resources */}
      <link rel="preload" href="https://upload.wikimedia.org/wikipedia/commons/9/9a/Robot_Operating_System_logo.svg" as="image" />
      <link rel="preload" href="https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" as="image" />
      {/* Loading Screen */}
      <AnimatePresence>
        {loadingProgress < 100 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center flex-col gap-8"
          >
            <motion.div
              className="w-96 h-2 bg-gray-800 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-[#00ff6a]"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <p className="text-[#00ff6a] font-mono text-2xl">
              INITIALIZING... {loadingProgress}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hide horizontal scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* Cursor - fixed: removed mix-blend-difference to prevent initial huge/glitchy appearance */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00ff6a]
                   pointer-events-none z-50 transition-transform"
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
      {/* PROJECTS - 3D Cylinder Carousel (Fixed) */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="py-56 relative"
      >
        <h2 className="text-7xl font-black mb-24 text-center bg-gradient-to-r from-[#00ff6a] to-white bg-clip-text text-transparent">
          ACTIVE BUILDS
        </h2>
        <div className="max-w-7xl mx-auto h-[700px] relative" style={{ perspective: "1200px" }}>
          <motion.div
            drag="x"
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0 }}
            onDrag={(_, info) => {
              rotation.set(rotation.get() - info.delta.x * 0.4);
            }}
            style={{
              rotateY: smoothRotation,
              transformStyle: "preserve-3d",
            }}
            initial={{ rotateY: angleStep / 2 }} {/* Fixed: offset for balanced initial circle view */}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {PROJECTS.map((project, i) => {
              const angle = i * angleStep;
              return (
                <motion.div
                  key={i}
                  className="absolute w-[440px] border-2 border-[#00ff6a] bg-black/60 backdrop-blur-md p-10 rounded-xl shadow-2xl"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    transformStyle: "preserve-3d",
                  }}
                  /* Fixed: removed whileHover scale to prevent stacking/distortion in 3D space */
                  onClick={() => setActiveProject(project)}
                >
                  <div className="h-52 mb-8 bg-gradient-to-br from-[#00ff6a]/25 to-black rounded-lg" />
                  <h3 className="text-3xl text-[#00ff6a] font-bold mb-6">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((t: string) => (
                      <span
                        key={t}
                        className="px-4 py-1.5 text-sm border border-[#00ff6a] hover:bg-[#00ff6a] hover:text-black transition"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>
      {/* SKILLS SECTION */}
      <motion.section
        id="skills"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-56 px-24"
      >
        <h2 className="text-7xl font-black mb-24 bg-gradient-to-r from-[#00ff6a] to-white bg-clip-text text-transparent text-center">
          CORE SKILLS
        </h2>
        <div className="max-w-5xl mx-auto grid gap-12">
          {SKILLS.map((skill, i) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { once: true });
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="flex items-center gap-8"
              >
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-16 h-16 object-contain"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <p className="text-xl text-[#00ff6a]">{skill.name}</p>
                    <p className="text-gray-400">{skill.level}%</p>
                  </div>
                  <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00ff6a] to-[#00ff6a]/60"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
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
                className="border border-[#00ff6a] px-8 py-3 text-[#00ff6a] hover:bg-[#00ff6a] hover:text-black"
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