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
      setHidden(y > last && y > 120);
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
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed left-1/2 -translate-x-1/2 z-40
                   backdrop-blur bg-black/60 border border-[#00ff6a]/40
                   px-10 h-14 flex items-center gap-10 text-sm font-mono"
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
                   text-[#00ff6a] font-mono
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
    <span className="text-[#00ff6a] font-mono tracking-widest">
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
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();

  // SPLIT HERO SCROLL (NAME LEFT, ROBOT RIGHT)
  const splitProgress = useTransform(scrollY, [200, 600], [0, 1]);

  // Name starts CENTER → moves LEFT
  const nameX = useTransform(splitProgress, [0, 1], ["50%", "0%"]);

  // Robot starts OFFSCREEN RIGHT → moves into place
  const robotX = useTransform(splitProgress, [0, 1], ["150%", "0%"]);


  const nameScale = useTransform(splitProgress, [0, 1], [1, 0.95]);
  const robotScale = useTransform(splitProgress, [0, 1], [0.9, 1]);

  // Calculate width for name and robot blocks
  const nameWidth = useTransform(splitProgress, [0, 1], ["100%", "50%"]);
  const robotWidth = useTransform(splitProgress, [0, 1], ["0%", "50%"]);

  const [activeProject, setActiveProject] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingDone = loadingProgress >= 100;

  // New: Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextProject = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

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

  // Carousel variants for revolving door effect (3D rotate + fade + scale)
  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      z: 0,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.8,
    }),
  };

  // Mouse position for 3D robot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Cursor glow effect
  useEffect(() => {
    const glow = cursorRef.current;
    if (!glow) return;

    const move = (e: MouseEvent) => {
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      
      // Update mouse position for 3D
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  // Three.js Robot Setup - Load from CDN
  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

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
      
      renderer.setSize(400, 400);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.position.z = 7;
      camera.position.y = 0.5;

      // Raycaster for click detection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      let chestMaterial: any = null;
      const flowerTexture = createFlowerTexture();

      // Create a simple robot structure
      const createRobot = () => {
        const robot = new THREE.Group();
        
        // Main body (rectangular torso)
        const bodyGeometry = new THREE.BoxGeometry(1.2, 1.6, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x3a3a3a,
          metalness: 0.9,
          roughness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0;
        robot.add(body);

        // Glowing chest panel
        const chestGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.05);
        chestMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 1,
          metalness: 0.5,
          roughness: 0.2
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.set(0, 0.2, 0.41);
        chest.name = 'chest';
        robot.add(chest);
        
        // Head (smaller box on top)
        const headGeometry = new THREE.BoxGeometry(0.8, 0.7, 0.7);
        const headMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x4a4a4a,
          metalness: 0.9,
          roughness: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.4;
        robot.add(head);

        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.5
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = 2;
        robot.add(antenna);

        // Antenna tip (glowing sphere)
        const tipGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const tipMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 1.5
        });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.y = 2.25;
        robot.add(tip);

        // Visor (glowing eyes area)
        const visorGeometry = new THREE.BoxGeometry(0.7, 0.2, 0.05);
        const visorMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 1.2
        });
        const visor = new THREE.Mesh(visorGeometry, visorMaterial);
        visor.position.set(0, 1.45, 0.36);
        robot.add(visor);

        // Shoulders
        const shoulderGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const shoulderMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x333333,
          metalness: 0.9,
          roughness: 0.2
        });
        
        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.position.set(-0.8, 0.6, 0);
        robot.add(leftShoulder);
        
        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        rightShoulder.position.set(0.8, 0.6, 0);
        robot.add(rightShoulder);

        // Arms (robotic arms)
        const upperArmGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
        
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
        leftUpperArm.position.set(-0.8, 0, 0);
        robot.add(leftUpperArm);
        
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
        rightUpperArm.position.set(0.8, 0, 0);
        robot.add(rightUpperArm);

        // Forearms
        const forearmGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8);
        
        const leftForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
        leftForearm.position.set(-0.8, -0.65, 0);
        robot.add(leftForearm);
        
        const rightForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
        rightForearm.position.set(0.8, -0.65, 0);
        robot.add(rightForearm);

        // Hands (glowing)
        const handGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const handMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.5
        });
        
        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(-0.8, -1.1, 0);
        robot.add(leftHand);
        
        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        rightHand.position.set(0.8, -1.1, 0);
        robot.add(rightHand);

        // Pelvis/waist
        const waistGeometry = new THREE.BoxGeometry(1.1, 0.3, 0.7);
        const waist = new THREE.Mesh(waistGeometry, bodyMaterial);
        waist.position.y = -1;
        robot.add(waist);

        // Legs (thicker, more robotic)
        const thighGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
        
        const leftThigh = new THREE.Mesh(thighGeometry, bodyMaterial);
        leftThigh.position.set(-0.35, -1.7, 0);
        robot.add(leftThigh);
        
        const rightThigh = new THREE.Mesh(thighGeometry, bodyMaterial);
        rightThigh.position.set(0.35, -1.7, 0);
        robot.add(rightThigh);

        // Lower legs
        const shinGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 8);
        
        const leftShin = new THREE.Mesh(shinGeometry, bodyMaterial);
        leftShin.position.set(-0.35, -2.55, 0);
        robot.add(leftShin);
        
        const rightShin = new THREE.Mesh(shinGeometry, bodyMaterial);
        rightShin.position.set(0.35, -2.55, 0);
        robot.add(rightShin);

        // Feet (glowing)
        const footGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.5);
        const footMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.5,
          metalness: 0.5,
          roughness: 0.2
        });
        
        const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        leftFoot.position.set(-0.35, -3.1, 0.1);
        robot.add(leftFoot);
        
        const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        rightFoot.position.set(0.35, -3.1, 0.1);
        robot.add(rightFoot);

        return robot;
      };

      const robot = createRobot();
      scene.add(robot);

      // Click handler
      const handleCanvasClick = (event: MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(robot.children, true);
        
        if (intersects.length > 0) {
          // Robot was clicked!
          setRobotGreeting(true);
          
          // Update chest to show flower
          if (chestMaterial) {
            chestMaterial.map = flowerTexture;
            chestMaterial.emissiveMap = flowerTexture;
            chestMaterial.emissiveIntensity = 0.5;
            chestMaterial.needsUpdate = true;
          }
          
          // Reset greeting after 3 seconds
          setTimeout(() => {
            setRobotGreeting(false);
            
            // Reset chest
            if (chestMaterial) {
              chestMaterial.map = null;
              chestMaterial.emissiveMap = null;
              chestMaterial.emissiveIntensity = 1;
              chestMaterial.needsUpdate = true;
            }
          }, 3000);
        }
      };
      
      canvasRef.current?.addEventListener('click', handleCanvasClick);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x00ff6a, 1, 100);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x00ffff, 0.5, 100);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      // Animation
      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // Subtle floating animation
        robot.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Rotate based on mouse position
        robot.rotation.y = smoothMouseX.get() * 0.5;
        robot.rotation.x = smoothMouseY.get() * 0.3;
        
        // Idle rotation
        robot.rotation.y += 0.002;
        
        renderer.render(scene, camera);
      };
      
      animate();
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Remove click listener
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', () => {});
      }
    };
  }, [smoothMouseX, smoothMouseY]);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden text-white">
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

      {/* Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00ff6a]
                   pointer-events-none z-50 mix-blend-difference transition-transform"
      />

      {/* PARALLAX BACKGROUND GLOW */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,#00ff6a15,transparent_60%)]"
      />

      {/* PARALLAX FOG */}
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"
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
      <section className="relative h-[200vh] z-20">
        {/* Sticky split screen */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="relative h-full">

            {/* LEFT — NAME */}
            <motion.div
                style={{ x: nameX, scale: nameScale, width: nameWidth }}
                className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center"
              >

              <div
                className="px-20 py-16 bg-black/40 backdrop-blur
                           shadow-[0_0_40px_#00ff6a33]"
              >
                <h1
                  className="text-[clamp(4rem,10vw,9rem)] font-black leading-none
                             bg-gradient-to-r from-[#00ff6a] to-white
                             bg-clip-text text-transparent"
                >
                  ISHIKA
                  <br />
                  SAIJWAL
                </h1>

                <p className="text-2xl text-[#00ff6a] mt-6 text-center">
                  Robotics Engineer · Embedded Systems · Autonomous Machines
                </p>
              </div>
            </motion.div>

            {/* RIGHT — ROBOT */}
            <motion.div
              style={{ x: robotX, scale: robotScale, width: robotWidth }}
              className="absolute right-0 flex justify-center items-center overflow-visible"
            >
              <canvas
                ref={canvasRef}
                className="w-[420px] h-[420px]"
              />
            </motion.div>

          </div>
        </div>
      </section>
      
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

        <div className="max-w-4xl mx-auto relative h-[600px] perspective-1000">
          {/* 3D container */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  rotateY: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="absolute w-full max-w-lg border-2 border-[#00ff6a] bg-black/40 backdrop-blur p-10 cursor-pointer"
                onClick={() => setActiveProject(PROJECTS[currentIndex])}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                >
                  <div className="h-64 mb-8 bg-gradient-to-br from-[#00ff6a]/25 to-black rounded-lg" />
                  <h3 className="text-4xl text-[#00ff6a] font-bold mb-6">
                    {PROJECTS[currentIndex].title}
                  </h3>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    {PROJECTS[currentIndex].desc}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {PROJECTS[currentIndex].tech.map((t: string) => (
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevProject}
            className="absolute left-10 top-1/2 -translate-y-1/2 z-10 text-[#00ff6a] text-6xl"
          >
            ‹
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextProject}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-10 text-[#00ff6a] text-6xl"
          >
            ›
          </motion.button>

          {/* Dots Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentIndex ? "bg-[#00ff6a]" : "bg-gray-600"
                }`}
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