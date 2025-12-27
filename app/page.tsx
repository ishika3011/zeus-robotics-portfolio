"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
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
  { name: "ROS / ROS2", level: 95, icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Robot_Operating_System_logo.svg" },
  { name: "C++", level: 90, icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" },
  { name: "Python", level: 85, icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
  { name: "PCL", level: 80, icon: "https://pointclouds.org/assets/images/pcl.png" },
  { name: "Gazebo", level: 85, icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Gazebo_logo.svg" },
  { name: "Embedded Systems", level: 90, icon: "https://img.icons8.com/ios-filled/100/00ff6a/microcontroller.png" },
  { name: "SLAM", level: 85, icon: "https://img.icons8.com/ios/100/00ff6a/map.png" },
  { name: "OpenCV", level: 80, icon: "https://opencv.org/wp-content/uploads/2020/07/OpenCV_logo_black.png" },
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
    return scrollY.on("change", (y) => {
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
                   px-6 py-2 border border-[#00ff6a]
                   text-[#00ff6a] tracking-wide
                   hover:bg-[#00ff6a] hover:text-black transition"
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
      setDisplayed((prev) => {
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
      setShowCursor((v) => !v);
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

  // Always start at the top (ISHIKA) on refresh / navigation
  useEffect(() => {
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {}
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        if (!ctx) return new THREE.Texture(canvas);
        
        // Background
        ctx.fillStyle = '#001a0d';
        ctx.fillRect(0, 0, 256, 256);
        
        // Draw flower
        const centerX = 128;
        const centerY = 128;
        
        // Petals
        ctx.fillStyle = '#ff69b4';
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const x = centerX + Math.cos(angle) * 40;
          const y = centerY + Math.sin(angle) * 40;
          
          ctx.beginPath();
          ctx.ellipse(x, y, 25, 15, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Center
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Stem
        ctx.fillStyle = '#00ff6a';
        ctx.fillRect(118, 148, 20, 80);
        
        // Leaves
        ctx.fillStyle = '#00ff6a';
        ctx.beginPath();
        ctx.ellipse(108, 170, 20, 10, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(148, 190, 20, 10, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        const texture = new THREE.Texture(canvas);
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
      renderer.toneMappingExposure = 1.24;

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
        const leftSeam = new THREE.Mesh(seamGeometry, accentGlowMaterial);
        leftSeam.position.set(-0.54, 0.02, 0.43);
        bodyGroup.add(leftSeam);

        const rightSeam = new THREE.Mesh(seamGeometry, accentGlowMaterial);
        rightSeam.position.set(0.54, 0.02, 0.43);
        bodyGroup.add(rightSeam);

        const spine = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 1.25, 0.02),
          new THREE.MeshStandardMaterial({
            color: 0x00ff6a,
            emissive: 0x00ff6a,
            emissiveIntensity: 0.65,
            transparent: true,
            opacity: 0.55,
          })
        );
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
          accentGlowMaterial
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
        robot.add(leftUpperArm);
        
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, graphiteMaterial);
        rightUpperArm.position.set(0.86, 0.1, 0);
        robot.add(rightUpperArm);

        // Forearms
        const forearmGeometry = new THREE.CylinderGeometry(0.11, 0.12, 0.68, 16);
        
        const leftForearm = new THREE.Mesh(forearmGeometry, matteDarkMaterial);
        leftForearm.position.set(-0.86, -0.55, 0.03);
        robot.add(leftForearm);
        
        const rightForearm = new THREE.Mesh(forearmGeometry, matteDarkMaterial);
        rightForearm.position.set(0.86, -0.55, 0.03);
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
          }

          // Thumb
          const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.10), matteDarkMaterial);
          thumb.position.set(0.09 * side, -0.05, 0.18);
          thumb.rotation.y = side > 0 ? -0.55 : 0.55;
          hand.add(thumb);

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

          const heel = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.10, 0.18),
            graphiteMaterial
          );
          heel.position.set(0, -0.01, -0.28);
          foot.add(heel);

          const ankleRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.16, 0.012, 12, 40),
            accentGlowMaterial
          );
          ankleRing.rotation.x = Math.PI / 2;
          ankleRing.position.set(0, 0.11, -0.05);
          foot.add(ankleRing);

          const sideGlow = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.06, 0.36),
            accentGlowMaterial
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
      scene.add(robot);

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
          
          // Update chest inner panel to show flower (behind glass)
          if (chestInnerMaterial) {
            chestInnerMaterial.color.setHex(0xffffff);
            chestInnerMaterial.map = flowerTexture;
            chestInnerMaterial.emissiveMap = flowerTexture;
            chestInnerMaterial.emissiveIntensity = 0.8;
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
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.22);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
      keyLight.position.set(6, 10, 7);
      scene.add(keyLight);

      // Green rim to keep the accent color saturated and "neon"
      const rimLight = new THREE.DirectionalLight(0x00ff6a, 1.55);
      rimLight.position.set(-7, 5, -7);
      scene.add(rimLight);

      const pointLight1 = new THREE.PointLight(0x00ff6a, 2.0, 100);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x00ffff, 0.55, 100);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      const animate = () => {
        if (!isRunning) return;
        animationFrameId = window.requestAnimationFrame(animate);

        // Cap FPS a bit to reduce main-thread + GPU pressure (helps scroll smoothness)
        const now = performance.now();
        if (now - lastFrameT < 1000 / 50) return;
        lastFrameT = now;
        
        // Subtle floating animation
        robot.position.y = Math.sin(now * 0.001) * 0.1;
        
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
      <FloatingNav
        onLetsTalk={() => setOpenCalendar(true)}
        showWelcome={loadingDone}
      />

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

        /* ---- 3D Projects Carousel ---- */
        .projects-3d-stage {
          position: relative;
          height: clamp(520px, 70vh, 680px);
          perspective: 1200px;
          perspective-origin: 50% 38%;
          touch-action: pan-y;
          user-select: none;
        }

        .projects-3d-tilt {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform: rotateX(8deg);
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
          top: 50%;
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
          border: 1px solid rgba(0,255,106,0.35);
          background:
            radial-gradient(1200px 500px at 20% 0%, rgba(0,255,106,0.10), transparent 55%),
            linear-gradient(180deg, rgba(16,16,16,0.55), rgba(0,0,0,0.55));
          backdrop-filter: blur(14px);
          box-shadow:
            0 18px 60px rgba(0,0,0,0.65),
            0 0 0 1px rgba(0,255,106,0.18) inset,
            0 0 70px rgba(0,255,106,0.12);
          opacity: var(--opacity, 1);
          filter: blur(var(--blur, 0px));
          transition: transform 520ms cubic-bezier(.2,.85,.2,1), opacity 520ms ease, filter 520ms ease, box-shadow 520ms ease, border-color 520ms ease;
          will-change: transform, opacity, filter;
          cursor: grab;
        }

        .projects-3d-card:active { cursor: grabbing; }

        .projects-3d-card.is-front {
          border-color: rgba(0,255,106,0.72);
          box-shadow:
            0 26px 90px rgba(0,0,0,0.72),
            0 0 0 1px rgba(0,255,106,0.28) inset,
            0 0 120px rgba(0,255,106,0.20);
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
          background: linear-gradient(135deg, rgba(0,255,106,0.20), rgba(0,0,0,0.8));
          border: 1px solid rgba(255,255,255,0.06);
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
            linear-gradient(135deg, rgba(0,255,106,0.18), transparent 35%),
            linear-gradient(225deg, rgba(255,255,255,0.08), transparent 45%);
          opacity: 0.55;
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
          .projects-3d-stage { height: clamp(520px, 78vh, 660px); }
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
      <section className="relative min-h-screen z-20 flex items-center justify-center px-10">
        <div className="px-20 py-16 bg-black/40 backdrop-blur shadow-[0_0_40px_#00ff6a33]">
          <h1
            className="text-[clamp(4rem,10vw,9rem)] font-black leading-none
                       bg-gradient-to-r from-[#00ff6a] to-white
                       bg-clip-text text-transparent text-center"
          >
            ISHIKA
            <br />
            SAIJWAL
          </h1>

          <p className="text-2xl text-[#00ff6a] mt-6 text-center">
            Robotics Engineer · Embedded Systems · Autonomous Machines
          </p>
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

        {/* Non-blocking label (kept away from face/antenna) */}
        <div className="pointer-events-none absolute bottom-8 left-8 z-10 max-w-[min(520px,80vw)] rounded-2xl border border-[#00ff6a33] bg-black/35 backdrop-blur px-5 py-4">
          <h2 className="text-xl md:text-3xl font-black text-[#00ff6a]">
            Hi I am Zeus
          </h2>
          <p className="mt-1 text-sm md:text-base text-white/70">
            Your personal healthcare companion · Click my chest
          </p>
        </div>
      </motion.section>
      
      <section id="about" className="py-56 px-24">
      <h2 className="text-7xl font-black mb-16 text-[#00ff6a]">ABOUT</h2>
      <p className="max-w-4xl text-2xl text-gray-300 leading-relaxed">
        Robotics engineer focused on autonomous systems, embedded control,
        perception pipelines, and real-world deployment.
      </p>
    </section>
        {/* EXPERIENCE */}
      <section id="experience" className="py-56 px-24">
        <h2 className="text-7xl font-black mb-16 text-[#00ff6a]">EXPERIENCE</h2>
        <p className="text-2xl text-gray-300">Industry, labs, research roles.</p>
      </section>
      {/* PUBLICATIONS */}
      <section id="publications" className="py-56 px-24">
        <h2 className="text-7xl font-black mb-16 text-[#00ff6a]">PUBLICATIONS</h2>
        <p className="text-2xl text-gray-300">Papers, arXiv, reports.</p>
      </section>


      {/* PROJECTS - Now a revolving carousel */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="py-56 relative"
      >
        <h2
          className="text-7xl font-black mb-24 text-center
                     bg-gradient-to-r from-[#00ff6a] to-white bg-clip-text text-transparent"
        >
          ACTIVE BUILDS
        </h2>

        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-white/60 mb-10">
            Drag to rotate · Click a card to open · Use ← / → keys
          </p>

          <div className="flex items-center justify-center gap-6 md:gap-10">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevProject}
              className="w-14 h-14 rounded-full border border-[#00ff6a]/40 bg-black/50 backdrop-blur text-[#00ff6a] text-3xl shrink-0"
              aria-label="Previous project"
              data-carousel-control="true"
            >
              ‹
            </motion.button>

            <div
              className="projects-3d-stage outline-none flex-1 max-w-[980px]"
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
              className="w-14 h-14 rounded-full border border-[#00ff6a]/40 bg-black/50 backdrop-blur text-[#00ff6a] text-3xl shrink-0"
              aria-label="Next project"
              data-carousel-control="true"
            >
              ›
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="mt-10 flex justify-center gap-4">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => snapToIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentIndex ? "bg-[#00ff6a]" : "bg-gray-600"
                }`}
                aria-label={`Go to project ${i + 1}`}
                data-carousel-control="true"
              />
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
        className="py-20 md:py-24 px-6 md:px-16"
      >
        <h2 className="text-4xl md:text-6xl font-black mb-12 bg-gradient-to-r from-[#00ff6a] to-white bg-clip-text text-transparent text-center tracking-tight">
          CORE SKILLS
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
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
                    className="relative w-7 h-7 object-contain"
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
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={() => setOpenCalendar(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 40 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[1100px] h-[650px]
                        bg-black/70 backdrop-blur-xl
                        border border-[#00ff6a]
                        shadow-[0_0_40px_#00ff6a33]"
            >
              <iframe
                src={CALENDAR_EMBED}
                className="w-full h-full rounded"
                style={{
                  filter: "invert(1) hue-rotate(90deg) saturate(2)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}