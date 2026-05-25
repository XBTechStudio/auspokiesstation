"use client";

import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { BrandCard } from "./components/BrandCard";
import { SplitLayout } from "./components/SplitLayout";
import { HeroBanner } from "./components/HeroBanner";
import { TransactionSection, type Transaction } from "./components/TransactionSection";
import styles from "./page.module.css";

// Lazy load heavy components
const IntroSection = lazy(() => import("./components/IntroSection").then(module => ({ default: module.IntroSection })));
const TestimonialCards = lazy(() => import("./components/TestimonialCards").then(module => ({ default: module.TestimonialCards })));
const PartnershipFooter = lazy(() => import("./components/PartnershipFooter").then(module => ({ default: module.PartnershipFooter })));

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
  source?: 'wildgroup' | 'wildgroupau' | '88group' | 'group88';
};

type Testimonial = {
  name: string;
  casino: string;
  text: string;
  rating: number;
  date?: string;
  source?: 'wildgroup' | 'wildgroupau' | '88group' | 'group88';
};

type SiteSettings = {
  whatsapp?: {
    channel?: string;
    community?: string;
  };
  telegram?: string;
  feedbackDocs?: string;
  complaintHotline?: {
    phone?: string;
    link?: string;
  };
  marquee?: string;
};

// Transaction generation functions
function generatePhoneNumber(): string {
  const prefix = "61";
  const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  const last3 = randomDigits.slice(-3);
  return `${prefix}******${last3}`;
}

function generateAmount(type: 'deposit' | 'withdrawal'): number {
  if (type === 'deposit') {
    const depositAmounts = [
      { amount: 10, weight: 30 }, { amount: 30, weight: 30 }, { amount: 50, weight: 20 },
      { amount: 100, weight: 10 }, { amount: 500, weight: 5 }, { amount: 1000, weight: 5 },
    ];
    const totalWeight = depositAmounts.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of depositAmounts) {
      random -= item.weight;
      if (random <= 0) return item.amount;
    }
    return depositAmounts[0].amount;
  } else {
    return Math.floor(Math.random() * 2000) + 100;
  }
}

function formatTimestamp(offsetMinutes: number = 0): string {
  const now = new Date();
  const date = new Date(now.getTime() - offsetMinutes * 60000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function generateTransactions(brands: Brand[], type: 'deposit' | 'withdrawal', count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const offsetMinutes = i * (Math.floor(Math.random() * 13) + 3);
    return {
      id: `${type}-${Date.now()}-${i}`,
      brand: brand.name,
      brandLogo: brand.logo,
      phone: generatePhoneNumber(),
      amount: generateAmount(type),
      timestamp: formatTimestamp(offsetMinutes),
      source: brand.source,
    };
  });
}


