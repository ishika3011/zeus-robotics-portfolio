"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen px-6 md:px-20">

      {/* HERO */}
      <section className="h-screen flex flex-col justify-center">
        <p className="text-[#00ff6a] font-mono mb-3">{"> INITIALIZING SYSTEM"}</p>

        <h1 className="text-5xl md:text-7xl tracking-widest font-bold">
          ISHIKA SAIJWAL
        </h1>

        <p className="mt-4 text-lg text-gray-400">
          Robotics Engineer · Embedded Systems · Autonomous Machines
        </p>

        <p className="mt-6 max-w-xl text-gray-300">
          I build intelligent machines where software meets physics — focusing on
          control systems, embedded programming, and real-world robotics.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="#projects"
            className="border border-[#00ff6a] px-6 py-3 text-[#00ff6a] hover:bg-[#00ff6a] hover:text-black transition"
          >
            VIEW PROJECTS
          </a>

          <a
            href="https://github.com/ishika3011"
            target="_blank"
            className="border border-gray-600 px-6 py-3 text-gray-300 hover:border-[#00ff6a] hover:text-[#00ff6a] transition"
          >
            GITHUB
          </a>
        </div>
      </section>

      {/* SKILLS */}
      <section className="py-24">
        <h2 className="text-3xl mb-12 tracking-wider text-[#00ff6a]">
          SYSTEM CAPABILITIES
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            ["EMBEDDED SYSTEMS", "C / C++ · Microcontrollers · Timers · Interrupts"],
            ["ROBOTICS", "Sensors · Motors · PID Control · Kinematics"],
            ["TOOLS", "Linux · Git · Python · MATLAB"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="border border-green-900 p-6 hover:border-[#00ff6a] transition"
            >
              <h3 className="text-[#00ff6a] mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24">
        <h2 className="text-3xl mb-12 tracking-wider text-[#00ff6a]">
          ACTIVE BUILDS
        </h2>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="border border-[#00ff6a] p-6 max-w-xl"
        >
          <h3 className="text-xl text-[#00ff6a] mb-2">
            WALL-E INSPIRED AUTONOMOUS ROBOT
          </h3>
          <p className="text-sm text-gray-400">
            Designed and built a working autonomous robot capable of obstacle
            detection and basic navigation using embedded control logic and sensors.
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-green-900 text-sm text-gray-400">
        <p className="text-[#00ff6a] font-mono">{"> CONTACT"}</p>
        <p>Email: Ishika.saijwal01@gmail.com</p>
        <p>
          GitHub:{" "}
          <a href="https://github.com/ishika3011" className="text-[#00ff6a]">
            github.com/ishika3011
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a href="https://linkedin.com/in/ishika-saijwal" className="text-[#00ff6a]">
            linkedin.com/in/ishika-saijwal
          </a>
        </p>
      </footer>

    </main>
  );
}
