"use client";

import { useState, useEffect } from "react";
import { QuantumParticles, FloatingElements, ParallaxBackground, OrganicFlowBackground } from "../components/BackgroundEffects";
import { HolographicCard } from "../components/HolographicCard";
import { AnimatedSection } from "../components/AnimatedSection";
import { QuantumStatus } from "../components/QuantumStatus";
import { AITypingText } from "../components/AITypingText";
import styles from "./page.module.css";

type BonusCategory = {
  id: string | number;
  title: string;
  icon?: string;
  description?: string;
  bonuses: Array<{
    name: string;
    description?: string;
    icon?: string;
  }>;
  source?: 'wildgroup' | '88group';
};

export default function BonusesPromotions() {
  const [wildGroupBonuses, setWildGroupBonuses] = useState<BonusCategory[]>([]);
  const [group88Bonuses, setGroup88Bonuses] = useState<BonusCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async () => {
    try {
      const response = await fetch("/api/bonuses-promotions");
      if (response.ok) {
        const data = await response.json();
        setWildGroupBonuses(data.wildgroup || []);
        setGroup88Bonuses(data['88group'] || []);
      }
    } catch (error) {
      console.error("Error fetching bonuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = (category: BonusCategory, index: number) => {
    const isWildGroup = category.source === 'wildgroup';
    const cardTheme = isWildGroup ? styles.wildGroupTheme : styles.group88Theme;

    return (
      <AnimatedSection key={category.id} animation="scaleIn" delay={index * 100}>
        <div className={`${styles.categoryCard} ${cardTheme}`}>
          <div className={styles.cardHeader}>
            {category.source && (
              <div className={`${styles.sourceBadge} ${isWildGroup ? styles.wildGroupBadge : styles.group88Badge}`}>
                <span className={styles.badgeIcon}>
                  {isWildGroup ? '🎯' : '💎'}
                </span>
                {isWildGroup ? 'WildGroup' : '88Group'}
              </div>
            )}
          </div>

          <div className={styles.cardContent}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            {category.description && (
              <p className={styles.categoryDescription}>{category.description}</p>
            )}

            <div className={styles.bonusesContainer}>
              {category.bonuses.length > 0 ? (
                category.bonuses.map((bonus, idx) => (
                  <div key={idx} className={styles.bonusItem}>
                    <div className={styles.bonusIcon}>💰</div>
                    <div className={styles.bonusContent}>
                      <strong className={styles.bonusName}>{bonus.name}</strong>
                      {bonus.description && (
                        <span className={styles.bonusDesc}>{bonus.description}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyBonus}>
                  <span className={styles.emptyIcon}>📭</span>
                  <span>No bonuses available</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.cardGlow}></div>
        </div>
      </AnimatedSection>
    );
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
                <span>Bonuses & Promotions</span>
                <div className={styles.titleGlow}></div>
              </h1>
              <p className={styles.heroSubtitle}>
                <AITypingText
                  text="Explore our bonus categories available across all partner casinos."
                  speed={30}
                />
              </p>
            </AnimatedSection>
          </div>
        </section>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading bonus categories...</p>
          </div>
        ) : (
          <div className={styles.bonusesSection}>
            {/* WildGroup Bonuses */}
            {wildGroupBonuses.length > 0 && (
              <div className={styles.groupSection}>
                <div className={styles.groupHeader}>
                  <div className={styles.groupLogo}>
                    <img
                      src={`/api/proxy-image?url=${encodeURIComponent('https://wildgroupau.com/assets/logo/wildgroup-logo.png')}`}
                      alt="WildGroup Logo"
                      className={styles.logoImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <h2 className={styles.groupTitle}>WildGroup Bonuses</h2>
                  <div className={styles.groupAccent}></div>
                </div>
                <div className={styles.categoriesGrid}>
                  {wildGroupBonuses.map((category, index) => renderCategory(category, index))}
                </div>
              </div>
            )}

            {/* 88 Group Bonuses */}
            {group88Bonuses.length > 0 && (
              <div className={styles.groupSection}>
                <div className={styles.groupHeader}>
                  <div className={styles.groupLogo}>
                    <img
                      src={`/api/proxy-image?url=${encodeURIComponent('https://88groupau.com/logo.gif')}`}
                      alt="88 Group Logo"
                      className={styles.logoImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <h2 className={styles.groupTitle}>88 Group Bonuses</h2>
                  <div className={styles.groupAccent}></div>
                </div>
                <div className={styles.categoriesGrid}>
                  {group88Bonuses.map((category, index) => renderCategory(category, index + wildGroupBonuses.length))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {wildGroupBonuses.length === 0 && group88Bonuses.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎭</div>
                <h3>No Bonus Categories Available</h3>
                <p>Please check back later for exciting bonus offers!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
