"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// Declare THREE on window for TypeScript
declare global {
  interface Window {
    THREE: any;
  }
}

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollY } = useScroll();
  
  // Enhanced scroll transforms with more dramatic effects
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.6]);
  const heroY = useTransform(scrollY, [0, 500], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const glowOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  // Parallax for background layers
  const bgY1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const bgY2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const bgY3 = useTransform(scrollY, [0, 1000], [0, -450]);

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
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true,
        antialias: true 
      });
      
      renderer.setSize(400, 400);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.position.z = 5;

      // Create a cute robot structure (EVE-inspired)
      const createRobot = () => {
        const robot = new THREE.Group();
        
        // Materials
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.2,
          metalness: 0.8,
          roughness: 0.2
        });

        const accentMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.6,
          metalness: 0.9,
          roughness: 0.1
        });

        const eyeMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ddff,
          emissive: 0x00ddff,
          emissiveIntensity: 1
        });

        // Body - egg/capsule shape (using sphere stretched vertically)
        const bodyGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        bodyGeometry.scale(0.7, 1.2, 0.7); // Make it taller and narrower
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0;
        robot.add(body);

        // Head section - smooth dome on top
        const headGeometry = new THREE.SphereGeometry(0.65, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 0.96;
        robot.add(head);

        // Chest glow - subtle detail
        const chestGeometry = new THREE.CircleGeometry(0.15, 32);
        const chestMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.9
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.set(0, 0.1, 0.57);
        robot.add(chest);

        // Eyes - large expressive digital eyes (like EVE)
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.22, 0.3, 0.6);
        robot.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.22, 0.3, 0.6);
        robot.add(rightEye);

        // Arms - small, simple, and cute
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 16);
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(-0.6, -0.1, 0);
        leftArm.rotation.z = 0.3;
        robot.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(0.6, -0.1, 0);
        rightArm.rotation.z = -0.3;
        robot.add(rightArm);

        // Hands - tiny rounded tips
        const handGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const leftHand = new THREE.Mesh(handGeometry, accentMaterial);
        leftHand.position.set(-0.7, -0.45, 0);
        robot.add(leftHand);
        
        const rightHand = new THREE.Mesh(handGeometry, accentMaterial);
        rightHand.position.set(0.7, -0.45, 0);
        robot.add(rightHand);

        // Base - rounded bottom (like EVE's hovering base)
        const baseGeometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const base = new THREE.Mesh(baseGeometry, bodyMaterial);
        base.position.y = -0.96;
        robot.add(base);

        // Hover glow effect under base
        const glowGeometry = new THREE.CircleGeometry(0.5, 32);
        const glowMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.5
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = -1.1;
        robot.add(glow);

        return robot;
      };

      const robot = createRobot();
      scene.add(robot);

      // Lighting - enhanced for better appearance
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x00ff6a, 1.5, 100);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x00ffff, 1, 100);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      const pointLight3 = new THREE.PointLight(0xffffff, 0.8, 100);
      pointLight3.position.set(0, 5, -5);
      scene.add(pointLight3);

      // Animation
      let animationFrameId: number;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // Subtle floating animation
        robot.position.y = Math.sin(Date.now() * 0.001) * 0.15;
        
        // Rotate based on mouse position - more responsive
        const targetRotationY = smoothMouseX.get() * 0.8;
        const targetRotationX = smoothMouseY.get() * 0.5;
        
        robot.rotation.y = targetRotationY;
        robot.rotation.x = targetRotationX;
        
        renderer.render(scene, camera);
      };
      
      animate();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [smoothMouseX, smoothMouseY]);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
      {/* Custom Styles */}
      <style>{`
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .tech-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,106,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,106,0.12) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 20s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        .hero-glow {
          position: absolute;
          top: 40%;
          left: 50%;
          width: 1000px;
          height: 600px;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 255, 106, 0.3),
            rgba(0, 255, 106, 0.1),
            transparent 70%
          );
          animation: pulseGlow 6s ease-in-out infinite;
          z-index: 0;
          filter: blur(100px);
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #00ff6a;
          border-radius: 50%;
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Layered Parallax Backgrounds */}
      <motion.div style={{ y: bgY1 }} className="tech-grid opacity-30" />
      <motion.div style={{ y: bgY2 }} className="hero-glow" />
      <motion.div 
        style={{ y: bgY3 }} 
        className="fixed inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none z-0"
      />

      {/* Cursor glow */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px]
                   rounded-full bg-[rgba(0,255,106,0.15)]
                   blur-[120px] z-10 mix-blend-screen"
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            opacity: Math.random() * 0.5 + 0.2
          }}
        />
      ))}

      {/* HERO SECTION */}
      <section className="min-h-screen relative flex items-center justify-center px-6 md:px-24">
        <motion.div
          style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
          className="relative z-20 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-[#00ff6a] font-mono mb-6 text-sm md:text-base tracking-wider"
          >
            {"> INITIALIZING SYSTEM"}
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            style={{ opacity: glowOpacity }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider
                      text-white relative mb-8
                      drop-shadow-[0_0_60px_rgba(0,255,106,1)]"
          >
            ISHIKA<br/>SAIJWAL
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#00ff6a] to-[#00ffff] font-semibold mb-6"
          >
            Robotics Engineer · Embedded Systems · Autonomous Machines
          </motion.p>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="max-w-2xl text-gray-300 leading-relaxed text-lg mb-12"
          >
            I design and build intelligent machines where software meets physics —
            focusing on embedded control, real-time systems, and autonomous robotics.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="flex flex-wrap gap-6"
          >
            <a
              href="#projects"
              className="group relative border-2 border-[#00ff6a] px-10 py-4 text-[#00ff6a] font-bold
                        hover:bg-[#00ff6a] hover:text-black transition-all duration-300
                        shadow-[0_0_40px_rgba(0,255,106,0.6)] hover:shadow-[0_0_80px_rgba(0,255,106,1)]
                        overflow-hidden"
            >
              <span className="relative z-10">VIEW PROJECTS</span>
              <div className="absolute inset-0 bg-[#00ff6a] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 -z-0" />
            </a>

            <a
              href="https://github.com/ishika3011"
              target="_blank"
              className="border-2 border-gray-600 px-10 py-4 text-gray-300 font-bold
                        hover:border-[#00ff6a] hover:text-[#00ff6a] transition-all duration-300
                        hover:shadow-[0_0_40px_rgba(0,255,106,0.4)]"
            >
              GITHUB
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Robot - Positioned on the right */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden lg:block absolute right-24 top-1/2 transform -translate-y-1/2 z-20"
        >
          <div className="relative">
            <canvas ref={canvasRef} className="w-[400px] h-[400px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          </div>
          <p className="text-center text-[#00ff6a] font-mono text-sm mt-4 opacity-70">
            {"<HOVER TO INTERACT>"}
          </p>
        </motion.div>
      </section>

      {/* Statement Section with Parallax */}
      <section className="py-64 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center px-6 max-w-5xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            I don't just write code.
          </h2>

          <p className="text-3xl md:text-4xl text-[#00ff6a] font-light">
            I engineer systems that interact with the real world.
          </p>
        </motion.div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-40 px-6 md:px-24 relative z-20">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl text-[#00ff6a] mb-20 tracking-wider font-black"
        >
          ACTIVE BUILDS
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.03, y: -10 }}
          className="border-2 border-[#00ff6a] p-12 max-w-2xl
                    hover:shadow-[0_0_100px_rgba(0,255,106,0.8)]
                    transition-all duration-300 backdrop-blur-sm bg-black/30"
        >
          <h3 className="text-3xl text-[#00ff6a] mb-6 font-bold">
            WALL-E INSPIRED AUTONOMOUS ROBOT
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Designed and built an autonomous robot capable of obstacle detection
            and navigation using embedded control logic and sensor fusion.
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 md:px-24 border-t border-green-900/50 text-gray-400 relative z-20">
        <p className="text-[#00ff6a] font-mono mb-6 text-lg tracking-wider">{"> CONTACT"}</p>
        <div className="space-y-3 text-lg">
          <p>Email: Ishika.saijwal01@gmail.com</p>
          <p>
            GitHub:{" "}
            <a className="text-[#00ff6a] hover:underline transition" href="https://github.com/ishika3011">
              github.com/ishika3011
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a
              className="text-[#00ff6a] hover:underline transition"
              href="https://linkedin.com/in/ishika-saijwal"
            >
              linkedin.com/in/ishika-saijwal
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}