export default function Page() {
  const year = new Date().getFullYear();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, testimonialsRes, settingsRes] = await Promise.all([
          fetch("/api/brands?cv=logo-fix-v3", { cache: "no-store" }),
          fetch("/api/testimonials"),
          fetch("/api/settings"),
        ]);

        if (brandsRes.ok) {
          const data = await brandsRes.json();
          setBrands(data);
        }

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          setTestimonials(data);
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (brands.length === 0) return;

    const updateTransactions = () => {
      const depositCount = Math.floor(Math.random() * 4) + 3;
      setDeposits(generateTransactions(brands, 'deposit', depositCount));

      const withdrawalCount = Math.floor(Math.random() * 3) + 2;
      setWithdrawals(generateTransactions(brands, 'withdrawal', withdrawalCount));
    };

    updateTransactions();
    // Reduce update frequency for better performance - update every 5-10 minutes instead of 2-5 minutes
    const updateInterval = setInterval(() => {
      updateTransactions();
    }, Math.floor(Math.random() * 300000) + 300000); // 5-10 minutes

    return () => clearInterval(updateInterval);
  }, [brands]);

  return (
    <div className={styles.page}>
      {/* Organic Flow Background - Simplified for performance */}
      <div className={styles.organicFlow}>
        {/* Reduced from 5 to 2 shapes */}
        <div className={styles.organicShape} />
        <div className={styles.organicShape} />
      </div>

      {settings?.marquee && (
        <div className={styles.welcomeMarquee}>
          <div className={styles.marqueeContent}>
            <span className={styles.marqueeText}>
              {settings.marquee}
            </span>
            <span className={styles.marqueeText}>
              {settings.marquee}
            </span>
          </div>
        </div>
      )}

      <HeroBanner />

      <div className={styles.wrap} style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.note}>
          We keep this page simple: brand list, current offers, and official access links.
          Please play responsibly and comply with local regulations (18+).
        </div>

        <section className={styles.section} id="offers">
          <div className={styles.secHead}>
            <h2 className={styles.h2}>Verified Brands & Current Offers</h2>
            <p className={styles.secHint}>Register or follow updates</p>
          </div>

          {brandsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
              Loading...
            </div>
          ) : brands.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
              No brands available
            </div>
          ) : (
            <SplitLayout
              leftTitle={
                <div className={styles.splitTitleWithLogo}>
                  <img 
                    src={`/api/proxy-image?url=${encodeURIComponent('https://88groupau.com/logo.gif')}`}
                    alt="88Group" 
                    className={styles.splitTitleLogo}
                  />
                  <span className={styles.splitTitleText}>Partners</span>
                </div>
              }
              rightTitle={
                <div className={styles.splitTitleWithLogo}>
                  <img 
                    src={`/api/proxy-image?url=${encodeURIComponent('https://wildgroupau.com/assets/logo/wildgroup-logo.png')}`}
                    alt="WildGroup" 
                    className={styles.splitTitleLogo}
                  />
                  <span className={styles.splitTitleText}>Partners</span>
                </div>
              }
              leftContent={
                <div className={styles.cardGrid}>
                  {brands.filter(b => b.source === '88group' || b.source === 'group88').length > 0 ? (
                    brands.filter(b => b.source === '88group' || b.source === 'group88').map((b) => (
                      <BrandCard key={b.key} brand={b} />
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                      No 88Group brands available
                    </div>
                  )}
                </div>
              }
              rightContent={
                <div className={styles.cardGrid}>
                  {brands.filter(b => b.source === 'wildgroupau' || b.source === 'wildgroup').length > 0 ? (
                    brands.filter(b => b.source === 'wildgroupau' || b.source === 'wildgroup').map((b) => (
                      <BrandCard key={b.key} brand={b} />
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                      No WildGroup brands available
                    </div>
                  )}
                </div>
              }
            />
          )}

          {/* Real-time Transaction Data */}
          <TransactionSection deposits={deposits} withdrawals={withdrawals} />

          {/* Testimonial Section */}
          <section className={styles.testimonialSection}>
            <h2 className={styles.testimonialTitle}>
              Customer Testimonials
            </h2>
            {(testimonials.length > 0 || brands.length > 0) && (
              <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>Loading testimonials...</div>}>
                <TestimonialCards testimonials={testimonials} brands={brands} />
              </Suspense>
            )}
          </section>

          {/* Video Section */}
          <div className={styles.videoSection}>
            <div className={styles.videoContainer}>
              <iframe
                src="https://streamable.com/e/f23vz9?autoplay=1&muted=1"
                className={styles.videoIframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                title="88 GROUP × WILD GROUP PARTNERSHIP Video"
              />
            </div>
          </div>

          {/* Intro Section */}
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>Loading content...</div>}>
            <IntroSection />
          </Suspense>

          <div className={styles.disclaimer}>
            Disclaimer: This page provides information only and does not offer gambling services. Users must be 18+ and comply with local laws.
            Promotions may change without notice; please confirm on the official site.
          </div>

          {/* Partnership Footer Section */}
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)' }}>Loading footer...</div>}>
            <PartnershipFooter />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
