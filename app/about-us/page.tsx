"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatedSection } from "../components/AnimatedSection";
import styles from "./page.module.css";

// --- Quantum Particle System ---
function QuantumParticles() {
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

    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
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

        // Enhanced entanglement with color variations
        particles.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
            );
            if (distance < 200) {
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

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className={styles.quantumCanvas} />;
}

// --- Holographic Card Component ---
function HolographicCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Holographic rotation effect
      const rotateX = (y - rect.height / 2) / 10;
      const rotateY = (x - rect.width / 2) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className={`${styles.holographicCard} ${className}`}>
      <div className={styles.holographicOverlay}></div>
      {children}
    </div>
  );
}

// --- AI-Powered Typing Effect ---
function AITypingText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed + Math.random() * 20); // AI-like variable timing

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={styles.aiText}>
      {displayedText}
      {!isComplete && <span className={styles.aiCursor}>|</span>}
      {isComplete && <span className={styles.aiComplete}>✓</span>}
    </span>
  );
}

// --- Scroll-triggered Floating Elements ---
function FloatingElements() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
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
function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
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

export default function AboutUs() {
  return (
    <div className={styles.page}>
      {/* Enhanced Parallax Background */}
      <ParallaxBackground />

      {/* Quantum Particle System Background */}
      <QuantumParticles />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Background Effects - Choose one by uncommenting */}

      {/* Current: Organic Flow Background */}
      <div className={styles.organicFlow}>
        {/* Flowing Organic Shapes */}
        <div className={styles.organicShape} />
        <div className={styles.organicShape} />
        <div className={styles.organicShape} />
        <div className={styles.organicShape} />
        <div className={styles.organicShape} />

        {/* Flowing Energy Streams */}
        <div className={styles.energyStream} />
        <div className={styles.energyStream} />
        <div className={styles.energyStream} />

        {/* Dynamic Light Orbs */}
        <div className={styles.lightOrb} />
        <div className={styles.lightOrb} />
        <div className={styles.lightOrb} />
      </div>

      {/* Alternative 1: Geometric Abstraction (Uncomment to use) */}
      {/*
      <div className={styles.geometricAbstraction}>
        <div className={styles.geometricShape} />
        <div className={styles.geometricShape} />
        <div className={styles.geometricShape} />
        <div className={styles.geometricShape} />
      </div>
      */}

      {/* Alternative 2: Wave Flow (Uncomment CSS in .module.css to use) */}
      {/*
      <div className={styles.waveFlow}>
        <div className={styles.waveLayer} />
        <div className={styles.waveLayer} />
        <div className={styles.waveLayer} />
      </div>
      */}

      {/* Alternative 3: Particle Field (Uncomment CSS in .module.css to use) */}
      {/*
      <div className={styles.particleField}>
        <div className={styles.particleDot} />
        <div className={styles.particleDot} />
        <div className={styles.particleDot} />
        <div className={styles.particleDot} />
        <div className={styles.particleDot} />
        <div className={styles.particleDot} />
        <div className={styles.particleDot} />
        <div className={styles.particleDot} />
      </div>
      */}

      <div className={styles.wrap}>
        {/* Quantum Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <AnimatedSection animation="quantumFade">
              <div className={styles.quantumStatus}>
                <div className={styles.statusIndicator}>
                  <div className={styles.quantumBit}></div>
                  <span>SYSTEM STATUS: OPERATIONAL</span>
                </div>
              </div>

              <h1 className={styles.heroTitle}>
                Ultimate <span>Partnership</span>
                <div className={styles.titleGlow}></div>
              </h1>

              <p className={styles.heroSubtitle}>
                <AITypingText
                  text="Australia's premier gaming partnership network, connecting players with the most trusted and rewarding online casino platforms. We combine WildGroup's transparency with 88 Group's premium gaming excellence."
                  speed={30}
                />
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className={styles.missionSection}>
          <AnimatedSection animation="neuralExpand">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
            </div>
          </AnimatedSection>

          <HolographicCard className={styles.missionCard}>
            <p className={styles.missionText}>
              <AITypingText
                text="To connect Australian players with the most trusted and rewarding online casino platforms through carefully curated partnerships with industry-leading operators."
                speed={20}
              />
            </p>
            <p className={styles.missionText}>
              <AITypingText
                text="We combine transparency, player protection, and exceptional value through exclusive bonuses, VIP rewards, and professional support services."
                speed={25}
              />
            </p>
            <p className={styles.missionText}>
              <AITypingText
                text="Our mission is to simplify choice in a crowded market by featuring trusted partners that demonstrate consistent performance, fair systems, and reliable payouts."
                speed={20}
              />
            </p>
          </HolographicCard>
        </section>

        {/* Our Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
          </div>

          <div className={styles.valuesGrid}>
            {[
              {
                icon: "shield",
                title: "Transparency & Trust",
                text: "We clearly present partner activity, offers, and information without misleading claims. All our partners are fully licensed by recognized gaming authorities.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "bolt",
                title: "Lightning-Fast Service",
                text: "Experience instant withdrawals and lightning-fast payouts. Most withdrawals are processed within hours with multiple secure payment options.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "layers",
                title: "Independence & Excellence",
                text: "We don't operate casinos or control game outcomes. Partners are selected based on performance, stability, and user feedback — not placement fees.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "gift",
                title: "Exclusive Rewards",
                text: "Access special welcome packages, free spins, and VIP rewards exclusive to our partnership network members.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 12 20 22 4 22 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="7" width="20" height="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="22" x2="12" y2="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C9.5 2 12 3.5 12 7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C14.5 2 12 3.5 12 7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "users",
                title: "24/7 Premium Support",
                text: "Our dedicated Australian support team is available around the clock via live chat, WhatsApp, and email for all partnership members.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "gamepad",
                title: "Premium Gaming Experience",
                text: "From pokies to live dealers, enjoy access to thousands of premium games from top providers across our partner network.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              }
            ].map((value, index) => (
              <AnimatedSection key={index} animation="fadeInUp" delay={index * 200}>
                <HolographicCard className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    {value.svg}
                  </div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueText}>{value.text}</p>
                  <div className={styles.neuralPattern}></div>
                </HolographicCard>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Our Partnership Advantages Section */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Our Partnership Network</h2>
          </div>

          <div className={styles.featuresGrid}>
            {[
              {
                icon: "shield",
                title: "Fully Licensed & Certified Partners",
                text: "All our partner casinos are fully licensed by recognized gaming authorities including PAGCOR and Curacao eGaming.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "bolt",
                title: "Lightning-Fast Withdrawals",
                text: "Experience instant withdrawals and lightning-fast payouts. Most withdrawals are processed within hours.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "gift",
                title: "Exclusive Partnership Bonuses",
                text: "Access special welcome packages, free spins, and VIP rewards exclusive to our partnership network members.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 12 20 22 4 22 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="7" width="20" height="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="22" x2="12" y2="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C9.5 2 12 3.5 12 7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C14.5 2 12 3.5 12 7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "headset",
                title: "24/7 Australian Support",
                text: "Our dedicated Australian support team is available around the clock via live chat, WhatsApp, and email.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 21h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V11a7 7 0 0 1 14 0v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "gamepad",
                title: "Thousands of Premium Games",
                text: "From pokies to live dealers, enjoy access to thousands of premium games from top providers across our network.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                icon: "lock",
                title: "Secure Banking Options",
                text: "Multiple secure payment options including credit cards, e-wallets, and cryptocurrencies for safe transactions.",
                svg: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="16" r="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} animation="scaleIn" delay={index * 150}>
                <HolographicCard className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    {feature.svg}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureText}>{feature.text}</p>
                </HolographicCard>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Our Network Section */}
        <section className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Partnership Network</h2>
          </div>

          <div className={styles.networkStats}>
            <HolographicCard className={styles.statCard}>
              <div className={styles.statNumber}>16+</div>
              <div className={styles.statLabel}>Total Partner Casinos</div>
              <div className={styles.statDescription}>Combined from WildGroup and 88 Group networks</div>
            </HolographicCard>

            <HolographicCard className={styles.statCard}>
              <div className={styles.statNumber}>10,000+</div>
              <div className={styles.statLabel}>Games Available</div>
              <div className={styles.statDescription}>From pokies to live dealers across all partners</div>
            </HolographicCard>

            <HolographicCard className={styles.statCard}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support Available</div>
              <div className={styles.statDescription}>Dedicated Australian support team</div>
            </HolographicCard>

            <HolographicCard className={styles.statCard}>
              <div className={styles.statNumber}>$25M+</div>
              <div className={styles.statLabel}>Paid to Winners</div>
              <div className={styles.statDescription}>Combined payouts across our network</div>
            </HolographicCard>
          </div>
        </section>

        {/* Our Story Section */}
        <section className={styles.storySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
          </div>

          <HolographicCard className={styles.storyCard}>
            <div className={styles.storyContent}>
              <div className={styles.storyText}>
                <p>
                  Founded in 2026, 88 GROUP × WILD GROUP PARTNERSHIP emerged from a vision to revolutionize the Australian online
                  gaming experience. Our founders, with decades of combined industry experience, recognized
                  the need for a trusted network that prioritizes player satisfaction above all else.
                </p>
                <p>
                  Through the merger of WildGroup's transparency-focused approach and 88 Group's premium gaming excellence,
                  we created Australia's most comprehensive gaming partnership network. Today, we partner with sixteen
                  premium casino platforms, each selected for their commitment to fair play, generous rewards, and exceptional service.
                </p>
                <p>
                  Our network serves thousands of Australian players who trust us to deliver the best gaming experience
                  with complete transparency, lightning-fast withdrawals, and exclusive partnership bonuses.
                </p>
                <p>
                  As we continue to grow, our commitment remains unchanged: to be the most trusted gateway
                  to premium online gaming in Australia, combining the best of both worlds.
                </p>
              </div>
            </div>
          </HolographicCard>
        </section>

        {/* Responsible Gaming Section */}
        <section className={styles.responsibleSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Responsible Gaming</h2>
          </div>

          <HolographicCard className={styles.responsibleCard}>
            <p className={styles.responsibleText}>
              We encourage responsible play and recommend all users participate
              within their personal limits. Gaming should remain a form of
              entertainment, not financial risk. Our partnership network is committed
              to player protection and providing a safe, enjoyable gaming environment.
            </p>
          </HolographicCard>
        </section>

        {/* Important Disclaimer */}
        <section className={styles.disclaimerSection}>
          <HolographicCard className={styles.disclaimerCard}>
            <h2 className={styles.disclaimerTitle}>Important Disclaimer</h2>
            <p className={styles.disclaimerText}>
              88 GROUP × WILD GROUP PARTNERSHIP is not a gambling operator. We are an independent partner platform
              that connects players with carefully selected online casino brands. All deposits, withdrawals,
              and gameplay are handled directly by our verified partner casinos. We do not operate games,
              process payments, or control game outcomes.
            </p>
          </HolographicCard>
        </section>
      </div>
    </div>
  );
}
