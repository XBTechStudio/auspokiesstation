"use client";

import { useState, useRef } from "react";
import styles from "../page.module.css";

interface BrandCardProps {
  brand: {
    key: string;
    name: string;
    logo: string;
    headline?: string;
    details?: string;
    promo_text?: string;
    promoText?: string;
    register_url?: string;
    registerUrl?: string;
    registerUrl_2?: string;
    telegram_url?: string;
    telegramUrl?: string;
    tag?: string;
    border_color?: string;
    borderColor?: string;
    subtitle_text?: string;
    source?: 'wildgroup' | 'wildgroupau' | '88group' | 'group88';
  };
}

export function BrandCard({ brand }: BrandCardProps) {
  const [isBorderActive, setIsBorderActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const borderColor = brand.border_color || brand.borderColor || '#D4AF37';
  const tag = brand.tag || '';
  const promoText = brand.promo_text || brand.promoText || '';
  const isWildGroupSource = brand.source === 'wildgroup' || brand.source === 'wildgroupau';
  // WildGroup cards mirror wildgroupau.com: primary register_url from admin
  const registerUrl = isWildGroupSource
    ? (brand.register_url || brand.registerUrl || brand.registerUrl_2 || '#')
    : (brand.registerUrl_2 || brand.register_url || brand.registerUrl || '#');
  const telegramUrl = brand.telegram_url || brand.telegramUrl;
  const headline = brand.headline || '';
  const details = brand.details || '';

  const companyLogoUrl = brand.source === 'wildgroup' || brand.source === 'wildgroupau'
    ? '/api/proxy-image?url=' + encodeURIComponent('https://wildgroupau.com/assets/logo/wildgroup-logo.png')
    : '/api/proxy-image?url=' + encodeURIComponent('https://88groupau.com/logo.gif');

  const normalizeBrandLogoUrl = (logo: string | undefined, source?: string): string => {
    if (!logo) return '';

    // Some rows store logo as base64 data URL.
    if (logo.startsWith('data:image/')) {
      return logo.replace(/\s+/g, '');
    }

    // Already proxied by our API; keep as-is.
    if (logo.startsWith('/api/proxy-image?url=')) {
      // Handle historical bad value: /api/proxy-image?url=https://88groupau.com/data:image/...
      try {
        const encoded = logo.slice('/api/proxy-image?url='.length);
        const decoded = decodeURIComponent(encoded);
        const dataPrefixPos = decoded.indexOf('data:image/');
        if (dataPrefixPos >= 0) {
          return decoded.slice(dataPrefixPos).replace(/\s+/g, '');
        }
      } catch {
        // Keep original value when decode fails.
      }
      return logo;
    }

    let normalized = logo.trim();
    if (!normalized) return '';

    // Handle protocol-relative URLs like //domain/path.png
    if (normalized.startsWith('//')) {
      normalized = `https:${normalized}`;
    }

    // Avoid mixed-content issues on HTTPS pages.
    if (normalized.startsWith('http://')) {
      normalized = normalized.replace(/^http:\/\//, 'https://');
    }

    // Proxy known upstream domains for reliability and cache benefits.
    if (
      normalized.startsWith('https://wildgroupau.com') ||
      normalized.startsWith('https://88groupau.com')
    ) {
      return `/api/proxy-image?url=${encodeURIComponent(normalized)}`;
    }

    // Normalize relative paths from database rows.
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      const cleanPath = normalized.startsWith('/') ? normalized : `/${normalized}`;
      const normalizedSource = source === 'group88' ? '88group' : source;
      if (normalizedSource === 'wildgroup' || normalizedSource === 'wildgroupau') {
        return `/api/proxy-image?url=${encodeURIComponent(`https://wildgroupau.com${cleanPath}`)}`;
      }
      if (normalizedSource === '88group') {
        return `/api/proxy-image?url=${encodeURIComponent(`https://88groupau.com${cleanPath}`)}`;
      }
      return cleanPath;
    }

    return normalized;
  };
  const brandLogoUrl = normalizeBrandLogoUrl(brand.logo, brand.source);

  const handleCardClick = () => {
    if (!isBorderActive) {
      setIsBorderActive(true);
      // Remove the active class after animation completes (4 seconds)
      setTimeout(() => {
        setIsBorderActive(false);
      }, 4000);
    }
  };

  // For wildgroup: Combine headline and details, filter out "Competitive Promotions" and "VIP & ... PROGRAM"
  const isWildGroup = brand.source === 'wildgroup' || brand.source === 'wildgroupau';
  const is88Group = brand.source === '88group' || brand.source === 'group88';
  
  const wildGroupDetailsList = isWildGroup && (headline || details)
    ? [
        ...(headline ? [headline] : []),
        ...(details ? details.split(' • ').filter(d => {
          // Filter out "Competitive Promotions" and any item containing "VIP &" and "PROGRAM"
          return !d.includes('Competitive Promotions') && 
                 !(d.includes('VIP &') && d.includes('PROGRAM'));
        }) : [])
      ].slice(0, 3)
    : [];

  // For 88group: Parse headline as list items (format: "Label: Value | Label: Value")
  const group88DetailsList = is88Group && headline
    ? headline.split(' | ').map(item => {
        const match = item.match(/^(.+?):\s*(.+)$/);
        if (match) {
          // Return as "Label Value" (remove colon)
          return `${match[1]} ${match[2]}`;
        }
        return item;
      }).slice(0, 3)
    : [];

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isBorderActive ? styles.cardBorderActive : ''}`}
      style={{ borderColor: borderColor }}
      onClick={handleCardClick}
    >
      {/* Company Logo as Background */}
      {brand.source && (
        <div className={styles.cardBackgroundLogo}>
          <img 
            src={companyLogoUrl}
            alt={brand.source === 'wildgroup' || brand.source === 'wildgroupau' ? 'WildGroup' : '88Group'}
            className={styles.cardBackgroundLogoImg}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      {tag && (
        <div className={styles.cardTag} style={{ background: borderColor }}>
          {tag}
        </div>
      )}
      <div className={styles.cardHeader}>
        <img src={brandLogoUrl} alt={brand.name} loading="lazy" />
      </div>
      <div className={styles.cardContent}>
        {/* WildGroup: promo_text as cardRegister, headline + details as list */}
        {isWildGroup ? (
          <>
            {/* Promo Text as cardRegister */}
            {promoText && (
              <div className={styles.cardPromoSection}>
                <div className={styles.cardRegister}>{promoText}</div>
              </div>
            )}
            
            {/* Headline + Details as list items */}
            {wildGroupDetailsList.length > 0 && (
              <ul className={styles.cardDetails}>
                {wildGroupDetailsList.map((detail, idx) => (
                  <li key={idx}>
                    <span className={styles.detailIcon}>✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : is88Group ? (
          // 88Group: subtitle_text as cardRegister, headline as list items
          <>
            {/* Subtitle Text as cardRegister */}
            {brand.subtitle_text && (
              <div className={styles.cardPromoSection}>
                <div className={styles.cardRegister}>{brand.subtitle_text}</div>
              </div>
            )}
            
            {/* Headline as list items */}
            {group88DetailsList.length > 0 && (
              <ul className={styles.cardDetails}>
                {group88DetailsList.map((detail, idx) => (
                  <li key={idx}>
                    <span className={styles.detailIcon}>✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          // Fallback: Keep existing logic for other sources
          <>
            {/* Promo Text / Subtitle - Unified Style */}
            {(promoText || brand.subtitle_text) && (
              <div className={styles.cardPromoSection}>
                {promoText && <div className={styles.cardRegister}>{promoText}</div>}
                {brand.subtitle_text && (
                  <div className={styles.cardSubtitle}>
                    {brand.subtitle_text.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Headline / Bonus List - Unified Style */}
            {headline && (
              <div className={styles.cardHeadlineSection}>
                <div className={styles.bonusList}>
                  {headline.split(' | ').map((item, idx) => {
                    const match = item.match(/^(.+?):\s*(.+)$/);
                    if (match) {
                      return (
                        <div key={idx} className={styles.bonusItem}>
                          <span className={styles.bonusLabel}>{match[1]}</span>
                          <span className={styles.bonusValue}>{match[2]}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className={styles.bonusItem}>
                        <span className={styles.bonusValue}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.cardActions}>
        <a 
          className={styles.cardBtn} 
          href={registerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          REGISTER NOW
        </a>
        {telegramUrl && (
          <a 
            className={styles.cardBtnSecondary} 
            href={telegramUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span>✈</span> JOIN TELEGRAM
          </a>
        )}
      </div>
    </div>
  );
}
