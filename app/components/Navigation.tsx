'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/partner-casinos", label: "Partner Casinos" },
    { href: "/bonuses-promotions", label: "Bonuses & Promotions" },
    { href: "/game-tips", label: "Game Tips" },
    { href: "/announcements", label: "Announcements" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  const isActive = (href: string) => {
    if (!mounted || !pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navContainer}>
          <div className={styles.desktopNav}>
            <div className={styles.logoContainer}>
              <Link href="/">
                <img src="/partnership_logo.png" alt="88 GROUP × WILD GROUP PARTNERSHIP" className={styles.logoImage} />
              </Link>
            </div>
            <div className={styles.menuItems}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive(item.href) ? styles.active : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.mobileNav}>
            <button
              className={`${styles.hamburger} ${
                isMobileMenuOpen ? styles.hamburgerActive : ""
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
            <div className={styles.mobileLogoContainer}>
              <Link href="/">
                <img src="/partnership_logo.png" alt="88 GROUP × WILD GROUP PARTNERSHIP" className={styles.mobileLogoImage} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`${styles.sideMenu} ${
          isMobileMenuOpen ? styles.sideMenuOpen : ""
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={styles.sideMenuContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.sideMenuHeader}>
            <img src="/partnership_logo.png" alt="88 GROUP × WILD GROUP PARTNERSHIP" className={styles.sideMenuLogoImage} />
            <button
              className={styles.closeBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <nav className={styles.sideMenuNav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.sideMenuLink} ${
                  isActive(item.href) ? styles.sideMenuActive : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
