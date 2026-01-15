"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useReducedMotion,
} from "framer-motion";

// Type declaration for Three.js
declare global {
  interface Window {
    THREE: any;
  }
}

const MEET_LINK = "https://calendar.app.google/aCwn5aGEVT7Ett99A";
// Calendar.app pages don't always support the Google "embed=true" format; use the same URL in the iframe.
const CALENDAR_EMBED = "https://calendar.app.google/aCwn5aGEVT7Ett99A";


/* -------------------- DATA -------------------- */
const PROJECTS = [
  {
    title: "humbot",
    desc: "Modular autonomous navigation stack integrating mapping, planning, control, and behavior logic.",
    tech: ["C++", "SLAM", "Planning"],
    github: "https://github.com/ishika3011/humbot_ws",
    cover1: "/projects/humbot_1.JPG",
    cover2: "/projects/humbot_2.JPG",
  },
  {
    title: "Traversable-area-from-Point-Cloud",
    desc: "A ROS-based terrain analysis pipeline that converts raw 3D point clouds into elevation, obstacle, and traversability grid maps using windowed processing and geometric reasoning.",
    tech: ["ROS", "C++", "Point Cloud", "Terrain Analysis"],
    github: "https://github.com/ishika3011/Traversable-area-from-Point-Cloud",
    // Note: filename includes "_-1" and uppercase extension (Linux/Vercel is case-sensitive).
    cover1: "/projects/Traversable-area-from-Point-Cloud_-1.JPG",
  },
  {
    title: "Underwater_robotics",
    desc: "Software stack for AUV and ROV systems including control, localization, sensor fusion, and monitoring.",
    tech: ["C++", "Control", "Localization", "Sensor Fusion"],
    github: "https://github.com/ishika3011/Underwater_robotics",
    cover1: "/projects/Underwater_robotics_1.JPG",
  },
  {
    title: "aiubot",
    desc: "An educational ROS-based mobile robot project built to understand mapping, localization, planning, TF, and costmaps in the classical ROS navigation stack.",
    tech: ["ROS", "CMake", "Navigation", "Mapping"],
    github: "https://github.com/ishika3011/aiubot",
    cover1: "/projects/aiubot_1.JPG",
    cover2: "/projects/aiubot_2.JPG",
  },
];

