"use client";

import { useState, useEffect } from "react";
import { QuantumParticles, FloatingElements, ParallaxBackground, OrganicFlowBackground } from "../components/BackgroundEffects";
import { HolographicCard } from "../components/HolographicCard";
import { AnimatedSection } from "../components/AnimatedSection";
import { QuantumStatus } from "../components/QuantumStatus";
import { AITypingText } from "../components/AITypingText";
import styles from "./page.module.css";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  isImportant?: boolean;
  is_important?: boolean;
  date?: string;
  created_at?: string;
  source?: 'wildgroup' | '88group';
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements");
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
                <span>Announcements</span>
                <div className={styles.titleGlow}></div>
              </h1>
              <p className={styles.heroSubtitle}>
                <AITypingText
                  text="Stay updated with the latest news and important information from 88 GROUP × WILD GROUP PARTNERSHIP."
                  speed={30}
                />
              </p>
            </AnimatedSection>
          </div>
        </section>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📢</div>
            <h3>No Announcements Available</h3>
            <p>Please check back later for updates and important information!</p>
          </div>
        ) : (
          <div className={styles.timelineSection}>
            {/* Timeline Header */}
            <div className={styles.timelineHeader}>
              <h2 className={styles.timelineTitle}>Announcement Timeline</h2>
              <div className={styles.timelineAccent}></div>
            </div>

            {/* Timeline */}
            <div className={styles.timeline}>
              {(() => {
                // Combine and sort all WildGroup announcements by date (newest first)
                const allAnnouncements = announcements
                  .filter(ann => ann.source === 'wildgroup')
                  .sort((a, b) => {
                    const dateA = new Date(a.created_at || a.date || 0);
                    const dateB = new Date(b.created_at || b.date || 0);
                    return dateB.getTime() - dateA.getTime(); // Newest first
                  });

                return allAnnouncements.map((announcement, index) => {
                  const uniqueKey = `${announcement.source || 'unknown'}-${announcement.id}-${index}`;
                  const isExpanded = expandedId === uniqueKey;
                  const isImportant = announcement.isImportant || announcement.is_important;
                  const isEven = index % 2 === 0;

                  return (
                    <div key={uniqueKey} className={`${styles.timelineItem} ${isEven ? styles.left : styles.right}`}>
                      <AnimatedSection animation="fadeInUp" delay={index * 150}>
                        <div className={`${styles.timelineCard} ${isImportant ? styles.importantCard : ''}`}>
                          {/* Timeline connector */}
                          <div className={styles.timelineConnector}>
                            <div className={`${styles.timelineDot} ${isImportant ? styles.importantDot : ''}`}></div>
                          </div>

                          {/* Card content */}
                          <div className={styles.cardContent}>
                            {/* Priority indicator for important announcements */}
                            {isImportant && (
                              <div className={styles.priorityBadge}>
                                <span className={styles.priorityIcon}>⚡</span>
                                <span>Important</span>
                              </div>
                            )}

                            <div className={styles.cardMeta}>
                              <span className={styles.category}>{announcement.category}</span>
                              <span className={styles.date}>
                                {formatDate(announcement.created_at || announcement.date)}
                              </span>
                            </div>

                            {announcement.image && (
                              <div className={styles.imageContainer}>
                                <img
                                  src={announcement.image}
                                  alt={announcement.title}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}

                            <h3 className={styles.cardTitle}>{announcement.title}</h3>

                            <div className={styles.cardText}>
                              <p>
                                {isExpanded
                                  ? announcement.content
                                  : `${announcement.content.substring(0, 200)}...`}
                              </p>
                              {announcement.content.length > 200 && (
                                <button
                                  className={styles.readMore}
                                  onClick={() => setExpandedId(isExpanded ? null : uniqueKey)}
                                >
                                  {isExpanded ? "Read Less" : "Read More"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </AnimatedSection>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
