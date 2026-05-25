"use client";

import { useState, useEffect } from "react";
import { QuantumParticles, FloatingElements, ParallaxBackground, OrganicFlowBackground } from "../components/BackgroundEffects";
import { HolographicCard } from "../components/HolographicCard";
import { AnimatedSection } from "../components/AnimatedSection";
import { QuantumStatus } from "../components/QuantumStatus";
import { AITypingText } from "../components/AITypingText";
import styles from "./page.module.css";

type Testimonial = {
  name: string;
  casino: string;
  text: string;
  rating: number;
  date?: string;
  source?: 'wildgroup' | '88group';
};

type Brand = {
  name: string;
  logo: string;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prevIndex: number) => (prevIndex + 1) % testimonials.length);
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const fetchData = async () => {
    try {
      const [testimonialsRes, brandsRes] = await Promise.all([
        fetch("/api/testimonials"),
        fetch("/api/brands", { cache: "no-store" }),
      ]);
      
      if (testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json();
        setTestimonials(testimonialsData);
      }
      
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(brandsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBrandLogo = (casinoName: string) => {
    // Special handling for WildGroup - use default logo if not found
    if (casinoName === 'WildGroup' || casinoName.toLowerCase() === 'wildgroup') {
      // First try to find in brands
      let brand = brands.find(b => {
        const brandName = b.name.toLowerCase().replace(/\s+/g, '');
        return brandName === 'wildgroup' || brandName.includes('wildgroup');
      });
      
      // If found, return the logo (it should already be converted to full URL)
      if (brand?.logo) {
        return brand.logo;
      }
      
      // If not found, use default WildGroup logo (proxied)
      return `/api/proxy-image?url=${encodeURIComponent('https://wildgroupau.com/assets/logo/wildgroup-logo.png')}`;
    }
    
    // Normalize casino name for matching
    const normalizedCasino = casinoName.toLowerCase().trim();
    
    // Try exact match first
    let brand = brands.find(b => b.name === casinoName);
    
    // If not found, try case-insensitive match
    if (!brand) {
      brand = brands.find(b => b.name.toLowerCase() === normalizedCasino);
    }
    
    // If still not found, try partial match (e.g., "WildGroup" matches "WILDGROUP" or "Wild Group")
    if (!brand) {
      brand = brands.find(b => {
        const normalizedBrand = b.name.toLowerCase().replace(/\s+/g, '');
        return normalizedBrand === normalizedCasino.replace(/\s+/g, '');
      });
    }
    
    return brand?.logo || '';
  };

  return (
    <div className={styles.page}>
      {/* Enhanced Parallax Background */}
      <ParallaxBackground />

      {/* Quantum Particle System Background */}
      <QuantumParticles />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Organic Flow Background */}
      <OrganicFlowBackground />
      
      <div className={styles.wrap}>
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <AnimatedSection animation="fadeIn">
              <QuantumStatus text="SYSTEM STATUS: OPERATIONAL" />
              <h1 className={styles.heroTitle}>
                <span>Testimonials</span>
                <div className={styles.titleGlow}></div>
              </h1>
              <p className={styles.heroSubtitle}>
                <AITypingText
                  text="What our members say about 88 GROUP × WILD GROUP PARTNERSHIP"
                  speed={30}
                />
              </p>
            </AnimatedSection>
          </div>
        </section>
        {loading ? (
          <div className={styles.loading}>Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className={styles.empty}>No testimonials available</div>
        ) : (
          <>
            <AnimatedSection animation="scaleIn">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Voices of Satisfaction</h2>
                <div className={styles.subtitle}>
                  <span>Every story matters</span>
                  <div className={styles.decorativeLine}></div>
                </div>
              </div>
            </AnimatedSection>

            <div className={styles.fullscreenContainer}>
              <div className={styles.slidesWrapper}>
                {testimonials.map((testimonial, index) => {
                  const brandLogo = getBrandLogo(testimonial.casino);
                  const isActive = index === currentSlide;

                  return (
                    <div
                      key={testimonial.name + index}
                      className={`${styles.slide} ${isActive ? styles.active : ''}`}
                    >
                      <div className={styles.slideContent}>
                        <div className={styles.testimonialCard}>
                          {/* Brand Logo at top */}
                          {brandLogo && (
                            <div className={styles.testimonialLogoWrapper}>
                              <img 
                                src={brandLogo} 
                                alt={testimonial.casino} 
                                className={styles.testimonialLogo}
                                onError={(e) => {
                                  console.error('Image failed to load:', brandLogo, 'for casino:', testimonial.casino);
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          {/* Testimonial Header */}
                          <div className={styles.testimonialHeader}>
                            <div className={styles.authorInfo}>
                              <span className={styles.authorName}>{testimonial.name}</span>
                              <span className={styles.casinoName}>{testimonial.casino}</span>
                            </div>
                            <div className={styles.rating}>
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <span key={i} className={styles.starIcon}>★</span>
                              ))}
                            </div>
                          </div>

                          {/* Testimonial Text */}
                          <p className={styles.testimonialText}>&ldquo;{testimonial.text}&rdquo;</p>

                          {/* Date */}
                          {testimonial.date && (
                            <span className={styles.testimonialDate}>{testimonial.date}</span>
                          )}
                        </div>
                      </div>

                      {/* Floating decorative elements */}
                      <div className={styles.floatingDecorations}>
                        <div className={styles.decoration1}></div>
                        <div className={styles.decoration2}></div>
                        <div className={styles.decoration3}></div>
                      </div>
                    </div>
                  );
                })}
              </div>


              {/* Progress bar */}
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((currentSlide + 1) / testimonials.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
