"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

// Declare THREE on window for TypeScript
declare global {
  interface Window {
    THREE: any;
  }
}

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();

  // Scroll-based transforms kept from original (unchanged)
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.6]);
  const heroY = useTransform(scrollY, [0, 500], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const glowOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Parallax
  const bgY1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const bgY2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const bgY3 = useTransform(scrollY, [0, 1000], [0, -450]);

  // Mouse motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Cursor glow & update motion values
  useEffect(() => {
    const glow = cursorRef.current;
    if (!glow) return;

    const move = (e: MouseEvent) => {
      // keep same large soft glow positioning as original
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  // ---------- Three.js / EVE-like Robot Setup ----------
  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;

    let animationFrameId: number | null = null;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let robot: any = null;
    let faceTexture: any = null;
    let leftHandTexture: any = null;
    let rightHandTexture: any = null;
    let rings: any[] = [];

    script.onload = () => {
      const THREE = window.THREE;
      if (!THREE) return;

      // Renderer
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
      const resizeRenderer = () => {
        const width = canvasRef.current!.clientWidth || 400;
        const height = canvasRef.current!.clientHeight || 400;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      // Scene + Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
      camera.position.set(0, 0.35, 3.6);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(0xffffff, 0.8);
      key.position.set(6, 6, 10);
      scene.add(key);
      const fill = new THREE.PointLight(0x00ffff, 0.6, 50);
      fill.position.set(-4, 2, 4);
      scene.add(fill);

      // Helper: create a canvas texture for the face / screens so we can animate eyes
      const createScreenCanvas = (w = 512, h = 256) => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        // initial draw
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        return { canvas, ctx };
      };

      // Draw face (simple EVE-style animated eyes on black glass)
      const face = createScreenCanvas(1024, 512);
      faceTexture = new THREE.CanvasTexture(face.canvas);
      faceTexture.encoding = THREE.sRGBEncoding;

      const drawFace = (time: number, pupilX = 0, pupilY = 0) => {
        const ctx = face.ctx;
        const w = face.canvas.width;
        const h = face.canvas.height;
        // glossy black screen
        const grd = ctx.createLinearGradient(0, 0, 0, h);
        grd.addColorStop(0, "#0b0b0b");
        grd.addColorStop(1, "#000000");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        // subtle highlight
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(w * 0.05, h * 0.05, w * 0.9, h * 0.35);

        // eyes bar
        ctx.save();
        ctx.translate(w / 2, h / 2);
        // bar background (rounded)
        const barW = w * 0.86;
        const barH = h * 0.35;
        const rx = barH * 0.5;
        ctx.fillStyle = "rgba(10,10,10,0.85)";
        roundRect(ctx, -barW / 2, -barH / 2, barW, barH, rx);
        ctx.fill();

        // draw two eye 'screens' as soft blue shapes
        const eyeW = barW * 0.28;
        const eyeH = barH * 0.6;
        const gap = eyeW * 0.3;

        // left eye
        drawEye(ctx, -gap - eyeW / 2 + pupilX * 18, 0 + pupilY * 6, eyeW, eyeH, time);
        // right eye
        drawEye(ctx, gap + eyeW / 2 + pupilX * 18, 0 + pupilY * 6, eyeW, eyeH, time + 300);

        ctx.restore();
        faceTexture.needsUpdate = true;
      };

      // helpers for face drawing
      const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };

      const drawEye = (ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, t: number) => {
        // soft gradient fill for eye
        const eyeGrd = ctx.createLinearGradient(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);
        eyeGrd.addColorStop(0, "#0077ff");
        eyeGrd.addColorStop(0.5, "#00ddff");
        eyeGrd.addColorStop(1, "#00a6ff");
        ctx.fillStyle = eyeGrd;
        roundRect(ctx, cx - w / 2, cy - h / 2, w, h, h * 0.45);
        ctx.fill();

        // pupil (a darker rounded rectangle inside)
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        const pupilW = w * 0.35;
        const pupilH = h * 0.6;
        roundRect(ctx, cx - pupilW / 2, cy - pupilH / 2, pupilW, pupilH, pupilH * 0.45);
        ctx.fill();

        // small glossy spec
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath();
        ctx.ellipse(cx - w * 0.16, cy - h * 0.18, w * 0.06, h * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      // Hand screens (smaller canvases)
      const leftHand = createScreenCanvas(256, 256);
      leftHandTexture = new THREE.CanvasTexture(leftHand.canvas);
      const rightHand = createScreenCanvas(256, 256);
      rightHandTexture = new THREE.CanvasTexture(rightHand.canvas);

      const drawHandScreen = (ctx: CanvasRenderingContext2D, time: number) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#001015";
        ctx.fillRect(0, 0, w, h);
        // simple pulsating center
        const r = (Math.sin(time * 0.002) * 0.5 + 0.5) * (w * 0.18) + w * 0.05;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,200,255,0.08)";
        ctx.fill();

        ctx.fillStyle = "rgba(0,200,255,0.85)";
        ctx.font = "28px monospace";
        ctx.textAlign = "center";
        ctx.fillText("OK", w / 2, h / 2 + 10);

        leftHandTexture.needsUpdate = true;
        rightHandTexture.needsUpdate = true;
      };

      // Create the EVE-like robot
      const createEve = () => {
        const group = new THREE.Group();

        // body (smooth capsule-like)
        const bodyGeo = new THREE.SphereGeometry(0.9, 64, 64);
        bodyGeo.scale(1, 1.18, 1);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.12 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // head dome (slightly separate) - this will have a front black screen plane
        const headGeo = new THREE.SphereGeometry(0.7, 64, 64);
        headGeo.scale(1, 0.92, 1);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.7, roughness: 0.08 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 0.95, 0);
        group.add(head);

        // front screen (slightly inset plane) using canvas texture
        const screenGeom = new THREE.PlaneGeometry(1.42, 0.52, 1, 1);
        const screenMat = new THREE.MeshStandardMaterial({
          map: faceTexture,
          emissiveMap: faceTexture,
          emissive: new THREE.Color(0x00dfff),
          emissiveIntensity: 0.9,
          transparent: true,
          metalness: 0.2,
          roughness: 0.05
        });
        const screen = new THREE.Mesh(screenGeom, screenMat);
        screen.position.set(0, 0.95, 0.52);
        // slight rounding illusion
        screen.rotation.x = 0;
        group.add(screen);

        // arms
        const armGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.68, 24);
        const armMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.12 });
        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.85, -0.05, 0);
        leftArm.rotation.z = 0.45;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.85, -0.05, 0);
        rightArm.rotation.z = -0.45;
        group.add(rightArm);

        // hands - small glossy pods with their own small screens
        const handGeo = new THREE.SphereGeometry(0.14, 32, 32);
        const handMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.08 });
        const leftHandMesh = new THREE.Mesh(handGeo, handMat);
        leftHandMesh.position.set(-0.98, -0.48, 0);
        group.add(leftHandMesh);

        const rightHandMesh = new THREE.Mesh(handGeo, handMat);
        rightHandMesh.position.set(0.98, -0.48, 0);
        group.add(rightHandMesh);

        // small screen planes on hands
        const smallScreen = new THREE.PlaneGeometry(0.26, 0.26);
        const smallMatL = new THREE.MeshStandardMaterial({
          map: leftHandTexture,
          emissiveMap: leftHandTexture,
          emissive: new THREE.Color(0x00dfff),
          emissiveIntensity: 0.9,
          transparent: true,
          metalness: 0.2,
          roughness: 0.05
        });
        const smallMatR = smallMatL.clone();
        const lScreen = new THREE.Mesh(smallScreen, smallMatL);
        lScreen.position.copy(leftHandMesh.position).add(new THREE.Vector3(0, 0, 0.14));
        lScreen.lookAt(camera.position);
        group.add(lScreen);

        const rScreen = new THREE.Mesh(smallScreen, smallMatR);
        rScreen.position.copy(rightHandMesh.position).add(new THREE.Vector3(0, 0, 0.14));
        rScreen.lookAt(camera.position);
        group.add(rScreen);

        // base (rounded bottom)
        const baseGeo = new THREE.SphereGeometry(0.6, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const base = new THREE.Mesh(baseGeo, bodyMat);
        base.position.y = -0.96;
        group.add(base);

        // anti-gravity blue rings (3 rings with additive glow)
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: 0.6 });
        const ringMatAdd = new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.35 });

        for (let i = 0; i < 3; i++) {
          const r = 0.55 + i * 0.15;
          const torus = new THREE.TorusGeometry(r, 0.03 + i * 0.01, 16, 100);
          const mesh = new THREE.Mesh(torus, i === 0 ? ringMatAdd : ringMat);
          mesh.rotation.x = Math.PI / 2;
          mesh.position.y = -1.05 - i * 0.02;
          mesh.renderOrder = 1;
          group.add(mesh);
          rings.push(mesh);

          // faint disc glow under each ring
          const discGeo = new THREE.CircleGeometry(r * 0.9, 64);
          const discMat = new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
          const disc = new THREE.Mesh(discGeo, discMat);
          disc.rotation.x = -Math.PI / 2;
          disc.position.y = mesh.position.y - 0.02;
          group.add(disc);
        }

        return group;
      };

      robot = createEve();
      scene.add(robot);

      // ground faint reflection plane (visual)
      const groundGeo = new THREE.PlaneGeometry(8, 8);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.1, roughness: 0.9, transparent: true, opacity: 0.35 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -2.2;
      scene.add(ground);

      // Resize handling
      resizeRenderer();
      window.addEventListener("resize", resizeRenderer);

      // Animation loop
      const start = performance.now();
      const animate = () => {
        const t = performance.now() - start;

        // floating
        if (robot) robot.position.y = Math.sin(t * 0.0013) * 0.12;

        // rings animation (rotate & pulse)
        rings.forEach((ring, i) => {
          ring.rotation.z = t * 0.0006 * (i % 2 === 0 ? 1 : -1);
          const pulse = 1 + Math.sin(t * 0.002 + i) * 0.04;
          ring.scale.set(pulse, pulse, pulse);
        });

        // robot orientation following mouse
        const targetRotationY = smoothMouseX.get() * 0.6;
        const targetRotationX = smoothMouseY.get() * 0.25;
        robot.rotation.y += (targetRotationY - robot.rotation.y) * 0.08;
        robot.rotation.x += (targetRotationX - robot.rotation.x) * 0.08;

        // animate face & hands
        // pupil movement influenced by mouse
        const pupilX = smoothMouseX.get();
        const pupilY = smoothMouseY.get() * 0.4;
        drawFace(t, pupilX, pupilY);
        drawHandScreen(leftHand.ctx, t);
        drawHandScreen(rightHand.ctx, t + 120);

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();

      // Cleanup on unmount
      const cleanup = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resizeRenderer);
        // dispose textures / geometry (best-effort)
        if (faceTexture) faceTexture.dispose();
        if (leftHandTexture) leftHandTexture.dispose();
        if (rightHandTexture) rightHandTexture.dispose();
        scene.traverse((obj: any) => {
          if (obj.geometry) obj.geometry.dispose && obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose && m.dispose());
            else obj.material.dispose && obj.material.dispose();
          }
        });
        renderer.dispose && renderer.dispose();
      };

      // attach cleanup to the script element for access in outer scope
      (script as any)._cleanup = cleanup;
    };

    document.head.appendChild(script);

    return () => {
      // run cleanup if created
      if ((script as any)._cleanup) (script as any)._cleanup();
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [smoothMouseX, smoothMouseY]);

  return (
    <div className="relative">
      {/* only showing the hero + canvas portion relevant to robot for brevity */}
      <div className="hidden lg:block absolute right-24 top-1/2 transform -translate-y-1/2 z-20">
        <div className="relative">
          <canvas ref={canvasRef} className="w-[400px] h-[400px] bg-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        </div>
        <p className="text-center text-[#00ff6a] font-mono text-sm mt-4 opacity-70">{"<HOVER TO INTERACT>"}</p>
      </div>

      {/* cursor glow */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px]
                   rounded-full bg-[rgba(0,255,106,0.15)]
                   blur-[120px] z-10 mix-blend-screen"
      />
    </div>
  );
}
