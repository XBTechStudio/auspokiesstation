"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./BackgroundEffects.module.css";

// --- Quantum Particle System ---
export function QuantumParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      quantum: number;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: 300 + Math.random() * 200,
        quantum: Math.random()
      };
    };

    // Reduced particle count for better performance (30 instead of 50)
    const particleCount = typeof window !== 'undefined' && window.innerWidth > 768 ? 30 : 15;
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    let animationFrameId: number;
    let lastTime = 0;
    const targetFPS = 30; // Reduced from 60fps to 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Enhanced quantum superposition with multiple harmonics
        const superposition1 = Math.sin(particle.life * 0.02 + particle.quantum * Math.PI * 2);
        const superposition2 = Math.sin(particle.life * 0.05 + particle.quantum * Math.PI * 4);
        const superposition = (superposition1 + superposition2 * 0.5) / 1.5;
        const opacity = (particle.life / particle.maxLife) * Math.abs(superposition) * 0.15;

        // Optimized entanglement - only check nearby particles (reduced connection distance)
        particles.forEach((other, otherIndex) => {
          if (index !== otherIndex && index < otherIndex) { // Only check each pair once
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared < 15000) { // 150px^2 instead of calculating sqrt for 200px
              const distance = Math.sqrt(distanceSquared);
              const connectionStrength = (1 - distance / 200) * opacity;
              const hue = (particle.quantum * 360 + Date.now() * 0.01) % 360;

              // Create gradient line effect
              const gradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
              gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${connectionStrength})`);
              gradient.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 80%, 70%, ${connectionStrength * 1.5})`);
              gradient.addColorStop(1, `hsla(${(hue + 120) % 360}, 70%, 60%, ${connectionStrength})`);

              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.8 + connectionStrength * 2;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });

        // Enhanced quantum particle with glow effect
        const particleSize = 3 + Math.abs(superposition) * 3;
        const hue = (particle.quantum * 360 + particle.life * 0.5) % 360;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particleSize * 3);
        glowGradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${opacity * 0.5})`);
        glowGradient.addColorStop(0.5, `hsla(${hue}, 80%, 70%, ${opacity * 0.3})`);
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner particle
        const particleGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particleSize);
        particleGradient.addColorStop(0, `hsla(${hue}, 90%, 80%, ${opacity})`);
        particleGradient.addColorStop(0.7, `hsla(${(hue + 60) % 360}, 85%, 75%, ${opacity * 0.8})`);
        particleGradient.addColorStop(1, `hsla(${(hue + 120) % 360}, 80%, 70%, ${opacity * 0.4})`);

        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fill();

        // Respawn particle with enhanced logic
        if (particle.life > particle.maxLife) {
          particles[index] = createParticle();
        }
        });

        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.quantumCanvas} />;
}

// --- Scroll-triggered Floating Elements ---
export function FloatingElements() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.floatingElements}>
      {/* Floating geometric shapes */}
      <div
        className={styles.floatingShape}
        style={{
          top: '10%',
          left: '10%',
          transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`,
        }}
      />
      <div
        className={styles.floatingShape}
        style={{
          top: '60%',
          right: '15%',
          transform: `translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.03}deg)`,
        }}
      />
      <div
        className={styles.floatingShape}
        style={{
          bottom: '20%',
          left: '20%',
          transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.08}deg)`,
        }}
      />
    </div>
  );
}

// --- Enhanced Parallax Background ---
export function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.parallaxBackground}>
      <div
        className={styles.parallaxLayer1}
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className={styles.parallaxLayer2}
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      <div
        className={styles.parallaxLayer3}
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
    </div>
  );
}

// --- Organic Flow Background ---
export function OrganicFlowBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on client side only
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={styles.organicFlow}>
      {/* Flowing Organic Shapes - Reduced from 5 to 3 */}
      <div className={styles.organicShape} />
      <div className={styles.organicShape} />
      {!isMobile && <div className={styles.organicShape} />}

      {/* Flowing Energy Streams - Reduced from 3 to 2 */}
      <div className={styles.energyStream} />
      {!isMobile && <div className={styles.energyStream} />}

      {/* Dynamic Light Orbs - Reduced from 3 to 2 */}
      <div className={styles.lightOrb} />
      {!isMobile && <div className={styles.lightOrb} />}
    </div>
  );
}
