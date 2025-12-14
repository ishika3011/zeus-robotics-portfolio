"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen px-6 md:px-24 overflow-hidden">
      {/* Background layers */}
      <div className="tech-grid" />
      <div className="hero-fog" />
      <div className="hero-glow" />

      {/* HERO */}
      <section className="h-screen flex items-start pt-40">
        <motion.div
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
            className="text-6xl md:text-8xl font-extrabold tracking-widest"
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
                         shadow-[0_0_30px_rgba(0,255,106,0.4)]"
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

      {/* PROJECTS */}
      <section id="projects" className="py-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl text-[#00ff6a] mb-12 tracking-wider"
        >
          ACTIVE BUILDS
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="border border-[#00ff6a] p-8 max-w-xl
                     hover:shadow-[0_0_40px_#00ff6a]
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
      <footer className="py-20 border-t border-green-900 text-gray-400">
        <p className="text-[#00ff6a] font-mono mb-2">{"> CONTACT"}</p>
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
