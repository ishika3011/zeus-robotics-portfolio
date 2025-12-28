"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

// Type declaration for Three.js
declare global {
  interface Window {
    THREE: any;
  }
}

const MEET_LINK =
  "https://calendar.google.com/calendar/appointments/schedules/YOUR_LINK";
const CALENDAR_EMBED =
  "https://calendar.google.com/calendar/appointments/schedules/YOUR_LINK?embed=true";


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
  { name: "ROS / ROS2", level: 95, icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Robot_Operating_System_logo.svg", iconTreatment: "invert" },
  { name: "C++", level: 90, icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" },
  { name: "Python", level: 85, icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
  { name: "PCL", level: 80, icon: "https://pointclouds.org/assets/images/pcl.png", iconTreatment: "invert" },
  { name: "Gazebo", level: 85, icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Gazebo_logo.svg", iconTreatment: "invert" },
  {
    name: "Embedded Systems",
    level: 90,
    // Inline SVG (never breaks due to hotlinking) — neon microchip icon.
    icon:
      "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%2300ff6a%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Crect%20x%3D%277%27%20y%3D%277%27%20width%3D%2710%27%20height%3D%2710%27%20rx%3D%272%27%2F%3E%3Cpath%20d%3D%27M12%201v3M12%2020v3M1%2012h3M20%2012h3M4.5%204.5l2.1%202.1M17.4%2017.4l2.1%202.1M19.5%204.5l-2.1%202.1M6.6%2017.4l-2.1%202.1%27%2F%3E%3C%2Fsvg%3E",
    iconTreatment: "boost",
  },
  { name: "SLAM", level: 85, icon: "https://img.icons8.com/ios/100/00ff6a/map.png" },
  { name: "OpenCV", level: 80, icon: "https://opencv.org/wp-content/uploads/2020/07/OpenCV_logo_black.png" },
];

const EXPERIENCE = [
  {
    role: "Robotics Engineer",
    org: "Your Company / Lab",
    location: "City, Country",
    period: "2024 — Present",
    highlights: [
      "Built perception + control pipelines for autonomous systems in real-world environments.",
      "Improved reliability by optimizing embedded bring-up, sensor fusion, and safety checks.",
      "Collaborated across mechanical/electrical/software to ship field-tested prototypes.",
    ],
    stack: ["ROS2", "C++", "Python", "SLAM", "Embedded"],
  },
  {
    role: "Research Engineer / RA",
    org: "Your University / Research Group",
    location: "City, Country",
    period: "2023 — 2024",
    highlights: [
      "Prototyped 3D perception and mapping workflows from point clouds and camera feeds.",
      "Evaluated algorithms with repeatable experiments and clear metrics/reporting.",
      "Authored technical documentation and maintained reproducible demos.",
    ],
    stack: ["PCL", "OpenCV", "Gazebo", "Robotics"],
  },
];

const PUBLICATIONS = [
  {
    title: "Your Paper Title",
    venue: "Conference / Journal / arXiv",
    year: "2025",
    blurb: "1–2 line summary of the contribution (perception, planning, control, etc.).",
    links: [
      { label: "PDF", href: "#" },
      { label: "arXiv", href: "#" },
    ],
    tags: ["Robotics", "Perception"],
  },
  {
    title: "Second Paper / Report Title",
    venue: "Workshop / Technical Report",
    year: "2024",
    blurb: "Short summary focusing on impact, results, or deployment context.",
    links: [{ label: "PDF", href: "#" }],
    tags: ["SLAM", "Embedded"],
  },
];

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
      {/* TOP LEFT — WELCOME */}
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

      {/* CENTER — NAV BOX */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -80 : 40, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed left-1/2 -translate-x-1/2 z-40
                   backdrop-blur bg-black/60 border border-[#00ff6a]/40
                   px-10 h-14 flex items-center gap-10 text-sm"
      >
        {[
          ["ABOUT", "#about"],
          ["EXPERIENCE", "#experience"],
          ["PROJECTS", "#projects"],
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

      {/* TOP RIGHT — LET’S TALK */}
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


/* -------------------- COMPONENT -------------------- */
export default function Home() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [robotGreeting, setRobotGreeting] = useState(false);
  const [zeusOpen, setZeusOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("robot");
  type ZeusEmoteType = "wave" | "heart";
  const zeusEmoteRef = useRef<
    | null
    | {
        type: ZeusEmoteType;
        startedAt: number;
        durationMs: number;
        baseChestIntensity?: number;
        baseChestMap?: any;
        baseChestEmissiveMap?: any;
        baseHeadRotY?: number;
        baseRightUpperArmRotZ?: number;
        baseRightForearmRotZ?: number;
        baseRightHandRotZ?: number;
      }
  >(null);
  const [zeusEmoteToast, setZeusEmoteToast] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotSectionRef = useRef<HTMLElement | null>(null);
  const { scrollY } = useScroll();

  const [activeProject, setActiveProject] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingDone = loadingProgress >= 100;

  // Projects 3D carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselAngle, setCarouselAngle] = useState(0); // degrees (Y axis)
  const dragRef = useRef<{
    isDown: boolean;
    startX: number;
    startAngle: number;
    moved: boolean;
  }>({
    isDown: false,
    startX: 0,
    startAngle: 0,
    moved: false,
  });

  const stepDeg = useMemo(() => (PROJECTS.length ? 360 / PROJECTS.length : 0), []);

  const normalizeDeg = (deg: number) => {
    let d = deg % 360;
    if (d < 0) d += 360;
    return d;
  };

  const shortestSignedDeg = (deg: number) => {
    // Map to [-180, 180)
    const d = ((deg + 180) % 360) - 180;
    return d;
  };

  const indexFromAngle = (angleDeg: number) => {
    if (!PROJECTS.length || !stepDeg) return 0;
    const raw = Math.round(-angleDeg / stepDeg);
    const n = PROJECTS.length;
    return ((raw % n) + n) % n;
  };

  const snapToIndex = (idx: number) => {
    if (!PROJECTS.length || !stepDeg) return;
    const n = PROJECTS.length;
    const next = ((idx % n) + n) % n;
    setCurrentIndex(next);
    setCarouselAngle(-next * stepDeg);
  };

  const snapToNearest = () => {
    snapToIndex(indexFromAngle(carouselAngle));
  };

  const nextProject = () => snapToIndex(currentIndex + 1);
  const prevProject = () => snapToIndex(currentIndex - 1);

  const ZEUS_SECTIONS = useMemo(
    () =>
      [
        { id: "robot", label: "Zeus" },
        { id: "about", label: "About" },
        { id: "experience", label: "Experience" },
        { id: "publications", label: "Publications" },
        { id: "projects", label: "Projects" },
        { id: "skills", label: "Skills" },
      ] as const,
    []
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextSection = () => {
    const idx = ZEUS_SECTIONS.findIndex((s) => s.id === activeSectionId);
    const next = ZEUS_SECTIONS[(idx >= 0 ? idx + 1 : 0) % ZEUS_SECTIONS.length];
    scrollToSection(next.id);
  };

  const openCurrentProject = () => {
    scrollToSection("projects");
    window.setTimeout(() => {
      const p = PROJECTS[currentIndex];
      if (p) setActiveProject(p);
    }, 450);
  };

  const triggerZeusEmote = (type: ZeusEmoteType) => {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const durationMs = type === "wave" ? 1400 : 1400;

    zeusEmoteRef.current = { type, startedAt: now, durationMs };

    const msg =
      type === "wave"
        ? "Zeus waves hello."
        : "Zeus sends a heart-beep.";
    setZeusEmoteToast(msg);
    window.setTimeout(() => setZeusEmoteToast(null), 1500);
  };

  const onCarouselPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't start a drag if the user is interacting with controls (arrows/dots)
    const target = e.target as HTMLElement | null;
    if (target?.closest?.('[data-carousel-control="true"]')) return;

    // Only respond to primary button/touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    // Allow drag-rotate anywhere on the stage
    dragRef.current.isDown = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startAngle = carouselAngle;
    dragRef.current.moved = false;

    try {
      (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onCarouselPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;

    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 5) dragRef.current.moved = true;

    // degrees per pixel (tuned for trackpads + mice)
    const nextAngle = dragRef.current.startAngle + dx * 0.28;
    setCarouselAngle(nextAngle);
    setCurrentIndex(indexFromAngle(nextAngle));
  };

  const onCarouselPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;

    try {
      (e.currentTarget as any).releasePointerCapture?.(e.pointerId);
    } catch {}

    if (dragRef.current.moved) {
      snapToNearest();
    } else {
      // keep currentIndex aligned even after small tap
      snapToIndex(indexFromAngle(carouselAngle));
    }

    // Let the click event (if any) run before we clear the "moved" guard.
    setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  };

  /* ---------- PARALLAX LAYERS ---------- */
  const bgY = useTransform(scrollY, [0, 1200], [0, 260]);
  const fogY = useTransform(scrollY, [0, 1200], [0, 160]);

  /* ---------- Scroll Particles ---------- */
  const particleY = useTransform(scrollY, [0, 2000], [0, -500]);
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

  /* ---------- Sleek Loading Animation ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev: number) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
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

    let resizeRenderer: (() => void) | null = null;
    let handleCanvasClick: ((event: MouseEvent) => void) | null = null;
    let animationFrameId: number | null = null;
    let observer: IntersectionObserver | null = null;
    let scrollTimer: number | null = null;
    let lowQuality = false;
    let isInView = true;
    let isTabVisible = document.visibilityState !== "hidden";
    let isRunning = false;
    let lastFrameT = 0;

    // Load Three.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    
    script.onload = () => {
      const THREE = window.THREE;
      if (!THREE) return;

      // Create flower texture
      const createFlowerTexture = () => {
        const canvas = document.createElement('canvas');
        // Higher-res for sharper details on the chest "screen"
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (!ctx) return new THREE.Texture(canvas);
        
        const W = canvas.width;
        const H = canvas.height;
        const cx = W / 2;
        const cy = H / 2;

        // Deep "screen" background with vignette (keeps it looking modern/clear)
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#030406');
        bg.addColorStop(0.5, '#040b08');
        bg.addColorStop(1, '#010203');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const vignette = ctx.createRadialGradient(cx, cy, 40, cx, cy, Math.max(W, H) * 0.62);
        vignette.addColorStop(0, 'rgba(0,255,106,0.08)');
        vignette.addColorStop(0.55, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.75)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);

        // Subtle scanlines (very light, so it stays pleasing)
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 1);

        // Neon lotus / rosette (cleaner than the previous "stem + petals" flower)
        const petals = 12;
        const rInner = 78;
        const rOuter = 178;
        const petalWidth = 96;
        const petalLength = 170;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < petals; i++) {
          const a = (i * Math.PI * 2) / petals;
          ctx.save();
          ctx.rotate(a);

          // Gradient per petal: magenta -> violet -> green edge (no blue/cyan clash)
          const pg = ctx.createLinearGradient(0, -petalLength, 0, 22);
          pg.addColorStop(0, 'rgba(255, 105, 180, 0.70)');
          pg.addColorStop(0.55, 'rgba(169, 85, 255, 0.55)');
          pg.addColorStop(1, 'rgba(0, 255, 106, 0.20)');
          ctx.fillStyle = pg;

          // Teardrop petal (bezier) for a cleaner "visor HUD" aesthetic
          ctx.beginPath();
          ctx.moveTo(0, -rOuter);
          ctx.bezierCurveTo(petalWidth * 0.55, -rOuter + petalLength * 0.30, petalWidth * 0.40, -rInner, 0, -rInner + 12);
          ctx.bezierCurveTo(-petalWidth * 0.40, -rInner, -petalWidth * 0.55, -rOuter + petalLength * 0.30, 0, -rOuter);
          ctx.closePath();
          ctx.fill();

          // Petal rim highlight
          ctx.strokeStyle = 'rgba(255,255,255,0.10)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        }

        // Outer halo ring (thin + crisp)
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(0,255,106,0.22)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 210, 0, Math.PI * 2);
        ctx.stroke();

        // Center core + glow
        ctx.globalCompositeOperation = 'lighter';
        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 86);
        core.addColorStop(0, 'rgba(255,255,255,0.92)');
        core.addColorStop(0.26, 'rgba(255,232,120,0.80)');
        core.addColorStop(0.62, 'rgba(0,255,106,0.24)');
        core.addColorStop(1, 'rgba(0,0,0,0.00)');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(0, 0, 92, 0, Math.PI * 2);
        ctx.fill();

        // Micro sparkles
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        for (let i = 0; i < 22; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = 110 + Math.random() * 110;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        
        const texture = new THREE.Texture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
        return texture;
      };
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true,
        antialias: true 
      });
      
      renderer.setClearColor(0x000000, 0);
      const defaultPixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
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
      const flowerTexture = createFlowerTexture();

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

        ctx.fillStyle = "#050607";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(256, 220);
        ctx.scale(1.08, 1.08);
        ctx.beginPath();
        ctx.moveTo(0, 90);
        ctx.bezierCurveTo(0, 40, -90, 10, -90, -40);
        ctx.bezierCurveTo(-90, -90, -40, -110, 0, -60);
        ctx.bezierCurveTo(40, -110, 90, -90, 90, -40);
        ctx.bezierCurveTo(90, 10, 0, 40, 0, 90);
        const grd = ctx.createLinearGradient(-90, -110, 90, 110);
        grd.addColorStop(0, "#ff7aa8");
        grd.addColorStop(0.5, "#ff3f78");
        grd.addColorStop(1, "#ffacc4");
        ctx.fillStyle = grd;
        ctx.shadowColor = "rgba(255, 63, 120, 0.6)";
        ctx.shadowBlur = 26;
        ctx.fill();
        ctx.restore();

        const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 210);
        g.addColorStop(0, "rgba(255, 63, 120, 0.2)");
        g.addColorStop(1, "rgba(255, 63, 120, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        // Sit clearly above the head and slightly forward so it's never hidden
        antennaGroup.position.set(0, 0.46, 0.18);
        antennaGroup.rotation.z = -0.08;
        antennaGroup.scale.set(1.05, 1.05, 1.05);

        const antennaMetalMaterial = new THREE.MeshStandardMaterial({
          color: 0x1b1b1b,
          metalness: 0.95,
          roughness: 0.25,
        });

        const antennaStemGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.44, 16);
        const antennaStem = new THREE.Mesh(antennaStemGeometry, antennaMetalMaterial);
        antennaStem.position.y = 0.22;
        antennaGroup.add(antennaStem);

        const ringMaterial = new THREE.MeshStandardMaterial({
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 1.6,
          transparent: true,
          opacity: 0.9,
        });

        const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.014, 12, 40), ringMaterial);
        baseRing.rotation.x = Math.PI / 2;
        baseRing.position.y = 0.04;
        antennaGroup.add(baseRing);

        const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.01, 12, 40), ringMaterial);
        midRing.rotation.x = Math.PI / 2;
        midRing.position.y = 0.18;
        antennaGroup.add(midRing);

        const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 12, 40), ringMaterial);
        topRing.rotation.x = Math.PI / 2;
        topRing.position.y = 0.31;
        antennaGroup.add(topRing);

        const antennaCap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 18), antennaMetalMaterial);
        antennaCap.position.y = 0.44;
        antennaGroup.add(antennaCap);

        const tipGlass = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 24, 24),
          new THREE.MeshPhysicalMaterial({
            color: 0x00ff6a,
            transparent: true,
            opacity: 0.28,
            transmission: 0.95,
            ior: 1.45,
            thickness: 0.08,
            roughness: 0.08,
            metalness: 0.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.06,
            emissive: 0x00ff6a,
            emissiveIntensity: 0.8,
          })
        );
        tipGlass.position.y = 0.51;
        antennaGroup.add(tipGlass);

        const tipHalo = new THREE.Mesh(
          new THREE.TorusGeometry(0.095, 0.006, 10, 48),
          new THREE.MeshStandardMaterial({
            color: 0x00ff6a,
            emissive: 0x00ff6a,
            emissiveIntensity: 2.4,
            transparent: true,
            opacity: 0.75,
          })
        );
        tipHalo.rotation.x = Math.PI / 2;
        tipHalo.position.y = 0.51;
        antennaGroup.add(tipHalo);

        headGroup.add(antennaGroup);

        // Visor (modern "screen" behind glass cover, in the same green theme)
        const visorGroup = new THREE.Group();
        visorGroup.position.set(0, 1.45, 0.395);
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

        robot.add(visorGroup);


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
        rightUpperArm.name = "rightUpperArm";
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
        robot.add(leftElbow);

        const rightElbow = new THREE.Mesh(jointGeometry, shellMaterial);
        rightElbow.position.set(0.86, -0.2, 0);
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

        robot.add(createHand(-1));
        robot.add(createHand(1));

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
      robot.scale.set(1.62, 1.62, 1.62);

      // Named parts for cute emotes (optional — safe to be null)
      const zeusHead: any = robot.getObjectByName("head");
      const zeusRightUpperArm: any = robot.getObjectByName("rightUpperArm");
      const zeusRightForearm: any = robot.getObjectByName("rightForearm");
      const zeusRightHand: any = robot.getObjectByName("rightHand");

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
          
          // Update chest inner panel to show flower (behind glass)
          if (chestInnerMaterial) {
            chestInnerMaterial.color.setHex(0xffffff);
            chestInnerMaterial.map = flowerTexture;
            chestInnerMaterial.emissiveMap = flowerTexture;
            // brighter so the "flower" reads clearly through the glass shell
            chestInnerMaterial.emissiveIntensity = 1.25;
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
      const keyLight = new THREE.DirectionalLight(0xffffff, 0.95);
      keyLight.position.set(6, 10, 7);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.radius = 7;
      keyLight.shadow.bias = -0.00012;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);

      // Green rim: keep neon accents saturated without looking like a second sun
      const rimLight = new THREE.DirectionalLight(0x00ff6a, 1.05);
      rimLight.position.set(-7, 6, -7);
      scene.add(rimLight);

      // Green accent lift (keeps the robot "selling" on dark BG)
      const pointLight1 = new THREE.PointLight(0x00ff6a, 1.6, 100);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      // Warm fill (pairs well with green; replaces any blue/cyan feel)
      const pointLight2 = new THREE.PointLight(0xffc58a, 0.55, 100);
      pointLight2.position.set(-5, -3, 6);
      scene.add(pointLight2);

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
        if (emote) {
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
              chestInnerMaterial.needsUpdate = true;
            }
            if (emote.type === "wave") {
              if (zeusHead && typeof emote.baseHeadRotY === "number") zeusHead.rotation.y = emote.baseHeadRotY;
              if (zeusRightUpperArm && typeof emote.baseRightUpperArmRotZ === "number") {
                zeusRightUpperArm.rotation.z = emote.baseRightUpperArmRotZ;
              }
              if (zeusRightForearm && typeof emote.baseRightForearmRotZ === "number") {
                zeusRightForearm.rotation.z = emote.baseRightForearmRotZ;
              }
              if (zeusRightHand && typeof emote.baseRightHandRotZ === "number") {
                zeusRightHand.rotation.z = emote.baseRightHandRotZ;
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
                if (heartTexture) {
                  chestInnerMaterial.map = heartTexture;
                  chestInnerMaterial.emissiveMap = heartTexture;
                }
                const pulse = (Math.sin(p * Math.PI * 2) * 0.5 + 0.5); // 0..1
                const base = emote.baseChestIntensity ?? (chestInnerMaterial.emissiveIntensity ?? 1.4);
                chestInnerMaterial.emissiveIntensity = base + pulse * 0.9;
                chestInnerMaterial.needsUpdate = true;
              }
            } else if (emote.type === "wave") {
              // Wave: head tilt + shoulder + forearm + hand flick
              if (zeusHead) {
                if (typeof emote.baseHeadRotY !== "number") emote.baseHeadRotY = zeusHead.rotation.y ?? 0;
                const baseHead = emote.baseHeadRotY ?? (zeusHead.rotation.y ?? 0);
                zeusHead.rotation.y = baseHead + Math.sin(p * Math.PI * 2) * 0.16;
              }
              if (zeusRightUpperArm) {
                if (typeof emote.baseRightUpperArmRotZ !== "number") {
                  emote.baseRightUpperArmRotZ = zeusRightUpperArm.rotation.z ?? 0;
                }
                const baseUpper = emote.baseRightUpperArmRotZ ?? (zeusRightUpperArm.rotation.z ?? 0);
                zeusRightUpperArm.rotation.z = baseUpper + 0.8 + Math.sin(p * Math.PI * 4) * 0.22;
              }
              if (zeusRightForearm) {
                if (typeof emote.baseRightForearmRotZ !== "number") {
                  emote.baseRightForearmRotZ = zeusRightForearm.rotation.z ?? 0;
                }
                const baseFore = emote.baseRightForearmRotZ ?? (zeusRightForearm.rotation.z ?? 0);
                zeusRightForearm.rotation.z = baseFore + 0.4 + Math.sin(p * Math.PI * 4 + 0.6) * 0.28;
              }
              if (zeusRightHand) {
                if (typeof emote.baseRightHandRotZ !== "number") {
                  emote.baseRightHandRotZ = zeusRightHand.rotation.z ?? 0;
                }
                const baseHand = emote.baseRightHandRotZ ?? (zeusRightHand.rotation.z ?? 0);
                zeusRightHand.rotation.z = baseHand + Math.sin(p * Math.PI * 4 + 1.1) * 0.35;
              }
            }
          }
        }

        robot.position.y = Math.sin(now * 0.001) * 0.1 + extraY;
        
        // Rotate based on mouse position
        robot.rotation.y = smoothMouseX.get() * 0.5;
        robot.rotation.x = smoothMouseY.get() * 0.3;
        
        // Idle rotation
        robot.rotation.y += 0.002;
        
        renderer.render(scene, camera);
      };
      
      const setRunning = () => {
        const shouldRun = isInView && isTabVisible;
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

      // Pause rendering when offscreen; resume when visible again
      if (robotSectionRef.current) {
        observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            isInView = !!entry?.isIntersecting;
            setRunning();
          },
          { threshold: 0.12 }
        );
        observer.observe(robotSectionRef.current);
      }

      // Temporarily lower pixel ratio while actively scrolling (prevents scroll hitching)
      const onScroll = () => {
        if (!lowQuality) {
          lowQuality = true;
          renderer.setPixelRatio(1);
          resizeRenderer?.();
        }
        if (scrollTimer != null) window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          lowQuality = false;
          renderer.setPixelRatio(defaultPixelRatio);
          resizeRenderer?.();
        }, 140);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const onVisibility = () => {
        isTabVisible = document.visibilityState !== "hidden";
        setRunning();
      };
      document.addEventListener("visibilitychange", onVisibility);

      // Start rendering if visible
      setRunning();

      // Attach runtime cleanup on the script element so we can call it in outer cleanup
      (script as any).__robotCleanupRuntime = () => {
        window.removeEventListener("scroll", onScroll as any);
        document.removeEventListener("visibilitychange", onVisibility);
        if (observer) observer.disconnect();
        if (scrollTimer != null) window.clearTimeout(scrollTimer);
      };
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (animationFrameId != null) window.cancelAnimationFrame(animationFrameId);
      if (resizeRenderer) window.removeEventListener('resize', resizeRenderer);
      if (handleCanvasClick && canvasRef.current) canvasRef.current.removeEventListener('click', handleCanvasClick);
      try {
        const cleanupRuntime = (script as any).__robotCleanupRuntime;
        if (typeof cleanupRuntime === "function") cleanupRuntime();
      } catch {}
    };
  }, [smoothMouseX, smoothMouseY]);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden overflow-y-visible text-white">
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
            <p className="text-[#00ff6a] text-2xl tracking-wide">
              INITIALIZING... {loadingProgress}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
          backdrop-filter: blur(18px) saturate(120%);
          -webkit-backdrop-filter: blur(18px) saturate(120%);
          isolation: isolate;
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
          filter: blur(28px) saturate(115%);
          animation: heroAurora 12.5s ease-in-out infinite;
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
          filter: blur(26px);
          opacity: 0.55;
          animation: heroOrbFloat 8.5s ease-in-out infinite;
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
          animation: heroScrollPip 1.4s ease-in-out infinite;
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
          backdrop-filter: blur(18px) saturate(115%);
          -webkit-backdrop-filter: blur(18px) saturate(115%);
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

        /* ---- 3D Projects Carousel ---- */
        .projects-3d-stage {
          position: relative;
          height: clamp(640px, 78vh, 820px); /* larger window so cards don't get clipped */
          perspective: 1200px;
          perspective-origin: 50% 42%; /* slightly lower framing */
          touch-action: pan-y;
          user-select: none;
          overflow: hidden; /* prevents 3D cards from bleeding into the heading area */
          isolation: isolate; /* keeps stacking predictable */
        }

        .projects-3d-tilt {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform: rotateX(8deg) translateY(22px); /* drop the ring so the front card centers better */
        }

        .projects-3d-floor {
          position: absolute;
          left: 50%;
          top: 58%;
          width: min(860px, 92vw);
          height: 420px;
          transform: translateX(-50%) rotateX(78deg) translateZ(-140px);
          transform-origin: center;
          border-radius: 999px;
          background: radial-gradient(circle at center,
            rgba(0,255,106,0.18) 0%,
            rgba(0,255,106,0.06) 36%,
            rgba(0,0,0,0) 70%);
          filter: blur(0.2px);
          pointer-events: none;
        }

        .projects-3d-ring {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          --radius: clamp(150px, 22vw, 380px);
        }

        .projects-3d-card {
          position: absolute;
          left: 50%;
          top: 54%;
          width: min(420px, 90vw);
          height: clamp(420px, 56vh, 560px);
          overflow: hidden;
          transform-style: preserve-3d;
          transform:
            translate(-50%, -50%)
            translateY(var(--lift, 0px))
            rotateY(var(--theta))
            translateZ(var(--radius))
            rotateY(calc(-1 * var(--theta)))
            scale(var(--scale, 1));
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background:
            radial-gradient(900px 300px at 50% -40%, rgba(255,255,255,0.12), transparent 65%),
            radial-gradient(800px 320px at 14% 30%, rgba(0,255,106,0.06), transparent 62%),
            linear-gradient(180deg, rgba(14,14,16,0.72), rgba(0,0,0,0.78));
          backdrop-filter: blur(18px) saturate(130%);
          -webkit-backdrop-filter: blur(18px) saturate(130%);
          box-shadow:
            0 26px 100px rgba(0,0,0,0.82),
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 1px 0 rgba(255,255,255,0.12) inset,
            0 -1px 0 rgba(0,0,0,0.45) inset;
          opacity: var(--opacity, 1);
          filter: blur(var(--blur, 0px));
          transition: transform 520ms cubic-bezier(.2,.85,.2,1), opacity 520ms ease, filter 520ms ease, box-shadow 520ms ease, border-color 520ms ease, background 520ms ease;
          will-change: transform, opacity, filter;
          cursor: grab;
        }

        .projects-3d-card:active { cursor: grabbing; }

        .projects-3d-card.is-front {
          border-color: rgba(0,255,106,0.55);
          background:
            radial-gradient(1000px 340px at 18% 0%, rgba(0,255,106,0.18), transparent 58%),
            radial-gradient(900px 320px at 60% -30%, rgba(255,255,255,0.14), transparent 62%),
            linear-gradient(180deg, rgba(20,20,22,0.62), rgba(2,2,2,0.70));
          box-shadow:
            0 32px 120px rgba(0,0,0,0.78),
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 0 140px rgba(0,255,106,0.18);
        }

        .projects-3d-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .projects-3d-media {
          height: clamp(140px, 20vh, 210px);
          border-radius: 14px;
          background:
            radial-gradient(800px 220px at 20% 0%, rgba(0,255,106,0.20), transparent 62%),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.65)),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 10px);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.35) inset,
            0 18px 60px rgba(0,0,0,0.45);
          flex: 0 0 auto;
        }

        .projects-3d-titleClamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .projects-3d-descClamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
        }

        .projects-3d-techRow {
          margin-top: auto;
          padding-top: 4px;
        }

        .projects-3d-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.10), transparent 34%),
            linear-gradient(240deg, rgba(255,255,255,0.06), transparent 52%);
          opacity: 0.65;
          pointer-events: none;
        }

        .projects-3d-card::after {
          content: "";
          position: absolute;
          left: 10px;
          right: 10px;
          top: 10px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          opacity: 0.65;
          pointer-events: none;
        }

        .projects-3d-float {
          animation: projectsFloat 5.6s ease-in-out infinite;
        }

        @keyframes projectsFloat {
          0%, 100% { transform: translateZ(22px) translateY(0px); }
          50% { transform: translateZ(22px) translateY(-10px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .projects-3d-card { transition: none; }
          .projects-3d-float { animation: none; }
        }

        @media (max-width: 640px) {
          .projects-3d-stage { height: clamp(600px, 86vh, 780px); }
          .projects-3d-ring { --radius: clamp(120px, 48vw, 220px); }
          .projects-3d-floor {
            top: 60%;
            height: 360px;
            transform: translateX(-50%) rotateX(78deg) translateZ(-160px);
          }
        }
      `}</style>

      {/* Cursor */}
      {/* PARALLAX BACKGROUND GLOW */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,#00ff6a15,transparent_60%)]"
      />

      {/* PARALLAX FOG */}
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-60"
      />

      {/* Scroll circuit traces */}
      <motion.div
        style={{ y: particleY }}
        className="fixed inset-0 pointer-events-none opacity-20"
      >
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
      </motion.div>

      {/* HERO */}
      <section className="relative min-h-screen z-20 flex items-center justify-center px-6 md:px-10 pt-28 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-aurora" />
          <div className="hero-grid" />
          <div className="hero-noise" />
        </div>

        <div className="relative w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hero-surface rounded-[28px] px-6 py-10 md:px-12 md:py-14"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="absolute -top-24 left-1/2 h-56 w-[min(820px,90vw)] -translate-x-1/2 rounded-full bg-[#00ff6a]/10 blur-3xl" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs tracking-[0.22em] text-white/70">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                  ROBOTICS ENGINEER
                </span>

                <h1 className="mt-6 text-[clamp(3.1rem,7.6vw,5.6rem)] font-black leading-[0.92] tracking-tight">
                  <span className="block text-white/90">I’m</span>
                  <span className="block bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-white bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(0,255,106,0.18)]">
                    Ishika Saijwal
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
                  I build autonomous machines that work in the real world — embedded control, ROS2 pipelines,
                  perception, and deployment-grade reliability.
                </p>

                <div className="mt-7 flex flex-wrap gap-2 text-xs">
                  {["ROS2", "Embedded", "Perception"].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/70"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]/90" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-5
                                shadow-[0_0_0_1px_rgba(255,255,255,0.05)]
                                hover:border-[#00ff6a]/22 hover:shadow-[0_0_0_1px_rgba(0,255,106,0.10),0_18px_60px_rgba(0,0,0,0.55)]
                                transition">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    {/* Replace this with your actual photo. Recommended: put an image at /public/me.jpg and update src. */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_28%,rgba(0,255,106,0.16),transparent_55%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_50%,rgba(0,0,0,0.40))]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center">
                          <span className="text-white/70 font-semibold">IS</span>
                        </div>
                        <p className="mt-3 text-xs tracking-[0.22em] text-white/55">YOUR PHOTO HERE</p>
                        <p className="mt-1 text-xs text-white/55">Replace with a portrait</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs tracking-[0.22em] text-white/55">CURRENTLY</p>
                    <p className="mt-2 text-sm text-white/72 leading-relaxed">
                      Working on robotics systems that stay stable under real-world noise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-10 flex justify-center gap-3 flex-wrap">
              <a
                href="#robot"
                aria-label="Meet Zeus section"
                className="group inline-flex items-center gap-3 rounded-full border border-[#00ff6a]/25 bg-[#00ff6a]/[0.06] px-4 py-2 text-xs tracking-[0.22em] text-white/70
                           hover:border-[#00ff6a]/45 hover:bg-[#00ff6a]/[0.10] hover:text-white/85 transition"
              >
                MEET ZEUS
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a] shadow-[0_0_14px_rgba(0,255,106,0.55)]" />
              </a>
              <a
                href="#about"
                aria-label="Scroll to About section"
                className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs tracking-[0.22em] text-white/60 hover:text-white/80 transition"
              >
                SCROLL
                <span className="relative inline-flex h-6 w-[2px] overflow-hidden rounded-full bg-white/10">
                  <span className="hero-scroll-pip" />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROBOT (full-viewport) */}
      <motion.section
        id="robot"
        ref={robotSectionRef as any}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Full-screen canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-screen h-screen cursor-pointer" />

        {/* ZEUS HUD (tiny + focused so Zeus stays the focus) */}
        <div className="pointer-events-none absolute left-5 md:left-7 bottom-5 md:bottom-7 z-10 w-[min(340px,90vw)]">
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
                  <p className="text-[10px] md:text-[11px] tracking-[0.30em] text-white/50">
                    ZEUS // GUIDE
                  </p>
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

              <div className="mt-2 text-[11px] md:text-xs text-white/65 leading-relaxed">
                Click my chest to open Assist Mode (bottom-right).
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
                    Assist mode deployed — check the bottom-right widget.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ZEUS ASSIST (floating, site-wide) */}
      <div className="fixed bottom-6 right-6 z-[60]">
        {!zeusOpen && (
          <button
            onClick={() => setZeusOpen(true)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl px-4 py-3
                       shadow-[0_0_0_1px_rgba(0,255,106,0.14),0_18px_60px_rgba(0,0,0,0.55)]
                       hover:border-[#00ff6a]/40 hover:shadow-[0_0_0_1px_rgba(0,255,106,0.30),0_24px_90px_rgba(0,255,106,0.10)]
                       transition"
            aria-label="Open Zeus assistant"
          >
            <span className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.22),transparent_60%)]" />
            </span>
            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#00ff6a]/30 bg-[#00ff6a]/10 text-[#00ff6a] font-black">
                Z
              </span>
              <div className="text-left">
                <p className="text-xs tracking-[0.22em] text-white/55">ASSIST</p>
                <p className="text-sm text-white/80">Zeus</p>
              </div>
            </div>
          </button>
        )}

        <AnimatePresence>
          {zeusOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mt-3 w-[min(380px,92vw)] overflow-hidden rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl
                         shadow-[0_0_0_1px_rgba(0,255,106,0.12),0_30px_120px_rgba(0,0,0,0.70)]"
              role="dialog"
              aria-label="Zeus assistant"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-black/35">
                <div>
                  <p className="text-xs tracking-[0.22em] text-white/55">ZEUS ASSIST</p>
                  <p className="mt-0.5 text-sm text-white/80">
                    You’re in{" "}
                    <span className="text-[#00ff6a]">
                      {ZEUS_SECTIONS.find((s) => s.id === activeSectionId)?.label ?? "the page"}
                    </span>
                  </p>
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

              <div className="p-4">
                <p className="text-sm text-white/70 leading-relaxed">
                  Use me as a fast navigator (and a shortcut to your current build).
                </p>

                {zeusEmoteToast && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00ff6a]/18 bg-[#00ff6a]/[0.06] px-3 py-2 text-[11px] text-white/80">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]/90" />
                    {zeusEmoteToast}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={nextSection}
                    className="rounded-xl border border-[#00ff6a]/25 bg-[#00ff6a]/[0.06] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/40 hover:bg-[#00ff6a]/[0.10] transition"
                  >
                    Next section
                  </button>
                  <button
                    onClick={() => {
                      setOpenCalendar(true);
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Book a call
                  </button>

                  <button
                    onClick={() => scrollToSection("projects")}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Jump to projects
                  </button>
                  <button
                    onClick={openCurrentProject}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Open current build
                  </button>

                  <button
                    onClick={() => scrollToSection("about")}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("skills")}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80
                               hover:border-[#00ff6a]/30 hover:text-white transition"
                  >
                    Skills
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] tracking-[0.22em] text-white/55">MAKE ZEUS YOUR FRIEND</p>
                  <p className="mt-1 text-xs text-white/70">
                    Tap an emoji — I’ll wave or send a heart.
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2">
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
                      onClick={() => triggerZeusEmote("heart")}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85
                                 hover:border-[#00ff6a]/30 hover:text-white transition"
                      aria-label="Zeus heart beep"
                      title="Heart-beep"
                    >
                      💚
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <a
                    href={MEET_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/55 hover:text-[#00ff6a] transition"
                  >
                    Open calendar link
                  </a>
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
      
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative pb-20 md:pb-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,106,0.10),transparent_55%)]" />

        <div className="section-glassbar">
          <div className="section-glassbar-inner relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-6 md:py-7 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2
                className="text-4xl md:text-6xl font-black tracking-tight
                           bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-[#EFFFF7]
                           bg-clip-text text-transparent
                           drop-shadow-[0_0_22px_rgba(0,255,106,0.25)]"
              >
                ABOUT
              </h2>
              <p className="mt-2 text-sm md:text-base text-white/60">
                A quick snapshot of what I build and how I work.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {["Autonomy", "Perception", "Embedded", "ROS2"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2 text-white/65"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-7">
              <div className="group relative overflow-hidden rounded-2xl border border-[#00ff6a]/25 bg-white/[0.03] backdrop-blur-xl p-7
                              shadow-[0_0_0_1px_rgba(0,255,106,0.28),0_0_90px_rgba(0,255,106,0.12)]
                              hover:border-[#00ff6a]/45
                              hover:shadow-[0_0_0_1px_rgba(0,255,106,0.40),0_0_130px_rgba(0,255,106,0.16)]
                              transition">
                <div className="pointer-events-none absolute -inset-10 opacity-85 group-hover:opacity-100 transition">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.26),transparent_58%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(255,255,255,0.12),transparent_58%)]" />
                </div>
                <div className="relative">
                  <p className="text-xs tracking-[0.22em] text-white/55">SUMMARY</p>
                  <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed">
                    Robotics engineer focused on autonomous systems, embedded control,
                    perception pipelines, and real-world deployment.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["System integration", "Field testing", "Safety-first control", "Experiment design"].map((t) => (
                      <span
                        key={t}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#00ff6a]/25 bg-[#00ff6a]/[0.06] text-white/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid gap-5">
                {[
                  {
                    k: "Build style",
                    v: "Prototype → validate → harden → deploy",
                  },
                  {
                    k: "Strengths",
                    v: "Perception + control + embedded bring-up",
                  },
                  {
                    k: "Collaboration",
                    v: "Cross-functional: mech · elec · software",
                  },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6
                               shadow-[0_0_0_1px_rgba(255,255,255,0.08)]
                               hover:border-[#00ff6a]/25
                               hover:shadow-[0_0_0_1px_rgba(0,255,106,0.18),0_22px_70px_rgba(0,255,106,0.06)]
                               transition"
                  >
                    <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.10),transparent_62%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,106,0.14),transparent_62%)]" />
                    </div>
                    <p className="relative text-xs tracking-[0.22em] text-white/55">{x.k}</p>
                    <p className="relative mt-3 text-sm md:text-base text-white/70 leading-relaxed">
                      {x.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
        {/* EXPERIENCE */}
      <motion.section
        id="experience"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative pb-20 md:pb-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,106,0.10),transparent_55%)]" />

        <div className="section-glassbar">
          <div className="section-glassbar-inner relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-6 md:py-7 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2
                className="text-4xl md:text-6xl font-black tracking-tight
                           bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-[#EFFFF7]
                           bg-clip-text text-transparent
                           drop-shadow-[0_0_22px_rgba(0,255,106,0.25)]"
              >
                EXPERIENCE
              </h2>
              <p className="mt-2 text-sm md:text-base text-white/60">
                Industry · Labs · Research — selected highlights
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/55">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                Ship real systems
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                Research rigor
              </span>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left summary card */}
            <div className="lg:col-span-4">
              <div className="group relative overflow-hidden rounded-2xl border border-[#00ff6a]/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] backdrop-blur-xl p-6
                              shadow-[0_0_0_1px_rgba(0,255,106,0.35),0_0_120px_rgba(0,255,106,0.16)]
                              hover:border-[#00ff6a]/55
                              hover:shadow-[0_0_0_1px_rgba(0,255,106,0.46),0_0_150px_rgba(0,255,106,0.20)]
                              transition">
                <div className="pointer-events-none absolute -inset-10 opacity-100 transition">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.26),transparent_58%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(255,255,255,0.18),transparent_58%)]" />
                </div>
                <div className="relative">
                  <p className="text-xs tracking-[0.22em] text-white/55">FOCUS</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    Autonomy, perception, and embedded control — built to deploy.
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-white/65">
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                      <span>Robust ROS/ROS2 integration for field systems</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                      <span>Perception pipelines: point clouds, vision, mapping</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                      <span>Embedded bring-up + safety-minded control loops</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right timeline */}
            <div className="lg:col-span-8">
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00ff6a]/40 via-white/10 to-transparent" />

                <div className="grid gap-5">
                  {EXPERIENCE.map((x, i) => (
                    <motion.div
                      key={`${x.role}-${x.org}-${x.period}`}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
                      className="relative"
                    >
                      <div className="absolute -left-[19px] top-7 w-3.5 h-3.5 rounded-full bg-[#00ff6a] shadow-[0_0_0_6px_rgba(0,255,106,0.10)]" />

                      <div
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6
                                   shadow-[0_0_0_1px_rgba(0,255,106,0.10)]
                                   hover:border-[#00ff6a]/40
                                   hover:shadow-[0_0_0_1px_rgba(0,255,106,0.32),0_28px_90px_rgba(0,255,106,0.10)]
                                   transition"
                      >
                        <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.22),transparent_55%)]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(255,255,255,0.10),transparent_55%)]" />
                        </div>

                        <div className="relative flex items-start justify-between gap-4 flex-wrap">
                          <div className="min-w-0">
                            <h3 className="text-lg md:text-xl font-semibold text-white truncate">
                              {x.role}
                            </h3>
                            <p className="mt-1 text-sm text-white/65 truncate">
                              <span className="text-[#00ff6a]">{x.org}</span>
                              <span className="text-white/40"> · </span>
                              <span>{x.location}</span>
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-white/55 rounded-full border border-white/10 bg-black/30 px-3 py-1.5">
                            {x.period}
                          </span>
                        </div>

                        <ul className="relative mt-4 space-y-2 text-sm text-white/70 leading-relaxed">
                          {x.highlights.map((h) => (
                            <li key={h} className="flex gap-2">
                              <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                              <span className="flex-1">{h}</span>
                            </li>
                          ))}
                        </ul>

                        {x.stack?.length ? (
                          <div className="relative mt-5 flex flex-wrap gap-2">
                            {x.stack.map((t) => (
                              <span
                                key={t}
                                className="text-xs px-3 py-1.5 rounded-full border border-[#00ff6a]/25 bg-[#00ff6a]/[0.06] text-white/75
                                           hover:bg-[#00ff6a] hover:text-black transition"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs text-white/45">
                {/* helper removed for a cleaner read */}
              </p>
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
        className="relative pb-20 md:pb-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,106,0.10),transparent_55%)]" />

        <div className="section-glassbar">
          <div className="section-glassbar-inner relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-6 md:py-7 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2
                className="text-4xl md:text-6xl font-black tracking-tight
                           bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-[#EFFFF7]
                           bg-clip-text text-transparent
                           drop-shadow-[0_0_22px_rgba(0,255,106,0.25)]"
              >
                PUBLICATIONS
              </h2>
              <p className="mt-2 text-sm md:text-base text-white/60">
                Papers · arXiv · reports — selected work
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/55">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                Reproducible
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                Measured
              </span>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="group relative overflow-hidden rounded-2xl border border-[#00ff6a]/25 bg-white/[0.03] backdrop-blur-xl p-6
                              shadow-[0_0_0_1px_rgba(0,255,106,0.28),0_0_90px_rgba(0,255,106,0.12)]
                              hover:border-[#00ff6a]/45
                              hover:shadow-[0_0_0_1px_rgba(0,255,106,0.40),0_0_130px_rgba(0,255,106,0.16)]
                              transition">
                <div className="pointer-events-none absolute -inset-10 opacity-85 group-hover:opacity-100 transition">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.26),transparent_58%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(255,255,255,0.12),transparent_58%)]" />
                </div>
                <div className="relative">
                  <p className="text-xs tracking-[0.22em] text-white/55">HIGHLIGHTS</p>
                  <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
                    I focus on publishable, testable results—then translate them into working demos.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Point clouds", "Mapping", "Control", "Deployment"].map((t) => (
                      <span
                        key={t}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#00ff6a]/25 bg-[#00ff6a]/[0.06] text-white/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-5">
                {PUBLICATIONS.map((p, i) => (
                  <motion.article
                    key={`${p.title}-${p.year}`}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6
                               shadow-[0_0_0_1px_rgba(0,255,106,0.10)]
                               hover:border-[#00ff6a]/40
                               hover:shadow-[0_0_0_1px_rgba(0,255,106,0.32),0_28px_90px_rgba(0,255,106,0.10)]
                               transition"
                  >
                    <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,106,0.22),transparent_55%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(255,255,255,0.10),transparent_55%)]" />
                    </div>

                    <div className="relative flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-white">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-sm text-white/65">
                          <span className="text-[#00ff6a]">{p.venue}</span>
                          <span className="text-white/40"> · </span>
                          <span>{p.year}</span>
                        </p>
                      </div>
                    </div>

                    <p className="relative mt-3 text-sm text-white/70 leading-relaxed">
                      {p.blurb}
                    </p>

                    <div className="relative mt-5 flex flex-wrap items-center gap-2">
                      {p.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-3 py-1.5 rounded-full border border-[#00ff6a]/25 bg-[#00ff6a]/[0.06] text-white/75"
                        >
                          {t}
                        </span>
                      ))}

                      <div className="ml-auto flex flex-wrap gap-2">
                        {p.links?.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-black/30 text-white/70
                                       hover:border-[#00ff6a]/40 hover:text-[#00ff6a] transition"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              <p className="mt-4 text-xs text-white/45">
                {/* helper removed for a cleaner read */}
              </p>
            </div>
          </div>
        </div>
      </motion.section>


      {/* PROJECTS - Now a revolving carousel */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative pb-20 md:pb-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,106,0.10),transparent_55%)]" />

        <div className="section-glassbar">
          <div className="section-glassbar-inner relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-6 md:py-7 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2
                className="text-4xl md:text-6xl font-black tracking-tight
                           bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-[#EFFFF7]
                           bg-clip-text text-transparent
                           drop-shadow-[0_0_22px_rgba(0,255,106,0.25)]"
              >
                ACTIVE BUILDS
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/55">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                3D carousel
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff6a]" />
                Tap-friendly controls
              </span>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-10">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevProject}
              className="group relative w-12 h-12 md:w-14 md:h-14 rounded-2xl shrink-0 overflow-hidden
                         border border-white/10 bg-white/[0.03] backdrop-blur-xl
                         shadow-[0_0_0_1px_rgba(0,255,106,0.12)]
                         hover:border-[#00ff6a]/40
                         hover:shadow-[0_0_0_1px_rgba(0,255,106,0.32),0_24px_80px_rgba(0,255,106,0.10)]
                         transition"
              aria-label="Previous project"
              data-carousel-control="true"
            >
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <span className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,106,0.22),transparent_58%)]" />
              </span>
              <svg
                className="relative mx-auto"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#00ff6a]"
                />
              </svg>
            </motion.button>

            <div
              className="projects-3d-stage outline-none flex-1 max-w-[980px]
                         rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur
                         shadow-[0_0_0_1px_rgba(0,255,106,0.06)]"
              role="region"
              aria-label="Active builds 3D carousel"
              tabIndex={0}
              onPointerDown={onCarouselPointerDown}
              onPointerMove={onCarouselPointerMove}
              onPointerUp={onCarouselPointerUp}
              onPointerCancel={onCarouselPointerUp}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") prevProject();
                if (e.key === "ArrowRight") nextProject();
                if (e.key === "Home") snapToIndex(0);
                if (e.key === "End") snapToIndex(PROJECTS.length - 1);
              }}
            >
              <div className="projects-3d-tilt">
                <div className="projects-3d-floor" />

                <div className="projects-3d-ring">
                  {PROJECTS.map((p, i) => {
                    const theta = i * stepDeg + carouselAngle;
                    const rel = shortestSignedDeg(normalizeDeg(theta));
                    const abs = Math.abs(rel);
                    const depth = Math.min(1, abs / 170);

                    const isFront = i === currentIndex;
                    const scale = isFront ? 1 : 1 - depth * 0.10;
                    const opacity = 1 - depth * 0.58;
                    const blur = depth * 1.6;
                    const lift = -(1 - depth) * 8;
                    const zIndex = Math.round(1000 - abs * 5);

                    return (
                      <div
                        key={p.title}
                        className={`projects-3d-card ${isFront ? "is-front" : ""}`}
                        style={{
                          // CSS custom properties for the 3D transform pipeline:
                          ["--theta" as any]: `${theta}deg`,
                          ["--scale" as any]: scale,
                          ["--opacity" as any]: opacity,
                          ["--blur" as any]: `${blur}px`,
                          ["--lift" as any]: `${lift}px`,
                          zIndex,
                        }}
                        onClick={() => {
                          if (dragRef.current.moved) return;
                          setActiveProject(p);
                        }}
                        aria-label={`Open project: ${p.title}`}
                        role="button"
                        tabIndex={-1}
                      >
                        <div className="projects-3d-float p-6 md:p-8" style={{ animationDelay: `${i * 0.18}s` }}>
                          <div className="projects-3d-inner">
                            <div className="projects-3d-media" />

                            <div className="flex items-start justify-between gap-6">
                              <h3 className="projects-3d-titleClamp text-3xl md:text-4xl text-[#00ff6a] font-black">
                                {p.title}
                              </h3>
                              <span className="mt-1 text-xs text-white/45">
                                {String(i + 1).padStart(2, "0")}/{String(PROJECTS.length).padStart(2, "0")}
                              </span>
                            </div>

                            <p className="projects-3d-descClamp text-gray-300 leading-relaxed text-base md:text-lg">
                              {p.desc}
                            </p>

                            <div className="projects-3d-techRow flex flex-wrap gap-3">
                              {p.tech.map((t: string) => (
                                <span
                                  key={t}
                                  className="px-4 py-1.5 text-sm border border-[#00ff6a]/70
                                         hover:bg-[#00ff6a] hover:text-black transition"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextProject}
              className="group relative w-12 h-12 md:w-14 md:h-14 rounded-2xl shrink-0 overflow-hidden
                         border border-white/10 bg-white/[0.03] backdrop-blur-xl
                         shadow-[0_0_0_1px_rgba(0,255,106,0.12)]
                         hover:border-[#00ff6a]/40
                         hover:shadow-[0_0_0_1px_rgba(0,255,106,0.32),0_24px_80px_rgba(0,255,106,0.10)]
                         transition"
              aria-label="Next project"
              data-carousel-control="true"
            >
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <span className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,106,0.22),transparent_58%)]" />
              </span>
              <svg
                className="relative mx-auto"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#00ff6a]"
                />
              </svg>
            </motion.button>
          </div>

          {/* Modern indicator */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-3 py-2">
              {PROJECTS.map((p, i) => (
                <motion.button
                  key={p.title}
                  onClick={() => snapToIndex(i)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  title={p.title}
                  className={`relative h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-10 bg-[#00ff6a] shadow-[0_0_18px_rgba(0,255,106,0.45)]"
                      : "w-2.5 bg-white/20 hover:bg-white/35"
                  }`}
                  aria-label={`Go to project ${i + 1}: ${p.title}`}
                  data-carousel-control="true"
                />
              ))}
            </div>

            <div className="text-xs md:text-sm text-white/55">
              <span className="text-white/35">Now viewing:</span>{" "}
              <span className="text-white/75">{PROJECTS[currentIndex]?.title}</span>
            </div>
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
        <div className="section-glassbar section-glassbar--center">
          <div className="section-glassbar-inner relative max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-6 md:py-7 flex items-end justify-between gap-6 flex-wrap">
            <h2
              className="text-4xl md:text-6xl font-black tracking-tight
                         bg-gradient-to-r from-[#00ff6a] via-[#7CFFB7] to-[#EFFFF7]
                         bg-clip-text text-transparent
                         drop-shadow-[0_0_22px_rgba(0,255,106,0.25)]"
            >
              CORE SKILLS
            </h2>
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl
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
                        bg-black/65 backdrop-blur-xl
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