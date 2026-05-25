"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

type SiteSettings = {
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    telegram?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  contactEmail?: string;
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
  footerDescription?: string;
  responsibleGamingText?: string;
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const socialMedia = settings?.socialMedia || {
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    twitter: "https://twitter.com",
    telegram: settings?.telegram || "https://t.me/AusPokiesStation",
  };
  const contactEmail = settings?.contactEmail || settings?.contact?.email || "88grouppartnership@gmail.com";
  const contactPhone = settings?.contact?.phone || "";
  const contactAddress = settings?.contact?.address || "";
  const footerDescription = settings?.footerDescription ||
    "88 GROUP × WILD GROUP PARTNERSHIP connects Australian players with trusted casino platforms offering competitive welcome bonuses, thousands of online pokies, live casino games, and secure access.";
  const whatsapp = settings?.whatsapp || {
    channel: "https://whatsapp.com/channel/0029Vb6VfdMJ3jv6tm2QzZ1n",
    community: "https://chat.whatsapp.com/FzBYah59mJPCfWRf7xVdhO",
  };
  const telegram = settings?.telegram || "https://t.me/AusPokiesStation";
  const feedbackDocs = settings?.feedbackDocs || "";
  const complaintHotline = settings?.complaintHotline || {
    phone: "+61 420 368 915",
    link: "https://api.whatsapp.com/send/?phone=%2B61420368915&text&type=phone_number&app_absent=0&wame_ctl=1",
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Left Column - Logo, Description, Social Media */}
          <div className={styles.footerColumn}>
            <div className={styles.logoSection}>
              <Link href="/" className={styles.logoLink}>
                <img src="/partnership_logo.png" alt="88 GROUP × WILD GROUP PARTNERSHIP" className={styles.logoImage} />
              </Link>
            </div>
            <p className={styles.description}>
              {footerDescription}
            </p>
            <div className={styles.socialSection}>
              <h3 className={styles.socialTitle}>Social Media</h3>
              <div className={styles.socialIcons}>
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href={socialMedia.telegram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Telegram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className={styles.footerColumn}>
            <div className={styles.menuSection}>
              <h3 className={styles.menuTitle}>Quick Links</h3>
              <ul className={styles.menuList}>
                <li><Link href="/" className={styles.menuLink}>Home</Link></li>
                <li><Link href="/about-us" className={styles.menuLink}>About Us</Link></li>
                <li><Link href="/partner-casinos" className={styles.menuLink}>Partner Casinos</Link></li>
                <li><Link href="/bonuses-promotions" className={styles.menuLink}>Bonuses & Promotions</Link></li>
                <li><Link href="/announcements" className={styles.menuLink}>Announcements</Link></li>
                <li><Link href="/testimonials" className={styles.menuLink}>Testimonials</Link></li>
                <li><Link href="/faq" className={styles.menuLink}>FAQ</Link></li>
                <li><Link href="/contact-us" className={styles.menuLink}>Contact Us</Link></li>
              </ul>
            </div>

            {/* Community Links */}
            <div className={styles.communitySection}>
              <h3 className={styles.communityTitle}>Community</h3>
              <ul className={styles.communityList}>
                <li>
                  <a href="https://t.me/AusPokiesStation" target="_blank" rel="noopener noreferrer" className={styles.communityLink}>
                    <i className="fab fa-telegram"></i>
                    <span>Telegram Community</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Contact Info & Responsible Gaming */}
          <div className={styles.footerColumn}>
            <div className={styles.contactSection}>
              <h3 className={styles.contactTitle}>Contact Us</h3>
              <div className={styles.contactInfo}>
                {contactEmail && (
                  <p className={styles.contactItem}>
                    <i className="fas fa-envelope"></i>
                    <a href={`mailto:${contactEmail}`} className={styles.contactLink}>
                      {contactEmail}
                    </a>
                  </p>
                )}
                {contactPhone && (
                  <p className={styles.contactItem}>
                    <i className="fas fa-phone"></i>
                    <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className={styles.contactLink}>
                      {contactPhone}
                    </a>
                  </p>
                )}
                {contactAddress && (
                  <p className={styles.contactItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span className={styles.contactText}>{contactAddress}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Responsible Gaming */}
            <div className={styles.responsibleGaming}>
              <h3 className={styles.responsibleTitle}>Responsible Gaming</h3>
              <p 
                className={styles.responsibleText}
                dangerouslySetInnerHTML={{
                  __html: settings?.responsibleGamingText || 
                    "Please gamble responsibly. Only play with money you can afford to lose. " +
                    "If you have a gambling problem, seek help from organizations like " +
                    "<a href='https://www.gamblinghelponline.org.au' target='_blank' rel='noopener noreferrer'>Gambling Help Online</a> " +
                    "or call <a href='tel:1800858858'>1800 858 858</a>."
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>© {currentYear} 88 GROUP × WILD GROUP PARTNERSHIP. All rights reserved.</p>
          <p className={styles.partnershipNote}>
            88 GROUP × WILD GROUP PARTNERSHIP combines the strengths of WildGroup and 88 Group to deliver Australia's premier gaming experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
