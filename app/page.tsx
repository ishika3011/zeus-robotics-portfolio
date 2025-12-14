"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

export default function Home() {
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
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

    const move = (e) => {
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      
      // Update mouse position for 3D
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  // Three.js Robot Setup - Load dynamically
  useEffect(() => {
    if (!canvasRef.current) return;

    // Dynamically import Three.js only on client side
    import('three').then((THREE) => {
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

      // Create a simple robot structure
      const createRobot = () => {
        const robot = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x00ff6a,
          emissive: 0x00ff6a,
          emissiveIntensity: 0.3,
          metalness: 0.8,
          roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        robot.add(body);

        // Head
        const headGeometry = new THREE.BoxGeometry(1, 1, 0.8);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.8;
        robot.add(head);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.8
        });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 1.9, 0.5);
        robot.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 1.9, 0.5);
        robot.add(rightEye);

        // Arms
        const armGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(-1, 0, 0);
        leftArm.rotation.z = 0.3;
        robot.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(1, 0, 0);
        rightArm.rotation.z = -0.3;
        robot.add(rightArm);

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(-0.5, -1.6, 0);
        robot.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(0.5, -1.6, 0);
        robot.add(rightLeg);

        return robot;
      };

      const robot = createRobot();
      scene.add(robot);

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

      return () => {
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
      };
    }).catch(err => {
      console.error('Failed to load Three.js:', err);
    });
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