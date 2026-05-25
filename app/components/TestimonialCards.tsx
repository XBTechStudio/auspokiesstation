"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../page.module.css";

// Type definitions moved here to avoid import issues
type Brand = {
  name: string;
  logo: string;
};

type Testimonial = {
  name: string;
  casino: string;
  text: string;
  rating: number;
  date?: string;
  source?: 'wildgroup' | 'wildgroupau' | '88group' | 'group88';
  logo?: string;
  title?: string;
};

interface TestimonialCardsProps {
  testimonials: Testimonial[];
  brands: Brand[];
}

export function TestimonialCards({ testimonials, brands }: TestimonialCardsProps) {
  const [displayedTestimonials, setDisplayedTestimonials] = useState<Testimonial[]>([]);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    const mq = window.matchMedia ? window.matchMedia("(max-width: 768px)") : null;
    return mq ? mq.matches : window.innerWidth <= 768;
  });
  const testimonialsViewportRef = useRef<HTMLDivElement>(null);
  const testimonialsTrackRef = useRef<HTMLDivElement>(null);
  const animationProgressRef = useRef(0);
  const initializedRef = useRef(false);
  const testimonialsLengthRef = useRef(-1);
  const brandsLengthRef = useRef(-1);
  const mobileModeRef = useRef(isMobile);

  const currentTestimonialsLength = testimonials.length;
  const currentBrandsLength = brands.length;

  useEffect(() => {
    if (mobileModeRef.current !== isMobile) {
      mobileModeRef.current = isMobile;
      initializedRef.current = false;
      testimonialsLengthRef.current = -1;
      brandsLengthRef.current = -1;
      animationProgressRef.current = 0;
      if (testimonialsTrackRef.current) {
        testimonialsTrackRef.current.style.transform = "";
      }
    }

    if (
      initializedRef.current &&
      testimonialsLengthRef.current === currentTestimonialsLength &&
      brandsLengthRef.current === currentBrandsLength
    ) {
      return;
    }

    if (initializedRef.current && currentTestimonialsLength === 0 && currentBrandsLength === 0) {
      return;
    }

    if (currentTestimonialsLength === 0 && currentBrandsLength === 0) {
      return;
    }

    const shuffleArray = <T,>(array: T[]): T[] => {
      if (!array || array.length === 0) return [];
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    try {
      if (currentTestimonialsLength > 0) {
        const shuffled = shuffleArray([...testimonials]);
        setDisplayedTestimonials(
          isMobile
            ? Array(2).fill(null).flatMap(() => shuffled)
            : Array(5).fill(null).flatMap(() => shuffled)
        );
        testimonialsLengthRef.current = currentTestimonialsLength;
        brandsLengthRef.current = currentBrandsLength;
        initializedRef.current = true;
      } else if (currentBrandsLength > 0 && !initializedRef.current) {
        const defaultLogo = brands[0]?.logo || "";
        const baseTestimonials: Testimonial[] = [
          { title: "Where Trust Meets Performance", text: "Everything worked exactly as promised. Smooth process from start to finish.", name: "Daniel Wright", logo: brands[0]?.logo || defaultLogo, source: "wildgroup", rating: 5, casino: "WildGroup" },
          { title: "Fast Wins, Faster Withdrawals", text: "No delays, no confusion. Withdrawals were processed quickly and clearly.", name: "Jason Miller", logo: brands[1]?.logo || defaultLogo, source: "88group", rating: 5, casino: "88Group" },
          { title: "Reliable From Day One", text: "Registration was simple and the platform felt stable right away.", name: "Andrew Collins", logo: brands[2]?.logo || defaultLogo, source: "wildgroup", rating: 5, casino: "WildGroup" },
          { title: "Exactly What a Player Needs", text: "Clear information, fair system, and reliable payouts every time.", name: "Matthew Brooks", logo: brands[3]?.logo || defaultLogo, source: "88group", rating: 5, casino: "88Group" },
        ];
        const shuffledFallback = shuffleArray(baseTestimonials);
        setDisplayedTestimonials(
          isMobile
            ? Array(2).fill(null).flatMap(() => shuffledFallback)
            : Array(5).fill(null).flatMap(() => shuffledFallback)
        );
        testimonialsLengthRef.current = currentTestimonialsLength;
        brandsLengthRef.current = currentBrandsLength;
        initializedRef.current = true;
      }
    } catch (error) {
      console.error("Error initializing testimonials:", error);
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTestimonialsLength, currentBrandsLength, isMobile]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia ? window.matchMedia("(max-width: 768px)") : null;
    const check = () => {
      setIsMobile(mq ? mq.matches : window.innerWidth <= 768);
    };

    check();

    if (mq) {
      const handler = () => check();
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
      }

      // Safari fallback
      // eslint-disable-next-line deprecation/deprecation
      mq.addListener(handler);
      return () => {
        // eslint-disable-next-line deprecation/deprecation
        mq.removeListener(handler);
      };
    }

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!testimonialsTrackRef.current || displayedTestimonials.length === 0) return;

    const track = testimonialsTrackRef.current;
    if (isMobile) {
      track.style.transform = "";
      return;
    }

    const ANIMATION_DURATION = 120000;
    let animationId: number | null = null;
    let lastTime = Date.now();
    let currentOffset = animationProgressRef.current;
    let groupWidth = 0;

    const calculateGroupWidth = () => {
      if (track.children.length === 0) return 0;
      const groupSize = currentTestimonialsLength > 0 ? currentTestimonialsLength : 4;
      const firstCard = track.children[0] as HTMLElement;
      if (!firstCard) return 0;
      const cardWidth = firstCard.offsetWidth;
      const gap = 24;
      return (cardWidth + gap) * groupSize - gap;
    };

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      if (groupWidth === 0) {
        groupWidth = calculateGroupWidth();
      }

      if (groupWidth === 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const pixelsPerSecond = groupWidth / (ANIMATION_DURATION / 1000);
      currentOffset += (deltaTime / 1000) * pixelsPerSecond;

      if (currentOffset >= groupWidth) {
        currentOffset -= groupWidth;
      }

      track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
      animationProgressRef.current = (currentOffset / groupWidth) * (100 / 5);
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      groupWidth = calculateGroupWidth();
      const progressPercent = animationProgressRef.current;
      currentOffset = (progressPercent / (100 / 5)) * groupWidth;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationId !== null) cancelAnimationFrame(animationId);
        animationId = null;
        return;
      }

      if (groupWidth === 0) {
        groupWidth = calculateGroupWidth();
      }
      if (groupWidth > 0) {
        const progressPercent = animationProgressRef.current;
        currentOffset = (progressPercent / (100 / 5)) * groupWidth;
      }
      lastTime = Date.now();
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [displayedTestimonials.length, currentTestimonialsLength, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === "undefined") return;
    if (!testimonialsViewportRef.current || !testimonialsTrackRef.current) return;

    const viewport = testimonialsViewportRef.current;
    const track = testimonialsTrackRef.current;
    const SPEED_PX_PER_SEC = 80;
    let rafId: number | null = null;
    let ro: ResizeObserver | null = null;

    const apply = () => {
      const loopWidth = Math.floor(track.scrollWidth / 2);
      const viewportWidth = viewport.clientWidth;
      const canAnimate = loopWidth > 0 && viewportWidth > 0 && track.scrollWidth > viewportWidth + 1;

      if (!canAnimate) {
        track.classList.remove(styles.testimonialTrackMobileMarquee);
        track.style.removeProperty("--testimonial-loop-width");
        track.style.removeProperty("--testimonial-marquee-duration");
        track.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      const durationSec = Math.max(8, loopWidth / SPEED_PX_PER_SEC);
      track.style.setProperty("--testimonial-loop-width", `${loopWidth}px`);
      track.style.setProperty("--testimonial-marquee-duration", `${durationSec}s`);
      track.classList.add(styles.testimonialTrackMobileMarquee);
    };

    const schedule = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => apply());
    };

    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => schedule());
      ro.observe(viewport);
      ro.observe(track);
    }

    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      track.classList.remove(styles.testimonialTrackMobileMarquee);
    };
  }, [isMobile, displayedTestimonials.length]);

  const brandLogoMap = useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach(brand => {
      if (brand.logo && brand.name) {
        map.set(brand.name.toLowerCase(), brand.logo);
      }
    });
    return map;
  }, [brands]);

  if (displayedTestimonials.length === 0) {
    return null;
  }

  return (
    <div className={styles.testimonialContainer}>
      <div ref={testimonialsViewportRef} className={styles.testimonialViewport}>
        <div ref={testimonialsTrackRef} className={styles.testimonialTrack}>
          {displayedTestimonials.map((testimonial: Testimonial, index) => {
            let brandLogo = testimonial.logo;

            if (!brandLogo && testimonial.casino && brandLogoMap.size > 0) {
              const casinoLower = testimonial.casino.toLowerCase();
              for (const [key, logo] of brandLogoMap.entries()) {
                if (casinoLower === key || casinoLower.includes(key) || key.includes(casinoLower)) {
                  brandLogo = logo;
                  break;
                }
              }
            }

            if (!brandLogo && brands.length > 0) {
              brandLogo = brands[0]?.logo;
            }

            if (!brandLogo) {
              brandLogo = "/file.svg";
            }

            const uniqueKey = `testimonial-${testimonial.source || "unknown"}-${testimonial.name || testimonial.casino || "testimonial"}-${index}`;

            return (
              <div key={uniqueKey} className={styles.testimonialCard}>
                {testimonial.source && (
                  <div className={styles.sourceBadge}>
                    <img
                      src={
                        testimonial.source === "wildgroup" || testimonial.source === "wildgroupau"
                          ? `/api/proxy-image?url=${encodeURIComponent('https://wildgroupau.com/assets/logo/wildgroup-logo.png')}`
                          : `/api/proxy-image?url=${encodeURIComponent('https://88groupau.com/logo.gif')}`
                      }
                      alt={testimonial.source}
                      className={styles.sourceLogo}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target) {
                          target.style.display = "none";
                        }
                      }}
                    />
                  </div>
                )}
                <div className={styles.testimonialHeader}>
                  <img
                    src={brandLogo}
                    alt="Brand"
                    className={styles.testimonialBrandLogo}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target && target.src !== "/file.svg") {
                        target.src = "/file.svg";
                      }
                    }}
                  />
                </div>
                <div className={styles.testimonialStars}>★★★★★</div>
                <h3 className={styles.testimonialCardTitle}>
                  {testimonial.title || testimonial.casino || "Testimonial"}
                </h3>
                <p className={styles.testimonialText}>
                  "{testimonial.text || ""}"
                </p>
                <div className={styles.testimonialAuthor}>— {testimonial.name || "Anonymous"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}