const SKILLS = [
  // Robotics & AI skills first
  { name: "ROS (ROS1/ROS2)", level: 82, icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Robot_Operating_System_logo.svg", iconTreatment: "invert" },
  { name: "Navigation", level: 80, icon: "https://img.icons8.com/ios/100/00ff6a/route.png" },
  { name: "Perception", level: 80, icon: "https://img.icons8.com/ios/100/00ff6a/radar.png" },
  { name: "Localization", level: 80, icon: "https://img.icons8.com/ios/100/00ff6a/marker.png" },
  { name: "SLAM", level: 82, icon: "https://img.icons8.com/ios/100/00ff6a/map.png" },
  { name: "Sensor Fusion", level: 78, icon: "https://img.icons8.com/ios/100/00ff6a/merge.png" },
  { name: "Gazebo", level: 82, icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Gazebo_logo.svg", iconTreatment: "invert" },
  { name: "C / C++", level: 92, icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" },
  { name: "Python", level: 86, icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
  { name: "Applied ML", level: 70, icon: "https://img.icons8.com/ios/100/00ff6a/artificial-intelligence.png" },
  { name: "CARLA", level: 78, icon: "https://img.icons8.com/ios/100/00ff6a/car--v1.png" },
  { name: "Embedded Firmware", level: 90, icon: "https://img.icons8.com/ios/100/00ff6a/processor.png" },
  { name: "RTOS", level: 82, icon: "https://img.icons8.com/ios/100/00ff6a/clock--v1.png" },
  { name: "Wi‑Fi (MAC/LMAC)", level: 86, icon: "https://img.icons8.com/ios/100/00ff6a/wifi--v1.png" },
];

const EXPERIENCE = [
  {
    role: "Associate Software Design Engineer",
    org: "Silicon Labs",
    location: "Hyderabad, India",
    period: "Jun 2023 - Present",
    highlights: [
      "Developed real-time Wi-Fi LMAC firmware under strict latency and power constraints.",
      "Reduced sleep current by 21% through systematic profiling and regression testing.",
      "Improved throughput by 28% by resolving system-level performance bottlenecks.",
    ],
    stack: ["C", "Embedded", "Wi-Fi", "RTOS", "Firmware"],
  },
  {
    role: "Robotics Software Intern",
    org: "OttonomyIO",
    location: "Noida, India",
    period: "Jun 2022 - Jul 2022",
    highlights: [
      "Developed autonomy simulation pipelines using Gazebo and CARLA (UE4).",
      "Implemented LiDAR-based curb and road segmentation for navigation stack.",
      "Achieved stable 9–10 Hz navigation performance on Jetson Xavier NX.",
    ],
    stack: ["ROS", "Gazebo", "CARLA", "C++"],
  },
  {
    role: "Robotics Intern",
    org: "IIT Delhi – AIA Foundation",
    location: "New Delhi, India",
    period: "Jun 2021 - Jul 2021",
    highlights: [
      "Implemented autonomous indoor navigation using ROS1 Navigation Stack.",
      "Developed 2D LiDAR-based mapping and AMCL particle-filter localization.",
      "Performed parameter sweeps to improve localization stability and trajectory smoothness.",
    ],
    stack: ["ROS1", "Navigation", "SLAM"],
  },
];

const PUBLICATIONS = [
  {
    title: "Autonomous Mobile Robot for Inventory Management in Retail Industry",
    venue: "Springer",
    year: "2024",
    blurb: "This paper implements an autonomous differential drive mobile robot using depth camera and RP-LIDAR to navigate warehouse aisles, detect shelves, and count inventory in real time. It demonstrates sensor-based perception and control to improve inventory tracking in retail settings.",
    links: [{ label: "Open", href: "https://link.springer.com/chapter/10.1007/978-981-19-5037-7_7" }],
    tags: ["AMR", "Navigation", "Retail"],
  },
  {
    title: "Human Activity Recognition in IoT Networks Through Wi-Fi Channel State Information",
    venue: "Springer",
    year: "2022",
    blurb: "This research explores using Wi-Fi Channel State Information (CSI) in IoT networks to sense and classify human activities non-intrusively, leveraging signal variations caused by motion. It highlights the challenges and benefits of CSI-based activity recognition for applications like healthcare monitoring and security with advanced ML/DL methods.",
    links: [{ label: "Open", href: "https://link.springer.com/chapter/10.1007/978-981-97-7946-8_6" }],
    tags: ["Wi‑Fi CSI", "IoT", "ML"],
  },
  {
    title: "Navigation Control of Remotely Operated Underwater Vehicle",
    venue: "Journal publication",
    year: "2022",
    blurb: "This work presents the design and software architecture of a Remotely Operated Underwater Vehicle (ROV) equipped with IMU, pressure/temperature sensors, cameras, and enables stable 6-DOF navigation. The system integrates onboard processing with remote control over LAN for maneuvering and sensor feedback in underwater environments.",
    links: [
      {
        label: "Open",
        href: "https://www.journalspub.info/ecc/index.php?journal=JSCRS&page=article&op=view&path%5B%5D=1683",
      },
    ],
    tags: ["ROV", "Control", "Navigation"],
  },
];

const PROJECT_TITLE_ACRONYMS = new Set([
  "ws",
  "ros",
  "tf",
  "slam",
  "amcl",
  "auv",
  "rov",
  "lmac",
  "wifi",
  "csi",
]);

function prettifyProjectTitle(raw: string) {
  const cleaned = raw
    .replace(/[_\\-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\\s+/g, " ")
    .trim();

  if (!cleaned) return raw;

  return cleaned
    .split(" ")
    .map((tok) => {
      const lower = tok.toLowerCase();
      if (PROJECT_TITLE_ACRONYMS.has(lower)) return lower.toUpperCase();
      if (/^\\d+$/.test(tok)) return tok;
      if (tok.length <= 2 && /^[a-zA-Z]+$/.test(tok)) return tok.toUpperCase();
      return tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
    })
    .join(" ");
}

// Project covers are hardcoded in `PROJECTS` as `/projects/<filename>` so builds remain fast and
// images resolve correctly on Linux (case-sensitive paths/extensions).

function FloatingNav({
  onLetsTalk,
  showWelcome,
}: {
  onLetsTalk: () => void;
  showWelcome: boolean;
}) {

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = 0;
    return scrollY.on("change", (y: number) => {
      const delta = y - last;
      // Small thresholds prevent jitter and make the nav feel snappier.
      if (y > 120 && delta > 2) setHidden(true);
      if (delta < -2) setHidden(false);
      last = y;
    });
  }, [scrollY]);

  return (
    <>
      {/* TOP LEFT - WELCOME */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: hidden ? 0 : 1, y: hidden ? -20 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-8 z-40"
        >
          <Typewriter text="WELCOME" />
        </motion.div>
      )}

      {/* CENTER - NAV BOX */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -80 : 40, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed left-1/2 -translate-x-1/2 z-40
                   backdrop-blur bg-black/60 border border-[#00ff6a]/40
                   px-10 h-14 flex items-center gap-10 text-sm"
      >
        {[
          ["EXPERIENCE", "#experience"],
          ["Project", "#projects"],
          ["PUBLICATIONS", "#publications"],
        ].map(([label, link]) => (
          <a
            key={label}
            href={link}
            className="text-gray-300 hover:text-[#00ff6a] transition"
          >
            {label}
          </a>
        ))}
      </motion.nav>

      {/* TOP RIGHT - LET’S TALK */}
      <motion.button
        onClick={onLetsTalk}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? -20 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 right-8 z-40
                   inline-flex items-center gap-2
                   px-5 py-2.5 rounded-full
                   border border-[#00ff6a]/60
                   bg-black/40 backdrop-blur
                   text-[#00ff6a] tracking-[0.14em] text-xs font-semibold
                   shadow-[0_0_0_1px_rgba(0,255,106,0.12),0_16px_60px_rgba(0,0,0,0.55)]
                   hover:bg-[#00ff6a] hover:text-black hover:shadow-[0_22px_80px_rgba(0,255,106,0.18)]
                   active:scale-[0.98]
                   transition"
      >
        LET’S TALK
      </motion.button>
    </>
  );
}

function Typewriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;

    const typing = setInterval(() => {
      setDisplayed((prev: string) => {
        // STOP before undefined
        if (i >= text.length) {
          clearInterval(typing);
          return prev;
        }
        const next = prev + text[i];
        i++;
        return next;
      });
    }, 120); // ⬅️ slower, more readable

    return () => clearInterval(typing);
  }, [text]);

  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor((v: boolean) => !v);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  return (
    <span className="text-[#00ff6a] tracking-[0.18em]">
      {displayed}
      <span
        className={`inline-block w-[10px] ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      >
        ▍
      </span>
    </span>
  );
}

/* -------------------- SECTION ORNAMENTS (LIGHTWEIGHT 3D) -------------------- */
const THREE_CDN_SRC = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
let threeLoadPromise: Promise<any> | null = null;

function loadThree(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const w = window as any;
  if (w.THREE) return Promise.resolve(w.THREE);
  if (threeLoadPromise) return threeLoadPromise;

  threeLoadPromise = new Promise((resolve, reject) => {
    const existing = Array.from(document.getElementsByTagName("script")).find(
      (s) => (s as HTMLScriptElement).src === THREE_CDN_SRC
    ) as HTMLScriptElement | undefined;

    if (existing) {
      if ((window as any).THREE) {
        resolve((window as any).THREE);
        return;
      }

      const onLoad = () => resolve((window as any).THREE);
      const onErr = () => reject(new Error("Failed to load Three.js"));
      existing.addEventListener("load", onLoad, { once: true } as any);
      existing.addEventListener("error", onErr, { once: true } as any);

      // Fallback: if load event is missed, poll briefly for the global.
      const started = performance.now();
      const poll = window.setInterval(() => {
        if ((window as any).THREE) {
          window.clearInterval(poll);
          resolve((window as any).THREE);
          return;
        }
        if (performance.now() - started > 6000) {
          window.clearInterval(poll);
          reject(new Error("Three.js global not found after load"));
        }
      }, 60);
      return;
    }

    const script = document.createElement("script");
    script.src = THREE_CDN_SRC;
    script.async = true;
    script.onload = () => {
      const THREE = (window as any).THREE;
      if (THREE) resolve(THREE);
      else reject(new Error("Three.js loaded but global not found"));
    };
    script.onerror = () => reject(new Error("Failed to load Three.js"));
    document.head.appendChild(script);
  });

  return threeLoadPromise;
}

function SectionOrnament({
  className = "",
  seed = 1,
}: {
  className?: string;
  seed?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRefLocal = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const canvas = canvasRefLocal.current;
    if (!el || !canvas) return;
    if (typeof window === "undefined") return;

    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mql?.matches) return;

    let cleanup: (() => void) | null = null;
    let destroyed = false;

    loadThree()
      .then((THREE) => {
        if (!THREE || destroyed) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
        camera.position.set(0, 0, 6);

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);

        const dpr = Math.min(2, window.devicePixelRatio || 1);
        renderer.setPixelRatio(dpr);

        const group = new THREE.Group();
        scene.add(group);

        // Lights (kept minimal)
        const amb = new THREE.AmbientLight(0xffffff, 0.55);
        const key = new THREE.PointLight(0x00ff6a, 1.35, 30);
        key.position.set(2.8, 2.2, 3.6);
        scene.add(amb, key);

        // Core wireframe shape
        const geo = new THREE.TorusKnotGeometry(1.05, 0.30, 180, 18);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.75,
          metalness: 0.15,
          roughness: 0.35,
          transparent: true,
          opacity: 0.42,
          wireframe: true,
        });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        // Particle shell
        const rand = (() => {
          let s = seed >>> 0;
          return () => {
            // xorshift32
            s ^= s << 13;
            s ^= s >>> 17;
            s ^= s << 5;
            return (s >>> 0) / 4294967295;
          };
        })();

        const ptsCount = 220;
        const pos = new Float32Array(ptsCount * 3);
        for (let i = 0; i < ptsCount; i++) {
          const u = rand();
          const v = rand();
          const theta = u * Math.PI * 2;
          const phi = Math.acos(2 * v - 1);
          const r = 1.65 + rand() * 0.55;
          pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
          pos[i * 3 + 1] = r * Math.cos(phi);
          pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        const ptsGeo = new THREE.BufferGeometry();
        ptsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const ptsMat = new THREE.PointsMaterial({
          color: 0x00ff6a,
          size: 0.018,
          transparent: true,
          opacity: 0.65,
          depthWrite: false,
        });
        const points = new THREE.Points(ptsGeo, ptsMat);
        group.add(points);

        // Subtle “aura ring”
        const ringGeo = new THREE.RingGeometry(1.25, 1.85, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x00ff6a,
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI * 0.5;
        group.add(ring);

        let raf: number | null = null;
        let isInView = true;
        let lastT = 0;

        const resize = () => {
          const r = el.getBoundingClientRect();
          const w = Math.max(1, Math.floor(r.width));
          const h = Math.max(1, Math.floor(r.height));
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };

        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();

        const io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            isInView = !!entry?.isIntersecting;
            if (isInView && raf == null) {
              lastT = performance.now();
              raf = requestAnimationFrame(tick);
            }
          },
          { threshold: 0.12 }
        );
        io.observe(el);

        const tick = (t: number) => {
          raf = null;
          if (!isInView) return;
          const dt = Math.min(0.032, (t - lastT) / 1000);
          lastT = t;

          group.rotation.y += dt * 0.55;
          group.rotation.x += dt * 0.22;
          const bob = Math.sin(t / 900) * 0.06;
          group.position.y = bob;
          ring.rotation.z += dt * 0.25;

          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame((t: number) => {
          lastT = t;
          tick(t);
        });

        cleanup = () => {
          try {
            if (raf != null) cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            geo.dispose();
            mat.dispose();
            ptsGeo.dispose();
            ptsMat.dispose();
            ringGeo.dispose();
            ringMat.dispose();
            renderer.dispose();
          } catch {}
        };
      })
      .catch(() => {
        // Ornament is purely decorative; fail silently.
      });

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [seed]);

  return (
    <div ref={wrapRef} className={`pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={canvasRefLocal} className="w-full h-full" />
    </div>
  );
}


/* ---------- MEMOIZED CARDS (prevent animation replay on unrelated state changes) ---------- */
const PublicationDepthCard = React.memo(({ p, i, reduceMotion }: { p: any; i: number; reduceMotion: boolean }) => {
  return (
    <motion.article
      key={`${p.title}-${p.year}`}
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.035 }}
      className="group alive-card card-polish relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-md p-6 border border-white/[0.06] transition-[border-color,box-shadow] duration-200 hover:border-[#00ff6a]/30 hover:shadow-[0_26px_90px_rgba(0,0,0,0.55),0_0_40px_rgba(0,255,106,0.08)] will-change-[opacity,transform]"
    >
      <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,255,106,0.08),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_78%,rgba(255,255,255,0.06),transparent_62%)]" />
      </div>

      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-[#00ff6a]/90 transition-colors">
            {p.title}
          </h3>
          <p className="mt-1 text-sm text-white/65">
            {p.venue} · {p.year}
          </p>
        </div>
      </div>

      <p className="relative mt-3 text-sm text-white/72 leading-relaxed">
        {p.blurb}
      </p>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        {p.tags?.map((t: string) => (
          <span
            key={t}
            className="text-xs px-3 py-1.5 rounded-full bg-[#00ff6a]/[0.06] border border-[#00ff6a]/15 text-white/70"
          >
            {t}
          </span>
        ))}

        <div className="ml-auto flex flex-wrap gap-2">
          {p.links?.map((l: any) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-full bg-black/30 border border-white/10 text-white/70 hover:text-[#00ff6a] hover:border-[#00ff6a]/40 transition"
            >
              Open
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
});
PublicationDepthCard.displayName = "PublicationDepthCard";

const ExperienceScrollCard = React.memo(({ x, i, reduceMotion }: { x: any; i: number; reduceMotion: boolean }) => {
  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.035 }}
      className="group alive-card card-polish relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-md p-6 border border-white/[0.06] transition-[border-color,box-shadow] duration-200 hover:border-[#00ff6a]/30 hover:shadow-[0_26px_90px_rgba(0,0,0,0.55),0_0_40px_rgba(0,255,106,0.08)] will-change-[opacity,transform]"
    >
      <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,255,106,0.08),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_78%,rgba(255,255,255,0.06),transparent_62%)]" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 lg:gap-6 items-start">
        {/* Left: role + highlights */}
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-[#00ff6a]/90 transition-colors">
                {x.role}
              </h3>
              <p className="mt-1 text-sm text-white/65">
                {x.org} · {x.location} · {x.period}
              </p>
            </div>
          </div>

          <ul className="font-inter mt-4 space-y-2 text-sm text-white/72 leading-relaxed">
            {x.highlights.map((h: string) => (
              <li key={h} className="flex gap-2">
                <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]/60" />
                <span className="flex-1">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: stack - clean vertical list */}
        {x.stack?.length ? (
          <aside className="lg:pl-4 pt-4 lg:pt-0 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/8">
            <p className="text-[10px] tracking-[0.24em] text-white/45 lg:text-right mb-3">
              STACK
            </p>
            <div className="flex flex-col gap-1.5">
              {x.stack.map((t: string, idx: number) => (
                <div
                  key={t}
                  className="flex items-center lg:justify-end gap-2"
                >
                  <span className="text-[11px] text-white/65 font-medium tracking-wide">
                    {t}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff6a]/60" />
                </div>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </motion.article>
  );
});
ExperienceScrollCard.displayName = "ExperienceScrollCard";

/* -------------------- COMPONENT -------------------- */
export default function Home() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [robotGreeting, setRobotGreeting] = useState(false);
  const [zeusOpen, setZeusOpen] = useState(false);
  const zeusOpenRef = useRef(false);
  const zeusOpenedAtRef = useRef<number | null>(null); // Track when Zeus Assist was opened
  const zeusLastInteractionRef = useRef<number>(Date.now()); // Track last interaction for auto-close
  const zeusArmPointingStartRef = useRef<number | null>(null); // Track when arm started pointing
  const [activeSectionId, setActiveSectionId] = useState<string>("about");
  type ZeusEmoteType = "wave" | "heart" | "nod";
  const zeusEmoteRef = useRef<
    | null
    | {
        type: ZeusEmoteType;
        startedAt: number;
        durationMs: number;
        baseChestIntensity?: number;
        baseChestMap?: any;
        baseChestEmissiveMap?: any;
        baseChestEmissiveHex?: number;
        baseHeadRotY?: number;
        baseHeadRotX?: number;
        baseRightUpperArmRotZ?: number;
        baseRightUpperArmRotX?: number;
        baseRightHandRotX?: number;
        baseRightHandRotY?: number;
        baseRightHandRotZ?: number;
        baseRightElbowPivotRotZ?: number;
        baseRightElbowPivotRotX?: number;
        baseAntennaRingStates?: Array<{
          colorHex: number;
          emissiveHex: number;
          emissiveIntensity: number;
          opacity: number;
        }>;
        baseAntennaBeamOpacities?: number[];
      }
  >(null);
  const zeusRigRef = useRef<null | {
    head?: any;
    rightUpperArm?: any;
    rightElbowPivot?: any;
    rightHand?: any;
    chestInnerMaterial?: any;
    antennaRingBase?: any;
    antennaRingMid?: any;
    antennaRingTop?: any;
    antennaBeamBase?: any;
    antennaBeamMid?: any;
    antennaBeamTop?: any;
  }>(null);
  const zeusRestPoseRef = useRef<null | {
    headRotX: number;
    headRotY: number;
    rightUpperArmRotX: number;
    rightUpperArmRotZ: number;
    rightElbowPivotRotX: number;
    rightElbowPivotRotZ: number;
    rightHandRotX: number;
    rightHandRotY: number;
    rightHandRotZ: number;
    chestEmissiveHex?: number;
    antennaRingStates?: Array<{
      colorHex: number;
      emissiveHex: number;
      emissiveIntensity: number;
      opacity: number;
    }>;
    antennaBeamOpacities?: number[];
    chestIntensity?: number;
    chestMap?: any;
    chestEmissiveMap?: any;
  }>(null);
  const [zeusEmoteToast, setZeusEmoteToast] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const robotSectionRef = useRef<HTMLElement | null>(null);
  const experienceSectionRef = useRef<HTMLElement | null>(null);
  const projectsSectionRef = useRef<HTMLElement | null>(null);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  /* ---------- ROBOT: smooth scroll animation (no zoom, low-cost) ---------- */
  // Use scroll velocity to add a subtle "inertial tilt" while scrolling.
  // This is a CSS transform on the canvas wrapper (cheap) and does NOT increase Three.js workload.
  const scrollVelocity = useVelocity(scrollY);
  const smoothScrollVelocity = useSpring(scrollVelocity, { stiffness: 120, damping: 38 });
  // Removed rotateX tilt to prevent width distortion artifact during scroll
  const scrollTiltXRaw = useTransform(smoothScrollVelocity, [-900, 0, 900], [0, 0, 0]);
  const scrollShiftYRaw = useTransform(smoothScrollVelocity, [-900, 0, 900], [-8, 0, 8]);

  // Gate the effect so it mainly applies while the robot section is on screen.
  const { scrollYProgress: robotProgress } = useScroll({
    target: robotSectionRef,
    offset: ["start end", "end start"],
  });
  const robotPresence = useTransform(robotProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0], { clamp: true });
  // Avoid multi-input `useTransform([a,b], fn)` typing issues in strict TS builds by
  // composing via subscriptions (still runs on the motion pipeline, not React re-renders).
  const robotScrollTiltX = useMotionValue(0);
  const robotScrollShiftY = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const p = robotPresence.get();
      robotScrollTiltX.set(scrollTiltXRaw.get() * p);
      robotScrollShiftY.set(scrollShiftYRaw.get() * p);
    };

    update();
    const unsub1 = scrollTiltXRaw.on("change", update);
    const unsub2 = scrollShiftYRaw.on("change", update);
    const unsub3 = robotPresence.on("change", update);
    return () => {
      try { unsub1?.(); } catch {}
      try { unsub2?.(); } catch {}
      try { unsub3?.(); } catch {}
    };
  }, [robotPresence, robotScrollShiftY, robotScrollTiltX, scrollShiftYRaw, scrollTiltXRaw]);

  /* ---------- PROJECTS "STACK REVEAL" ---------- */
  const { scrollYProgress: projectsProgress } = useScroll({
    target: projectsSectionRef,
    offset: ["start 0.85", "end 0.25"],
  });

  const ProjectStackCard = ({ p, i }: { p: any; i: number }) => {
    // PROJECTS: reveal + unblur all cards together (no stagger between rows).
    const start = 0.0;
    const end = 0.28;
    const mid = 0.08;

    const t = useTransform(projectsProgress, [start, end], [0, 1], { clamp: true });
    const opacity = useTransform(projectsProgress, [start, mid, end], [0, 1, 1], { clamp: true });
    const y = useTransform(t, [0, 1], [22, 0]);
    const scale = useTransform(t, [0, 1], [0.97, 1]);
    const rotFrom = i % 2 === 0 ? -0.7 : 0.55;
    const rotateZ = useTransform(t, [0, 1], [rotFrom, 0]);
    const blurFrom = "blur(10px)";
    const filter = useTransform(t, [0, 1], [blurFrom, "blur(0px)"]);

    // Project cover images:
    // - image 1 shows by default
    // - if image 2 exists, arrow toggles between them
    const [showAltCover, setShowAltCover] = useState(false);

    // Reset per-project state when card data changes
    useEffect(() => {
      setShowAltCover(false);
    }, [p.title]);

    const cover1: string | undefined = p?.cover1;
    const cover2: string | undefined = p?.cover2;
    const hasAltCover = !!cover2;
    const coverSrc = showAltCover && cover2 ? cover2 : cover1;

    return (
      <motion.article
        key={p.title}
        style={{
          y: reduceMotion ? 0 : y,
          rotateZ: reduceMotion ? 0 : rotateZ,
          scale: reduceMotion ? 1 : scale,
          opacity: reduceMotion ? 1 : opacity,
          filter: reduceMotion ? "none" : (filter as any),
          willChange: reduceMotion ? undefined : ("transform, filter, opacity" as any),
          transformPerspective: 1000,
        }}
        data-perf-filter
        // Hover should not shift a single card vertically (avoids "one drops while others don't").
        // Keep hover polish via scale + shadow/border only.
        whileHover={reduceMotion ? undefined : { scale: 1.01 }}
        className="group card-polish relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 md:p-6
                   shadow-[0_0_0_1px_rgba(0,255,106,0.10)]
                   hover:border-[#00ff6a]/35 hover:shadow-[0_0_0_1px_rgba(0,255,106,0.22),0_28px_100px_rgba(0,0,0,0.55)]
                   transition"
        onClick={() => setActiveProject(p)}
        role="button"
        aria-label={`Open project: ${prettifyProjectTitle(p.title)}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setActiveProject(p);
        }}
      >
        {/* Big landscape cover (no text on the photo) */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] aspect-video">
          <div className="absolute inset-0" style={projectCoverStyle(i)} />
          {/* Cover image is hardcoded per project (fast + case-safe on Linux). */}
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={`${prettifyProjectTitle(p.title)} cover${showAltCover && hasAltCover ? " (2)" : ""}`}
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              style={{
                // Keep it neutral (no tint), just a touch of contrast
                filter: "brightness(1.06) contrast(1.04)",
              }}
            />
          ) : null}

          {/* Keep covers bright: only subtle highlight (no heavy dark overlay) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_55%,rgba(0,0,0,0.18))]" />
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
        </div>

        {/* Below-photo row (no overlay on the image) */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <h3 className="font-inter text-[clamp(1.05rem,1.6vw,1.35rem)] font-semibold text-white/92 leading-tight">
            {prettifyProjectTitle(p.title)}
          </h3>

          {hasAltCover ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAltCover((v) => !v);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/75
                         hover:border-white/20 hover:text-white transition"
              aria-label={`Toggle project image for ${prettifyProjectTitle(p.title)}`}
              title="Toggle image"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 7h11l-2.5-2.5" />
                <path d="M18 17H7l2.5 2.5" />
                <path d="M18 7v4" />
                <path d="M7 17v-4" />
              </svg>
            </button>
          ) : null}
        </div>
      </motion.article>
    );
  };

  /* ---------- Use memoized card components (defined outside Home) ---------- */

  const resetZeusToRestPose = () => {
    const rig = zeusRigRef.current;
    const rest = zeusRestPoseRef.current;
    if (!rig || !rest) return;

    if (rig.head) {
      rig.head.rotation.x = rest.headRotX;
      rig.head.rotation.y = rest.headRotY;
    }
    if (rig.rightUpperArm) {
      rig.rightUpperArm.rotation.x = rest.rightUpperArmRotX;
      rig.rightUpperArm.rotation.z = rest.rightUpperArmRotZ;
    }
    if (rig.rightElbowPivot) {
      rig.rightElbowPivot.rotation.x = rest.rightElbowPivotRotX;
      rig.rightElbowPivot.rotation.z = rest.rightElbowPivotRotZ;
    }
    if (rig.rightHand) {
      rig.rightHand.rotation.x = rest.rightHandRotX;
      rig.rightHand.rotation.y = rest.rightHandRotY;
      rig.rightHand.rotation.z = rest.rightHandRotZ;
    }
    if (rig.chestInnerMaterial && typeof rest.chestEmissiveHex === "number") {
      try {
        rig.chestInnerMaterial.emissive?.setHex?.(rest.chestEmissiveHex);
      } catch {}
      rig.chestInnerMaterial.needsUpdate = true;
    }
    if (rest.antennaRingStates && rest.antennaRingStates.length) {
      const rings = [rig.antennaRingBase, rig.antennaRingMid, rig.antennaRingTop].filter(Boolean);
      rings.forEach((mesh: any, i: number) => {
        const st = rest.antennaRingStates?.[i];
        const mat = mesh?.material;
        if (!st || !mat) return;
        try {
          mat.color?.setHex?.(st.colorHex);
          mat.emissive?.setHex?.(st.emissiveHex);
          mat.emissiveIntensity = st.emissiveIntensity;
          mat.opacity = st.opacity;
          mat.needsUpdate = true;
        } catch {}
      });
    }
    if (rest.antennaBeamOpacities && rest.antennaBeamOpacities.length) {
      const beams = [rig.antennaBeamBase, rig.antennaBeamMid, rig.antennaBeamTop].filter(Boolean);
      beams.forEach((mesh: any, i: number) => {
        const o = rest.antennaBeamOpacities?.[i];
        const mat = mesh?.material;
        if (typeof o !== "number" || !mat) return;
        try {
          mat.opacity = o;
          mat.needsUpdate = true;
        } catch {}
      });
    }
    if (rig.chestInnerMaterial) {
      if (typeof rest.chestIntensity === "number") rig.chestInnerMaterial.emissiveIntensity = rest.chestIntensity;
      if (typeof rest.chestMap !== "undefined") rig.chestInnerMaterial.map = rest.chestMap;
      if (typeof rest.chestEmissiveMap !== "undefined") rig.chestInnerMaterial.emissiveMap = rest.chestEmissiveMap;
      rig.chestInnerMaterial.needsUpdate = true;
    }
  };

  // Keep the Three.js animation loop in sync with React state.
  useEffect(() => {
    zeusOpenRef.current = zeusOpen;
    if (zeusOpen) {
      // Track when Zeus Assist opened and reset arm pointing timer
      zeusOpenedAtRef.current = Date.now();
      zeusArmPointingStartRef.current = Date.now();
      zeusLastInteractionRef.current = Date.now();
    } else {
      // When the assistant closes, restore Zeus to a clean rest pose.
      resetZeusToRestPose();
      zeusOpenedAtRef.current = null;
      zeusArmPointingStartRef.current = null;
    }
  }, [zeusOpen]);

  // Auto-close Zeus Assist after ~8 seconds of no interaction
  useEffect(() => {
    if (!zeusOpen) return;
    const checkIdle = setInterval(() => {
      const idleMs = Date.now() - zeusLastInteractionRef.current;
      if (idleMs > 8000) {
        setZeusOpen(false);
      }
    }, 1000);
    return () => clearInterval(checkIdle);
  }, [zeusOpen]);

  const [activeProject, setActiveProject] = useState<any>(null);
  const hasRealHref = (href?: string) =>
    !!href && href !== "#" && !href.includes("YOUR_LINK");

  const ZEUS_SECTIONS = useMemo(
    () =>
      [
        { id: "about", label: "About" },
        { id: "robot", label: "Zeus" },
        { id: "experience", label: "Experience" },
        { id: "publications", label: "Publications" },
        { id: "projects", label: "Project" },
      ] as const,
    []
  );

  const scrollToSection = (id: string) => {
    // Reset Zeus interaction timer whenever user navigates
    zeusLastInteractionRef.current = Date.now();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const triggerZeusEmote = (type: ZeusEmoteType) => {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const durationMs = type === "wave" ? 1400 : type === "nod" ? 1200 : 1400;

    // If the user spam-clicks emotes, always snap back to the last known rest pose first.
    // This prevents "stacking" transforms and leaving Zeus bent weirdly.
    resetZeusToRestPose();
    zeusEmoteRef.current = null;

    const rest = zeusRestPoseRef.current;
    zeusEmoteRef.current = {
      type,
      startedAt: now,
      durationMs,
      ...(rest
        ? {
            baseHeadRotX: rest.headRotX,
            baseHeadRotY: rest.headRotY,
            baseRightUpperArmRotX: rest.rightUpperArmRotX,
            baseRightUpperArmRotZ: rest.rightUpperArmRotZ,
            baseRightElbowPivotRotX: rest.rightElbowPivotRotX,
            baseRightElbowPivotRotZ: rest.rightElbowPivotRotZ,
            baseRightHandRotX: rest.rightHandRotX,
            baseRightHandRotY: rest.rightHandRotY,
            baseRightHandRotZ: rest.rightHandRotZ,
            baseChestIntensity: rest.chestIntensity,
            baseChestMap: rest.chestMap,
            baseChestEmissiveMap: rest.chestEmissiveMap,
            baseChestEmissiveHex: rest.chestEmissiveHex,
            baseAntennaRingStates: rest.antennaRingStates,
            baseAntennaBeamOpacities: rest.antennaBeamOpacities,
          }
        : null),
    };

    const msg =
      type === "wave"
        ? "Zeus waves hello."
        : type === "nod"
        ? "Zeus nods happily!"
        : "Zeus sends a heart-beep.";
    setZeusEmoteToast(msg);
    window.setTimeout(() => setZeusEmoteToast(null), 1500);
  };

  const projectCoverStyle = (i: number): React.CSSProperties => {
    const presets = [
      // Neutral (no green hue) to keep photos true-to-color
      ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.06)"],
      ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.05)"],
      ["rgba(255,255,255,0.07)", "rgba(255,255,255,0.06)"],
      ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.05)"],
    ];
    const [a, b] = presets[i % presets.length];
    return {
      backgroundImage: `radial-gradient(900px 260px at 18% 0%, ${a}, transparent 60%), radial-gradient(700px 220px at 85% 70%, ${b}, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.55))`,
    };
  };

  /* ---------- Decorative background (static) ---------- */
  const circuitTraces = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        height: `${28 + Math.random() * 120}px`,
        opacity: 0.12 + Math.random() * 0.25,
      })),
    []
  );

  // Preload Three.js early so the robot section doesn't hitch on first view.
  useEffect(() => {
    loadThree().catch(() => {});
  }, []);

  // Always start at the top (ISHIKA) on refresh / navigation
  useEffect(() => {
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {}
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Track which section the user is currently viewing (used by Zeus assistant)
  useEffect(() => {
    const ids = ZEUS_SECTIONS.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.id) setActiveSectionId(top.id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ZEUS_SECTIONS]);

  // Perf: keep all the fancy glass/blur when idle, but drop it while actively scrolling
  // (restores ~120ms after scroll ends). Big win on Windows without changing the "look" at rest.
  useEffect(() => {
    let t: number | null = null;
    const root = document.documentElement;

    const onScroll = () => {
      root.classList.add("is-scrolling");
      if (t != null) window.clearTimeout(t);
      t = window.setTimeout(() => {
        root.classList.remove("is-scrolling");
        t = null;
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      if (t != null) window.clearTimeout(t);
      root.classList.remove("is-scrolling");
    };
  }, []);

  // Mouse position for 3D robot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Mouse tracking for 3D robot (no custom cursor ring)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  // Three.js Robot Setup - Load from CDN
  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    let destroyed = false;
    let resizeRenderer: (() => void) | null = null;
    let handleCanvasClick: ((event: MouseEvent) => void) | null = null;
    let animationFrameId: number | null = null;
    let observer: IntersectionObserver | null = null;
    let scrollTimer: number | null = null;
    let lowQuality = false;
    let isInView = false;
    let isTabVisible = document.visibilityState !== "hidden";
    let isRunning = false;
    let lastFrameT = 0;
    let initStarted = false;
    let initTimer: number | null = null;
    let runTimer: number | null = null;
    let cleanupRuntime: (() => void) | null = null;
    let setRunningExternal: (() => void) | null = null;
    const root = document.documentElement;

    const scheduleInit = () => {
      if (initTimer != null) window.clearTimeout(initTimer);
      // Wait for scroll to "settle" before doing heavy work.
      initTimer = window.setTimeout(() => {
        maybeInit();
      }, 160);
    };

    const scheduleRunCheck = () => {
      if (runTimer != null) window.clearTimeout(runTimer);
      runTimer = window.setTimeout(() => {
        try {
          setRunningExternal?.();
        } catch {}
      }, 160);
    };

    // Keep `isInView` accurate + trigger deferred init/run when the robot section becomes visible.
    if (robotSectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isInView = !!entry?.isIntersecting;
          if (isInView) scheduleInit();
          scheduleRunCheck();
        },
        { threshold: 0.12 }
      );
      observer.observe(robotSectionRef.current);
    }

    // When the user scrolls, we want to:
    // - delay init until scroll settles
    // - pause rendering while scrolling (setRunning checks `html.is-scrolling`)
    const onGlobalScroll = () => {
      scheduleInit();
      scheduleRunCheck();
    };
    window.addEventListener("scroll", onGlobalScroll, { passive: true });

    const onVisibility = () => {
      isTabVisible = document.visibilityState !== "hidden";
      scheduleInit();
      scheduleRunCheck();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const maybeInit = () => {
      if (destroyed || initStarted) return;
      if (!isTabVisible) return;

      // Initialize only when the robot section is actually in view (keeps About instant).
      if (!isInView) return;

      // Don't initialize while actively scrolling.
      if (root.classList.contains("is-scrolling")) {
        scheduleInit();
        return;
      }

      initStarted = true;
      initRobot();
    };

    const initRobot = async () => {
      const THREE = await loadThree().catch(() => null);
      if (!THREE || destroyed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true,
        antialias: true 
      });
      
      renderer.setClearColor(0x000000, 0);
      const defaultPixelRatio = Math.min(window.devicePixelRatio || 1, 1.2);
      renderer.setPixelRatio(defaultPixelRatio);
      // Better-looking output on modern displays
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // Slightly lower exposure to avoid "washed" greens under ACES,
      // we'll compensate with green rim/accents.
      renderer.toneMappingExposure = 1.16;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      resizeRenderer = () => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;
        const { width, height } = canvasEl.getBoundingClientRect();
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      resizeRenderer();
      // We'll frame the camera to the robot bounds after it's created (keeps antenna + feet in view).

      // Raycaster for click detection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      let chestInnerMaterial: any = null;

      // Subtle "screen" texture so the panels read as modern translucent displays
      const createScreenTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.Texture(canvas);

        // Background gradient
        const g = ctx.createLinearGradient(0, 0, 256, 256);
        g.addColorStop(0, '#00130a');
        g.addColorStop(0.45, '#00331a');
        g.addColorStop(1, '#000b06');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 256);

        // Soft glow vignette
        const rg = ctx.createRadialGradient(128, 128, 10, 128, 128, 140);
        rg.addColorStop(0, 'rgba(0,255,106,0.22)');
        rg.addColorStop(1, 'rgba(0,255,106,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, 256, 256);

        // Scanlines
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (let y = 0; y < 256; y += 4) {
          ctx.fillRect(0, y, 256, 1);
        }

        // Small HUD ticks
        ctx.strokeStyle = 'rgba(0,255,106,0.35)';
        ctx.lineWidth = 2;
        ctx.strokeRect(18, 18, 220, 220);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0,255,106,0.25)';
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(28 + i * 36, 32);
          ctx.lineTo(28 + i * 36, 44);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(32, 28 + i * 36);
          ctx.lineTo(44, 28 + i * 36);
          ctx.stroke();
        }

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      };

      const screenTexture = createScreenTexture();

      const createHeartTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.Texture(canvas);

        // Dark background matching chest panel
        ctx.fillStyle = "#050607";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center coordinates for the heart
        const cx = 256;
        const cy = 256;

        // Draw robotic heart shape with circuit aesthetic
        ctx.save();
        ctx.translate(cx, cy);
        
        // Outer glow
        ctx.shadowColor = "rgba(0, 255, 106, 0.5)";
        ctx.shadowBlur = 35;
        
        // Main heart path (centered and scaled)
        const drawHeart = (scale: number) => {
          ctx.beginPath();
          ctx.moveTo(0, 55 * scale);
          ctx.bezierCurveTo(0, 25 * scale, -55 * scale, 5 * scale, -55 * scale, -25 * scale);
          ctx.bezierCurveTo(-55 * scale, -55 * scale, -25 * scale, -68 * scale, 0, -38 * scale);
          ctx.bezierCurveTo(25 * scale, -68 * scale, 55 * scale, -55 * scale, 55 * scale, -25 * scale);
          ctx.bezierCurveTo(55 * scale, 5 * scale, 0, 25 * scale, 0, 55 * scale);
        };
        
        // Outer stroke (circuit board trace style)
        drawHeart(1.15);
        ctx.strokeStyle = "#00ff6a";
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Main heart fill with gradient
        drawHeart(1.0);
        const grd = ctx.createLinearGradient(-60, -70, 60, 70);
        grd.addColorStop(0, "#00ff6a");
        grd.addColorStop(0.4, "#00cc55");
        grd.addColorStop(0.7, "#00ff6a");
        grd.addColorStop(1, "#7CFFB7");
        ctx.fillStyle = grd;
        ctx.fill();
        
        // Inner circuit pattern - geometric lines
        ctx.strokeStyle = "rgba(0, 40, 20, 0.6)";
        ctx.lineWidth = 2;
        
        // Vertical center line
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(0, 40);
        ctx.stroke();
        
        // Horizontal connections
        ctx.beginPath();
        ctx.moveTo(-25, -10);
        ctx.lineTo(25, -10);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-18, 15);
        ctx.lineTo(18, 15);
        ctx.stroke();
        
        // Circuit nodes (small circles at intersections)
        ctx.fillStyle = "#003318";
        const nodes = [[0, -30], [0, -10], [0, 15], [0, 40], [-25, -10], [25, -10], [-18, 15], [18, 15]];
        nodes.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Glowing center core
        const coreGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
        coreGrd.addColorStop(0, "rgba(200, 255, 220, 0.9)");
        coreGrd.addColorStop(0.5, "rgba(0, 255, 106, 0.6)");
        coreGrd.addColorStop(1, "rgba(0, 255, 106, 0)");
        ctx.fillStyle = coreGrd;
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        const tex = new THREE.Texture(canvas);
        tex.needsUpdate = true;
        return tex;
      };

      const heartTexture = createHeartTexture();

      // Create a simple robot structure
      const createRobot = () => {
        const robot = new THREE.Group();
        
        // Modern material set (graphite + clearcoat shell + accents)
        const graphiteMaterial = new THREE.MeshStandardMaterial({
          color: 0x1f2328,
          metalness: 0.85,
          roughness: 0.32,
        });

        const shellMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x0f1114,
          metalness: 0.9,
          roughness: 0.16,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
        });

        const matteDarkMaterial = new THREE.MeshStandardMaterial({
          color: 0x2c3138,
          metalness: 0.55,
          roughness: 0.55,
        });

        const accentGlowMaterial = new THREE.MeshStandardMaterial({
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 2.3,
          transparent: true,
          opacity: 0.9,
        });
        // Keep neon accents crisp under ACES tonemapping
        accentGlowMaterial.toneMapped = false;

        // Warm complement accent (pairs with neon green without reading as "blue/cyan")
        const warmAccentGlowMaterial = new THREE.MeshStandardMaterial({
          color: 0xffc58a,
          emissive: 0xffa45a,
          emissiveIntensity: 1.9,
          transparent: true,
          opacity: 0.78,
        });
        warmAccentGlowMaterial.toneMapped = false;

        // Main body (sleeker proportions + shell layering)
        const bodyGroup = new THREE.Group();
        bodyGroup.position.y = 0;

        const bodyCore = new THREE.Mesh(
          new THREE.BoxGeometry(1.16, 1.58, 0.82),
          graphiteMaterial
        );
        bodyGroup.add(bodyCore);

        const bodyShell = new THREE.Mesh(
          new THREE.BoxGeometry(1.22, 1.64, 0.86),
          shellMaterial
        );
        bodyShell.position.z = -0.01; // tiny offset to reduce z-fighting
        bodyGroup.add(bodyShell);

        // Clean front "seams" to break up the boxy look
        const seamGeometry = new THREE.BoxGeometry(0.04, 1.22, 0.02);
        const leftSeam = new THREE.Mesh(seamGeometry, warmAccentGlowMaterial);
        leftSeam.position.set(-0.54, 0.02, 0.43);
        bodyGroup.add(leftSeam);

        const rightSeam = new THREE.Mesh(seamGeometry, warmAccentGlowMaterial);
        rightSeam.position.set(0.54, 0.02, 0.43);
        bodyGroup.add(rightSeam);

        const spine = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 1.25, 0.02),
          new THREE.MeshStandardMaterial({
            color: 0xffc58a,
            emissive: 0xffa45a,
            emissiveIntensity: 0.65,
            transparent: true,
            opacity: 0.55,
          })
        );
        (spine.material as any).toneMapped = false;
        spine.position.set(0, 0.0, -0.43);
        bodyGroup.add(spine);

        robot.add(bodyGroup);

        // Chest panel (modern "screen" behind glass cover)
        const chestGroup = new THREE.Group();
        chestGroup.position.set(0, 0.2, 0.455);
        chestGroup.name = 'chest';

        // Subtle frame so it pops on dark body
        const chestFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.86, 0.66, 0.06),
          new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.95,
            roughness: 0.25,
          })
        );
        chestGroup.add(chestFrame);

        const chestInnerGeometry = new THREE.PlaneGeometry(0.74, 0.54);
        chestInnerMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x00ff6a,
          emissiveIntensity: 1.4,
          transparent: true,
          opacity: 0.95,
          roughness: 0.8,
          metalness: 0.0,
          side: THREE.DoubleSide,
          map: screenTexture,
          emissiveMap: screenTexture,
        });
        const chestInner = new THREE.Mesh(chestInnerGeometry, chestInnerMaterial);
        chestInner.position.z = 0.035;
        chestGroup.add(chestInner);

        // Glass cover (Phong gives strong, visible highlights even without env maps)
        const chestGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(0.78, 0.58),
          new THREE.MeshPhongMaterial({
            color: 0x66ff99,
            transparent: true,
            opacity: 0.22,
            shininess: 120,
            specular: 0x88ffbb,
          })
        );
        chestGlass.position.z = 0.051;
        chestGroup.add(chestGlass);

        robot.add(chestGroup);
        
        // Head (layered + ear pods for a more "designed" silhouette)
        const headGroup = new THREE.Group();
        headGroup.position.y = 1.42;
        headGroup.name = "head";

        const headCore = new THREE.Mesh(
          new THREE.BoxGeometry(0.78, 0.66, 0.68),
          graphiteMaterial
        );
        headGroup.add(headCore);

        const headShell = new THREE.Mesh(
          new THREE.BoxGeometry(0.84, 0.72, 0.72),
          shellMaterial
        );
        headShell.position.z = -0.01;
        headGroup.add(headShell);

        const earGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 20);
        const leftEar = new THREE.Mesh(earGeometry, matteDarkMaterial);
        leftEar.rotation.z = Math.PI / 2;
        leftEar.position.set(-0.48, 0.05, -0.06);
        headGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, matteDarkMaterial);
        rightEar.rotation.z = Math.PI / 2;
        rightEar.position.set(0.48, 0.05, -0.06);
        headGroup.add(rightEar);

        const earRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.075, 0.012, 12, 36),
          warmAccentGlowMaterial
        );
        earRing.rotation.y = Math.PI / 2;
        earRing.position.set(-0.54, 0.05, -0.06);
        headGroup.add(earRing);

        const earRing2 = earRing.clone();
        earRing2.position.set(0.54, 0.05, -0.06);
        headGroup.add(earRing2);

        robot.add(headGroup);

        // Antenna (mounted on top of head so it never clips)
        const antennaGroup = new THREE.Group();
        antennaGroup.name = "antenna";
        // Sit clearly above the head and slightly forward so it's never hidden
        antennaGroup.position.set(0, 0.46, 0.18);
        antennaGroup.rotation.z = -0.08;
        antennaGroup.scale.set(1.05, 1.05, 1.05);

        // Antenna stem/cap - dark metallic grey with subtle green tint to match robot
        const antennaMetalMaterial = new THREE.MeshStandardMaterial({
          color: 0x2a2a2a,
          metalness: 0.85,
          roughness: 0.3,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.05, // very subtle green glow
        });

        const antennaStemGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.44, 16);
        const antennaStem = new THREE.Mesh(antennaStemGeometry, antennaMetalMaterial);
        antennaStem.position.y = 0.22;
        antennaGroup.add(antennaStem);

        const ringMaterialBase = new THREE.MeshStandardMaterial({
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 2.2, // matches visor panel
          transparent: true,
          opacity: 0.92,
        });
        ringMaterialBase.toneMapped = false;
        const ringMaterialMid = ringMaterialBase.clone();
        const ringMaterialTop = ringMaterialBase.clone();

        const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.014, 12, 40), ringMaterialBase);
        baseRing.name = "antennaRingBase";
        baseRing.rotation.x = Math.PI / 2;
        baseRing.position.y = 0.04;
        antennaGroup.add(baseRing);

        const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.01, 12, 40), ringMaterialMid);
        midRing.name = "antennaRingMid";
        midRing.rotation.x = Math.PI / 2;
        midRing.position.y = 0.18;
        antennaGroup.add(midRing);

        const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 12, 40), ringMaterialTop);
        topRing.name = "antennaRingTop";
        topRing.rotation.x = Math.PI / 2;
        topRing.position.y = 0.31;
        antennaGroup.add(topRing);

        // Heart-emote "tower" beams (normally invisible; we animate opacity during heart)
        const beamMatBase = new THREE.MeshBasicMaterial({
          // Match the chest HUD line color (neon green), so it never reads "blue".
          color: 0x00ff6a,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        (beamMatBase as any).toneMapped = false;
        const beamMatMid = beamMatBase.clone();
        const beamMatTop = beamMatBase.clone();

        const beamGeoBase = new THREE.CylinderGeometry(0.065, 0.05, 0.16, 18, 1, true);
        const beamGeoMid = new THREE.CylinderGeometry(0.055, 0.042, 0.16, 18, 1, true);
        const beamGeoTop = new THREE.CylinderGeometry(0.048, 0.036, 0.16, 18, 1, true);

        const beamBase = new THREE.Mesh(beamGeoBase, beamMatBase);
        beamBase.name = "antennaBeamBase";
        beamBase.position.y = 0.11;
        antennaGroup.add(beamBase);

        const beamMid = new THREE.Mesh(beamGeoMid, beamMatMid);
        beamMid.name = "antennaBeamMid";
        beamMid.position.y = 0.25;
        antennaGroup.add(beamMid);

        const beamTop = new THREE.Mesh(beamGeoTop, beamMatTop);
        beamTop.name = "antennaBeamTop";
        beamTop.position.y = 0.38;
        antennaGroup.add(beamTop);

        const antennaCap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 18), antennaMetalMaterial);
        antennaCap.position.y = 0.44;
        antennaGroup.add(antennaCap);

        // Antenna tip - solid glowing green orb (matches visor panel color)
        const tipGlassMat = new THREE.MeshStandardMaterial({
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 2.2, // matches visor intensity
          transparent: true,
          opacity: 0.92,
          metalness: 0.05,
          roughness: 0.15,
        });
        tipGlassMat.toneMapped = false;
        const tipGlass = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 24, 24),
          tipGlassMat
        );
        tipGlass.position.y = 0.51;
        antennaGroup.add(tipGlass);

        const tipHaloMat = new THREE.MeshStandardMaterial({
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 2.6,
          transparent: true,
          opacity: 0.8,
        });
        tipHaloMat.toneMapped = false;
        const tipHalo = new THREE.Mesh(
          new THREE.TorusGeometry(0.095, 0.006, 10, 48),
          tipHaloMat
        );
        tipHalo.rotation.x = Math.PI / 2;
        tipHalo.position.y = 0.51;
        antennaGroup.add(tipHalo);

        headGroup.add(antennaGroup);

        // Visor (modern "screen" behind glass cover, in the same green theme)
        const visorGroup = new THREE.Group();
        // NOTE: This is local to `headGroup` so the visor follows head nods.
        visorGroup.position.set(0, 0.03, 0.395);
        visorGroup.name = "visor";

        const visorFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.78, 0.28, 0.06),
          new THREE.MeshStandardMaterial({
            color: 0x121212,
            metalness: 0.95,
            roughness: 0.25,
          })
        );
        visorGroup.add(visorFrame);

        const visorInner = new THREE.Mesh(
          new THREE.PlaneGeometry(0.66, 0.16),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x00ff6a,
            emissiveIntensity: 1.6,
            transparent: true,
            opacity: 0.95,
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide,
            map: screenTexture,
            emissiveMap: screenTexture,
          })
        );
        visorInner.position.z = 0.035;
        visorGroup.add(visorInner);

        const visorGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(0.70, 0.20),
          new THREE.MeshPhongMaterial({
            color: 0x66ff99,
            transparent: true,
            opacity: 0.18,
            shininess: 140,
            specular: 0x88ffbb,
          })
        );
        visorGlass.position.z = 0.051;
        visorGroup.add(visorGlass);

        headGroup.add(visorGroup);


        // Shoulders (sleek caps)
        const shoulderGeometry = new THREE.SphereGeometry(0.26, 22, 22);
        const shoulderMaterial = shellMaterial;
        
        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.position.set(-0.86, 0.62, 0);
        robot.add(leftShoulder);
        
        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        rightShoulder.position.set(0.86, 0.62, 0);
        robot.add(rightShoulder);

        // Arms (more designed: joint caps + two-tone segments)
        const upperArmGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.78, 16);
        
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, graphiteMaterial);
        leftUpperArm.position.set(-0.86, 0.1, 0);
        leftUpperArm.name = "leftUpperArm";
        robot.add(leftUpperArm);
        
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, graphiteMaterial);
        rightUpperArm.position.set(0.86, 0.1, 0);
        // Keep the mesh name distinct; `rightUpperArm` will be the shoulder pivot group.
        rightUpperArm.name = "rightUpperArmMesh";
        robot.add(rightUpperArm);

        // Forearms
        const forearmGeometry = new THREE.CylinderGeometry(0.11, 0.12, 0.68, 16);
        
        const leftForearm = new THREE.Mesh(forearmGeometry, matteDarkMaterial);
        leftForearm.position.set(-0.86, -0.55, 0.03);
        leftForearm.name = "leftForearm";
        robot.add(leftForearm);
        
        const rightForearm = new THREE.Mesh(forearmGeometry, matteDarkMaterial);
        rightForearm.position.set(0.86, -0.55, 0.03);
        rightForearm.name = "rightForearm";
        robot.add(rightForearm);

        const jointGeometry = new THREE.SphereGeometry(0.11, 18, 18);
        const leftElbow = new THREE.Mesh(jointGeometry, shellMaterial);
        leftElbow.position.set(-0.86, -0.2, 0);
        leftElbow.name = "leftElbow";
        robot.add(leftElbow);

        const rightElbow = new THREE.Mesh(jointGeometry, shellMaterial);
        rightElbow.position.set(0.86, -0.2, 0);
        rightElbow.name = "rightElbow";
        robot.add(rightElbow);

        // Hands (modern modules: cuff + palm + fingers + glow ring)
        const createHand = (side: number) => {
          const hand = new THREE.Group();
          hand.position.set(0.86 * side, -0.98, 0.06);
          hand.rotation.y = side > 0 ? -0.18 : 0.18;
          hand.name = side > 0 ? "rightHand" : "leftHand";

          // Wrist cuff
          const cuff = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11, 0.105, 0.08, 22),
            shellMaterial
          );
          cuff.rotation.x = Math.PI / 2;
          cuff.position.set(0, 0.02, 0);
          hand.add(cuff);

          const cuffRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.115, 0.008, 12, 40),
            accentGlowMaterial
          );
          cuffRing.rotation.y = Math.PI / 2;
          cuffRing.position.set(0, 0.02, 0);
          hand.add(cuffRing);

          // Palm body
          const palm = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.11, 0.22),
            graphiteMaterial
          );
          palm.position.set(0, -0.04, 0.12);
          hand.add(palm);

          // Finger blocks (3)
          const fingerGeo = new THREE.BoxGeometry(0.05, 0.03, 0.14);
          for (let i = -1; i <= 1; i++) {
            const finger = new THREE.Mesh(fingerGeo, matteDarkMaterial);
            finger.position.set(i * 0.055, -0.07, 0.26);
            hand.add(finger);

            // Glowing fingertip (subtle)
            const tip = new THREE.Mesh(new THREE.SphereGeometry(0.017, 12, 12), accentGlowMaterial);
            tip.position.set(i * 0.055, -0.07, 0.34);
            hand.add(tip);
          }

          // Thumb
          const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.10), matteDarkMaterial);
          thumb.position.set(0.09 * side, -0.05, 0.18);
          thumb.rotation.y = side > 0 ? -0.55 : 0.55;
          hand.add(thumb);

          const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), accentGlowMaterial);
          thumbTip.position.set(0.12 * side, -0.05, 0.24);
          hand.add(thumbTip);

          // Small glow dot
          const glowDot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), accentGlowMaterial);
          glowDot.position.set(0, -0.02, 0.17);
          hand.add(glowDot);

          return hand;
        };

        const leftHand = createHand(-1);
        robot.add(leftHand);
        const rightHand = createHand(1);
        robot.add(rightHand);

        // --- RIGHT ARM RIG (so forearm/hand follow bicep instead of drifting) ---
        // We build a tiny hierarchy:
        // robot -> rightUpperArm (shoulder pivot) -> rightElbowPivot (elbow pivot) -> (forearm + hand)
        const rightUpperArmPivot = new THREE.Group();
        rightUpperArmPivot.name = "rightUpperArm";
        rightUpperArmPivot.position.set(0.86, 0.62, 0); // same as rightShoulder
        robot.add(rightUpperArmPivot);

        const rightElbowPivot = new THREE.Group();
        rightElbowPivot.name = "rightElbowPivot";
        rightElbowPivot.position.set(0, -0.82, 0); // elbow world Y(-0.2) - shoulder world Y(0.62)
        rightUpperArmPivot.add(rightElbowPivot);

        // Re-parent while preserving current world transforms.
        rightUpperArmPivot.attach(rightUpperArm);
        rightElbowPivot.attach(rightElbow);
        rightElbowPivot.attach(rightForearm);
        rightElbowPivot.attach(rightHand);

        // Pelvis/waist
        const waistGeometry = new THREE.BoxGeometry(1.14, 0.32, 0.76);
        const waist = new THREE.Mesh(waistGeometry, shellMaterial);
        waist.position.y = -0.98;
        robot.add(waist);

        // Legs (thicker, more robotic)
        const thighGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.98, 16);
        
        const leftThigh = new THREE.Mesh(thighGeometry, graphiteMaterial);
        leftThigh.position.set(-0.36, -1.68, 0.02);
        robot.add(leftThigh);
        
        const rightThigh = new THREE.Mesh(thighGeometry, graphiteMaterial);
        rightThigh.position.set(0.36, -1.68, 0.02);
        robot.add(rightThigh);

        // Lower legs
        const shinGeometry = new THREE.CylinderGeometry(0.17, 0.18, 0.88, 16);
        
        const leftShin = new THREE.Mesh(shinGeometry, matteDarkMaterial);
        leftShin.position.set(-0.36, -2.5, 0.06);
        robot.add(leftShin);
        
        const rightShin = new THREE.Mesh(shinGeometry, matteDarkMaterial);
        rightShin.position.set(0.36, -2.5, 0.06);
        robot.add(rightShin);

        const kneeGeometry = new THREE.SphereGeometry(0.13, 18, 18);
        const leftKnee = new THREE.Mesh(kneeGeometry, shellMaterial);
        leftKnee.position.set(-0.36, -2.15, 0);
        robot.add(leftKnee);

        const rightKnee = new THREE.Mesh(kneeGeometry, shellMaterial);
        rightKnee.position.set(0.36, -2.15, 0);
        robot.add(rightKnee);

        // Feet (modern boots: sole + upper + toe cap + ankle ring)
        const createFoot = (side: number) => {
          const foot = new THREE.Group();
          foot.position.set(0.36 * side, -3.02, 0.14);

          const sole = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, 0.08, 0.72),
            new THREE.MeshStandardMaterial({
              color: 0x0b0d10,
              metalness: 0.65,
              roughness: 0.35,
            })
          );
          sole.position.y = -0.06;
          foot.add(sole);

          const upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.36, 0.16, 0.60),
            shellMaterial
          );
          upper.position.y = 0.02;
          foot.add(upper);

          const toeCap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.16, 0.19, 0.18, 22),
            graphiteMaterial
          );
          toeCap.rotation.x = Math.PI / 2;
          toeCap.position.set(0, 0.03, 0.28);
          foot.add(toeCap);

          // Front toe circle glow (matches ears + finger tips)
          const toeRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.185, 0.008, 10, 56),
            warmAccentGlowMaterial
          );
          toeRing.position.set(0, 0.03, 0.41);
          foot.add(toeRing);

          const heel = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.10, 0.18),
            graphiteMaterial
          );
          heel.position.set(0, -0.01, -0.28);
          foot.add(heel);

          const ankleRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.16, 0.012, 12, 40),
            warmAccentGlowMaterial
          );
          ankleRing.rotation.x = Math.PI / 2;
          ankleRing.position.set(0, 0.11, -0.05);
          foot.add(ankleRing);

          const sideGlow = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.06, 0.36),
            warmAccentGlowMaterial
          );
          sideGlow.position.set(0.18 * side, 0.02, 0.02);
          foot.add(sideGlow);

          return foot;
        };

        robot.add(createFoot(-1));
        robot.add(createFoot(1));

        return robot;
      };

      const robot = createRobot();
      // Slightly larger now that the canvas fills the viewport
      const targetScale = 1.62;
      // Set to target scale first (needed for fitCameraToObject to work correctly)
      robot.scale.set(targetScale, targetScale, targetScale);
      
      // Modern entrance animation state
      let robotAppearProgress = 0; // 0 to 1
      const entranceStartY = -1.8; // Start position (below view)
      const entranceTargetY = 0; // Final resting Y position (will be combined with float)
      const entranceStartRotY = -0.4; // Start slightly rotated
      const entranceDuration = 1.2; // Total animation duration in seconds (at 50fps = 60 frames)
      const entranceFrameIncrement = 1 / (entranceDuration * 50); // Progress per frame
      
      // Easing functions for modern feel
      const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const easeOutBack = (t: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };
      const easeOutElastic = (t: number) => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
      };

      // Named parts for cute emotes (optional - safe to be null)
      const zeusHead: any = robot.getObjectByName("head");
      const zeusVisor: any = robot.getObjectByName("visor");
      const zeusRightUpperArm: any = robot.getObjectByName("rightUpperArm");
      const zeusRightForearm: any = robot.getObjectByName("rightForearm");
      const zeusRightHand: any = robot.getObjectByName("rightHand");
      const zeusRightElbowPivot: any = robot.getObjectByName("rightElbowPivot");
      const zeusAntennaRingBase: any = robot.getObjectByName("antennaRingBase");
      const zeusAntennaRingMid: any = robot.getObjectByName("antennaRingMid");
      const zeusAntennaRingTop: any = robot.getObjectByName("antennaRingTop");
      const zeusAntennaBeamBase: any = robot.getObjectByName("antennaBeamBase");
      const zeusAntennaBeamMid: any = robot.getObjectByName("antennaBeamMid");
      const zeusAntennaBeamTop: any = robot.getObjectByName("antennaBeamTop");
      zeusRigRef.current = {
        head: zeusHead,
        rightUpperArm: zeusRightUpperArm,
        rightElbowPivot: zeusRightElbowPivot,
        rightHand: zeusRightHand,
        chestInnerMaterial,
        antennaRingBase: zeusAntennaRingBase,
        antennaRingMid: zeusAntennaRingMid,
        antennaRingTop: zeusAntennaRingTop,
        antennaBeamBase: zeusAntennaBeamBase,
        antennaBeamMid: zeusAntennaBeamMid,
        antennaBeamTop: zeusAntennaBeamTop,
      };

      // Enable soft shadows (studio look)
      robot.traverse((obj: any) => {
        if (obj && obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
      scene.add(robot);

      // Soft shadow catcher (grounds the robot without adding visible geometry)
      const shadowCatcher = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.ShadowMaterial({ opacity: 0.22 })
      );
      shadowCatcher.rotation.x = -Math.PI / 2;
      shadowCatcher.position.y = -999; // set after bounds are known
      shadowCatcher.receiveShadow = true;
      scene.add(shadowCatcher);

      // Fit camera to robot (prevents antenna going out of frame on different screen sizes)
      const fitCameraToObject = (obj: any, fitOffset = 1.18) => {
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = maxSize / (2 * Math.tan((camera.fov * Math.PI) / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

        camera.position.copy(center).add(new THREE.Vector3(0, 0.12, distance));
        camera.near = Math.max(0.01, distance / 100);
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
        camera.lookAt(center.x, center.y - 0.1, center.z);

        // Place the shadow catcher just under the robot's feet
        shadowCatcher.position.y = box.min.y - 0.03;
      };

      fitCameraToObject(robot);

      // Set initial state for modern entrance animation
      robot.scale.set(0.01, 0.01, 0.01); // Start tiny (not 0 to avoid rendering issues)
      robot.position.y = entranceStartY;
      robot.rotation.y = entranceStartRotY;
      
      // Create entrance glow effect (soft rim light that fades)
      const entranceGlow = new THREE.PointLight(0x00ff6a, 0, 8);
      entranceGlow.position.set(0, 0, 2);
      robot.add(entranceGlow);

      // Click handler
      handleCanvasClick = (event: MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(robot.children, true);
        
        if (intersects.length > 0) {
          // Robot was clicked!
          setRobotGreeting(true);
          setZeusOpen(true);
          // Keep the chest screen as a clean HUD (no flower) and let the gesture do the guidance.
          // (Optional micro-highlight so the click feels responsive.)
          if (chestInnerMaterial) {
            chestInnerMaterial.emissiveIntensity = 1.7;
            chestInnerMaterial.needsUpdate = true;
          }
          
          // Reset greeting after 3 seconds
          setTimeout(() => {
            setRobotGreeting(false);
            
            // Reset chest inner panel
            if (chestInnerMaterial) {
              chestInnerMaterial.color.setHex(0xffffff);
              chestInnerMaterial.map = screenTexture;
              chestInnerMaterial.emissiveMap = screenTexture;
              chestInnerMaterial.emissiveIntensity = 1.4;
              chestInnerMaterial.needsUpdate = true;
            }
          }, 3000);
        }
      };
      
      canvasRef.current?.addEventListener('click', handleCanvasClick);
      window.addEventListener('resize', resizeRenderer);

      // Lighting
      // Back to the earlier "hero" lighting feel, but softened (no double-sun harshness)
      const hemi = new THREE.HemisphereLight(0xffffff, 0x05060a, 0.22);
      scene.add(hemi);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.20);
      scene.add(ambientLight);

      // Key (softened): main readable light
      // NOTE: keep the "sun" coming from the LEFT so clicking emotes (right side UI)
      // doesn’t rotate Zeus into harsh specular highlights.
      const keyLight = new THREE.DirectionalLight(0xffffff, 0.90);
      keyLight.position.set(-6, 10, 7);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.radius = 7;
      keyLight.shadow.bias = -0.00012;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);

      // Green rim: softened for high-quality look without harsh highlights
      const rimLight = new THREE.DirectionalLight(0x00ff6a, 0.65);
      rimLight.position.set(-7, 6, -7);
      scene.add(rimLight);

      // Green accent lift (softened to prevent blowout when robot faces right)
      const pointLight1 = new THREE.PointLight(0x00ff6a, 0.75, 100);
      pointLight1.position.set(6, 4, 3); // Moved further away and more frontal
      scene.add(pointLight1);

      // Warm fill (pairs well with green; replaces any blue/cyan feel)
      const pointLight2 = new THREE.PointLight(0xffc58a, 0.45, 100);
      pointLight2.position.set(-5, -3, 6);
      scene.add(pointLight2);

      // (Removed) Back glow light - user requested no extra glow behind Zeus

      const animate = () => {
        if (!isRunning) return;
        animationFrameId = window.requestAnimationFrame(animate);

        // Cap FPS a bit to reduce main-thread + GPU pressure (helps scroll smoothness)
        const now = performance.now();
        if (now - lastFrameT < 1000 / 50) return;
        lastFrameT = now;
        
        // Subtle floating animation (+ optional cute emotes)
        let extraY = 0;

        const emote = zeusEmoteRef.current;
        // Helper for smooth pose changes
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const isGuidingToAssist = !emote && zeusOpenRef.current;

        if (!emote) {
          // Track the "rest pose" only when no emote is active AND we're not in the "guide" pose.
          // If we overwrite rest pose while guiding, the target drifts and Zeus looks like he's spinning.
          const shouldCaptureRest = !isGuidingToAssist || !zeusRestPoseRef.current;
          if (shouldCaptureRest) {
            const antennaRings = [zeusAntennaRingBase, zeusAntennaRingMid, zeusAntennaRingTop].filter(Boolean);
            const antennaBeams = [zeusAntennaBeamBase, zeusAntennaBeamMid, zeusAntennaBeamTop].filter(Boolean);
            zeusRestPoseRef.current = {
              headRotX: zeusHead?.rotation?.x ?? 0,
              headRotY: zeusHead?.rotation?.y ?? 0,
              rightUpperArmRotX: zeusRightUpperArm?.rotation?.x ?? 0,
              rightUpperArmRotZ: zeusRightUpperArm?.rotation?.z ?? 0,
              rightElbowPivotRotX: zeusRightElbowPivot?.rotation?.x ?? 0,
              rightElbowPivotRotZ: zeusRightElbowPivot?.rotation?.z ?? 0,
              rightHandRotX: zeusRightHand?.rotation?.x ?? 0,
              rightHandRotY: zeusRightHand?.rotation?.y ?? 0,
              rightHandRotZ: zeusRightHand?.rotation?.z ?? 0,
              chestEmissiveHex: chestInnerMaterial?.emissive?.getHex?.(),
              antennaRingStates: antennaRings.map((m: any) => {
                const mat = m?.material;
                return {
                  colorHex: mat?.color?.getHex?.() ?? 0x00ff6a,
                  emissiveHex: mat?.emissive?.getHex?.() ?? 0x00ff6a,
                  emissiveIntensity: typeof mat?.emissiveIntensity === "number" ? mat.emissiveIntensity : 1.6,
                  opacity: typeof mat?.opacity === "number" ? mat.opacity : 0.9,
                };
              }),
              antennaBeamOpacities: antennaBeams.map((m: any) => (typeof m?.material?.opacity === "number" ? m.material.opacity : 0)),
              chestIntensity: chestInnerMaterial?.emissiveIntensity,
              chestMap: chestInnerMaterial?.map,
              chestEmissiveMap: chestInnerMaterial?.emissiveMap,
            };
          }
        } else {
          const t = now - emote.startedAt;
          if (t >= emote.durationMs) {
            // Reset any overrides at end of emote
            if (emote.type === "heart" && chestInnerMaterial) {
              if (typeof emote.baseChestIntensity === "number") {
                chestInnerMaterial.emissiveIntensity = emote.baseChestIntensity;
              }
              if (typeof emote.baseChestMap !== "undefined") {
                chestInnerMaterial.map = emote.baseChestMap;
              }
              if (typeof emote.baseChestEmissiveMap !== "undefined") {
                chestInnerMaterial.emissiveMap = emote.baseChestEmissiveMap;
              }
              if (typeof emote.baseChestEmissiveHex === "number") {
                try {
                  chestInnerMaterial.emissive?.setHex?.(emote.baseChestEmissiveHex);
                } catch {}
              }
              chestInnerMaterial.needsUpdate = true;
            }
            if (emote.type === "heart") {
              // Restore antenna rings + beams (if present)
              const rig = zeusRigRef.current;
              const rings = [rig?.antennaRingBase, rig?.antennaRingMid, rig?.antennaRingTop].filter(Boolean);
              const beams = [rig?.antennaBeamBase, rig?.antennaBeamMid, rig?.antennaBeamTop].filter(Boolean);

              if (emote.baseAntennaRingStates && emote.baseAntennaRingStates.length) {
                rings.forEach((m: any, i: number) => {
                  const st = emote.baseAntennaRingStates?.[i];
                  const mat = m?.material;
                  if (!st || !mat) return;
                  try {
                    mat.color?.setHex?.(st.colorHex);
                    mat.emissive?.setHex?.(st.emissiveHex);
                    mat.emissiveIntensity = st.emissiveIntensity;
                    mat.opacity = st.opacity;
                    mat.needsUpdate = true;
                  } catch {}
                });
              }

              if (emote.baseAntennaBeamOpacities && emote.baseAntennaBeamOpacities.length) {
                beams.forEach((m: any, i: number) => {
                  const o = emote.baseAntennaBeamOpacities?.[i];
                  const mat = m?.material;
                  if (typeof o !== "number" || !mat) return;
                  try {
                    mat.opacity = o;
                    mat.needsUpdate = true;
                  } catch {}
                });
              }
            }
            if (emote.type === "wave") {
              if (zeusHead && typeof emote.baseHeadRotY === "number") zeusHead.rotation.y = emote.baseHeadRotY;
              if (zeusRightUpperArm) {
                if (typeof emote.baseRightUpperArmRotZ === "number") zeusRightUpperArm.rotation.z = emote.baseRightUpperArmRotZ;
                if (typeof emote.baseRightUpperArmRotX === "number") zeusRightUpperArm.rotation.x = emote.baseRightUpperArmRotX;
              }
              if (zeusRightHand) {
                if (typeof emote.baseRightHandRotX === "number") zeusRightHand.rotation.x = emote.baseRightHandRotX;
                if (typeof emote.baseRightHandRotY === "number") zeusRightHand.rotation.y = emote.baseRightHandRotY;
                if (typeof emote.baseRightHandRotZ === "number") zeusRightHand.rotation.z = emote.baseRightHandRotZ;
              }
              if (zeusRightElbowPivot && typeof emote.baseRightElbowPivotRotZ === "number") {
                zeusRightElbowPivot.rotation.z = emote.baseRightElbowPivotRotZ;
              }
              if (zeusRightElbowPivot && typeof emote.baseRightElbowPivotRotX === "number") {
                zeusRightElbowPivot.rotation.x = emote.baseRightElbowPivotRotX;
              }
            }
            if (emote.type === "nod") {
              if (zeusHead) {
                if (typeof emote.baseHeadRotY === "number") zeusHead.rotation.y = emote.baseHeadRotY;
                if (typeof emote.baseHeadRotX === "number") zeusHead.rotation.x = emote.baseHeadRotX;
              }
            }
            zeusEmoteRef.current = null;
          } else {
            const p = Math.max(0, Math.min(1, t / emote.durationMs)); // 0..1

            if (emote.type === "heart") {
              // Heart pulse on the chest screen
              if (chestInnerMaterial) {
                if (typeof emote.baseChestIntensity !== "number") {
                  emote.baseChestIntensity = chestInnerMaterial.emissiveIntensity ?? 1.4;
                }
                if (typeof emote.baseChestMap === "undefined") emote.baseChestMap = chestInnerMaterial.map;
                if (typeof emote.baseChestEmissiveMap === "undefined") emote.baseChestEmissiveMap = chestInnerMaterial.emissiveMap;
                if (typeof emote.baseChestEmissiveHex !== "number") {
                  emote.baseChestEmissiveHex = chestInnerMaterial.emissive?.getHex?.();
                }
                if (heartTexture) {
                  chestInnerMaterial.map = heartTexture;
                  chestInnerMaterial.emissiveMap = heartTexture;
                }
                // Keep chest emissive green for robotic heart
                try {
                  chestInnerMaterial.emissive?.setHex?.(0x00ff6a);
                } catch {}
                const pulse = (Math.sin(p * Math.PI * 2) * 0.5 + 0.5); // 0..1
                const base = emote.baseChestIntensity ?? (chestInnerMaterial.emissiveIntensity ?? 1.4);
                chestInnerMaterial.emissiveIntensity = base + pulse * 0.9;
                chestInnerMaterial.needsUpdate = true;
              }

              // Antenna: match chest HUD line green + "tower" beams, blinking bottom→top repeatedly
              const rig = zeusRigRef.current;
              const rings = [rig?.antennaRingBase, rig?.antennaRingMid, rig?.antennaRingTop].filter(Boolean);
              const beams = [rig?.antennaBeamBase, rig?.antennaBeamMid, rig?.antennaBeamTop].filter(Boolean);

              if (typeof emote.baseAntennaRingStates === "undefined") {
                emote.baseAntennaRingStates = rings.map((m: any) => {
                  const mat = m?.material;
                  return {
                    colorHex: mat?.color?.getHex?.() ?? 0x00ff6a,
                    emissiveHex: mat?.emissive?.getHex?.() ?? 0x00ff6a,
                    emissiveIntensity: typeof mat?.emissiveIntensity === "number" ? mat.emissiveIntensity : 1.6,
                    opacity: typeof mat?.opacity === "number" ? mat.opacity : 0.9,
                  };
                });
              }
              if (typeof emote.baseAntennaBeamOpacities === "undefined") {
                emote.baseAntennaBeamOpacities = beams.map((m: any) => (typeof m?.material?.opacity === "number" ? m.material.opacity : 0));
              }

              // Sequencer (continuous while heart emote is active)
              const seq = ((now * 0.0032) % 1 + 1) % 1; // 0..1
              const centers = [0.08, 0.41, 0.74]; // base → mid → top
              const pulseAt = (x: number, c: number) => {
                const d = Math.abs((((x - c) % 1) + 1.5) % 1 - 0.5); // wrap distance in [0,0.5]
                const w = 0.16;
                const v = Math.max(0, 1 - d / w);
                return v * v;
              };

              rings.forEach((m: any, i: number) => {
                const mat = m?.material;
                if (!mat) return;
                const st = emote.baseAntennaRingStates?.[i];
                const baseIntensity = st?.emissiveIntensity ?? 1.6;
                const q = pulseAt(seq, centers[i] ?? 0);
                try {
                  mat.color?.setHex?.(0x00ff6a);
                  mat.emissive?.setHex?.(0x00ff6a);
                  mat.opacity = 0.92;
                  mat.emissiveIntensity = baseIntensity * 0.65 + q * 3.2;
                  mat.needsUpdate = true;
                } catch {}
              });

              beams.forEach((m: any, i: number) => {
                const mat = m?.material;
                if (!mat) return;
                const q = pulseAt(seq, centers[i] ?? 0);
                try {
                  mat.color?.setHex?.(0x00ff6a);
                  mat.opacity = q * 0.55;
                  mat.needsUpdate = true;
                } catch {}
                try {
                  // Subtle "tower" breathing (kept gentle so it doesn't look noisy)
                  m.scale.x = 1;
                  m.scale.z = 1;
                  m.scale.y = 0.9 + q * 0.35;
                } catch {}
              });
            } else if (emote.type === "wave") {
              // Wave: head tilt + arm lifts from shoulder, elbow bends, wrist flicks.
              // With a proper rig (forearm+hand parented), we only need rotations.
              // Stage 1: lift + settle (no waving)
              // Stage 2: hold arm up + wave the hand
              const liftEnd = 0.38; // % of emote duration to finish lifting
              const liftT = Math.max(0, Math.min(1, p / liftEnd));
              const liftEase = (1 - Math.cos(liftT * Math.PI)) / 2; // smooth ease-in-out
              const waveT = Math.max(0, Math.min(1, (p - liftEnd) / (1 - liftEnd)));
              const wave = Math.sin(waveT * Math.PI * 6);
              
              if (zeusHead) {
                if (typeof emote.baseHeadRotY !== "number") emote.baseHeadRotY = zeusHead.rotation.y ?? 0;
                const baseHead = emote.baseHeadRotY ?? (zeusHead.rotation.y ?? 0);
                zeusHead.rotation.y = baseHead + Math.sin(p * Math.PI * 2) * 0.16;
              }
              if (zeusRightUpperArm) {
                if (typeof emote.baseRightUpperArmRotZ !== "number") {
                  emote.baseRightUpperArmRotZ = zeusRightUpperArm.rotation.z ?? 0;
                }
                if (typeof emote.baseRightUpperArmRotX !== "number") {
                  emote.baseRightUpperArmRotX = zeusRightUpperArm.rotation.x ?? 0;
                }
                const baseUpperZ = emote.baseRightUpperArmRotZ ?? 0;
                const baseUpperX = emote.baseRightUpperArmRotX ?? 0;
                // Lift arm UP/FORWARD (X) with only a small "out to the side" (Z),
                // so the wave reads as front-facing instead of sideways.
                // IMPORTANT: after lift, keep shoulder stable (no up/down bobbing during waving)
                zeusRightUpperArm.rotation.x = baseUpperX - liftEase * 1.12;
                zeusRightUpperArm.rotation.z = baseUpperZ + liftEase * 0.10;
              }
              if (zeusRightElbowPivot) {
                if (typeof emote.baseRightElbowPivotRotZ !== "number") {
                  emote.baseRightElbowPivotRotZ = zeusRightElbowPivot.rotation.z ?? 0;
                }
                if (typeof emote.baseRightElbowPivotRotX !== "number") {
                  emote.baseRightElbowPivotRotX = zeusRightElbowPivot.rotation.x ?? 0;
                }
                const baseElbow = emote.baseRightElbowPivotRotZ ?? 0;
                const baseElbowX = emote.baseRightElbowPivotRotX ?? 0;
                // Elbow bend should happen in the forward plane (X) for a front-facing "hi".
                // IMPORTANT: after lift, keep elbow bend stable; only add a tiny twist during waving.
                zeusRightElbowPivot.rotation.x = baseElbowX - liftEase * 0.95;
                zeusRightElbowPivot.rotation.z = baseElbow + wave * 0.12 * waveT;
              }
              if (zeusRightHand) {
                if (typeof emote.baseRightHandRotX !== "number") emote.baseRightHandRotX = zeusRightHand.rotation.x ?? 0;
                if (typeof emote.baseRightHandRotY !== "number") emote.baseRightHandRotY = zeusRightHand.rotation.y ?? 0;
                if (typeof emote.baseRightHandRotZ !== "number") emote.baseRightHandRotZ = zeusRightHand.rotation.z ?? 0;

                const baseHandX = emote.baseRightHandRotX ?? 0;
                const baseHandY = emote.baseRightHandRotY ?? 0;
                const baseHandZ = emote.baseRightHandRotZ ?? 0;

                // Keep the palm/forearm looking "straight": wave mostly by yawing (Y),
                // with NO extra roll/pitch (Z/X) so the palm never looks bent backwards.
                zeusRightHand.rotation.x = baseHandX;
                zeusRightHand.rotation.y = baseHandY + wave * 0.34 * waveT;
                zeusRightHand.rotation.z = baseHandZ;
              }
            } else if (emote.type === "nod") {
              // Cute nod: head bobs up and down with a slight tilt
              const nodCycle = Math.sin(p * Math.PI * 4); // Multiple nods
              const tiltCycle = Math.sin(p * Math.PI * 2) * 0.5; // Gentle side tilt
              
              if (zeusHead) {
                if (typeof emote.baseHeadRotX !== "number") emote.baseHeadRotX = zeusHead.rotation.x ?? 0;
                if (typeof emote.baseHeadRotY !== "number") emote.baseHeadRotY = zeusHead.rotation.y ?? 0;
                const baseX = emote.baseHeadRotX ?? 0;
                const baseY = emote.baseHeadRotY ?? 0;
                zeusHead.rotation.x = baseX + nodCycle * 0.18; // Nod up/down
                zeusHead.rotation.y = baseY + tiltCycle * 0.08; // Slight side tilt for cuteness
              }
            }
          }
        }

        // If Zeus Assist is open and no emote is running, point toward the bottom-right assistant widget.
        // IMPORTANT: only move the arm (no head motion). Arm retracts after ~3s of pointing.
        if (!zeusEmoteRef.current && zeusOpenRef.current) {
          const rest = zeusRestPoseRef.current;
          const k = 0.10; // smoothing
          
          // Check how long we've been pointing - retract arm after 3 seconds
          const pointingStarted = zeusArmPointingStartRef.current;
          const pointingDuration = pointingStarted ? (now - pointingStarted) : 0;
          const shouldPoint = pointingDuration < 3000; // Point for 3 seconds then retract

          if (zeusRightUpperArm && rest) {
            // extend arm diagonally down-right (screen space)
            // NOTE: signs are sensitive to the rig orientation; these values are tuned for this model.
            const targetZ = shouldPoint ? (rest.rightUpperArmRotZ ?? 0) + 1.05 : (rest.rightUpperArmRotZ ?? 0);
            const targetX = shouldPoint ? (rest.rightUpperArmRotX ?? 0) + 0.35 : (rest.rightUpperArmRotX ?? 0);
            zeusRightUpperArm.rotation.z = lerp(zeusRightUpperArm.rotation.z, targetZ, k);
            zeusRightUpperArm.rotation.x = lerp(zeusRightUpperArm.rotation.x, targetX, k);
          }
          if (zeusRightElbowPivot && rest) {
            const targetX = shouldPoint ? (rest.rightElbowPivotRotX ?? 0) + 0.25 : (rest.rightElbowPivotRotX ?? 0);
            const targetZ = shouldPoint ? (rest.rightElbowPivotRotZ ?? 0) + 0.10 : (rest.rightElbowPivotRotZ ?? 0);
            zeusRightElbowPivot.rotation.x = lerp(zeusRightElbowPivot.rotation.x, targetX, k);
            zeusRightElbowPivot.rotation.z = lerp(zeusRightElbowPivot.rotation.z, targetZ, k);
          }
          if (zeusRightHand && rest) {
            const targetX = shouldPoint ? (rest.rightHandRotX ?? 0) + 0.10 : (rest.rightHandRotX ?? 0);
            const targetY = shouldPoint ? (rest.rightHandRotY ?? 0) - 0.20 : (rest.rightHandRotY ?? 0);
            const targetZ = shouldPoint ? (rest.rightHandRotZ ?? 0) + 0.06 : (rest.rightHandRotZ ?? 0);
            zeusRightHand.rotation.x = lerp(zeusRightHand.rotation.x, targetX, k);
            zeusRightHand.rotation.y = lerp(zeusRightHand.rotation.y, targetY, k);
            zeusRightHand.rotation.z = lerp(zeusRightHand.rotation.z, targetZ, k);
          }
        }

        // Modern entrance animation with multiple phases
        if (robotAppearProgress < 1) {
          robotAppearProgress = Math.min(1, robotAppearProgress + entranceFrameIncrement);
          
          // Phase 1: Scale (easeOutBack for subtle overshoot bounce)
          const scaleProgress = Math.min(1, robotAppearProgress * 1.15); // Complete scale slightly early
          const scaledEased = easeOutBack(scaleProgress);
          const currentScale = Math.min(targetScale, scaledEased * targetScale);
          robot.scale.set(currentScale, currentScale, currentScale);
          
          // Phase 2: Rise from below (easeOutExpo for smooth float-up)
          const yEased = easeOutExpo(robotAppearProgress);
          const entranceY = entranceStartY + (entranceTargetY - entranceStartY) * yEased;
          robot.position.y = entranceY + Math.sin(now * 0.001) * 0.02 * robotAppearProgress + extraY;
          
          // Phase 3: Rotation unwind (elastic feel at the end)
          const rotProgress = Math.min(1, robotAppearProgress * 1.1);
          const rotEased = easeOutElastic(rotProgress);
          const entranceRotY = entranceStartRotY * (1 - rotEased);
          robot.rotation.y = entranceRotY + smoothMouseX.get() * 0.35 * robotAppearProgress;
          
          // Subtle X rotation tilt during entrance (straightens up as it rises)
          const xTiltStart = 0.15; // Start slightly tilted forward
          robot.rotation.x = xTiltStart * (1 - easeOutExpo(robotAppearProgress));
          
          // Phase 4: Glow intensity (peaks mid-animation, fades out - softened)
          const glowProgress = robotAppearProgress < 0.5 
            ? robotAppearProgress * 2 
            : 2 - robotAppearProgress * 2;
          entranceGlow.intensity = glowProgress * 1.5;
        } else {
          // Normal floating animation after entrance complete (very minimal movement)
          robot.position.y = Math.sin(now * 0.001) * 0.02 + extraY;
          
          // Ensure glow is off after entrance
          if (entranceGlow.intensity > 0) {
            entranceGlow.intensity = Math.max(0, entranceGlow.intensity - 0.1);
          }
          
          // Rotate based on mouse position (only after entrance complete, reduced sensitivity)
          robot.rotation.y = smoothMouseX.get() * 0.35;
          // Tone down vertical (up/down) response while keeping sideways intact.
          // The dead-zone + center shift keeps Zeus more upright when cursor is around thigh/belly.
          const yRaw = smoothMouseY.get();
          const yCentered = yRaw - 0.15; // shift neutral zone slightly downward
          const yDeadZone = 0.12; // ignore small vertical movements
          const yAfterDeadZone =
            Math.abs(yCentered) <= yDeadZone
              ? 0
              : (Math.abs(yCentered) - yDeadZone) * Math.sign(yCentered);
          const yScaled = yAfterDeadZone * 0.18; // was 0.3
          robot.rotation.x = Math.max(-0.22, Math.min(0.22, yScaled));
          
          // Idle rotation
          robot.rotation.y += 0.002;
        }
        
        renderer.render(scene, camera);
      };
      
      const setRunning = () => {
        // Don't render while actively scrolling; resume when scroll settles.
        const shouldRun = isInView && isTabVisible && !root.classList.contains("is-scrolling");
        if (shouldRun === isRunning) return;
        isRunning = shouldRun;
        if (isRunning) {
          lastFrameT = 0;
          animate();
        } else if (animationFrameId != null) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      };
      setRunningExternal = setRunning;

      // Temporarily lower pixel ratio while actively scrolling (prevents scroll hitching)
      const onScroll = () => {
        if (!lowQuality) {
          lowQuality = true;
          // Shadows are one of the most expensive parts; disable during active scrolling.
          try {
            renderer.shadowMap.enabled = false;
          } catch {}
          renderer.setPixelRatio(1);
          resizeRenderer?.();
        }
        if (scrollTimer != null) window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          lowQuality = false;
          renderer.setPixelRatio(defaultPixelRatio);
          try {
            renderer.shadowMap.enabled = true;
          } catch {}
          resizeRenderer?.();
        }, 140);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // Start rendering if visible
      setRunning();

      // Runtime cleanup for renderer-scoped listeners/timers
      cleanupRuntime = () => {
        window.removeEventListener("scroll", onScroll as any);
        if (scrollTimer != null) window.clearTimeout(scrollTimer);
      };
    };

    // Kick off a prewarm attempt: this will only init if the loading screen is up OR robot is in view,
    // and will wait for scroll-idle.
    scheduleInit();

    return () => {
      destroyed = true;
      if (initTimer != null) window.clearTimeout(initTimer);
      if (runTimer != null) window.clearTimeout(runTimer);
      window.removeEventListener("scroll", onGlobalScroll as any);
      document.removeEventListener("visibilitychange", onVisibility);
      if (animationFrameId != null) window.cancelAnimationFrame(animationFrameId);
      if (resizeRenderer) window.removeEventListener('resize', resizeRenderer);
      if (handleCanvasClick && canvasRef.current) canvasRef.current.removeEventListener('click', handleCanvasClick);
      try {
        cleanupRuntime?.();
      } catch {}
      try {
        observer?.disconnect();
      } catch {}
    };
  }, [smoothMouseX, smoothMouseY]);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden overflow-y-visible text-white">
      {/* Preload critical resources */}
      <link rel="preload" href="https://upload.wikimedia.org/wikipedia/commons/9/9a/Robot_Operating_System_logo.svg" as="image" />
      <link rel="preload" href="https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" as="image" />

      {/* No loading screen: keep About calm and instant */}

      {/* Hide scrollbars (keep scrolling) */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Windows/Chrome/Edge: aggressively hide the visible scrollbar gutter */
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { width: 0px; height: 0px; display: none; }
        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display",
            "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji",
            "Segoe UI Emoji";
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
          letter-spacing: -0.01em;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0px; height: 0px; display: none; }

        h1, h2, h3 { letter-spacing: -0.03em; }
        .font-syne {
          font-family: "Syne", "SF Pro Display", ui-sans-serif, system-ui, sans-serif;
        }
        .font-inter {
          font-family: "Inter", "SF Pro Text", ui-sans-serif, system-ui, sans-serif;
        }

        /* ---- HERO (hyper-modern) ---- */
        .hero-surface {
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            0 40px 140px rgba(0,0,0,0.78),
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 0 80px rgba(0,255,106,0.08);
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          isolation: isolate;
        }

        /* ---- Apple-like panels (borderless, calm, continuous) ---- */
        .panel-surface {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(1100px 520px at 50% -10%, rgba(255,255,255,0.06), transparent 60%),
            radial-gradient(900px 420px at 15% 40%, rgba(255,255,255,0.035), transparent 62%),
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.10));
          border: none;
          box-shadow:
            0 30px 120px rgba(0,0,0,0.55),
            0 1px 0 rgba(255,255,255,0.06) inset;
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          isolation: isolate;
        }

        /* ---- Performance: during active scrolling, temporarily disable expensive filters ---- */
        html.is-scrolling .hero-surface,
        html.is-scrolling .panel-surface,
        html.is-scrolling .section-glassbar,
        html.is-scrolling .backdrop-blur,
        html.is-scrolling .backdrop-blur-md {
          backdrop-filter: blur(0px) saturate(110%) !important;
          -webkit-backdrop-filter: blur(0px) saturate(110%) !important;
        }
        html.is-scrolling .hero-aurora,
        html.is-scrolling .hero-orb {
          filter: none !important;
        }
        html.is-scrolling [data-perf-filter] {
          filter: none !important;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(circle at 30% 20%, black 0%, transparent 62%);
        }

        .hero-noise {
          position: absolute;
          inset: -30%;
          pointer-events: none;
          opacity: 0.11;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27300%27%20height%3D%27300%27%20viewBox%3D%270%200%20300%20300%27%3E%3Cfilter%20id%3D%27n%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.8%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27300%27%20height%3D%27300%27%20filter%3D%27url(%23n)%27%20opacity%3D%270.55%27%2F%3E%3C%2Fsvg%3E");
          transform: rotate(12deg);
        }

        .hero-aurora {
          position: absolute;
          inset: -60px;
          pointer-events: none;
          opacity: 0.45;
          background:
            radial-gradient(700px 460px at 18% 22%, rgba(0,255,106,0.20), transparent 65%),
            radial-gradient(680px 440px at 86% 36%, rgba(255,255,255,0.08), transparent 66%);
          filter: blur(16px) saturate(115%);
          /* Hero should feel calm like an About section: no moving aurora */
          animation: none;
        }

        @keyframes heroAurora {
          0%, 100% { transform: translate3d(0px, 0px, 0px) scale(1); }
          50% { transform: translate3d(22px, -12px, 0px) scale(1.03); }
        }

        .hero-orb {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(16px);
          opacity: 0.55;
          animation: none;
        }

        @keyframes heroOrbFloat {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          50% { transform: translate3d(0px, -18px, 0px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-aurora, .hero-orb { animation: none; }
        }

        .hero-scroll-pip {
          position: absolute;
          inset-inline: 0;
          top: 0;
          height: 12px;
          width: 100%;
          background: rgba(0,255,106,0.85);
          opacity: 0.85;
          animation: none;
        }

        @keyframes heroScrollPip {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-scroll-pip { animation: none; }
        }

        /* ---- Full-width "dark glass" section heading bar (cleaner) ---- */
        .section-glassbar {
          position: relative;
          width: 100vw;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(8,8,10,0.56);
          border-top: 1px solid rgba(255,255,255,0.10);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(10px) saturate(115%);
          -webkit-backdrop-filter: blur(10px) saturate(115%);
          box-shadow:
            0 18px 70px rgba(0,0,0,0.70),
            0 0 0 1px rgba(255,255,255,0.035) inset;
          overflow: hidden;
          isolation: isolate;
        }

        .section-glassbar::before {
          content: "";
          position: absolute;
          inset: -80px;
          background:
            radial-gradient(900px 220px at 50% -40%, rgba(255,255,255,0.08), transparent 62%),
            radial-gradient(900px 260px at 18% 50%, rgba(0,255,106,0.06), transparent 62%);
          opacity: 0.8;
          pointer-events: none;
        }

        .section-glassbar::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
          opacity: 0.75;
          pointer-events: none;
        }

        .section-glassbar--center .section-glassbar-inner {
          justify-content: center;
          text-align: center;
        }

        /* ---- Card polish (clean, no fake 3D transforms) ---- */
        .card-polish {
          position: relative;
          isolation: isolate;
        }
        .card-polish::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            radial-gradient(800px 260px at 18% 0%, rgba(0,255,106,0.16), transparent 60%),
            radial-gradient(700px 220px at 85% 70%, rgba(255,255,255,0.10), transparent 60%);
          opacity: 0.75;
          z-index: 0;
        }
        .card-polish::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.16), transparent 28%);
          opacity: 0.35;
          z-index: 0;
        }
        .card-polish > * {
          position: relative;
          z-index: 1;
        }

        /* ---- Subtle “Apple-like” interactivity ---- */
        .alive-card {
          position: relative;
          isolation: isolate;
        }
        .alive-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transform: translateX(-18%) skewX(-12deg);
          transition: opacity 450ms ease, transform 650ms cubic-bezier(.2,.85,.2,1);
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(255,255,255,0.10) 28%,
            rgba(0,255,106,0.14) 44%,
            rgba(255,255,255,0.08) 58%,
            transparent 100%
          );
          filter: blur(0.2px);
          z-index: 0;
        }
        .alive-card:hover::before {
          opacity: 1;
          transform: translateX(18%) skewX(-12deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .alive-card::before { transition: none; }
        }

        /* ---- PROJECTS grid clamps ---- */
        .project-titleClamp {
          font-family: "Syne", "SF Pro Display", ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.02em;
          line-height: 1.15;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .project-descClamp {
          font-family: "Inter", "SF Pro Text", ui-sans-serif, system-ui, sans-serif;
          letter-spacing: 0.01em;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        /* Hide the “ADD /public/…” overlay once the image loads */
        .has-photo .photo-placeholder {
          opacity: 0;
        }
      `}</style>

      {/* Cursor */}
      {/* BACKGROUND GLOW (static; keep hero calm) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,#00ff6a15,transparent_60%)]" />

      {/* FOG (static; keep hero calm) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-60" />

      {/* Circuit traces (static) */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {circuitTraces.map((t, i) => (
          <div
            key={i}
            className="absolute w-px h-24 bg-[#00ff6a]"
            style={{
              left: t.left,
              top: t.top,
              height: t.height,
              opacity: t.opacity,
            }}
          />
        ))}
      </div>

      {/* ABOUT (HERO) */}
      <section
        id="about"
        ref={heroSectionRef as any}
        className="relative min-h-[100svh] z-20 flex items-center justify-center px-6 md:px-10 py-20 md:py-24 scroll-mt-24"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-aurora" />
          <div className="hero-grid" />
          <div className="hero-noise" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left - ABOUT (separate card, dark glass + glow behind) */}
            <div className="lg:col-span-8">
              <div className="relative h-full">
                {/* Glow behind card */}
                <div className="pointer-events-none absolute -inset-10 opacity-65 blur-3xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,255,106,0.16),transparent_62%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_80%,rgba(255,255,255,0.08),transparent_64%)]" />
                </div>

                {/* Zeus-assist-like glass: darker, cleaner, high-quality */}
                <div className="card-polish relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-6 md:p-8 h-full shadow-[0_0_0_1px_rgba(0,255,106,0.08),0_22px_90px_rgba(0,0,0,0.58)]">
                  <div className="pointer-events-none absolute inset-0 opacity-75">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.06),transparent_58%)]" />
                    {/* Keep green as an accent only (small + controlled) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_80%,rgba(0,255,106,0.08),transparent_62%)]" />
                  </div>
                  <div className="relative flex flex-col items-center lg:items-start text-center lg:text-left h-full">
                    <p className="text-xs tracking-[0.26em] text-white/55">ABOUT</p>
                    <h1 className="mt-3 text-[clamp(2.4rem,5.5vw,4.5rem)] font-black leading-[0.96] tracking-tight">
                      <span className="block bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-white bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(0,255,106,0.18)]">
                        Ishika Saijwal
                      </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm md:text-base text-white/72 leading-relaxed font-inter">
                    I’m Ishika Saijwal, a robotics researcher focused on autonomous navigation, state estimation, and control. 
                    I build and analyze ROS2-based systems using sensor fusion, planning, and optimization methods, and am further studying 
                    Model Predictive Control for constrained, robust navigation under real-world uncertainty in mobile and underwater robots.
                    </p>

                    {/* EDUCATION */}
                    <div className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 md:p-5">
                      <p className="text-xs tracking-[0.26em] text-white/55">EDUCATION</p>
                      <div className="mt-3">
                        <p className="text-base md:text-lg font-semibold text-white/90">Nirma University</p>
                        <p className="mt-1 text-sm text-white/70 leading-relaxed">
                          B.Tech — Electronics and Communication Engineering · 2019–2023
                        </p>
                      </div>
                    </div>

                    {/* MEET ZEUS (below Education; not a long full-width bar) */}
                    <motion.button
                      onClick={() => scrollToSection("robot")}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
                      className="mt-6 w-full sm:w-auto group relative overflow-hidden rounded-xl px-5 py-3
                                 border border-[#00ff6a]/25
                                 bg-gradient-to-br from-[#00ff6a]/[0.12] via-[#00ff6a]/[0.06] to-white/[0.02]
                                 backdrop-blur-xl
                                 shadow-[0_0_0_1px_rgba(0,255,106,0.14),0_14px_55px_rgba(0,0,0,0.55)]
                                 hover:border-[#00ff6a]/45 hover:shadow-[0_0_0_1px_rgba(0,255,106,0.28),0_18px_70px_rgba(0,0,0,0.60)]
                                 active:scale-[0.99] transition-all duration-300"
                    >
                      <span className="pointer-events-none absolute -inset-10 opacity-60 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.22),transparent_62%)]" />
                      <div className="relative flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#00ff6a]/30 bg-[#00ff6a]/[0.12] text-[#00ff6a] font-black text-base shadow-[0_0_18px_rgba(0,255,106,0.28)]">
                          Z
                        </span>
                        <div className="text-left">
                          <p className="text-sm font-bold tracking-wide text-white group-hover:text-[#00ff6a] transition-colors">
                            Meet Zeus
                          </p>
                          <p className="text-[10px] tracking-[0.18em] text-white/55 group-hover:text-white/75 transition-colors">
                            YOUR AI GUIDE
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - PHOTO (separate card, narrower for portrait + glow behind) */}
            <div className="lg:col-span-4 lg:justify-self-end lg:max-w-[440px] w-full">
              <div className="relative h-full">
                {/* Glow behind card */}
                {/* Photo card glow: warm/neutral so the gold-lit portrait stays true, with a tiny green accent */}
                <div className="pointer-events-none absolute -inset-10 opacity-65 blur-3xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_28%,rgba(255,198,122,0.18),transparent_62%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_82%,rgba(255,255,255,0.10),transparent_65%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(0,255,106,0.06),transparent_60%)]" />
                </div>

                <div className="card-polish relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-5 md:p-6 h-full shadow-[0_0_0_1px_rgba(0,255,106,0.05),0_22px_90px_rgba(0,0,0,0.58)]">
                  <div className="pointer-events-none absolute inset-0 opacity-75">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.06),transparent_58%)]" />
                    {/* Warm highlight (photo-friendly) + subtle green micro-accent */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_80%,rgba(255,198,122,0.10),transparent_62%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_88%,rgba(0,255,106,0.05),transparent_62%)]" />
                  </div>

                  <div className="relative flex flex-col">
                    <p className="text-xs tracking-[0.26em] text-white/55">PHOTO</p>

                    <div
                      data-photo-frame
                      className="mt-4 relative w-full overflow-hidden rounded-xl border border-white/12 bg-black/30 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_70px_rgba(0,0,0,0.55)]"
                    >
                      <div className="relative w-full aspect-[3/4] min-h-[320px]">
                        {/* Place your photo at /public/front page.JPG */}
                        <div className="absolute inset-0 p-2">
                          <div className="relative h-full w-full">
                            <Image
                              // Served from Next.js `/public` folder
                              src="/front%20page.JPG"
                              alt="Ishika Saijwal"
                              fill
                              priority
                              fetchPriority="high"
                              quality={95}
                              sizes="(max-width: 1024px) 100vw, 440px"
                              className="object-cover object-center"
                              style={{
                                // Keep it neutral (no green hue)
                                filter: "brightness(1.03) contrast(1.05) saturate(1.03)",
                              }}
                              onLoad={(e) => {
                                e.currentTarget
                                  .closest("[data-photo-frame]")
                                  ?.classList.add("has-photo");
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                        {/* Keep overlays neutral so the photo colors stay true */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.06),transparent_55%)]" />
                        {/* Warm top highlight (matches gold lighting) */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,198,122,0.08),transparent_55%)]" />
                        {/* Keep it premium but not dark */}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_58%,rgba(0,0,0,0.34))]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(0,0,0,0.45)_86%)] opacity-45" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ROBOT (full-viewport) */}
      <motion.section
        id="robot"
        ref={robotSectionRef as any}
        className="relative z-20 h-[100svh] w-full flex items-center justify-center overflow-hidden"
        style={{ perspective: 1000 }}
      >
        {/* Full-screen canvas (scroll animation is CSS transform, not a Three.js zoom) */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            y: reduceMotion ? 0 : robotScrollShiftY,
            rotateX: reduceMotion ? 0 : robotScrollTiltX,
            transformStyle: "preserve-3d",
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer" />
        </motion.div>

        {/* Bottom-left Zeus stack: keeps panels close and prevents overlap when toast appears */}
        <div className="absolute left-5 md:left-7 bottom-5 md:bottom-7 z-[65] w-[min(340px,90vw)] flex flex-col gap-3 pointer-events-none">
          {/* MAKE ZEUS YOUR FRIEND */}
          <div className="pointer-events-auto">
            <div
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-3
                         shadow-[0_0_0_1px_rgba(0,255,106,0.10),0_18px_70px_rgba(0,0,0,0.62)]"
            >
            <div className="pointer-events-none absolute -inset-10 opacity-70">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,106,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.07),transparent_60%)]" />
            </div>
            <div className="relative">
              <p className="text-[10px] tracking-[0.22em] text-white/55">MAKE ZEUS YOUR FRIEND</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => triggerZeusEmote("wave")}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85
                             hover:border-[#00ff6a]/30 hover:text-white transition"
                  aria-label="Zeus wave hello"
                  title="Wave"
                >
                  👋
                </button>
                <button
                  onClick={() => triggerZeusEmote("nod")}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85
                             hover:border-[#00ff6a]/30 hover:text-white transition"
                  aria-label="Zeus nod"
                  title="Nod"
                >
                  😊
                </button>
                <button
                  onClick={() => triggerZeusEmote("heart")}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85
                             hover:border-[#00ff6a]/30 hover:text-white transition"
                  aria-label="Zeus heart beep"
                  title="Heart-beep"
                >
                  💚
                </button>
              </div>

              {zeusEmoteToast && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00ff6a]/18 bg-[#00ff6a]/[0.06] px-3 py-2 text-[11px] text-white/80">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]/90" />
                  {zeusEmoteToast}
                </div>
              )}
            </div>
          </div>
          </div>

          {/* ZEUS HUD (tiny + focused so Zeus stays the focus) */}
          <div className="pointer-events-none">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md
                         shadow-[0_0_0_1px_rgba(0,255,106,0.06),0_22px_90px_rgba(0,0,0,0.62)]
                         px-3 py-3 md:px-4 md:py-4"
            >
              {/* Corner aura (kept local so it doesn’t wash out Zeus) */}
              <div className="absolute -inset-10 opacity-60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_80%,rgba(0,255,106,0.18),transparent_58%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.06),transparent_58%)]" />
              </div>
              <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(transparent_0,rgba(255,255,255,0.06)_1px,transparent_2px)] bg-[length:100%_10px]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {/* ZEUS // GUIDE line removed to reduce visual weight */}
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg md:text-xl font-black leading-[0.95] tracking-tight text-white/92">
                        ZEUS
                      </h2>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#00ff6a]/20 bg-[#00ff6a]/[0.06] px-2.5 py-1 text-[10px] text-white/75">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#00ff6a] shadow-[0_0_12px_rgba(0,255,106,0.55)]" />
                        ONLINE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[11px] md:text-xs">
                  <Typewriter text="TIP: CLICK CHEST → ASSIST" />
                </div>

                <AnimatePresence>
                  {robotGreeting && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00ff6a]/25 bg-black/35 px-3 py-2 text-[11px] text-white/80"
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00ff6a] shadow-[0_0_12px_rgba(0,255,106,0.6)]" />
                      Assist mode deployed - check the bottom-right widget.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* DOWNLOAD RESUME (floating, above Zeus Assist) - show after about page */}
      <AnimatePresence>
        {activeSectionId !== "about" && (
          <motion.a
            href="/resume/Ishika_resume.pdf"
            download
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              width: zeusOpen ? 340 : 134,
              bottom: zeusOpen ? 272 : 92,
              height: zeusOpen ? 36 : 44,
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed right-6 z-[61] group
                       inline-flex items-center justify-center gap-2.5
                       px-5 rounded-2xl
                       border border-white/[0.08]
                       bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-black/20
                       backdrop-blur-xl
                       shadow-[0_0_0_1px_rgba(0,255,106,0.08),0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.2)]
                       hover:border-[#00ff6a]/35 hover:shadow-[0_0_0_1px_rgba(0,255,106,0.2),0_12px_40px_rgba(0,255,106,0.1),inset_0_1px_0_rgba(255,255,255,0.12)]
                       active:scale-[0.98]
                       overflow-hidden"
            style={{ maxWidth: "min(340px, calc(100vw - 3rem))" }}
          >
            {/* Glass shine effect */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
              <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_50%,transparent_100%)]" />
              <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </span>
            {/* Hover glow */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.12),transparent_60%)]" />
              <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_50%)]" />
            </span>
            <svg className="relative w-4 h-4 text-[#00ff6a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="relative text-xs font-semibold tracking-[0.14em] text-white/85 group-hover:text-white transition-colors whitespace-nowrap">
              RESUME
            </span>
          </motion.a>
        )}
      </AnimatePresence>

      {/* ZEUS ASSIST (floating) - show after about page */}
      {activeSectionId !== "about" && (
        <div className="fixed bottom-6 right-6 z-[60]">
          <AnimatePresence mode="wait">
            {!zeusOpen ? (
              <motion.button
                key="zeus-closed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, width: 134 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={() => setZeusOpen(true)}
                className="group relative overflow-hidden rounded-2xl px-3.5 py-2.5
                           border border-white/[0.08]
                           bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-black/20
                           backdrop-blur-xl
                           shadow-[0_0_0_1px_rgba(0,255,106,0.08),0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.2)]
                           hover:border-[#00ff6a]/35 hover:shadow-[0_0_0_1px_rgba(0,255,106,0.2),0_12px_40px_rgba(0,255,106,0.1),inset_0_1px_0_rgba(255,255,255,0.12)]
                           transition-shadow"
                aria-label="Open Zeus assistant"
              >
              {/* Glass shine effect */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_50%,transparent_100%)]" />
                <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
              {/* Hover glow */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.12),transparent_60%)]" />
                <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_50%)]" />
              </span>
              <div className="relative flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#00ff6a]/28 bg-[#00ff6a]/[0.08] text-[#00ff6a] font-black text-sm">
                  Z
                </span>
                <div className="text-left">
                  <p className="text-[11px] tracking-[0.22em] text-white/70">ASSIST</p>
                  <p className="text-[13px] font-semibold text-white/85">Zeus</p>
                </div>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="zeus-open"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-[min(340px,90vw)] overflow-hidden rounded-2xl
                         border border-white/[0.08]
                         bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-black/20
                         backdrop-blur-xl
                         shadow-[0_0_0_1px_rgba(0,255,106,0.08),0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.2)]"
              role="dialog"
              aria-label="Zeus assistant"
              onMouseMove={() => { zeusLastInteractionRef.current = Date.now(); }}
              onClick={() => { zeusLastInteractionRef.current = Date.now(); }}
            >
              {/* Glass shine effect */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_50%,transparent_100%)]" />
                <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
              <div className="relative flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-white/10 bg-black/20">
                <div>
                  <p className="text-xs tracking-[0.22em] text-white/55">ZEUS ASSIST</p>
                </div>
                <button
                  onClick={() => setZeusOpen(false)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70
                             hover:border-white/20 hover:text-white transition"
                  aria-label="Close Zeus assistant"
                >
                  Close
                </button>
              </div>

              <div className="p-3.5">
                <p className="text-sm text-white/65 leading-relaxed">
                  Use me as a fast navigator.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => scrollToSection("about")}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    About
                  </button>

                  <button
                    onClick={() => scrollToSection("experience")}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Project
                  </button>

                  <button
                    onClick={() => scrollToSection("publications")}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Publications
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { zeusLastInteractionRef.current = Date.now(); setOpenCalendar(true); }}
                      className="text-xs text-white/55 hover:text-white transition"
                    >
                      Book a call
                    </button>
                    <a
                      href={MEET_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-white/45 hover:text-white/80 transition"
                      aria-label="Book a call (open in new tab)"
                      title="Open in new tab"
                    >
                      ↗
                    </a>
                  </div>
                  <button
                    onClick={() => scrollToSection("robot")}
                    className="text-xs text-white/55 hover:text-white transition"
                  >
                    Back to Zeus
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      )}
      
      {/* EXPERIENCE */}
      <motion.section
        id="experience"
        ref={experienceSectionRef as any}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative py-16 md:py-24 scroll-mt-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,106,0.08),transparent_60%)]" />
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2 h-full px-0">
          <div className="panel-surface w-full rounded-none">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff6a]/30 to-transparent" />
              <div className="absolute -top-24 left-1/2 h-56 w-[min(980px,92vw)] -translate-x-1/2 rounded-full bg-[#00ff6a]/[0.06] blur-3xl" />
            </div>

            <div className="relative mx-auto h-full w-full max-w-[96rem] px-6 md:px-10 lg:px-14 2xl:px-20 py-10 md:py-12">
              <div>
                <h2 className="text-[clamp(2.0rem,3.6vw,3.2rem)] font-semibold leading-[1.06] tracking-tight text-white/90">
                  Experience
                </h2>

                <div className="mt-8 grid gap-5">
                  {EXPERIENCE.map((x, i) => (
                    <ExperienceScrollCard key={`${x.role}-${x.org}-${x.period}`} x={x} i={i} reduceMotion={reduceMotion ?? false} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* PUBLICATIONS */}
      <motion.section
        id="publications"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative py-16 md:py-24 scroll-mt-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,106,0.08),transparent_60%)]" />
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2 px-0">
          <div className="panel-surface w-full rounded-none">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff6a]/30 to-transparent" />
              <div className="absolute -top-24 left-1/2 h-56 w-[min(980px,92vw)] -translate-x-1/2 rounded-full bg-[#00ff6a]/[0.06] blur-3xl" />
            </div>

            <div className="relative mx-auto h-full w-full max-w-[96rem] px-6 md:px-10 lg:px-14 2xl:px-20 py-10 md:py-12">
              <div>
                <h2 className="text-[clamp(2.0rem,3.6vw,3.2rem)] font-semibold leading-[1.06] tracking-tight text-white/90">
                  Publications
                </h2>

                <div className="mt-8 grid gap-5">
                  {PUBLICATIONS.map((p, i) => (
                    <PublicationDepthCard key={`${p.title}-${p.year}`} p={p} i={i} reduceMotion={reduceMotion ?? false} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* PROJECTS */}
      <motion.section
        id="projects"
        ref={projectsSectionRef as any}
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative pb-20 md:pb-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,106,0.10),transparent_55%)]" />

        <div className="section-glassbar">
          <div className="section-glassbar-inner relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-6 md:py-7 flex items-end justify-start">
            <div>
              <h2
                className="font-inter text-4xl md:text-6xl font-extrabold tracking-tight
                           bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-[#EFFFF7]
                           bg-clip-text text-transparent
                           drop-shadow-[0_0_22px_rgba(0,255,106,0.25)]"
              >
                Projects
              </h2>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-10">
          {/* Bigger cards (landscape covers) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 md:gap-7">
            {PROJECTS.map((p: any, i: number) => (
              <ProjectStackCard key={p.title} p={p} i={i} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* SKILLS SECTION */}
      <motion.section
        id="skills"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative pb-20 md:pb-24"
      >
        <div className="section-glassbar">
          <div className="section-glassbar-inner relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-6 md:py-7 flex items-end justify-start">
            <div>
              <h2
                className="font-inter text-4xl md:text-6xl font-extrabold tracking-tight
                         bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-[#EFFFF7]
                         bg-clip-text text-transparent
                         drop-shadow-[0_0_22px_rgba(0,255,106,0.25)]"
              >
                CORE SKILLS
              </h2>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {SKILLS.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.04 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md
                           px-4 py-4 md:px-5 md:py-5
                           shadow-[0_0_0_1px_rgba(0,255,106,0.12)]
                           hover:border-[#00ff6a]/40
                           hover:shadow-[0_0_0_1px_rgba(0,255,106,0.35),0_22px_70px_rgba(0,255,106,0.10)]
                           transition"
              >
              {/* Glow wash */}
              <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.22),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.10),transparent_55%)]" />
              </div>

              <div className="relative flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-xl bg-black/35 border border-white/10 grid place-items-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ff6a]/25 via-transparent to-transparent" />
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className={`relative w-7 h-7 object-contain
                      ${skill.iconTreatment === "invert" ? "invert brightness-200 contrast-200 saturate-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]" : ""}
                      ${skill.iconTreatment === "boost" ? "brightness-110 contrast-110 drop-shadow-[0_0_12px_rgba(0,255,106,0.25)]" : ""}
                    `}
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm md:text-[15px] font-semibold text-gray-100 truncate">
                    {skill.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/55">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                    <span className="truncate">Core</span>
                  </div>
                </div>
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative py-20 md:py-28 scroll-mt-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,106,0.12),transparent_60%)]" />
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2 px-0">
          <div className="panel-surface w-full rounded-none">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff6a]/30 to-transparent" />
              <div className="absolute -top-24 left-1/2 h-56 w-[min(980px,92vw)] -translate-x-1/2 rounded-full bg-[#00ff6a]/[0.06] blur-3xl" />
            </div>

            <div className="relative mx-auto h-full w-full max-w-[96rem] px-6 md:px-10 lg:px-14 2xl:px-20 py-12 md:py-16">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-xs tracking-[0.26em] text-white/55">GET IN TOUCH</p>
                <h2 className="mt-4 text-[clamp(2.2rem,4vw,3.5rem)] font-black leading-[1.06] tracking-tight">
                  <span className="bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-white bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(0,255,106,0.18)]">
                    Contact Me
                  </span>
                </h2>
                <p className="mt-4 text-base md:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
                  I'm always open to discussing new opportunities, collaborations, or just having a chat about robotics and technology.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Email */}
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5
                               hover:border-[#00ff6a]/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,106,0.15),transparent_60%)]" />
                    </div>
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#00ff6a]/[0.08] border border-[#00ff6a]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#00ff6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90 group-hover:text-[#00ff6a] transition-colors">Email</p>
                        <p className="mt-1 text-xs text-white/50">ishika.saijwal01@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/ishika-saijwal"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5
                               hover:border-[#00ff6a]/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,106,0.15),transparent_60%)]" />
                    </div>
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#00ff6a]/[0.08] border border-[#00ff6a]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#00ff6a]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90 group-hover:text-[#00ff6a] transition-colors">LinkedIn</p>
                        <p className="mt-1 text-xs text-white/50">Let's connect</p>
                      </div>
                    </div>
                  </a>

                  {/* GitHub */}
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5
                               hover:border-[#00ff6a]/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,106,0.15),transparent_60%)]" />
                    </div>
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#00ff6a]/[0.08] border border-[#00ff6a]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#00ff6a]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90 group-hover:text-[#00ff6a] transition-colors">GitHub</p>
                        <p className="mt-1 text-xs text-white/50">github.com/ishika3011</p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Call */}
                  <button
                    onClick={() => setOpenCalendar(true)}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5
                               hover:border-[#00ff6a]/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,106,0.15),transparent_60%)]" />
                    </div>
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#00ff6a]/[0.08] border border-[#00ff6a]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#00ff6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90 group-hover:text-[#00ff6a] transition-colors">Schedule Call</p>
                        <p className="mt-1 text-xs text-white/50">Book a meeting</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Footer tagline */}
                <div className="mt-16 pt-8 border-t border-white/10">
                  <p className="text-sm text-white/40">
                    Built with passion for robotics
                  </p>
                  <p className="mt-2 text-xs text-white/30">
                    © {new Date().getFullYear()} Ishika Saijwal. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                {prettifyProjectTitle(activeProject.title)}
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {activeProject.desc}
              </p>
              {hasRealHref(activeProject.github) && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-5 py-3 text-white/85
                             hover:border-[#00ff6a]/40 hover:text-white transition mb-4"
                >
                  <span className="text-[#00ff6a]">GitHub</span>
                  <span className="text-white/50 text-sm">↗</span>
                </a>
              )}
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

      {/* CALENDAR MODAL (ADD HERE) */}
      <AnimatePresence>
        {openCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
            onClick={() => setOpenCalendar(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 40 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[min(1100px,92vw)] h-[min(720px,82vh)]
                        rounded-2xl overflow-hidden
                        bg-black/65 backdrop-blur-md
                        border border-white/12
                        shadow-[0_40px_140px_rgba(0,0,0,0.70),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
            >
              <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-white/10 bg-black/40">
                <div>
                  <p className="text-xs tracking-[0.22em] text-white/55">LET’S TALK</p>
                  <p className="mt-1 text-sm md:text-base text-white/80">
                    Pick a slot that works for you
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={MEET_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center justify-center rounded-lg
                               border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white/75
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Open in new tab
                  </a>
                  <button
                    onClick={() => setOpenCalendar(false)}
                    className="inline-flex items-center justify-center rounded-lg
                               border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white/75
                               hover:border-white/20 hover:text-white transition"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </div>
              </div>
              <iframe
                src={CALENDAR_EMBED}
                className="w-full h-full"
                style={{
                  filter: "invert(1) hue-rotate(90deg) saturate(1.4)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}