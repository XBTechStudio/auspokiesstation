"use client";

import { useState, useEffect } from "react";
import { SplitLayout } from "../components/SplitLayout";
import { BrandCard } from "../components/BrandCard";
import { QuantumParticles, FloatingElements, ParallaxBackground, OrganicFlowBackground } from "../components/BackgroundEffects";
import { AnimatedSection } from "../components/AnimatedSection";
import { QuantumStatus } from "../components/QuantumStatus";
import { AITypingText } from "../components/AITypingText";
import styles from "./page.module.css";
import homeStyles from "../page.module.css";

type Brand = {
  key: string;
  name: string;
  logo: string;
  headline?: string;
  details?: string;
  subtitle_text?: string;
  promo_text?: string;
  register_url?: string;
  registerUrl?: string;
  registerUrl_2?: string;
  telegram_url?: string;
  telegramUrl?: string;
  tag?: string;
  border_color?: string;
  borderColor?: string;
  source?: 'wildgroup' | '88group';
};

export default function PartnerCasinos() {
  const [wildGroupBrands, setWildGroupBrands] = useState<Brand[]>([]);
  const [group88Brands, setGroup88Brands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands/split?cv=logo-fix-v3", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setWildGroupBrands(data.wildgroup || []);
        setGroup88Brands(data['88group'] || []);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
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
                <span>Partner Casinos</span>
                <div className={styles.titleGlow}></div>
              </h1>
              <p className={styles.heroSubtitle}>
                <AITypingText
                  text="We feature a selection of independent casino partners, each suited for different player preferences."
                  speed={30}
                />
              </p>
            </AnimatedSection>
          </div>
        </section>
        {loading ? (
          <div className={styles.loading}>Loading brands...</div>
        ) : (
          <SplitLayout
            leftTitle={
              <div className={homeStyles.splitTitleWithLogo}>
                <img 
                  src={`/api/proxy-image?url=${encodeURIComponent('https://88groupau.com/logo.gif')}`}
                  alt="88Group Logo" 
                  className={homeStyles.splitTitleLogo}
                />
                <span className={homeStyles.splitTitleText}>Partners</span>
              </div>
            }
            rightTitle={
              <div className={homeStyles.splitTitleWithLogo}>
                <img 
                  src={`/api/proxy-image?url=${encodeURIComponent('https://wildgroupau.com/assets/logo/wildgroup-logo.png')}`}
                  alt="WildGroup Logo" 
                  className={homeStyles.splitTitleLogo}
                />
                <span className={homeStyles.splitTitleText}>Partners</span>
              </div>
            }
            leftContent={
              <div className={styles.brandsGrid}>
                {group88Brands.length > 0 ? (
                  group88Brands.map((brand) => (
                    <BrandCard key={brand.key} brand={brand} />
                  ))
                ) : (
                  <div className={styles.emptyState}>No 88 Group brands available</div>
                )}
              </div>
            }
            rightContent={
              <div className={styles.brandsGrid}>
                {wildGroupBrands.length > 0 ? (
                  wildGroupBrands.map((brand) => (
                    <BrandCard key={brand.key} brand={brand} />
                  ))
                ) : (
                  <div className={styles.emptyState}>No WildGroup brands available</div>
                )}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
